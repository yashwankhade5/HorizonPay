use anchor_lang::prelude::*;

#[event]
pub struct PaymentReceived {
    pub merchant: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub fee: u64,
    pub timestamp: i64,
}

#[event]
pub struct WithdrawExecuted {
    pub merchant: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}