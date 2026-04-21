use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct MerchantPda {
    pub admin_pda: Pubkey,
    pub merchant: Pubkey,
    pub transfer_flag: bool,       // enables withdrawal
    pub freeze_flag: bool,          // blocks withdrawal (dispute)
    pub freeze_expires_at: i64,     // unix ts, 0 = not frozen
    pub vault_count: u64,
    pub total_amount: u64,          // invariant: = withheld + withdrawable
    pub withdrawable_amount: u64,
    pub withheld_amount: u64,
}



