use anchor_lang::prelude::*;

#[event]
pub struct PaymentReceived {
    pub merchant: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub fee: u64,
    pub payment_intent:String,
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
#[event]
pub struct VaultUnfrozen {
    pub merchant: Pubkey,
    pub unfrozen_by: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct RecurringSetup {
    pub user: Pubkey,
    pub merchant: Pubkey,
    pub amount: u64,
    pub next_payment_at: i64,
}

#[event]
pub struct RecurringPulled {
    pub user: Pubkey,
    pub merchant: Pubkey,
    pub amount: u64,
    pub next_payment_at: i64,
}

#[event]
pub struct RecurringStopped {
    pub user: Pubkey,
    pub merchant: Pubkey,
    pub stopped_at: i64,
}

#[event]
pub struct MerchantOnboarded {
    pub merchantpda: Pubkey,
    pub merchant_vault:Pubkey,
    pub merchantwalletpubkey:Pubkey,
    pub timestamp: i64,
}