import crypto from "crypto";

/**
 * ---------------------------------------------------------------------------
 * TYPES
 * ---------------------------------------------------------------------------
 */





/**
 * ---------------------------------------------------------------------------
 * BUILD IDEMPOTENCY KEY (HUMAN READABLE)
 * ---------------------------------------------------------------------------
 *
 * Format:
 * merchantId:orderId:amount
 *
 * Used for:
 * - DB uniqueness constraint
 * - deduplication
 */
export function buildIdempotencyKey(  merchantId: string,
  orderId: string,
  amount: bigint): string {
  if (!merchantId || !orderId) {
    throw new Error("Invalid idempotency key inputs");
  }

  return `${merchantId}:${orderId}:${amount.toString()}`;
}

/**
 * ---------------------------------------------------------------------------
 * HASH IDEMPOTENCY KEY (OPTIONAL)
 * ---------------------------------------------------------------------------
 *
 * Why hash?
 * - fixed length
 * - hides business data (orderId, amount)
 * - better DB indexing
 *
 * You can store BOTH raw + hash if needed
 */
export function hashIdempotencyKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

/**
 * ---------------------------------------------------------------------------
 * SAFE COMPARE (TIMING ATTACK SAFE)
 * ---------------------------------------------------------------------------
 */

export function safeCompareKeys(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  if (aBuf.length !== bBuf.length) return false;

  return crypto.timingSafeEqual(aBuf, bBuf);
}

/**
 * ---------------------------------------------------------------------------
 * VALIDATION (OPTIONAL STRICT MODE)
 * ---------------------------------------------------------------------------
 */

export function validateIdempotencyKey(key: string): void {
  const parts = key.split(":");

  if (parts.length !== 3) {
    throw new Error("Invalid idempotency key format");
  }

  const [merchantId, orderId, amount] = parts;

  if (!merchantId || !orderId || !amount) {
    throw new Error("Invalid idempotency key components");
  }

  if (!/^\d+$/.test(amount)) {
    throw new Error("Amount must be numeric in idempotency key");
  }
}