
use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::*;

#[derive(Accounts)]
pub struct Admin<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer=signer,
        space= 8+AdminPda::INIT_SPACE,
        seeds = [b"admin",signer.key().as_ref()],
        bump
    )]
    pub admin_pda: Account<'info, AdminPda>,

    pub system_program: Program<'info, System>,
}

impl<'info> Admin<'info> {
    pub fn create_admin(
        &mut self,
        superadmins: Vec<Pubkey>,
        operators: Vec<Pubkey>,
        platform_fee_bps: u64,
        escrow_flag: bool,
        admin_fee_vault: Pubkey,
    ) -> Result<()> {
        require!(
            superadmins.len() >= 2,
            HorizonErrorCode::MinimumSuperadminsRequired
        );

        require!(
            superadmins.len() <= MAX_SUPERADMINS,
            HorizonErrorCode::TooManySuperadmins
        );

        require!(
            operators.len() <= MAX_OPERATORS,
            HorizonErrorCode::TooManyOperators
        );

     self.admin_pda.set_inner(AdminPda { superadmins, operators, platform_fee_bps, escrow_flag, admin_fee_vault });

        Ok(())
    }
}
