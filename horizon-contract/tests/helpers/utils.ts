import * as anchor from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { provider } from "./setup";

// Create a fresh test wallet
export const createWallet = async (): Promise<Keypair> => {
  const wallet = Keypair.generate();

  const sig = await provider.connection.requestAirdrop(
    wallet.publicKey,
    2 * LAMPORTS_PER_SOL
  );

  await provider.connection.confirmTransaction(sig);

  return wallet;
};

// Airdrop SOL to an existing wallet
export const airdropSol = async (
  pubkey: PublicKey,
  amount = 2
): Promise<void> => {
  const sig = await provider.connection.requestAirdrop(
    pubkey,
    amount * LAMPORTS_PER_SOL
  );

  await provider.connection.confirmTransaction(sig);
};

// Sleep helper for async timing
export const sleep = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// BN helper
export const bn = (value: number): anchor.BN => {
  return new anchor.BN(value);
};