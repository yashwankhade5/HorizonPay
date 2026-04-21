use anchor_lang::prelude::*;
use crate::state::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{ TokenAccount};


#[derive(Accounts)]
pub struct Merchant<'info>{
     #[account(mut)]
    pub signer: Signer<'info>,
    pub admin:Account<'info,AdminPda>,
     #[account(
        init,
        payer=signer,
        space= 8+MerchantPda::INIT_SPACE,
        seeds = [b"merchant",signer.key().as_ref(),admin.key().as_ref()],
        bump
    )]
    pub merchant_pda:Account<'info,MerchantPda>,

    pub merchant_vault:InterfaceAccount<'info, TokenAccount>,

    pub system_program: Program<'info, System>,

}