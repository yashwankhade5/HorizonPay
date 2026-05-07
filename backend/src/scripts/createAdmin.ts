import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";

import fs from "fs";
import path from "path";

import { idl } from "../config/idl";
import type { HorizonContract } from "../config/horizon_contract_types";

// -----------------------------
// CONFIG
// -----------------------------

const RPC_URL = "http://127.0.0.1:8899";

// your admin wallet keypair json
const KEYPAIR_PATH = path.resolve(
  process.env.HOME!,
  ".config/solana/id.json"
);

// token account that receives fees
const ADMIN_FEE_VAULT = new PublicKey(
  "YOUR_TOKEN_ACCOUNT_HERE"
);

// -----------------------------
// SETUP
// -----------------------------

const connection = new Connection(RPC_URL, "confirmed");

const secret = JSON.parse(
  fs.readFileSync(KEYPAIR_PATH, "utf-8")
);

const wallet = Keypair.fromSecretKey(
  Uint8Array.from(secret)
);

const provider = new anchor.AnchorProvider(
  connection,
  new anchor.Wallet(wallet),
  {
    commitment: "confirmed",
  }
);

anchor.setProvider(provider);

const program = new Program<HorizonContract>(
  idl as HorizonContract,
  provider
);

// -----------------------------
// PDA
// -----------------------------

const [adminPda] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("admin"),
    wallet.publicKey.toBuffer(),
  ],
  program.programId
);

// -----------------------------
// MAIN
// -----------------------------

async function main() {
  console.log("Signer:", wallet.publicKey.toBase58());
  console.log("Admin PDA:", adminPda.toBase58());

  
    const mint = await createMint(
      program.provider.connection,
      (program.provider as anchor.AnchorProvider).wallet.payer!,
      signer,
      null,
      6
    );


  const tx = await program.methods
    .createAdmin(
      [wallet.publicKey], // superadmins
      [], // operators
      new anchor.BN(250), // 2.5% fee
      false, // escrow flag
      ADMIN_FEE_VAULT
    )
    .accountsPartial({
      signer: wallet.publicKey,
      adminPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("TX SIG:", tx);

  const account =
    await program.account.adminPda.fetch(adminPda);

  console.log("Admin Account:");
  console.dir(account, { depth: null });
}

main().catch(console.error);