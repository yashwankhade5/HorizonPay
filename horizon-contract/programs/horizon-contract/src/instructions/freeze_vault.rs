use crate::{state::*, HorizonErrorCode};
use anchor_lang::prelude::*;

const MAX_FREEZE_DURATION: i64 = 30 * 24 * 60 * 60; // 30 days

#[derive(Accounts)]
pub struct FreezeVault<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    pub admin: Account<'info, AdminPda>,

    #[account(
        mut,
        seeds = [b"merchant", merchant_pda.merchant.as_ref(), admin.key().as_ref()],
        bump = merchant_pda.bump
    )]
    pub merchant_pda: Account<'info, MerchantPda>,
}

impl<'info> FreezeVault<'info> {
    pub fn freeze_vault(&mut self, duration_seconds: i64) -> Result<()> {
        let signer = self.signer.key();

        let authorized = self.admin.superadmins.contains(&signer)
            || self.admin.operators.contains(&signer);

        require!(authorized, HorizonErrorCode::Unauthorized);

        require!(
            duration_seconds > 0 && duration_seconds <= MAX_FREEZE_DURATION,
            HorizonErrorCode::FreezeDurationTooLong
        );

        let now = Clock::get()?.unix_timestamp;

        self.merchant_pda.freeze_flag = true;
        self.merchant_pda.freeze_expires_at = now
            .checked_add(duration_seconds)
            .ok_or(HorizonErrorCode::MathOverflow)?;

        Ok(())
    }
}