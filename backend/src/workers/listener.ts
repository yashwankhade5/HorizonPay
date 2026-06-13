// src/listener.ts
import { Connection, PublicKey } from "@solana/web3.js";
import { BorshCoder, EventParser, Idl } from "@coral-xyz/anchor";
import { prisma } from "../config/prisma"; // ← your singleton
import { idl as IDL } from "../config/idl";
import { env } from "../config/env";

const PROGRAM_ID = new PublicKey(env.PROGRAM_ID!);
const RPC_HTTP = env.SOLANA_RPC_URL!;
const RPC_WS = env.SOLANA_WS_URL!;

// ─── Event Types ──────────────────────────────────────────────────────────────
interface PaymentReceived {
  merchant: PublicKey;
  user: PublicKey;
  amount: bigint;
  fee: bigint;
  timestamp: bigint;
}

interface WithdrawExecuted {
  merchant: PublicKey;
  amount: bigint;
  timestamp: bigint;
}

interface FundsReleased {
  merchant: PublicKey;
  releaseAmount: bigint;
  newWithdrawable: bigint;
  timestamp: bigint;
}

interface VaultFrozen {
  merchant: PublicKey;
  frozenBy: PublicKey;
  expiresAt: bigint;
  timestamp: bigint;
}

interface EscrowAdvanced {
  merchant: PublicKey;
  slotsAdvanced: number;
  amountReleased: bigint;
  newWithdrawable: bigint;
  timestamp: bigint;
}

// ─── Handlers ─────────────────────────────────────────────────────────────────
async function handlePaymentReceived(
  event: PaymentReceived,
  signature: string
) {
  console.log(`⚡ PaymentReceived: ${signature}`);

  const merchant = await prisma.merchant.findUnique({
    where: { walletPubkey: event.merchant.toString() },
  });

  if (!merchant) {
    console.error(`Merchant not found: ${event.merchant.toString()}`);
    return;
  }

  const paymentIntent = await prisma.paymentIntent.findFirst({
    where: {
      merchantId: merchant.id,
      amount: event.amount,
      status: "submitted",
    },
  });

  await prisma.$transaction(async (tx) => {
    // 1. insert transaction
    await tx.transaction.upsert({
      where: { txSignature: signature },
      update: {},
      create: {
        merchantId: merchant.id,
        txSignature: signature,
        amount: event.amount,
        userPubkey: event.user.toString(),
        orderId: paymentIntent?.orderId ?? "unknown",
        paymentIntentId: paymentIntent?.id ?? "unknown",
      },
    });

    // 2. delete payment intent
    if (paymentIntent) {
      await tx.paymentIntent.delete({
        where: { id: paymentIntent.id },
      });
    }

    // 3. enqueue webhook
    if (merchant.webhookUrl) {
      await tx.webhookLog.create({
        data: {
          merchantId: merchant.id,
          eventType: "payment.confirmed",
          payload: {
            merchant: event.merchant.toString(),
            user: event.user.toString(),
            amount: event.amount.toString(),
            fee: event.fee.toString(),
            txSignature: signature,
            timestamp: event.timestamp.toString(),
          },
          delivered: false,
          attempts: 0,
        },
      });
    }
  });

  console.log(`✅ PaymentReceived done: ${signature}`);
}

async function handleWithdrawExecuted(
  event: WithdrawExecuted,
  signature: string
) {
  console.log(`⚡ WithdrawExecuted: ${signature}`);

  const merchant = await prisma.merchant.findUnique({
    where: { walletPubkey: event.merchant.toString() },
  });

  if (!merchant) {
    console.error(`Merchant not found: ${event.merchant.toString()}`);
    return;
  }

  if (merchant.webhookUrl) {
    await prisma.webhookLog.create({
      data: {
        merchantId: merchant.id,
        eventType: "withdraw.executed",
        payload: {
          merchant: event.merchant.toString(),
          amount: event.amount.toString(),
          txSignature: signature,
          timestamp: event.timestamp.toString(),
        },
        delivered: false,
        attempts: 0,
      },
    });
  }

  console.log(`✅ WithdrawExecuted done: ${signature}`);
}

