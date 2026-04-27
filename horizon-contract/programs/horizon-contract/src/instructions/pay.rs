use anchor_lang::prelude::*;
use anchor_spl::token::{
    transfer_checked, Mint, Token, TokenAccount, TransferChecked,
};
use crate::helpers::*;
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

    require!(
        self.merchant_pda.transfer_flag,
        HorizonErrorCode::TransferDisabled
    );

    let now = Clock::get()?.unix_timestamp;

    //
    // 1. Advance escrow FIRST (CRITICAL)
    //
    advance_escrow(&mut self.merchant_pda, now)?;

    //
    // 2. Compute fee (with minimum floor)
    //
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

    //
    // 3. Transfer fee (use transfer_checked)
    //
    let fee_accounts = TransferChecked {
        from: self.user_ata.to_account_info(),
        to: self.admin_fee_vault.to_account_info(),
        mint: self.mint.to_account_info(),
        authority: self.user.to_account_info(),
    };

    transfer_checked(
        CpiContext::new(self.token_program.to_account_info(), fee_accounts),
        platform_fee,
        self.mint.decimals,
    )?;

    //
    // 4. Transfer merchant amount
    //
    let merchant_accounts = TransferChecked {
        from: self.user_ata.to_account_info(),
        to: self.merchant_vault.to_account_info(),
        mint: self.mint.to_account_info(),
        authority: self.user.to_account_info(),
    };

    transfer_checked(
        CpiContext::new(self.token_program.to_account_info(), merchant_accounts),
        net_amount,
        self.mint.decimals,
    )?;

    //
    // 5. Update escrow state
    //
    self.merchant_pda.total_amount = self
        .merchant_pda
        .total_amount
        .checked_add(net_amount)
        .ok_or(HorizonErrorCode::MathOverflow)?;

    self.merchant_pda.withheld_amount = self
        .merchant_pda
        .withheld_amount
        .checked_add(net_amount)
        .ok_or(HorizonErrorCode::MathOverflow)?;

    let index = self.merchant_pda.current_index as usize;

    self.merchant_pda.withheld_buckets[index] = self
        .merchant_pda
        .withheld_buckets[index]
        .checked_add(net_amount)
        .ok_or(HorizonErrorCode::MathOverflow)?;

    //
    // 6. Emit event
    //
    emit!(PaymentReceived {
        merchant: self.merchant_pda.merchant,
        user: self.user.key(),
        amount,
        fee: platform_fee,
        timestamp: now,
    });

    Ok(())
}
    
}