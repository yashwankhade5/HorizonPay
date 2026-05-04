import { Connection } from "@solana/web3.js";
import { prisma } from "../config/prisma";
import { env } from "../config/env";

/**
 * ---------------------------------------------------------------------------
 * SETUP
 * ---------------------------------------------------------------------------
 */

const connection = new Connection(env.SOLANA_RPC_URL, "confirmed");

const BATCH_SIZE = 50;

/**
 * ---------------------------------------------------------------------------
 * RECONCILE SUBMITTED TRANSACTIONS
 * ---------------------------------------------------------------------------
 */

export async function reconcileTransactions(): Promise<void> {
  const txs = await prisma.transaction.findMany({
    where: {
      status: "submitted",
    },
    take: BATCH_SIZE,
    orderBy: {
      createdAt: "asc", // oldest first
    },
  });

  if (txs.length === 0) {
    return;
  }

  console.log(`[RECONCILE] Processing ${txs.length} transactions`);

  for (const tx of txs) {
    try {
      const res = await connection.getSignatureStatus(tx.signature);

      if (!res.value) {
        // Not found yet — skip
        continue;
      }

      const status = res.value;

      /**
       * ---------------------------------------------------------
       * FAILED TRANSACTION
       * ---------------------------------------------------------
       */
      if (status.err) {
        console.warn(`[RECONCILE] Failed tx: ${tx.signature}`);

        await prisma.$transaction([
          prisma.transaction.update({
            where: { id: tx.id },
            data: { status: "failed" },
          }),
          prisma.paymentIntent.update({
            where: { id: tx.paymentIntentId },
            data: { status: "failed" },
          }),
        ]);

        continue;
      }

      /**
       * ---------------------------------------------------------
       * CONFIRMED TRANSACTION
       * ---------------------------------------------------------
       */
      if (status.confirmationStatus === "finalized") {
        console.log(`[RECONCILE] Confirmed tx: ${tx.signature}`);

        await prisma.$transaction([
          prisma.transaction.update({
            where: { id: tx.id },
            data: { status: "confirmed" },
          }),
          prisma.paymentIntent.update({
            where: { id: tx.paymentIntentId },
            data: { status: "confirmed" },
          }),
        ]);

        /**
         * -------------------------------------------------------
         * TODO: TRIGGER WEBHOOK
         * -------------------------------------------------------
         * Example (future):
         *
         * await sendPaymentConfirmedWebhook({
         *   paymentIntentId: tx.paymentIntentId,
         *   signature: tx.signature,
         * });
         */
      }

    } catch (err) {
      console.error(
        `[RECONCILE] Error processing tx ${tx.signature}`,
        err
      );
    }
  }
}