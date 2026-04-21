use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct AdminPda { 

    #[max_len(3)]
    pub superadmins: Vec<Pubkey>,  // max 3 — change fees, manage operators
    #[max_len(10)] 
    pub operators: Vec<Pubkey>,      // max 10 — freeze/unfreeze only
    pub platform_fee_bps: u64,       // basis points (200 = 2%)
    pub escrow_flag: bool,
    pub admin_fee_vault: Pubkey,
}

