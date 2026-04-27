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



#[event]
pub struct FundsReleased {
    pub merchant: Pubkey,
    pub release_amount: u64,
    pub new_withdrawable: u64,
    pub timestamp: i64,
}

#[event]
pub struct VaultFrozen {
    pub merchant: Pubkey,
    pub frozen_by: Pubkey,
    pub expires_at: i64,
    pub timestamp: i64,
}
#[event]
pub struct EscrowAdvanced {
    pub merchant: Pubkey,
    pub slots_advanced: u8,
    pub amount_released: u64,
    pub new_withdrawable: u64,
    pub timestamp: i64,
}