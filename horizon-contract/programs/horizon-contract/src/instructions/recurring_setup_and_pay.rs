use crate::{state::*, HorizonErrorCode, PaymentReceived};
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked,
};

const BILLING_CYCLE_DAYS: i64 = 30;
const SECONDS_PER_DAY: i64 = 86400;

fn next_billing_timestamp(now: i64) -> Result<i64> {
    let current_day = now / SECONDS_PER_DAY;
    let next_day = current_day + BILLING_CYCLE_DAYS;

    Ok(next_day * SECONDS_PER_DAY)
}

#[derive(Accounts)]
pub struct RecurringSetupAndPay<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    pub admin: Account<'info, AdminPda>,

    #[account(
        mut,
        seeds = [b"merchant", merchant_pda.merchant.as_ref(), admin.key().as_ref()],
        bump = merchant_pda.bump
    )]
    pub merchant_pda: Account<'info, MerchantPda>,

    #[account(
        init,
        payer = signer,
        space = 8 + RecurringPda::INIT_SPACE,
        seeds = [b"subscription", signer.key().as_ref(), merchant_pda.key().as_ref()],
        bump
    )]
    pub recurring_pda: Account<'info, RecurringPda>,

    #[account(mut)]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        constraint = merchant_vault.owner == merchant_pda.key()
    )]
    pub merchant_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub admin_fee_vault: InterfaceAccount<'info, TokenAccount>,

    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> RecurringSetupAndPay<'info> {
    pub fn recurring_setup_and_pay(
        &mut self,
        amount: u64,
        bumps: &RecurringSetupAndPayBumps,
        payment_intent:String,
    ) -> Result<()> {
        require!(amount > 0, HorizonErrorCode::InvalidAmount);
        require!(
            self.merchant_pda.transfer_flag,
            HorizonErrorCode::TransferDisabled
        );

        let fee = amount
            .checked_mul(self.admin.platform_fee_bps)
            .ok_or(HorizonErrorCode::MathOverflow)?
            .checked_div(10000)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        let merchant_amount = amount
            .checked_sub(fee)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        // Transfer fee to admin fee vault
        let fee_transfer_accounts = TransferChecked {
            from: self.user_token_account.to_account_info(),
            to: self.admin_fee_vault.to_account_info(),
            mint: self.mint.to_account_info(),
            authority: self.signer.to_account_info(),
        };

        transfer_checked(
            CpiContext::new(self.token_program.to_account_info(), fee_transfer_accounts),
            fee,
            self.mint.decimals,
        )?;

        // Transfer merchant amount to merchant vault
        let merchant_transfer_accounts = TransferChecked {
            from: self.user_token_account.to_account_info(),
            to: self.merchant_vault.to_account_info(),
            mint: self.mint.to_account_info(),
            authority: self.signer.to_account_info(),
        };

        transfer_checked(
            CpiContext::new(
                self.token_program.to_account_info(),
                merchant_transfer_accounts,
            ),
            merchant_amount,
            self.mint.decimals,
        )?;

        // Update merchant balances
        self.merchant_pda.total_amount = self
            .merchant_pda
            .total_amount
            .checked_add(merchant_amount)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        self.merchant_pda.withheld_amount = self
            .merchant_pda
            .withheld_amount
            .checked_add(merchant_amount)
            .ok_or(HorizonErrorCode::MathOverflow)?;
        let index = self.merchant_pda.current_index as usize;

        self.merchant_pda.withheld_buckets[ index ] =
            self.merchant_pda.withheld_buckets[self.merchant_pda.current_index as usize]
                .checked_add(merchant_amount)
                .ok_or(HorizonErrorCode::MathOverflow)?;

        let now = Clock::get()?.unix_timestamp;

        // Create subscription
        self.recurring_pda.set_inner(RecurringPda {
            subscriber: self.signer.key(),
            merchant_pda: self.merchant_pda.key(),
            merchant_vault: self.merchant_vault.key(),
            amount,
            next_payment_timestamp: next_billing_timestamp(now)?,

            bump: bumps.recurring_pda,
        });

        emit!(PaymentReceived {
            merchant: self.merchant_pda.merchant,
            user: self.signer.key(),
            amount,
            fee,
            payment_intent:payment_intent,
            timestamp: now,
        });

        Ok(())
    }
}
