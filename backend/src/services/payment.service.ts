
import { prisma } from "../config/prisma";
import {
  validateSignedTransaction,
  sendSignedTransaction,
} from "./solana.service";
import { env } from "../config/env";
import { Keypair } from "@solana/web3.js";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";


/**
 * ---------------------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------------------
 */

export interface SubmitPaymentInput {
  paymentIntentId: string;
  signedTxBase64: string;
}

export interface SubmitPaymentResult {
  signature: string;
}

/**
 * ---------------------------------------------------------------------------
 * Service
 * ---------------------------------------------------------------------------
 */

export async function submitPayment(
  input: SubmitPaymentInput
): Promise<SubmitPaymentResult> {
  const { paymentIntentId, signedTxBase64 } = input;

  // -------------------------------------------------------------------------
  // 1. Fetch PaymentIntent
  // -------------------------------------------------------------------------
  const intent = await prisma.paymentIntent.findUnique({
    where: { id: paymentIntentId },
  });

  if (!intent) {
    throw Object.assign(new Error("PaymentIntent not found"), {
      statusCode: 404,
    });
  }

  // -------------------------------------------------------------------------
  // 2. Idempotency check (IMPORTANT)
  // -------------------------------------------------------------------------
  const existingTx = await prisma.transaction.findFirst({
    where: { paymentIntentId: intent.id },
  });

  if (existingTx) {
    return { signature: existingTx.txSignature };
  }

  // -------------------------------------------------------------------------
  // 3. Validate state
  // -------------------------------------------------------------------------
  if (intent.status !== "pending") {
    throw Object.assign(
      new Error(`Payment already ${intent.status}`),
      { statusCode: 409 }
    );
  }

  if (new Date() > intent.expiresAt) {
    throw Object.assign(new Error("Payment session expired"), {
      statusCode: 410,
    });
  }

  // -------------------------------------------------------------------------
  // 4. Fetch merchant (FIXED)
  // -------------------------------------------------------------------------
  const merchant = await prisma.merchant.findUnique({
    where: { id: intent.merchantId },
  });

  if (!merchant) {
    throw Object.assign(new Error("Merchant not found"), {
      statusCode: 404,
    });
  }
  const adminPubkey = Keypair.fromSecretKey(bs58.decode(env.ADMIN_KEYPAIR)).publicKey.toString()

  // -------------------------------------------------------------------------
  // 5. Validate signed transaction (CRITICAL SECURITY)
  // -------------------------------------------------------------------------
  await validateSignedTransaction(signedTxBase64, {
    merchantPubkey: merchant.walletPubkey,
    adminPubkey: adminPubkey,
    amount: intent.amount.toString(),
    mint:env.MINT_ADDRESS, 
  });

  // -------------------------------------------------------------------------
  // 6. Prevent race condition (atomic state change)
  // -------------------------------------------------------------------------
  const updated = await prisma.paymentIntent.updateMany({
    where: {
      id: intent.id,
      status: "pending",
    },
    data: {
      status: "submitted",
    },
  });

  if (updated.count === 0) {
    // another request already processed it
    const tx = await prisma.transaction.findFirst({
      where: { paymentIntentId: intent.id },
    });

    if (tx) {
      return { signature: tx.txSignature };
    }

    throw Object.assign(
      new Error("Payment already processed"),
      { statusCode: 409 }
    );
  }

  // -------------------------------------------------------------------------
  // 7. Send transaction
  // -------------------------------------------------------------------------
  let signature: string;

  try {
    signature = await sendSignedTransaction(signedTxBase64);
  } catch (err: any) {
    // IMPORTANT: we already marked as submitted
    // You may want to implement retry or recovery later
    throw Object.assign(err, { statusCode: 502 });
  }

  // -------------------------------------------------------------------------
  // 8. Store transaction (idempotent via unique constraint)
  // -------------------------------------------------------------------------
  // try {
  //   await prisma.transaction.create({
  //     data: {
  //       paymentIntentId: intent.id,
  //       txSignature:signature,
  //       orderId:intent.orderId,
  //       amount:intent.amount,
  //       merchantId:intent.merchantId
  //       paymentIntentId:intent.id,
  //       userPubkey:
  //     },
  //   });
  // } catch (err: any) {
  //   // handle duplicate insert (if two requests race)
  //   if (err.code === "P2002") {
  //     const existing = await prisma.transaction.findFirst({
  //       where: { paymentIntentId: intent.id },
  //     });

  //     if (existing) {
  //       return { signature: existing.txSignature };
  //     }
  //   }
  //   throw err;
  // }

  return { signature };
}