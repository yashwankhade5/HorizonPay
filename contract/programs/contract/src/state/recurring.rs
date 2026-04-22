use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct RecurringPDA {
    pub user: Pubkey,
    pub merchant: Pubkey,
    pub subscription_id: u64,
    pub amount: u64,
    pub next_payment_timestamp: i64,
    pub active: bool,
}

