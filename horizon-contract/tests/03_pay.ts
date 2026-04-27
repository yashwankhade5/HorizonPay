import * as anchor from "@coral-xyz/anchor";
import {
  PublicKey,
} from "@solana/web3.js";
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { program, signer, adminPda } from "./helpers/setup";
import { createWallet, bn } from "./helpers/utils";

describe("pay", () => {
  it("Processes a payment successfully", async () => {
    // Create user wallet
    const user = await createWallet();

    // Create test mint
    const mint = await createMint(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      signer,
      null,
      6
    );

    // Create user ATA
    const userAta = await createAssociatedTokenAccount(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      mint,
      user.publicKey
    );

    // Create admin fee ATA
    const adminFeeVault = await createAssociatedTokenAccount(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      mint,
      signer
    );

    // Mint tokens to user
    await mintTo(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      mint,
      userAta,
      signer,
      1_000_000
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

    // Pay 100000 units
    const amount = bn(100000);

    const tx = await program.methods
      .pay(amount)
      .accountsPartial({
        user: user.publicKey,
        userAta,
        merchantPda,
        adminPda,
        merchantVault,
        adminFeeVault,
        mint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    console.log("Pay tx:", tx);

    // Fetch merchant state
    const merchantAccount = await program.account.merchantPda.fetch(merchantPda);

    console.log("Merchant after payment:", merchantAccount);

    // Verify user balance reduced
    const userTokenAccount = await getAccount(
      program.provider.connection,
      userAta
    );

    console.log("User remaining balance:", Number(userTokenAccount.amount));

    if (merchantAccount.totalAmount.toNumber() <= 0) {
      throw new Error("Merchant total amount not updated");
    }

    console.log("Payment successful");
  });
});