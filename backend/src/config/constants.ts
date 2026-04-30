/**
 * Payment constants
 */
export const MIN_PAYMENT_AMOUNT = 10_000; // $0.01 USDC (6 decimals)
export const PLATFORM_FEE_BPS = 200; // 2%
export const MIN_PLATFORM_FEE = 1;

/**
 * Escrow constants
 */
export const ESCROW_DAYS = 7;

/**
 * API key prefixes
 */
export const SECRET_KEY_PREFIX_DEV = "sk_devnet_";
export const SECRET_KEY_PREFIX_LIVE = "sk_live_";

export const PUBLISHABLE_KEY_PREFIX_DEV = "pk_devnet_";
export const PUBLISHABLE_KEY_PREFIX_LIVE = "pk_live_";

/**
 * Rate limiting
 */
export const API_RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 min
export const API_RATE_LIMIT_MAX_REQUESTS = 100;

/**
 * Checkout session expiry
 */
export const CHECKOUT_SESSION_EXPIRY_MINUTES = 10;

/**
 * Reconciliation cron
 */
export const RECONCILIATION_INTERVAL_MS = 5 * 60 * 1000; // 5 min

/**
 * Recurring payments
 */
export const RECURRING_INTERVAL_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * Webhook security
 */
export const WEBHOOK_SIGNATURE_ALGORITHM = "sha256";
export const WEBHOOK_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Freeze rules
 */
export const MAX_FREEZE_DURATION_SECONDS = 30 * 24 * 60 * 60; // 30 days

/**
 * Retry logic
 */
export const MAX_WEBHOOK_RETRIES = 5;
export const WEBSOCKET_MAX_BACKOFF_MS = 30_000;