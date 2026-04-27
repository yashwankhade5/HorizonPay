use crate::{state::*, HorizonErrorCode};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UnfreezeVault<'info> {
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

impl<'info> UnfreezeVault<'info> {
    pub fn unfreeze_vault(&mut self) -> Result<()> {
        let signer = self.signer.key();

        let authorized = self.admin.superadmins.contains(&signer)
            || self.admin.operators.contains(&signer);

        require!(authorized, HorizonErrorCode::Unauthorized);

        self.merchant_pda.freeze_flag = false;
        self.merchant_pda.freeze_expires_at = 0;

        Ok(())
    }
}