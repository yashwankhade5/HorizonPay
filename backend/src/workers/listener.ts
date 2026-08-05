// src/workers/listener.ts
import { env } from "../config/env";
import { Connection, PublicKey } from "@solana/web3.js";
import { BorshCoder, EventParser, Idl } from "@coral-xyz/anchor";
import { prisma } from "../config/prisma";
import { TransactionEvent } from "../generated/prisma/enums";
import { idl as IDL } from "../config/idl";


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
interface MerchantOnBoard {
  merchantpda: PublicKey,
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
  signature: string,

) {
  console.log(`⚡ PaymentReceived: ${signature}`);
  console.log(`   merchant: ${event.merchant.toString()}`);
  console.log(`   user: ${event.user.toString()}`);
  console.log(`   amount: ${event.amount.toString()}`);

  const merchant = await prisma.merchant.findUnique({
    where: { walletPubkey: event.merchant.toString() },
  });

  if (!merchant) {
    console.error(`❌ Merchant not found: ${event.merchant.toString()}`);
    return;
  }

  console.log(`   merchantId in DB: ${merchant.id}`);
  const amount = BigInt(event.amount.toString());

  // ── find payment intent ──────────────────────────────────────────────────
  // check both "pending" and "submitted" — submit endpoint may not have
  // updated status yet if listener fires before submit response returns
  const paymentIntent = await prisma.paymentIntent.findFirst({
    where: {
      merchantId: merchant.id,
      amount,
      status: { in: ["pending", "submitted"] },
    },
  });

  if (!paymentIntent) {
    console.warn(`⚠️  No PaymentIntent found for amount=${event.amount} merchantId=${merchant.id}`);
    console.warn(`   Will still record transaction — reconciliation handles intent cleanup`);
  } else {
    console.log(`   paymentIntentId: ${paymentIntent.id} status: ${paymentIntent.status}`);
  }

  // ── write atomically ─────────────────────────────────────────────────────
  const paymentsrec = await prisma.$transaction(async (tx) => {
    // 1. insert transaction — upsert guards against duplicate processing
    const transaction = await tx.transaction.upsert({
      where: { txSignature: signature },
      update: {
        merchantId: merchant.id,
        amount,
        eventType: TransactionEvent.PAYMENT,
        userPubkey: event.user.toString(),
        orderId: paymentIntent?.orderId ?? "unknown",
        paymentIntentId: paymentIntent?.id ?? null,
      },
      create: {
        merchantId: merchant.id,
        txSignature: signature,
        amount,
        userPubkey: event.user.toString(),
        orderId: paymentIntent?.orderId ?? "unknown",
        paymentIntentId: paymentIntent?.id ?? "unknown",
      },
    });

    console.log(`   ✅ Transaction upserted: ${transaction.id}`);

    // 2. delete payment intent
    if (paymentIntent) {
      await tx.paymentIntent.delete({
        where: { id: paymentIntent.id },
      });
      console.log(`   ✅ PaymentIntent deleted: ${paymentIntent.id}`);
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
          attempts: 3,
        },
      });
      console.log(`   ✅ Webhook enqueued`);
    }
  });

  console.log(`✅ PaymentReceived fully processed: ${signature}`);
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
    console.error(`❌ Merchant not found: ${event.merchant.toString()}`);
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
    console.error(`❌ Merchant not found: ${event.merchant.toString()}`);
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
  console.log(
    `✅ EscrowAdvanced: merchant=${event.merchant.toString()} slotsAdvanced=${event.slotsAdvanced} released=${event.amountReleased} newWithdrawable=${event.newWithdrawable} sig=${signature}`
  );
}
async function handleMerchnatOnBoard(
  signature: string,
  event: MerchantOnBoard
) {



  const transaction = await prisma.transaction.update({
    where: { txSignature: signature },
    data: {
      eventType: TransactionEvent.MERCHANT_ONBOARDING,
      merchantId: event.merchantpda.toString()
    }
  })



}


async function storeRawTransaction(
  signature: string,


) {
  try {

    await prisma.transaction.upsert({
      where: {
        txSignature: signature,
      },

      update: {},

      create: {
        txSignature: signature,

        merchantId: null,


        amount: BigInt(0),

        userPubkey: "unknown",

        orderId: "unknown",

        paymentIntentId: null,
      },
    });


    console.log(
      `📦 Raw tx stored: ${signature}`
    );


  } catch (err) {

    console.error(
      "❌ Failed storing raw tx",
      err
    );

  }
}


// ─── Core Listener ────────────────────────────────────────────────────────────
async function startListener() {
  console.log(
    "DB:",
    env.DATABASE_URL
  );
  const connection = new Connection(RPC_HTTP, {
    wsEndpoint: RPC_WS,
    commitment: "confirmed",
  });

  // ── validate IDL loaded correctly ────────────────────────────────────────
  if (!IDL || !IDL.events || IDL.events.length === 0) {
    throw new Error("IDL not loaded or has no events — check ../config/idl");
  }
  console.log(`📄 IDL loaded: ${IDL.events.length} events found`);
  console.log(`   Events: ${IDL.events.map((e: any) => e.name).join(", ")}`);

  const coder = new BorshCoder(IDL as Idl);
  const eventParser = new EventParser(PROGRAM_ID, coder);

  console.log(`🔌 Subscribing to program: ${PROGRAM_ID.toString()}`);
  console.log(`   RPC HTTP: ${RPC_HTTP}`);
  console.log(`   RPC WS:   ${RPC_WS}`);

  connection.onLogs(
    PROGRAM_ID,
    async (logs, _ctx) => {
      const { signature, logs: rawLogs, err } = logs;

      // ── log every tx we see ────────────────────────────────────────────
      console.log(`\n📨 Tx received: ${signature} err=${!!err}`);

      if (err) {
        console.warn(`   Skipping failed tx`);
        return;
      }

      try {
        const events = [
          ...eventParser.parseLogs(rawLogs)
        ];


        console.log(
          `   Events parsed: ${events.length}`
        );


        // ALWAYS STORE TX
        await storeRawTransaction(
          signature,

        );


        // no event, already stored
        if (events.length === 0) {

          console.log(
            "No Anchor event. Stored only."
          );

          return;
        }

        for (const event of events) {
          console.log(`   Event: ${event.name}`);

          switch (event.name) {
            case "PaymentReceived":
              await handlePaymentReceived(
                event.data as PaymentReceived,
                signature,
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
            case "MerchantOnboarded":
              await handleMerchnatOnBoard(
                signature,
                event.data as MerchantOnBoard
              );
              break;

            default:
              console.log(`   Unknown event: ${event.name}`);
          }
        }
      } catch (err) {
        console.error(`❌ Error handling tx ${signature}:`, err);
      }
    },
    "confirmed"
  );

  console.log(`✅ Listener active — waiting for transactions...`);
  await new Promise(() => { });
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