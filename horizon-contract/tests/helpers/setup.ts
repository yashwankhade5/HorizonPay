import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { HorizonContract } from "../../target/types/horizon_contract";

// Anchor provider
export const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// Program instance
export const program = anchor.workspace
  .HorizonContract as Program<HorizonContract>;

// Wallet signer
export const signer = provider.wallet.publicKey;

// Admin PDA
export const [adminPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("admin"), signer.toBuffer()],
  program.programId
);

// Merchant PDA helper
export const getMerchantPda = (merchant: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("merchant"), merchant.toBuffer()],
    program.programId
  )[0];
};

// Recurring PDA helper
export const getRecurringPda = (
  user: PublicKey,
  merchant: PublicKey,
  subscriptionId: anchor.BN
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("recurring"),
      user.toBuffer(),
      merchant.toBuffer(),
      subscriptionId.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  )[0];
};