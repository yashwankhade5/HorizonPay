import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { string } from "zod";
import dotenv from "dotenv";
import { deriveAdminPDA, deriveMerchantPDA,deriveMerchantVaultPDA } from "../services/solana.service";
import { PublicKey } from "@solana/web3.js";
import { TransactionEvent } from "../generated/prisma/enums";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateMerchantInput {
  walletPubkey: string;
  webhookUrl?: string;
}

export interface MerchantWithKeys {
  id: string;
  walletPubkey: string;
  secretKey: string;        // shown ONCE
  publishableKey: string;   // shown ONCE
  webhookSecret?: string;   // shown ONCE
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return crypto.randomBytes(8).toString("hex"); // 16 char
}

function generateSecret(): string {
  return crypto.randomBytes(32).toString("hex"); // 64 char
}

function getEnvTag(): "live" | "devnet" {
  return env.NODE_ENV === "production" ? "live" : "devnet";
}

/**
 * Format:
 * sk_live_{keyId}_{secret}
 * pk_live_{keyId}_{secret}
 */
function buildApiKey(
  prefix: "sk" | "pk",
  keyId: string,
  secret: string
): string {
  return `${prefix}_${getEnvTag()}_${keyId}_${secret}`;
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
 * Webhook secret (bcrypt — per spec)
 */
async function hashWebhookSecret(secret: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(secret, saltRounds);
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * Create a new merchant
 *
 * - Generates sk + pk keys
 * - Stores only HMAC hashes (never raw secrets)
 * - Returns raw keys ONCE
 */
export async function createMerchant(
  input: CreateMerchantInput,
  accountId:string
): Promise<MerchantWithKeys> {
  if (!input.walletPubkey) {
    throw Object.assign(new Error("walletPubkey is required"), {
      statusCode: 400,
    });
  }


  const existing = await prisma.merchant.findUnique({
  where: {accountId },
});

if (existing) {
  throw new Error("Merchant already exists");
}
  // -----------------------------------------------------------------------
  // Generate keys
  // -----------------------------------------------------------------------

  const secretKeyId = generateId();
  const publishableKeyId = generateId();

  const secretKeySecret = generateSecret();
  const publishableKeySecret = generateSecret();

  const secretKey = buildApiKey("sk", secretKeyId, secretKeySecret);
  const publishableKey = buildApiKey("pk", publishableKeyId, publishableKeySecret);
  console.log("-----------------------------------------------------------------------------------------")

  
  console.log("secretkey : ",secretKey)
  console.log("publishablekey : ",publishableKey)

    console.log("-----------------------------------------------------------------------------------------")

  const secretKeyHash = hashSecret(secretKeySecret);
  const publishableKeyHash = hashSecret(publishableKeySecret);

  // -----------------------------------------------------------------------
  // Webhook secret (optional)
  // -----------------------------------------------------------------------

  let webhookSecret: string | undefined;
  let webhookSecretHash: string | undefined;

  if (input.webhookUrl) {
    webhookSecret = generateSecret();
    webhookSecretHash = await hashWebhookSecret(webhookSecret);
  }

  // -----------------------------------------------------------------------
  // Persist
  // -----------------------------------------------------------------------
 const merchant = await prisma.$transaction(async (tx) => {
   const merchant = await prisma.merchant.create({
     data: {
    walletPubkey: input.walletPubkey,

    merchantPda: deriveMerchantPDA(input.walletPubkey,deriveAdminPDA(env.ADMIN_PUBLICKEY)[0].toString())[0].toBase58(),
    merchantVault: deriveMerchantVaultPDA(deriveMerchantPDA(input.walletPubkey,deriveAdminPDA(env.ADMIN_PUBLICKEY)[0].toString())[0])[0].toBase58(),

    accountId, // ✅ correct field name

    secretKeyId,
    secretKeyHash,
    publishableKeyId,
    publishableKeyHash,

    webhookUrl: input.webhookUrl,
    webhookSecretHash,
  },
  });

    await prisma.merchantAccount.update({
    where: { id:accountId },
    data:{
      activated:true
    }
  });
return merchant

  })
  if (merchant != undefined) {
    return {
    id: merchant.id,
    walletPubkey: merchant.walletPubkey,
    secretKey,
    publishableKey,
    webhookSecret,
  };  
  }

 else {
  
  throw Object.assign(new Error("merchnat unable to activate please try again"), {
      statusCode: 404,
    });}
}

/**
 * Get merchant by ID
 */
export async function getMerchantById(accountid: string) {
  const merchant = await prisma.merchant.findUnique({
    where: { accountId:accountid },
  });

  if (!merchant) {
    throw Object.assign(new Error("Merchant not found"), {
      statusCode: 404,
    });
  }

  return merchant;
}

/**
 * Rotate API keys
 *
 * - Generates NEW keyId + secret
 * - Old key becomes invalid immediately
 */
export async function rotateApiKey(
  merchantId: string,
  type: "secret" | "publishable"
): Promise<{ apiKey: string }> {
  const keyId = generateId();
  const secret = generateSecret();

  const prefix = type === "secret" ? "sk" : "pk";
  const apiKey = buildApiKey(prefix, keyId, secret);
  const hash = hashSecret(secret);

  if (type === "secret") {
    await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        secretKeyId: keyId,
        secretKeyHash: hash,
      },
    });
  } else {
    await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        publishableKeyId: keyId,
        publishableKeyHash: hash,
      },
    });
  }

  return { apiKey };
}

/**
 * Rotate webhook secret
 */
export async function rotateWebhookSecret(
  merchantId: string
): Promise<{ webhookSecret: string }> {
  const secret = generateSecret();
  const hash = await hashWebhookSecret(secret);

  await prisma.merchant.update({
    where: { id: merchantId },
    data: {
      webhookSecretHash: hash,
    },
  });

  return { webhookSecret: secret };
}


/**
 * Get TX of merchant
 */
/**
 * Fetch transactions for a merchant filtered by event type
 *
 * - Defaults to "payment_received" events
 * - Returns most recent first
 */
export async function getMerchantTransactions(
  merchantId: string,
  start: number,
  end: number,
  eventType: string = TransactionEvent.PAYMENT
) {
  if (start < 0 || end <= start) {
    throw Object.assign(new Error("Invalid range: end must be greater than start"), {
      statusCode: 400,
    });
  }

  const take = end - start;

  const transactions = await prisma.transaction.findMany({
    where: {
      merchantId,
      eventType: TransactionEvent.PAYMENT,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: start,
    take,
  });

  // if (!transactions || transactions.length === 0) {
  //   throw Object.assign(new Error("No transactions found for this merchant"), {
  //     statusCode: 404,
  //   });
  // }

  return transactions;
}