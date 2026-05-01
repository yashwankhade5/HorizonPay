import crypto from "crypto";
import { prisma } from '../config/prisma';
import { env } from "../config/env";

export type ApiKeyType = "secret" | "publishable";

export interface AuthenticatedMerchant {
  merchantId: string;
  walletPubkey: string;
  keyType: ApiKeyType;
}

interface ParsedApiKey {
  prefix: string;
  envTag: string;
  keyId: string;
  secret: string;
  keyType: ApiKeyType;
}

/**
 * Parse API key:
 * sk_live_{keyId}_{secret}
 * pk_live_{keyId}_{secret}
 */
function parseApiKey(apiKey: string): ParsedApiKey {
  const parts = apiKey.split("_");

  if (parts.length < 4) {
    throw new Error("Invalid API key format");
  }

  const [prefix, envTag, keyId, ...secretParts] = parts;
  const secret = secretParts.join("_");

  if (!["sk", "pk"].includes(prefix)) {
    throw new Error("Invalid API key prefix");
  }

  if (!["live", "devnet"].includes(envTag)) {
    throw new Error("Invalid API key environment");
  }

  return {
    prefix,
    envTag,
    keyId,
    secret,
    keyType: prefix === "sk" ? "secret" : "publishable",
  };
}

/**
 * HMAC-SHA256(secret, SERVER_HMAC_SECRET)
 */
function hashSecret(secret: string): string {
  return crypto
    .createHmac("sha256", env.SERVER_HMAC_SECRET)
    .update(secret)
    .digest("hex");
}

/**
 * timing-safe compare
 */

function safeCompare(a: string, b: string): boolean {
  if (a.length !== 64 || b.length !== 64) {
    throw new Error("Hash length invariant violated — possible DB corruption");
  }
  return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}

/**
 * Authenticate API key and return merchant context
 */
export async function authenticate(
  apiKey: string
): Promise<AuthenticatedMerchant> {
  const parsed = parseApiKey(apiKey);

  // chceking for env mismatch apikey

  const expectedEnvTag = env.NODE_ENV === "production" ? "live" : "devnet";
  if (parsed.envTag !== expectedEnvTag) {
    throw new Error("API key environment mismatch");
  }

  const merchant = await prisma.merchant.findFirst({
    where:
      parsed.keyType === "secret"
        ? { secretKeyId: parsed.keyId }
        : { publishableKeyId: parsed.keyId },
    select: {
      id: true,
      walletPubkey: true,
      secretKeyHash: true,
      publishableKeyHash: true,
    },
  });

  if (!merchant) {
    throw new Error("API key not found");
  }

  const incomingHash = hashSecret(parsed.secret);

  const storedHash =
    parsed.keyType === "secret"
      ? merchant.secretKeyHash
      : merchant.publishableKeyHash;

  const valid = safeCompare(incomingHash, storedHash);

  if (!valid) {
    throw new Error("Invalid API key");
  }

  return {
    merchantId: merchant.id,
    walletPubkey: merchant.walletPubkey,
    keyType: parsed.keyType,
  };
}

/**
 * Enforce route-level permissions
 */
export function authorize(
  keyType: ApiKeyType,
  allowed: ApiKeyType[]
): void {
  if (!allowed.includes(keyType)) {
    throw new Error("Forbidden");
  }
}