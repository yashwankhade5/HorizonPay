use anchor_lang::prelude::*;

pub mod state;
use crate::state::*;
pub mod instructions;
pub use instructions::*;

declare_id!("57AFQ836EZ1JXKedRUioW1nkJ49X2S2vGG7UTzLcNEZR");

#[program]
pub mod contract {
    use super::*;

    pub fn create_admin(ctx: Context<Admin>) -> Result<()> {
     
        Ok(())
    }


    pub fn create_merchant(ctx:Context<Merchant>)->Result<()>{

        Ok(())
    }
    pub fn pay(ctx:Context<Merchant>)->Result<()>{

        Ok(())
    }



}


