import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  createMint,
  createAssociatedTokenAccount,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { program, signer, adminPda } from "./helpers/setup";
import { bn } from "./helpers/utils";

describe("withdraw", () => {
  it("Withdraws funds from merchant vault", async () => {
    // Create mint
    const mint = await createMint(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      signer,
      null,
      6
    );

    // Derive merchant PDA
    const [merchantPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("merchant"),
        signer.toBuffer(),
        adminPda.toBuffer(),
      ],
      program.programId
    );

    // Derive merchant vault PDA
    const vaultIndex = new anchor.BN(1);
    const [merchantVault] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("vault"),
        merchantPda.toBuffer(),
        vaultIndex.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    // Merchant ATA (destination for withdraw)
    const merchantAta = await createAssociatedTokenAccount(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      mint,
      signer
    );

    // Withdraw amount
    const amount = bn(50000);

    const tx = await program.methods
      .withdraw(amount)
      .accountsPartial({
        merchant: signer,
        merchantPda,
        merchantVault,
        merchantAta,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log("Withdraw tx:", tx);

    // Check merchant ATA balance
    const merchantTokenAccount = await getAccount(
      program.provider.connection,
      merchantAta
    );

    console.log("Merchant ATA balance:", Number(merchantTokenAccount.amount));

    if (Number(merchantTokenAccount.amount) <= 0) {
      throw new Error("Withdraw failed: merchant ATA balance is zero");
    }

    console.log("Withdraw successful");
  });
});