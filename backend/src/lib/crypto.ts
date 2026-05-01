import crypto from "crypto";
import { env } from "../config/env";

/**
 * ---------------------------------------------------------------------------
 * HMAC SHA256 (USED FOR API KEY HASHING)
 * ---------------------------------------------------------------------------
 *
 * hash = HMAC(secret, SERVER_HMAC_SECRET)
 */
export function hmacSHA256(data: string, secret?: string): string {
  const key = secret ?? env.SERVER_HMAC_SECRET;

  if (!key) {
    throw new Error("Missing HMAC secret");
  }

  return crypto
    .createHmac("sha256", key)
    .update(data)
    .digest("hex");
}

/**
 * ---------------------------------------------------------------------------
 * SHA256 HASH (GENERIC)
 * ---------------------------------------------------------------------------
 */
export function sha256(data: string): string {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex");
}

/**
 * ---------------------------------------------------------------------------
 * TIMING-SAFE STRING COMPARISON
 * ---------------------------------------------------------------------------
 *
 * Prevents timing attacks when comparing hashes
 */
export function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "hex");
  const bBuf = Buffer.from(b, "hex");

  if (aBuf.length !== bBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuf, bBuf);
}

/**
 * ---------------------------------------------------------------------------
 * GENERATE RANDOM TOKEN (SECURE)
 * ---------------------------------------------------------------------------
 *
 * Used for:
 * - webhook secrets
 * - session tokens (if you add later)
 */
export function generateRandomToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * ---------------------------------------------------------------------------
 * GENERATE UUID (OPTIONAL ALT)
 * ---------------------------------------------------------------------------
 *
 * You already use uuid lib, but keeping here for flexibility
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}