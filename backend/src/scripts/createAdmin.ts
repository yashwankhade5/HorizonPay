import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction
} from "@solana/web3.js";

import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import "dotenv/config";

import fs from "fs";
import path from "path";

import {idl} from "../config/idl";
import { HorizonContract } from "../config/horizon_contract_types";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import bs58 from "bs58";

const mint_keypair = Keypair.fromSecretKey(
  bs58.decode(process.env.MINT_KEYPAIR!)
);

// ------------------------------------------------
// CONFIG
// ------------------------------------------------

const RPC_URL = "http://127.0.0.1:8899";

const KEYPAIR_PATH = path.resolve(
  process.env.HOME!,
  ".config/solana/id.json"
);

// ------------------------------------------------
// LOAD WALLET
// ------------------------------------------------

const secret = JSON.parse(
  fs.readFileSync(KEYPAIR_PATH, "utf-8")
);

const signer = Keypair.fromSecretKey(
  Uint8Array.from(secret)
);

// ------------------------------------------------
// CONNECTION
// ------------------------------------------------

const connection = new Connection(
  RPC_URL,
  "confirmed"
);

// ------------------------------------------------
// PROVIDER
// ------------------------------------------------

const provider = new anchor.AnchorProvider(
  connection,
  new anchor.Wallet(signer),
  {
    commitment: "confirmed",
  }
);

anchor.setProvider(provider);

// ------------------------------------------------
// PROGRAM
// ------------------------------------------------

const program = new Program<HorizonContract>(
  idl as HorizonContract,
  provider
);

// ------------------------------------------------
// ADMIN PDA
// ------------------------------------------------

const [adminPda] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("admin"),
    signer.publicKey.toBuffer(),
  ],
  program.programId
);

// ------------------------------------------------
// MAIN
// ------------------------------------------------

async function main() {
  console.log("\n=== HORIZON SETUP ===\n");

  console.log(
    "Admin Wallet:",
    signer.publicKey.toBase58()
  );

  // --------------------------------------------
  // CREATE MINT
  // --------------------------------------------

  console.log("\nCreating mint...\n");
  console.log("MintPubkey:",mint_keypair.publicKey.toBase58());

  const mint = await createMint(
    connection,
    signer,
    signer.publicKey,
    null,
    6, // decimals
mint_keypair  
  );

  console.log("Mint:", mint.toBase58());

  // --------------------------------------------
  // CREATE ADMIN ATA
  // --------------------------------------------

  console.log("\nCreating admin ATA...\n");

  const adminAta =
    await getOrCreateAssociatedTokenAccount(
      connection,
      signer,
      mint,
      signer.publicKey
    );
    const ata = await getOrCreateAssociatedTokenAccount(
  connection,
  signer,
  mint,
  new PublicKey("3TVcyXxsrLbpYBqQ7y8fWXwfe1cFUBsKzx2qxkkdtSDR"),
  false,
  "finalized"
);

  console.log(
    "Admin ATA:",
    adminAta.address.toBase58()
  );
  console.log(
    "buyer ATA:",
    ata.address.toBase58()
  );

  // --------------------------------------------
  // MINT TOKENS
  // --------------------------------------------

  console.log("\nMinting tokens...\n");

  await mintTo(
    connection,
    signer,
    mint,
    adminAta.address,
    signer,
    1_000_000_000 // 1000 tokens
  );
 const mintedtoken = await mintTo(
    connection,
    signer,
    mint,
    ata.address,
    signer,
    1_000_000_000_000 // 1000 tokens
  );

  console.log("Minted test tokens");
  console.log("Minted test tokens buyer ata :", mintedtoken);

  // --------------------------------------------
  // CHECK ADMIN PDA
  // --------------------------------------------

  const existing =
    await connection.getAccountInfo(adminPda);

  if (existing) {
    console.log(
      "\nAdmin PDA already initialized"
    );

    console.log(
      "Admin PDA:",
      adminPda.toBase58()
    );

    return;
  }

  // --------------------------------------------
  // CREATE ADMIN PDA
  // --------------------------------------------

  console.log("\nCreating Admin PDA...\n");

  const tx = await program.methods
    .createAdmin(
      [
        signer.publicKey,
        signer.publicKey,
      ], // minimum 2 required
      [],
      new anchor.BN(200), // 2%
      true,
      adminAta.address
    )
    .accountsPartial({
      signer: signer.publicKey,
      adminPda,
      systemProgram: SystemProgram.programId,
    })
    .signers([signer])
    .rpc();

  console.log("TX:", tx);

  // --------------------------------------------
  // FETCH ADMIN
  // --------------------------------------------

  const admin =
    await program.account.adminPda.fetch(
      adminPda
    );

  console.log("\n=== ADMIN STATE ===\n");

  console.log({
    superadmins: admin.superadmins.map(
      (x: PublicKey) => x.toBase58()
    ),

    operators: admin.operators.map(
      (x: PublicKey) => x.toBase58()
    ),

    platformFeeBps:
      admin.platformFeeBps.toString(),

    escrowFlag: admin.escrowFlag,

    adminFeeVault:
      admin.adminFeeVault.toBase58(),
  });

  console.log("\n=== IMPORTANT ===\n");

  console.log("PROGRAM_ID=");
  console.log(program.programId.toBase58());

  console.log("\nADMIN_PDA=");
  console.log(adminPda.toBase58());

  console.log("\nMINT_ADDRESS=");
  console.log(mint.toBase58());

  console.log("\nADMIN_ATA=");
  console.log(adminAta.address.toBase58());

  console.log("\n====================\n");

// ---------------------------------------------------
//  transfer sol
// --------------------------------------------------
const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: signer.publicKey,
        toPubkey: new PublicKey("3TVcyXxsrLbpYBqQ7y8fWXwfe1cFUBsKzx2qxkkdtSDR"),
        lamports: 1000 * 1000000000, // 0.1 SOL
      })
    );

    // Send transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [signer]
    );

    console.log("Transfer successful!");
    console.log("Signature:", signature);

    const mintInfo = await connection.getAccountInfo(mint);

console.log("Mint exists:", mintInfo !== null);
console.log("Mint address:", mint);
  console.log("\nADMIN_ATA=");
  console.log(adminAta.address.toBase58());


}

main().catch(console.error);
