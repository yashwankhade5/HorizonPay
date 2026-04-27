import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { program, signer, adminPda } from "./helpers/setup";
import { createWallet, bn } from "./helpers/utils";

describe("recurring payments", () => {
  it("Sets up recurring payment, pays, and stops recurring", async () => {
    // Create subscriber wallet
    const subscriber = await createWallet();

    // Create test mint
    const mint = await createMint(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      signer,
      null,
      6
    );

    // Subscriber token account
    const userTokenAccount = await createAssociatedTokenAccount(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      mint,
      subscriber.publicKey
    );

    // Admin fee vault
    const adminFeeVault = await createAssociatedTokenAccount(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      mint,
      signer
    );

    // Mint tokens to subscriber
    await mintTo(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      mint,
      userTokenAccount,
      signer,
      1_000_000
    );

    // Merchant PDA
    const [merchantPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("merchant"),
        signer.toBuffer(),
        adminPda.toBuffer(),
      ],
      program.programId
    );

    // Merchant Vault PDA
    const vaultIndex = new anchor.BN(1);
    const [merchantVault] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("vault"),
        merchantPda.toBuffer(),
        vaultIndex.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    // Recurring PDA
    const [recurringPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("subscription"),
        subscriber.publicKey.toBuffer(),
        merchantPda.toBuffer(),
      ],
      program.programId
    );

    const amount = bn(100000);

    // -----------------------------------
    // 1. recurring_setup_and_pay
    // -----------------------------------
    const setupTx = await program.methods
      .recurringSetupAndPay(amount)
      .accountsPartial({
        signer: subscriber.publicKey,
        admin: adminPda,
        merchantPda,
        recurringPda,
        userTokenAccount,
        merchantVault,
        adminFeeVault,
        mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([subscriber])
      .rpc();

    console.log("Recurring setup tx:", setupTx);

    let recurringAccount = await program.account.recurringPda.fetch(recurringPda);

    if (recurringAccount.active !== true) {
      throw new Error("Recurring payment not activated");
    }

    console.log("Recurring payment setup successful");

    // -----------------------------------
    // 2. recurr_pay
    // -----------------------------------
    const payTx = await program.methods
      .recurrPay()
      .accountsPartial({
        signer: subscriber.publicKey,
        admin: adminPda,
        merchantPda,
        recurringPda,
        userTokenAccount,
        merchantVault,
        adminFeeVault,
        mint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([subscriber])
      .rpc();

    console.log("Recurring pay tx:", payTx);

    console.log("Recurring payment executed");

    // -----------------------------------
    // 3. stop_recurr_pay
    // -----------------------------------
    const stopTx = await program.methods
      .stopRecurrPay()
      .accountsPartial({
        signer: subscriber.publicKey,
        admin: adminPda,
        merchantPda,
        recurringPda,
      })
      .signers([subscriber])
      .rpc();

    console.log("Stop recurring tx:", stopTx);

    recurringAccount = await program.account.recurringPda.fetch(recurringPda);

    if (recurringAccount.active !== false) {
      throw new Error("Recurring payment not stopped");
    }

    console.log("Recurring payment stopped successfully");
  });
});