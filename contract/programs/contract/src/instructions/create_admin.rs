use anchor_lang::prelude::*;
use crate::state::*;


#[derive(Accounts)]
pub struct Admin<'info>{
     #[account(mut)]
    pub signer: Signer<'info>,
     #[account(
        init,
        payer=signer,
        space= 8+AdminPda::INIT_SPACE,
        seeds = [b"admin",signer.key().as_ref()],
        bump
    )]
    pub admin_pda:Account<'info,AdminPda>,

    pub system_program: Program<'info, System>,

}


impl<'info> Admin<'info> {
    pub fn create_admin()->Result<()>{
    Ok(())
}
   
   
    }