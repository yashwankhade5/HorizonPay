import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { program, signer, adminPda } from "./helpers/setup";

describe("freeze / unfreeze / transfer flags", () => {
  it("Freezes and unfreezes merchant vault, toggles transfer", async () => {
    // Derive merchant PDA
    const [merchantPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("merchant"),
        signer.toBuffer(),
        adminPda.toBuffer(),
      ],
      program.programId
    );

    // -------------------------
    // Freeze vault
    // -------------------------
    const freezeTx = await program.methods
      .freezeVault(new anchor.BN(3600)) // freeze for 1 hour
      .accountsPartial({
        signer,
        admin: adminPda,
        merchantPda,
      })
      .rpc();

    console.log("Freeze tx:", freezeTx);

    let merchantAccount = await program.account.merchantPda.fetch(merchantPda);

    if (merchantAccount.freezeFlag !== true) {
      throw new Error("freezeFlag was not set to true");
    }

    console.log("Vault frozen successfully");

    // -------------------------
    // Unfreeze vault
    // -------------------------
    const unfreezeTx = await program.methods
      .unfreezeVault()
      .accountsPartial({
        signer,
        admin: adminPda,
        merchantPda,
      })
      .rpc();

    console.log("Unfreeze tx:", unfreezeTx);

    merchantAccount = await program.account.merchantPda.fetch(merchantPda);

    if (merchantAccount.freezeFlag !== false) {
      throw new Error("freezeFlag was not reset to false");
    }

    console.log("Vault unfrozen successfully");

    // -------------------------
    // Enable transfer
    // -------------------------
    const enableTx = await program.methods
      .enableTransfer()
      .accountsPartial({
        signer,
        admin: adminPda,
        merchantPda,
      })
      .rpc();

    console.log("Enable transfer tx:", enableTx);

    merchantAccount = await program.account.merchantPda.fetch(merchantPda);

    if (merchantAccount.transferFlag !== true) {
      throw new Error("transferFlag was not set to true");
    }

    console.log("Transfer enabled");

    // -------------------------
    // Disable transfer
    // -------------------------
    const disableTx = await program.methods
      .disableTransfer()
      .accountsPartial({
        signer,
        admin: adminPda,
        merchantPda,
      })
      .rpc();

    console.log("Disable transfer tx:", disableTx);

    merchantAccount = await program.account.merchantPda.fetch(merchantPda);

    if (merchantAccount.transferFlag !== false) {
      throw new Error("transferFlag was not reset to false");
    }

    console.log("Transfer disabled");
  });
});