import {
  Connection,
  PublicKey,
  Transaction,
  Keypair
} from "@solana/web3.js";
import {
  AnchorProvider,
  BN,
  Program,
  Wallet
} from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID} from "@solana/spl-token";
import { env } from "../config/env";
import { idl } from "../config/idl";
import { txValidator } from "../lib/txValidator";
import {HorizonContract} from "../config/horizon_contract_types"
import bs58 from "bs58";

/**
 * -------------------------------------------------------
 * SOLANA SETUP
 * -------------------------------------------------------
 */


const backendKeypair = Keypair.fromSecretKey(
  bs58.decode(env.BACKEND_PRIVATE_KEY)
);

const wallet = new Wallet(backendKeypair);

export const connection = new Connection(env.SOLANA_RPC_URL, "confirmed");

export const provider = new AnchorProvider(
  connection,
  wallet,
  { commitment: "confirmed" }
);

export const program = new Program<HorizonContract>(
  idl,
  provider
);

/**
 * -------------------------------------------------------
 * PDA HELPERS
 * -------------------------------------------------------
 */

export function deriveAdminPDA(adminPubkey: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("admin"),
      new PublicKey(adminPubkey).toBuffer(),
    ],
    program.programId
  );
}

export function deriveMerchantPDA(
  merchantPubkey: string,
  adminPubkey: string
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("merchant"),
      new PublicKey(merchantPubkey).toBuffer(),
      new PublicKey(adminPubkey).toBuffer(),
    ],
    program.programId
  );
}

export function deriveMerchantVaultPDA(
  merchantPda: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      merchantPda.toBuffer(),
      new BN(1).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
}

/**
 * -------------------------------------------------------
 * BUILD PAY TRANSACTION
 * -------------------------------------------------------
 */

export async function buildPaymentTransaction(params: {
  userPubkey: string;
  userAta: string;
  merchantPubkey: string;
  adminPubkey: string;
  adminFeeVault: string;
  mint: string;
  amount: string;
}): Promise<string> {
  const {
    userPubkey,
    userAta,
    merchantPubkey,
    adminPubkey,
    adminFeeVault,
    mint,
    amount,
  } = params;

  const [adminPda] = deriveAdminPDA(adminPubkey);
  const [merchantPda] = deriveMerchantPDA(merchantPubkey, adminPubkey);
  const [merchantVault] = deriveMerchantVaultPDA(merchantPda);

  const tx = await program.methods
    .pay(new BN(amount))
    .accountsPartial({
      user: new PublicKey(userPubkey),
      userAta: new PublicKey(userAta),
      merchantPda,
      adminPda,
      merchantVault,
      adminFeeVault: new PublicKey(adminFeeVault),
      mint: new PublicKey(mint),
      tokenProgram:TOKEN_PROGRAM_ID
    })
    .transaction();

  const { blockhash } = await connection.getLatestBlockhash("confirmed");

  tx.feePayer = new PublicKey(userPubkey);
  tx.recentBlockhash = blockhash;

  return tx.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  }).toString("base64");
}

/**
 * -------------------------------------------------------
 * VALIDATE SIGNED TX
 * -------------------------------------------------------
 */

export async function validateSignedTransaction(
  signedTxBase64: string,
  expected: {
    merchantPubkey: string;
    adminPubkey: string;
    amount: string;
    mint:string
  }
) {
  const tx = Transaction.from(
    Buffer.from(signedTxBase64, "base64")
  );

  await txValidator({
    tx,
    expectedProgramId: program.programId.toBase58(),
    expectedMerchantPda: expected.merchantPubkey,
    expectedAdminPda: expected.adminPubkey,
    expectedAmount: expected.amount,
    
 
  expectedMint: expected.mint
  });
}

/**
 * -------------------------------------------------------
 * SEND SIGNED TX
 * -------------------------------------------------------
 */

export async function sendSignedTransaction(
  signedTxBase64: string
): Promise<string> {
  const tx = Transaction.from(
    Buffer.from(signedTxBase64, "base64")
  );

  const signature = await connection.sendRawTransaction(
    tx.serialize()
  );

  const latestBlockhash = await connection.getLatestBlockhash("confirmed");

// await connection.confirmTransaction(
//   {
//     signature,
//     blockhash: latestBlockhash.blockhash,
//     lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
//   },
//   "confirmed"
// );

  return signature;
}

/**
 * -------------------------------------------------------
 * FETCH MERCHANT STATE
 * -------------------------------------------------------
 */

export async function getMerchantState(
  merchantPubkey: string,
  adminPubkey: string
) {
  const [merchantPda] = deriveMerchantPDA(
    merchantPubkey,
    adminPubkey
  );

  return await program.account.merchantPda.fetch(merchantPda);
}

/**
 * -------------------------------------------------------
 * BUILD WITHDRAW TX
 * -------------------------------------------------------
 */

export async function buildWithdrawTransaction(params: {
  merchantPubkey: string;
  merchantAta: string;
  adminPubkey: string;
  mint: string;
  amount: string;
}): Promise<string> {
  const {
    merchantPubkey,
    merchantAta,
    adminPubkey,
    mint,
    amount,
  } = params;

  const [merchantPda] = deriveMerchantPDA(
    merchantPubkey,
    adminPubkey
  );

  const [merchantVault] = deriveMerchantVaultPDA(merchantPda);

  const tx = await program.methods
    .withdraw(new BN(amount))
    .accountsPartial({
      merchantSigner: new PublicKey(merchantPubkey),
      merchantPda,
      merchantVault,
      merchantAta: new PublicKey(merchantAta),
      mint: new PublicKey(mint),
      tokenProgram:TOKEN_PROGRAM_ID,
    })
    .transaction();

  const { blockhash } = await connection.getLatestBlockhash("confirmed");

  tx.feePayer = new PublicKey(merchantPubkey);
  tx.recentBlockhash = blockhash;

  return tx.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  }).toString("base64");
}

/**
 * -------------------------------------------------------
 * BUILD Activate TX
 * -------------------------------------------------------
 */

export async function buildActivateTransaction(params: {
  merchantPubkey: string;
  adminPubkey: string;
 
}): Promise<{
  tx: string;
  merchantPda: string;
  merchantVault: string;
}> {
  let mint = "HGEkZnaCAg6USfEjgZndEZRvCVCkaRR8cxwhkmucKqXN"
  const { merchantPubkey, adminPubkey } = params;

  const merchant = new PublicKey(merchantPubkey);
  const admin = new PublicKey(adminPubkey);

  // ✅ Derive PDAs (CRITICAL)
  const [merchantPda] = deriveMerchantPDA(merchantPubkey, adminPubkey);
  const [merchantVault] = deriveMerchantVaultPDA(merchantPda);

  // ✅ Build transaction
  const tx = await program.methods
    .createMerchant()
    .accountsPartial({
      signer: merchant,
      admin,
      merchantPda,
      merchantVault,
      mint: new PublicKey(mint),
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: new PublicKey("11111111111111111111111111111111"),
    })
    .transaction();

  // ✅ Add blockhash
  const { blockhash } = await connection.getLatestBlockhash("confirmed");

  tx.feePayer = merchant;
  tx.recentBlockhash = blockhash;
  console.log(blockhash)
  console.log(tx.recentBlockhash)
  let serializetx =  tx
      .serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      })

  return {
    tx:serializetx.toString("base64"),

    merchantPda: merchantPda.toBase58(),
    merchantVault: merchantVault.toBase58(),
  };
}