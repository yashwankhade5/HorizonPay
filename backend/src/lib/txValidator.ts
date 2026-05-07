import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

const PAY_DISCRIMINATOR = Buffer.from([
  119, 18, 216, 65, 192, 117, 122, 220,
]);

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

function assert(condition: any, message: string): void {
  if (!condition) {
    throw new Error(`TX_VALIDATION_FAILED: ${message}`);
  }
}

function readU64LE(buffer: Buffer, offset: number): BN {
  return new BN(buffer.slice(offset, offset + 8), "le");
}

export async function txValidator(params: {
  tx: Transaction;
  expectedProgramId: string;
  expectedMerchantPda: string;   // IMPORTANT rename
  expectedAdminPda: string;
  expectedAmount: string;
  expectedMint: string;          // NEW
}) {
  const {
    tx,
    expectedProgramId,
    expectedMerchantPda,
    expectedAdminPda,
    expectedAmount,
    expectedMint,
  } = params;

  // 1. Single instruction
  assert(tx.instructions.length === 1, "Only single instruction allowed");

  const ix: TransactionInstruction = tx.instructions[0];

  // 2. Program ID
  assert(
    ix.programId.toBase58() === expectedProgramId,
    "Invalid program"
  );

  // 3. Discriminator
  const data = Buffer.from(ix.data);
  assert(data.length >= 16, "Invalid data length");

  const discriminator = data.slice(0, 8);
  assert(
    discriminator.equals(PAY_DISCRIMINATOR),
    "Not pay instruction"
  );

  // 4. Amount
  const amount = readU64LE(data, 8);
  assert(amount.toString() === expectedAmount, "Amount mismatch");

  // 5. Accounts
  assert(ix.keys.length === 8, "Invalid accounts length");

  const [
    user,
    userAta,
    merchantPda,
    adminPda,
    merchantVault,
    adminFeeVault,
    mint,
    tokenProgram,
  ] = ix.keys;

  // 6. Signer
  assert(user.isSigner, "User must sign");

  // 7. Fee payer check
  assert(
    tx.feePayer?.toBase58() === user.pubkey.toBase58(),
    "User must be fee payer"
  );

  // 8. Merchant PDA
  assert(
    merchantPda.pubkey.toBase58() === expectedMerchantPda,
    "Invalid merchant PDA"
  );

  // 9. Admin PDA
  assert(
    adminPda.pubkey.toBase58() === expectedAdminPda,
    "Invalid admin PDA"
  );

  // 10. Mint check
  assert(
    mint.pubkey.toBase58() === expectedMint,
    "Invalid mint"
  );

  // 11. Token program
  assert(
    tokenProgram.pubkey.equals(TOKEN_PROGRAM_ID),
    "Invalid token program"
  );

  // 12. Writable checks (strict)
  assert(user.isWritable, "User must be writable");
  assert(userAta.isWritable, "userAta must be writable");
  assert(merchantPda.isWritable, "merchantPda must be writable");
  assert(adminPda.isWritable, "adminPda must be writable");
  assert(merchantVault.isWritable, "merchantVault must be writable");
  assert(adminFeeVault.isWritable, "adminFeeVault must be writable");

  // 13. Read-only checks
  assert(!mint.isWritable, "Mint should not be writable");

  // DONE
}