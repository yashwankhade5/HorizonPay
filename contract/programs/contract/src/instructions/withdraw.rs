use anchor_lang::prelude::*;
use anchor_spl::token::{
    transfer,
    Token,
    TokenAccount,
    Transfer,
};

use crate::state::*;
use crate::event::*;
use crate::error::HorizonErrorCode;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub merchant: Signer<'info>,

    #[account(
        mut,
        seeds = [b"merchant", merchant.key().as_ref()],
        bump
    )]
    pub merchant_pda: Account<'info, MerchantPda>,

    #[account(
        mut,
        seeds = [
            b"vault",
            merchant_pda.key().as_ref(),
            1u64.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub merchant_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub merchant_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

impl<'info> Withdraw<'info> {
    pub fn withdraw(&mut self, amount: u64, bumps: &WithdrawBumps) -> Result<()> {
        require!(amount > 0, HorizonErrorCode::InvalidAmount);

        require!(
            !self.merchant_pda.freeze_flag,
            HorizonErrorCode::VaultFrozen
        );

        require!(
            self.merchant_pda.transfer_flag,
            HorizonErrorCode::TransferDisabled
        );

        require!(
            self.merchant_pda.withdrawable_amount >= amount,
            HorizonErrorCode::InsufficientWithdrawableBalance
        );

        let signer_seeds: &[&[&[u8]]] = &[&[
            b"token",
            self.merchant_pda.to_account_info().key().as_ref(),
            &1u64.to_le_bytes(),
            &[bumps.merchant_vault],
        ]];

        let transfer_accounts = Transfer {
            from: self.merchant_vault.to_account_info(),
            to: self.merchant_ata.to_account_info(),
            authority: self.merchant_vault.to_account_info(),
        };

        transfer(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                transfer_accounts,
                signer_seeds,
            ),
            amount,
        )?;

        self.merchant_pda.withdrawable_amount = self.merchant_pda.withdrawable_amount
            .checked_sub(amount)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        emit!(WithdrawExecuted {
            merchant: self.merchant.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}