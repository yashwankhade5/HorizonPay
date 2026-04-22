use anchor_lang::prelude::*;

#[error_code]
pub enum HorizonErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,

    #[msg("Invalid amount")]
    InvalidAmount,

    #[msg("Invalid release amount")]
    InvalidReleaseAmount,

    #[msg("Vault is frozen")]
    VaultFrozen,

    #[msg("Transfers are disabled")]
    TransferDisabled,

    #[msg("Freeze duration exceeds maximum allowed")]
    FreezeDurationTooLong,

    #[msg("Recurring payment is inactive")]
    RecurringInactive,

    #[msg("Recurring payment is not due yet")]
    TooEarly,

    #[msg("Insufficient withdrawable balance")]
    InsufficientWithdrawableBalance,

    #[msg("Math overflow")]
    MathOverflow,

    #[msg("Merchant already exists")]
    MerchantAlreadyExists,

    #[msg("Admin already initialized")]
    AdminAlreadyInitialized,

    #[msg("Operator already exists")]
    OperatorAlreadyExists,

    #[msg("Operator not found")]
    OperatorNotFound,

    #[msg("Superadmin already exists")]
    SuperadminAlreadyExists,

    #[msg("Superadmin not found")]
    SuperadminNotFound,

    #[msg("At least one superadmin must remain")]
    LastSuperadminRemoval,

    #[msg("Maximum operators limit reached")]
    MaxOperatorsReached,

    #[msg("Maximum superadmins limit reached")]
    MaxSuperadminsReached,

    #[msg("Invalid fee configuration")]
    InvalidFeeConfig,

    #[msg("Account invariant violated")]
    InvariantViolation,

    #[msg("Subscription already cancelled")]
    SubscriptionInactive,

    #[msg("Invalid merchant vault")]
    InvalidMerchantVault,

    #[msg("At least 2 superadmins are required")]
    MinimumSuperadminsRequired,

    #[msg("Too many superadmins")]
    TooManySuperadmins,

    #[msg("Too many operators")]
    TooManyOperators,
}