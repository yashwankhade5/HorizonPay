use anchor_lang::prelude::*;

pub mod error;
pub use error::*;
pub mod event;
pub use event::*;
pub mod state;
pub mod helpers;

pub mod instructions;
pub use instructions::*;

declare_id!("k3ep1PK9dkQyzHm5STsP7dg3wK2Y73qxuJB5nStGvyS");

#[program]
pub mod horizon_contract {
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

    pub fn create_merchant(ctx: Context<CreateMerchant>,) -> Result<()> {
        ctx.accounts.create_merchant(ctx.bumps)?;

        Ok(())
    }

    pub fn pay(ctx: Context<Pay>,amount:u64) -> Result<()> {

        ctx.accounts.pay(amount)?;
        Ok(())
    }
    pub fn withdraw(ctx:Context<Withdraw>,amount:u64)->Result<()>{
ctx.accounts.withdraw(amount)?;

        Ok(())
    }
   pub fn freeze_vault(ctx: Context<FreezeVault>, duration_seconds: i64) -> Result<()> {
    ctx.accounts.freeze_vault(duration_seconds)?;
    Ok(())
}

pub fn unfreeze_vault(ctx: Context<UnfreezeVault>) -> Result<()> {
    ctx.accounts.unfreeze_vault()?;
    Ok(())
}

pub fn enable_transfer(ctx: Context<EnableTransfer>) -> Result<()> {
    ctx.accounts.enable_transfer()?;
    Ok(())
}
pub fn disable_transfer(ctx: Context<DisableTransfer>) -> Result<()> {
    ctx.accounts.disable_transfer()?;
    Ok(())
}




// pub fn recurring_setup_and_pay(
//     ctx: Context<RecurringSetupAndPay>,
//     amount: u64,
// ) -> Result<()> {
//     ctx.accounts.recurring_setup_and_pay(amount, &ctx.bumps)?;
//     Ok(())
// }

// pub fn recurr_pay(ctx: Context<RecurrPay>) -> Result<()> {
//     ctx.accounts.recurr_pay()?;
//     Ok(())
// }

// pub fn stop_recurr_pay(ctx: Context<StopRecurrPay>) -> Result<()> {
//     ctx.accounts.stop_recurr_pay()?;
//     Ok(())
// }

}


