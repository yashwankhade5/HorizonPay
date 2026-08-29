import crypto from "crypto";
import axios from "axios";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { WebhookLogScalarWhereInput } from "../generated/prisma/internal/prismaNamespace";

/**
 * ---------------------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------------------
 */

export interface PaymentReceivedEvent {
  signature: string;
  merchant: string;
  user: string;
  amount: string;
  timestamp: number;
}

// /**
//  * ---------------------------------------------------------------------------
//  * Helpers
//  * ---------------------------------------------------------------------------
//  */

function signPayload(payload: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
}

// /**
//  * ---------------------------------------------------------------------------
//  * Service
//  * ---------------------------------------------------------------------------
//  */

// export async function handlePaymentReceived(
//   event: PaymentReceivedEvent
// ): Promise<void> {
//   const { signature, merchant, user, amount } = event;

//   // -------------------------------------------------------------------------
//   // 1. Find transaction
//   // -------------------------------------------------------------------------
//   const tx = await prisma.transaction.findUnique({
//     where: { txSignature:signature },
//     include: {
//       paymentIntent: {
//         include: {
//           merchant: true, // assuming relation exists
//         },
//       },
//     },
//   });

//   if (!tx) {
//     console.warn("⚠️ Unknown transaction:", signature);
//     return;
//   }

//   // -------------------------------------------------------------------------
//   // 2. Idempotency guard
//   // -------------------------------------------------------------------------
//   if (tx.status === "confirmed") {
//     return;
//   }

//   const intent = tx.paymentIntent;
//   const merchantRecord = intent?.merchant;

//   if (!intent || !merchantRecord) {
//     console.error("❌ Missing intent or merchant");
//     return;
//   }

//   // -------------------------------------------------------------------------
//   // 3. Validate event (critical security)
//   // -------------------------------------------------------------------------
//   if (
//     intent.merchantId !== merchant ||
//     intent.userPubkey !== user ||
//     intent.amount.toString() !== amount
//   ) {
//     console.error("❌ Event mismatch", { signature });
//     return;
//   }

//   // -------------------------------------------------------------------------
//   // 4. Update DB atomically
//   // -------------------------------------------------------------------------
//   await prisma.$transaction([
//     prisma.transaction.update({
//       where: { id: tx.id },
//       data: {
//         status: "confirmed",
//         confirmedAt: new Date(),
//       },
//     }),
//     prisma.paymentIntent.update({
//       where: { id: intent.id },
//       data: { status: "confirmed" },
//     }),
//   ]);

//   // -------------------------------------------------------------------------
//   // 5. Send webhook to merchant
//   // -------------------------------------------------------------------------

//   if (!merchantRecord.webhookUrl) {
//     console.warn("⚠️ Merchant has no webhook URL");
//     return;
//   }

//   const payload = {
//     id: intent.id,
//     orderId: intent.orderId,
//     amount: intent.amount.toString(),
//     user: intent.userPubkey,
//     merchant: intent.merchantId,
//     signature,
//     status: "confirmed",
//     timestamp: Date.now(),
//   };

//   const rawBody = JSON.stringify(payload);

//   const signatureHeader = signPayload(
//     rawBody,
//     merchantRecord.webhookSecret // must be stored securely
//   );

//   try {
//     await axios.post(merchantRecord.webhookUrl, payload, {
//       headers: {
//         "Content-Type": "application/json",
//         "x-horizon-signature": signatureHeader,
//       },
//       timeout: 5000,
//     });

//     // mark webhook delivered
//     await prisma.webhookEvent.create({
//       data: {
//         paymentIntentId: intent.id,
//         status: "delivered",
//       },
//     });

//   } catch (err) {
//     console.error("❌ Webhook delivery failed:", err);

//     // store for retry system
//     await prisma.webhookEvent.create({
//       data: {
//         paymentIntentId: intent.id,
//         status: "failed",
//       },
//     });

//     // DO NOT throw → webhook retries handled async
//   }
// }

// service
interface GetWebhookLogsOptions {
  page: number;
  limit: number;
  delivered?: "true" | "false";
  eventType?: string;
}

export async function getMerchantWebhookLogs(
  merchantId: string,
  options: GetWebhookLogsOptions
) {
  const { page, limit, delivered, eventType } = options;



  const [logs, total] = await prisma.$transaction([
    prisma.webhookLog.findMany({
      where: {
        merchantId: merchantId,

      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.webhookLog.count({
      where: {
        merchantId,
        ...(delivered !== undefined && { delivered: delivered === "true" }),
        ...(eventType && { eventType }),
      }
    }),
  ]);

  console.log("merchhant-log:", logs)
  return { logs, total };
}

export async function updateWebhookHandler(accountid: string, url: string) {



  try {
    const parsed = new URL(url);
    parsed.protocol === "https:";


  
    const webhookurlchanged=  await prisma.merchant.update({
      where: { accountId: accountid },
      data: { webhookUrl: url },
      select: { id: true, webhookUrl: true },
    });

    return webhookurlchanged
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new Error("Merchant not found for account");
    }
    throw err;
  }
}