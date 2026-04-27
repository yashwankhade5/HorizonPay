import * as anchor from "@coral-xyz/anchor";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { createMint, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { program, signer, adminPda } from "./helpers/setup";

describe("create_merchant", () => {
  it("Creates merchant PDA and merchant vault", async () => {
    const [merchantPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("merchant"),
        signer.toBuffer(),
        adminPda.toBuffer(),
      ],
      program.programId
    );

    const vaultIndex = new anchor.BN(1);

    const [merchantVault] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("vault"),
        merchantPda.toBuffer(),
        vaultIndex.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const mint = await createMint(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      signer,
      null,
      6
    );

    const tx = await program.methods
      .createMerchant()
      .accountsPartial({
        signer,
        admin: adminPda,
        merchantPda,
        merchantVault,
        mint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Create merchant tx:", tx);

    const merchantAccount = await program.account.merchantPda.fetch(merchantPda);

    console.log("Merchant account:", merchantAccount);
  });
});