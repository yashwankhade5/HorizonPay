import { PublicKey, SystemProgram } from "@solana/web3.js";
import { program, signer, adminPda } from "./helpers/setup";
import { bn } from "./helpers/utils";

describe("create_admin", () => {
  it("Creates the admin PDA", async () => {
    const superadmins = [signer, signer];
    const operators: PublicKey[] = [];

    const tx = await program.methods
      .createAdmin(
        superadmins,
        operators,
        bn(200),     // 2% fee in basis points
        true,        // escrow enabled
        signer       // admin fee vault
      )
      .accounts({
        // adminPda: adminPda,
        signer: signer,
        // systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Create admin tx:", tx);

    const adminAccount = await program.account.adminPda.fetch(adminPda);

    console.log("Admin account:", adminAccount);

    // Assertions
    if (adminAccount.platformFeeBps.toNumber() !== 200) {
      throw new Error("Platform fee bps incorrect");
    }

    if (adminAccount.escrowFlag !== true) {
      throw new Error("Escrow flag incorrect");
    }

    if (!adminAccount.adminFeeVault.equals(signer)) {
      throw new Error("Admin fee vault incorrect");
    }

    console.log("Admin PDA created successfully");
  });
});