async function handleFundsReleased(
  event: FundsReleased,
  signature: string
) {
  // escrow state lives on-chain — no DB update needed
  console.log(
    `✅ FundsReleased: merchant=${event.merchant.toString()} released=${event.releaseAmount} newWithdrawable=${event.newWithdrawable} sig=${signature}`
  );
}

async function handleVaultFrozen(
  event: VaultFrozen,
  signature: string
) {
  console.log(`⚡ VaultFrozen: ${signature}`);

  const merchant = await prisma.merchant.findUnique({
    where: { walletPubkey: event.merchant.toString() },
  });

  if (!merchant) {
    console.error(`Merchant not found: ${event.merchant.toString()}`);
    return;
  }

  if (merchant.webhookUrl) {
    await prisma.webhookLog.create({
      data: {
        merchantId: merchant.id,
        eventType: "vault.frozen",
        payload: {
          merchant: event.merchant.toString(),
          frozenBy: event.frozenBy.toString(),
          expiresAt: event.expiresAt.toString(),
          txSignature: signature,
          timestamp: event.timestamp.toString(),
        },
        delivered: false,
        attempts: 0,
      },
    });
  }

  console.log(`✅ VaultFrozen done: ${signature}`);
}

async function handleEscrowAdvanced(
  event: EscrowAdvanced,
  signature: string
) {
  // fully on-chain — just log for ops visibility
  console.log(
    `✅ EscrowAdvanced: merchant=${event.merchant.toString()} slotsAdvanced=${event.slotsAdvanced} released=${event.amountReleased} newWithdrawable=${event.newWithdrawable} sig=${signature}`
  );
}

// ─── Core Listener ────────────────────────────────────────────────────────────
async function startListener() {
  const connection = new Connection(RPC_HTTP, {
    wsEndpoint: RPC_WS,
    commitment: "confirmed",
  });

  const coder = new BorshCoder(IDL as Idl);
  const eventParser = new EventParser(PROGRAM_ID, coder);

  console.log(`🔌 Subscribing to program: ${PROGRAM_ID.toString()}`);

  connection.onLogs(
    PROGRAM_ID,
    async (logs, _ctx) => {
      const { signature, logs: rawLogs, err } = logs;

      if (err) {
        console.warn(`Skipping failed tx: ${signature}`);
        return;
      }

      try {
        const events = [...eventParser.parseLogs(rawLogs)];
        if (events.length === 0) return;

        for (const event of events) {
          switch (event.name) {
            case "PaymentReceived":
              await handlePaymentReceived(
                event.data as PaymentReceived,
                signature
              );
              break;

            case "WithdrawExecuted":
              await handleWithdrawExecuted(
                event.data as WithdrawExecuted,
                signature
              );
              break;

            case "FundsReleased":
              await handleFundsReleased(
                event.data as FundsReleased,
                signature
              );
              break;

            case "VaultFrozen":
              await handleVaultFrozen(
                event.data as VaultFrozen,
                signature
              );
              break;

            case "EscrowAdvanced":
              await handleEscrowAdvanced(
                event.data as EscrowAdvanced,
                signature
              );
              break;

            default:
              console.log(`Unknown event: ${event.name}`);
          }
        }
      } catch (err) {
        console.error(`Error handling tx ${signature}:`, err);
        // don't crash — reconciliation cron catches missed events
      }
    },
    "confirmed"
  );

  await new Promise(() => {});
}

// ─── Reconnect with Exponential Backoff ───────────────────────────────────────
async function startWithRetry() {
  let delay = 1000;

  while (true) {
    try {
      console.log("🚀 Starting listener...");
      await startListener();
    } catch (err) {
      console.error(`💥 Listener crashed. Retrying in ${delay}ms...`, err);
      await new Promise((res) => setTimeout(res, delay));
      delay = Math.min(delay * 2, 30_000);
    }
  }
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
process.on("SIGINT", async () => {
  console.log("Shutting down listener...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down listener...");
  await prisma.$disconnect();
  process.exit(0);
});

startWithRetry().catch(console.error);