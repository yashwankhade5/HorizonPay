use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct RecurringPda {
    pub subscriber: Pubkey,
    pub merchant_pda: Pubkey,
    pub merchant_vault: Pubkey,
    // pub subscription_id: u64,
    pub amount: u64,
    pub next_payment_timestamp: i64,
    pub bump: u8,
}
