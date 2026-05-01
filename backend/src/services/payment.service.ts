import { prisma } from "../config/prisma";
import {
  validateSignedTransaction,
  sendSignedTransaction,
} from "./solana.service";

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

  // -------------------------------------------------------------------------
  // 5. Validate signed transaction (CRITICAL SECURITY)
  // -------------------------------------------------------------------------
  await validateSignedTransaction(signedTxBase64, {
    merchantPubkey: merchant.walletPubkey,
    adminPubkey: process.env.ADMIN_PUBKEY!,
    amount: intent.amount.toString(),
    userPubkey: intent.userPubkey, // ensure correct signer
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
      return { signature: tx.signature };
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
  try {
    await prisma.transaction.create({
      data: {
        paymentIntentId: intent.id,
        signature,
        status: "submitted",
      },
    });
  } catch (err: any) {
    // handle duplicate insert (if two requests race)
    if (err.code === "P2002") {
      const existing = await prisma.transaction.findFirst({
        where: { paymentIntentId: intent.id },
      });

      if (existing) {
        return { signature: existing.signature };
      }
    }
    throw err;
  }

  return { signature };
}