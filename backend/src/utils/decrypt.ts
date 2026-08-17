// src/config/crypto.ts
import crypto from "crypto";
import { env } from "../config/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV, standard for GCM

function getKey(): Buffer {
  const key = Buffer.from(env.WEBHOOK_ENCRYPTION_KEY!, "hex");
  if (key.length !== 32) {
    throw new Error(
      `WEBHOOK_ENCRYPTION_KEY must be 32 bytes (64 hex chars) — got ${key.length} bytes`
    );
  }
  return key;
}

// Encrypt before storing merchant.webhookSecretEncrypt
export function encryptWebhookSecret(raw: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  const encrypted = Buffer.concat([cipher.update(raw, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Store as: iv:authTag:ciphertext (all hex)
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

// Decrypt at dispatch time to sign outbound webhook — never store the raw secret
export function decryptWebhookSecret(stored: string): string {
  const [ivHex, authTagHex, encryptedHex] = stored.split(":");
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Malformed webhook secret ciphertext — expected iv:authTag:ciphertext");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  return (
    decipher.update(Buffer.from(encryptedHex, "hex")).toString("utf8") +
    decipher.final("utf8")
  );
}