// src/workers/webhook-dispatcher.ts
import { prisma } from "../config/prisma";
import { decryptWebhookSecret } from "../utils/decrypt"; // your existing AES-256-GCM decrypt
import crypto from "crypto";

const BATCH_SIZE = 20;
const MAX_ATTEMPTS = 8;
const POLL_INTERVAL_MS = 3000;

interface ClaimedRow {
  id: string;
  merchant_id: string;
  event_type: string;
  payload: any;
  attempts: number;
  webhook_url: string;
  webhook_secret_hash: string;
}

function nextDelayMs(attempts: number) {
  // 5s, 10s, 20s, 40s ... capped at 1hr
  return Math.min(5000 * 2 ** attempts, 60 * 60 * 1000);
}

function signPayload(secret: string, payload: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

async function processRow(tx: any, row: ClaimedRow) {
  const payloadStr = JSON.stringify(row.payload);
  const rawSecret = decryptWebhookSecret(row.webhook_secret_hash);
  const signature = signPayload(rawSecret, payloadStr);



  try {
    const res = await fetch(row.webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Webhook-Event": row.event_type,
      },
      body: payloadStr,
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    await tx.$executeRaw`
      UPDATE webhook_log
      SET delivered = TRUE, attempts = attempts + 1, last_attempt = NOW()
      WHERE id = ${row.id}
    `;
    console.log(`✅ webhook delivered: ${row.event_type} → ${row.merchant_id}`);
  } catch (err: any) {
    const attempts = row.attempts + 1;
    await tx.$executeRaw`
      UPDATE webhook_log
      SET attempts = ${attempts},
          last_attempt = NOW(),
          next_attempt_at = NOW() + (${nextDelayMs(attempts)} || ' milliseconds')::interval,
          last_error = ${String(err.message).slice(0, 500)}
      WHERE id = ${row.id}
    `;
    console.warn(`⚠️  webhook failed (attempt ${attempts}): ${row.event_type} → ${row.merchant_id} — ${err.message}`);
  }
}

async function tick() {
  try {

    await prisma.$transaction(
      async (tx) => {
        const rows = await tx.$queryRaw<ClaimedRow[]>`
          SELECT wl.id, wl.merchant_id, wl.event_type, wl.payload, wl.attempts,
                 m.webhook_url, m.webhook_secret_hash
          FROM webhook_log wl
          JOIN merchants m ON m.account_id = wl.merchant_id
          WHERE wl.delivered = FALSE
            AND wl.attempts < ${MAX_ATTEMPTS}
            AND wl.next_attempt_at <= NOW()
            AND m.webhook_url IS NOT NULL
          ORDER BY wl.created_at
          LIMIT ${BATCH_SIZE}
          FOR UPDATE OF wl SKIP LOCKED
        `;

        for (const row of rows) {
    
          await processRow(tx, row);
        }
      },
      { timeout: 20_000 }
    );
  } catch (err) {
    console.error("webhook dispatcher tick failed", err);
  }
}

export function startWebhookDispatcher() {
  setInterval(() => {
    tick().catch((err) => console.error("webhook dispatcher error", err));
  }, POLL_INTERVAL_MS);
  console.log("✅ Webhook dispatcher active — polling every 3s");
}