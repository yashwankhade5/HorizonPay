use anchor_lang::prelude::*;
pub mod error;
pub use error::*;
pub mod event;
pub use event::*;
pub mod state;
use crate::state::*;
pub mod instructions;
pub use instructions::*;

declare_id!("57AFQ836EZ1JXKedRUioW1nkJ49X2S2vGG7UTzLcNEZR");

#[program]
pub mod contract {
    use super::*;

    pub fn create_admin(
        ctx: Context<Admin>,
        superadmins: Vec<Pubkey>,
        operators: Vec<Pubkey>,
        platform_fee_bps: u64,
        escrow_flag: bool,
        admin_fee_vault: Pubkey,
    ) -> Result<()> {
        ctx.accounts.create_admin(
            superadmins,
            operators,
            platform_fee_bps,
            escrow_flag,
            admin_fee_vault,
        )?;

        Ok(())
    }

    pub fn create_merchant(ctx: Context<CreateMerchant>) -> Result<()> {
        ctx.accounts.create_merchant()?;

        Ok(())
    }

    pub fn pay(ctx: Context<Pay>,amount:u64) -> Result<()> {

        ctx.accounts.pay(amount)?;
        Ok(())
    }
    pub fn withdraw(ctx:Context<Withdraw>,amount:u64)->Result<()>{
ctx.accounts.withdraw(amount, bumps)?;

        Ok(())
    }
}
