use crate::state::*;
use anchor_lang::prelude::*;

use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

#[derive(Accounts)]
pub struct CreateMerchant<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub admin: Account<'info, AdminPda>,
    #[account(
        init,
        payer=signer,
        space= 8+MerchantPda::INIT_SPACE,
        seeds = [b"merchant",signer.key().as_ref(),admin.key().as_ref()],
        bump
    )]
    pub merchant_pda: Account<'info, MerchantPda>,

    #[account(
        init,
        payer = signer,
        token::mint = mint,
        token::authority = merchant_pda,
        token::token_program = token_program,
        seeds = [b"vault",merchant_pda.key().as_ref(),1u64.to_le_bytes().as_ref()],
        bump
    )]
    pub merchant_vault: InterfaceAccount<'info, TokenAccount>,
    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateMerchant<'info> {
    pub fn create_merchant(&mut self, bumps: CreateMerchantBumps) -> Result<()> {
        self.merchant_pda.set_inner(MerchantPda {
            admin_pda: self.admin.key(),
            merchant: self.signer.key(),
            transfer_flag: true,
            freeze_flag: false,
            freeze_expires_at: 0,
            vault_count: 1,
            total_amount: 0,
            withdrawable_amount: 0,
            withheld_amount: 0,
            bump: bumps.merchant_pda,
            withheld_buckets: [0; 7],
            current_index: 0,
            current_date: 0,
        });

        
        Ok(())
    }
}
