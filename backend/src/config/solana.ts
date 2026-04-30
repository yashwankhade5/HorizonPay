import { Connection, Keypair, PublicKey, Commitment } from "@solana/web3.js";
import bs58 from "bs58";
import { env } from "./env";

/**
 * RPC connection commitment levels
 */
export const CONFIRMED_COMMITMENT: Commitment = "confirmed";
export const FINALIZED_COMMITMENT: Commitment = "finalized";

/**
 * Solana RPC connection
 */
export const solanaConnection = new Connection(
  env.SOLANA_RPC_URL,
  CONFIRMED_COMMITMENT
);

/**
 * Program ID
 */
export const PROGRAM_ID = new PublicKey(env.PROGRAM_ID);

/**
 * Backend signer keypair
 * Used for:
 * - recurring cron
 * - escrow advance cron
 * - admin-triggered backend txs
 *
 * NEVER expose this to frontend
 */
export const backendKeypair = Keypair.fromSecretKey(
  bs58.decode(env.BACKEND_PRIVATE_KEY)
);