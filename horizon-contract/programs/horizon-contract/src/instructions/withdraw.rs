use crate::{
    error::HorizonErrorCode,
    event::WithdrawExecuted,
    helpers::advance_escrow,
    state::MerchantPda,
};
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked,
};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub merchant_signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"merchant", merchant_pda.merchant.as_ref()],
        bump = merchant_pda.bump,
        constraint = merchant_pda.merchant == merchant_signer.key()
    )]
    pub merchant_pda: Account<'info, MerchantPda>,

    #[account(
        mut,
        constraint = merchant_vault.owner == merchant_pda.key()
    )]
    pub merchant_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub merchant_ata: InterfaceAccount<'info, TokenAccount>,

    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
}

impl<'info> Withdraw<'info> {
    pub fn withdraw(&mut self, amount: u64) -> Result<()> {
        require!(amount > 0, HorizonErrorCode::InvalidAmount);

        let now = Clock::get()?.unix_timestamp;

        //
        // 1. Advance escrow FIRST (handles missed days too)
        //
        advance_escrow(&mut self.merchant_pda, now)?;

        //
        // 2. Auto-expire freeze (spec requirement)
        //
        if self.merchant_pda.freeze_flag
            && self.merchant_pda.freeze_expires_at != 0
            && now > self.merchant_pda.freeze_expires_at
        {
            self.merchant_pda.freeze_flag = false;
            self.merchant_pda.freeze_expires_at = 0;
        }

        //
        // 3. Checks
        //
        require!(
            self.merchant_pda.transfer_flag,
            HorizonErrorCode::TransferDisabled
        );

        require!(
            !self.merchant_pda.freeze_flag,
            HorizonErrorCode::VaultFrozen
        );

        require!(
            amount <= self.merchant_pda.withdrawable_amount,
            HorizonErrorCode::InvalidAmount
        );

        //
        // 4. Transfer tokens from vault → merchant ATA
        //    PDA signs
        //
        let seeds = &[
            b"merchant",
            self.merchant_pda.merchant.as_ref(),
            &[self.merchant_pda.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let transfer_accounts = TransferChecked {
            from: self.merchant_vault.to_account_info(),
            to: self.merchant_ata.to_account_info(),
            mint: self.mint.to_account_info(),
            authority: self.merchant_pda.to_account_info(),
        };

        transfer_checked(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                transfer_accounts,
                signer_seeds,
            ),
            amount,
            self.mint.decimals,
        )?;

        //
        // 5. Update state (maintain invariant)
        //
        self.merchant_pda.total_amount = self
            .merchant_pda
            .total_amount
            .checked_sub(amount)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        self.merchant_pda.withdrawable_amount = self
            .merchant_pda
            .withdrawable_amount
            .checked_sub(amount)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        //
        // 6. Emit event
        //
        emit!(WithdrawExecuted {
            merchant: self.merchant_pda.merchant,
            amount,
            timestamp: now,
        });

        Ok(())
    }
}