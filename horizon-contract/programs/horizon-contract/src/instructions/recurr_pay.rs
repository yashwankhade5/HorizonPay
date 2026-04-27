use crate::{state::*, HorizonErrorCode, PaymentReceived};
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked,
};

const BILLING_CYCLE_DAYS: i64 = 30;
const SECONDS_PER_DAY: i64 = 86400;

fn next_billing_timestamp(current_due: i64) -> i64 {
    let current_day = current_due / SECONDS_PER_DAY;
    let next_day = current_day + BILLING_CYCLE_DAYS;

    next_day * SECONDS_PER_DAY
}

#[derive(Accounts)]
pub struct RecurrPay<'info> {
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
        mut,
        seeds = [b"subscription", recurring_pda.subscriber.as_ref(), merchant_pda.key().as_ref()],
        bump = recurring_pda.bump
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
}

impl<'info> RecurrPay<'info> {
    pub fn recurr_pay(&mut self) -> Result<()> {
       

        let now = Clock::get()?.unix_timestamp;

        require!(
            now >= self.recurring_pda.next_payment_timestamp,
            HorizonErrorCode::TooEarly
        );

        require!(
            self.merchant_pda.transfer_flag,
            HorizonErrorCode::TransferDisabled
        );

        let amount = self.recurring_pda.amount;

        let fee = amount
            .checked_mul(self.admin.platform_fee_bps)
            .ok_or(HorizonErrorCode::MathOverflow)?
            .checked_div(10000)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        let merchant_amount = amount
            .checked_sub(fee)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        // Transfer fee
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

        // Transfer merchant amount
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
        let now = Clock::get()?.unix_timestamp;

        self.recurring_pda.next_payment_timestamp = next_billing_timestamp(now);

        emit!(PaymentReceived {
            merchant: self.merchant_pda.merchant,
            user: self.recurring_pda.subscriber,
            amount,
            fee,
            timestamp: now,
        });

        Ok(())
    }
}