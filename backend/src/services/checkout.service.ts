import { v4 as uuidv4 } from 'uuid';
import { PublicKey } from '@solana/web3.js';
import { prisma } from '../config/prisma';
import { buildPaymentTransaction } from './solana.service';
import { MIN_PAYMENT_AMOUNT } from '../config/constants';
import { buildIdempotencyKey } from "../lib/idempotency";
import { verifyJWT } from "../middleware/auth";



// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateCheckoutSessionInput {
  merchantId: string;
  merchantpubkey: string;
  orderId: string;
  amount: bigint;        // token units (e.g. USDC with 6 decimals)
  // userPubkey: string;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
  sessionId: string;     // payment_intent id — plain UUID, safe as URL param
  expiresAt: Date;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build idempotency key from the three merchant-controlled fields.
 * Format: merchantId:orderId:amount
 * Stored with a UNIQUE constraint — duplicate requests hit a DB conflict
 * before any tx is built.
 */
// function buildIdempotencyKey(merchantId: string, orderId: string, amount: bigint): string {
//   return `${merchantId}:${orderId}:${amount.toString()}`;
// }

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateInput(input: CreateCheckoutSessionInput): void {
  if (!input.orderId || typeof input.orderId !== 'string' || input.orderId.trim() === '') {
    throw Object.assign(new Error('order_id is required'), { statusCode: 400 });
  }

  if (input.amount < MIN_PAYMENT_AMOUNT) {
    throw Object.assign(
      new Error(`amount must be at least ${MIN_PAYMENT_AMOUNT} token units`),
      { statusCode: 400 }
    );
  }

  // Validate user_pubkey is a valid base58 Solana address
  // try {
  //   new PublicKey(input.userPubkey);
  // } catch {
  //   throw Object.assign(new Error('user_pubkey is not a valid Solana public key'), { statusCode: 400 });
  // }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * POST /checkout/session
 *
 * Creates (or returns an existing) PaymentIntent and returns a checkout URL
 * containing the plain payment intent UUID.
 *
 * Security model:
 * - Session IDs are UUIDs (122 bits of entropy) — unguessable in practice.
 * - No session token signing needed: even if someone guessed a session ID,
 *   the full server-side tx validation in POST /payment/submit (program ID,
 *   vault address, amount, user pubkey) is the real security gate and rejects
 *   anything that does not match the stored PaymentIntent.
 *
 * Idempotency:
 * - Enforced at the DB level via UNIQUE constraint on idempotency_key.
 * - A duplicate request returns the existing intent row — no second tx built,
 *   no DB error surfaced to the caller.
 *
 * NOTE: The unsigned tx built here includes a placeholder blockhash. The
 * checkout page MUST fetch a fresh blockhash from the RPC before presenting
 * the tx to the wallet — blockhash expires in ~90 seconds.
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<CheckoutSessionResult> {
  validateInput(input);
let userPubkey = "HVcH9SecFL99oM2n4Zigeadegxiznwb53iz6HXpxeKLA"
  const idempotencyKey = buildIdempotencyKey(input.merchantId, input.orderId, input.amount);

  // Check for existing intent first to avoid building an unnecessary tx
  let paymentIntent = await prisma.paymentIntent.findUnique({
    where: { idempotencyKey },
  });


  if (!paymentIntent) {
    
    // Build unsigned tx before DB write — if tx construction fails, no broken
    // row is persisted. Blockhash here is a placeholder; checkout page refreshes
    // it from RPC immediately before wallet signing.
    const unsignedTxBase64 = await buildPaymentTransaction({
      userPubkey: userPubkey,
      merchantPubkey: input.merchantpubkey,
      amount: input.amount.toString(),

    });

    try {
      
      paymentIntent = await prisma.paymentIntent.create({
        data: {
          id: uuidv4(),
          merchantId: input.merchantId,
          orderId: input.orderId,
          amount: input.amount,
          userPubkey: userPubkey,
          idempotencyKey,
          status: 'pending',
          unsignedTx: unsignedTxBase64,
          // expires_at defaults to NOW() + INTERVAL '10 minutes' in schema
        },
      });
      
    } catch (err: any) {
      // Handle unique constraint race (two concurrent requests for same key)
      if (err.code === 'P2002' && err.meta?.target?.includes('idempotency_key')) {
        paymentIntent = await prisma.paymentIntent.findUniqueOrThrow({
          where: { idempotencyKey },
        });
      } else {
        throw err;
      }
    }
  }
console.log("i am here1")
  const baseUrl = process.env.CHECKOUT_BASE_URL ?? 'https://pay.horizonpay.io';
  const checkoutUrl = `${baseUrl}/${paymentIntent.id}`;

  return {
    checkoutUrl,
    sessionId: paymentIntent.id,
    expiresAt: paymentIntent.expiresAt,
  };
}

/**
 * GET /checkout/:sessionId
 *
 * Called by the checkout page to retrieve the unsigned tx.
 * Returns the PaymentIntent if it exists, is pending, and has not expired.
 * The checkout page must then fetch a fresh blockhash from the RPC and update
 * the tx before presenting it to the wallet for signing.
 */
export async function getPaymentIntentById(id: string) {
  const intent = await prisma.paymentIntent.findUnique({ where: { id } });

  if (!intent) {
    throw Object.assign(new Error('Payment session not found'), { statusCode: 404 });
  }
  if (intent.status !== 'pending') {
    throw Object.assign(
      new Error(`Payment session is already ${intent.status}`),
      { statusCode: 409 }
    );
  }
  if (new Date() > intent.expiresAt) {
    throw Object.assign(new Error('Payment session has expired'), { statusCode: 410 });
  }

  return intent;
}

/**
 * Mark a PaymentIntent as submitted after the signed tx has been broadcast.
 * Called by payment.service after a successful sendTransaction call.
 * Final confirmation (and PaymentIntent deletion) is handled by the
 * contract event listener on PaymentReceived, with the reconciliation
 * cron as fallback.
 */
export async function markPaymentIntentSubmitted(id: string) {
  return prisma.paymentIntent.update({
    where: { id },
    data: { status: 'submitted' },
  });
}