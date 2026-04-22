use anchor_lang::prelude::*;
use anchor_spl::token::{
    transfer, Mint, Token, TokenAccount, Transfer,
};

use crate::state::*;
use crate::error::HorizonErrorCode;
use crate::event::*;

#[derive(Accounts)]
pub struct Pay<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub user_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub merchant_pda: Account<'info, MerchantPda>,

    #[account(
        mut,
       constraint = admin_pda.key() == merchant_pda.admin_pda @ HorizonErrorCode::Unauthorized
    )]
    pub admin_pda: Account<'info, AdminPda>,


    #[account(mut)]
    pub merchant_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub admin_fee_vault: Account<'info, TokenAccount>,

    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}

impl<'info> Pay<'info> {
    pub fn pay(&mut self, amount: u64) -> Result<()> {

        require!(amount > 0, HorizonErrorCode::InvalidAmount);


        let fee_bps = self.admin_pda.platform_fee_bps;

        let mut platform_fee = amount
            .checked_mul(fee_bps)
            .ok_or(HorizonErrorCode::MathOverflow)?
            .checked_div(10_000)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        if platform_fee == 0 {
            platform_fee = 1;
        }

        let net_amount = amount
            .checked_sub(platform_fee)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        // Transfer platform fee
        let fee_accounts = Transfer {
            from: self.user_ata.to_account_info(),
            to: self.admin_fee_vault.to_account_info(),
            authority: self.user.to_account_info(),
        };

        transfer(
            CpiContext::new(
                self.token_program.to_account_info(),
                fee_accounts,
            ),
            platform_fee,
        )?;

        // Transfer merchant amount
        let merchant_accounts = Transfer {
            from: self.user_ata.to_account_info(),
            to: self.merchant_vault.to_account_info(),
            authority: self.user.to_account_info(),
        };

        transfer(
            CpiContext::new(
                self.token_program.to_account_info(),
                merchant_accounts,
            ),
            net_amount,
        )?;

        self.merchant_pda.total_amount = self.merchant_pda.total_amount
            .checked_add(net_amount)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        self.merchant_pda.withheld_amount = self.merchant_pda.withheld_amount
            .checked_add(net_amount)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        emit!(PaymentReceived {
            merchant: self.merchant_pda.merchant,
            user: self.user.key(),
            amount,
            fee: platform_fee,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}