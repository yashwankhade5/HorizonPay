import { prisma } from "../config/prisma";
import { reconcileTransactions } from "./reconcile";

/**
 * ---------------------------------------------------------------------------
 * CONFIG
 * ---------------------------------------------------------------------------
 */

const CRON_INTERVAL_MS = 15 * 1000;

/**
 * Prevent overlapping runs
 */
let isRunning = false;

/**
 * ---------------------------------------------------------------------------
 * EXPIRE PAYMENT INTENTS (INLINE)
 * ---------------------------------------------------------------------------
 */

async function expirePaymentIntents(): Promise<void> {
  const now = new Date();

  const result = await prisma.paymentIntent.updateMany({
    where: {
      status: "pending",
      expiresAt: {
        lt: now,
      },
    },
    data: {
      status: "expired",
    },
  });

  if (result.count > 0) {
    console.log(`[CRON] Expired ${result.count} payment intents`);
  }
}

/**
 * ---------------------------------------------------------------------------
 * START CRON
 * ---------------------------------------------------------------------------
 */

export function startCron(): void {
  console.log("[CRON] Service started");

  setInterval(async () => {
    if (isRunning) {
      console.warn("[CRON] Skipping run — previous job still running");
      return;
    }

    isRunning = true;

    try {
      console.log("[CRON] Running jobs...");

      await Promise.all([
        reconcileTransactions(),
        expirePaymentIntents(),
      ]);

      console.log("[CRON] Jobs completed");
    } catch (err) {
      console.error("[CRON] Fatal error:", err);
    } finally {
      isRunning = false;
    }
  }, CRON_INTERVAL_MS);
}