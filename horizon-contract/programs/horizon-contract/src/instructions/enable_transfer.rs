use crate::{state::*, HorizonErrorCode};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct EnableTransfer<'info> {
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

impl<'info> EnableTransfer<'info> {
    pub fn enable_transfer(&mut self) -> Result<()> {
        let signer = self.signer.key();

        let authorized = self.admin.superadmins.contains(&signer)
            || self.admin.operators.contains(&signer);

        require!(authorized, HorizonErrorCode::Unauthorized);

        self.merchant_pda.transfer_flag = true;

        Ok(())
    }
}