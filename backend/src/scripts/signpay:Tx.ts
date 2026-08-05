import {
  Connection,
  Keypair,
  Transaction,
  PublicKey
} from "@solana/web3.js";
import {getAssociatedTokenAddressSync} from "@solana/spl-token"
import bs58 from "bs58";
import { env } from "../config/env";

import { getAssociatedTokenAddress } from "@solana/spl-token";


async function deriveATA(
  wallet: string | PublicKey,
  mint: string | PublicKey
): Promise<PublicKey> {
  const walletPk = typeof wallet === "string" ? new PublicKey(wallet) : wallet;
  const mintPk = typeof mint === "string" ? new PublicKey(mint) : mint;

  return await getAssociatedTokenAddress(
    mintPk,       // mint
    walletPk,     // owner
    false         // allowOwnerOffCurve
  );
}




// ⚠️ DEV ONLY
const RPC_URL = "http://127.0.0.1:8899";

// Base58 private key
const PRIVATE_KEY =
  "3CFaCJqLHTNeVFGoH4SiYVuVwKsKCye6cfpwAVqwbDicj5UsA9bHWoQVSSjYFvQhzaTdTMZv22ZL9v3ReXFP9w47";

// Base64 serialized tx
const BASE64_TX =
  "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAMHJIDV/mHsUzwAIzlsy0rmU7TaTs8Fz9AqxUN2ybfFtaw9msK621+OR0GD6DBuNdpBSXlVLvVZv+/ZuR5RS45Crm+ug1odl0RR2kxIFC5qAB8Fcp9Lk24lb2xdQ2iRl9YcC6lMMyBwh/PfKzjPnj9TiswglBEBfWs+/QuP7nF0V1s8PGoxUPubq3uGZPGKVYfR4nWRPjyKrDxxIVqNfKKBKQsG+Sq5YsmqxaRUaHBLyvOVR8i8dPSDt+pHnSmfGROlBt324ddloZPZy+FGzut5rBy0he1fWzeROoz1hX7/AKkGhoWdOMgKlyFIGEFpF+C/j8oVfkZPmMz9D/qd96ktqwEFBgACAwEEBhC3EkaclG2hIgAAAAAAAAAA";

// 1️⃣ Load keypair
const keypair = Keypair.fromSecretKey(
  bs58.decode(PRIVATE_KEY)
);

// 2️⃣ Create connection
const connection = new Connection(
  RPC_URL,
  "confirmed"
);

async function main() {

  // 3️⃣ Deserialize tx
  const tx = Transaction.from(
    Buffer.from(BASE64_TX, "base64")
  );

  // 4️⃣ Set fee payer from same keypair
  tx.feePayer = keypair.publicKey;

let ix = tx.instructions[0]

ix.keys[0].pubkey = keypair.publicKey
ix.keys[1].pubkey = await deriveATA(keypair.publicKey,env.MINT_ADDRESS)

console.log(ix.keys)

const mint = new PublicKey(
  env.MINT_ADDRESS
);


// Derive new ATA
const newUserAta = getAssociatedTokenAddressSync(
    mint,
    keypair.publicKey
  );



  // 5️⃣ Fetch fresh blockhash
  const { blockhash } =
    await connection.getLatestBlockhash(
      "confirmed"
    );

  tx.recentBlockhash = blockhash;

  // Debug
  console.log(
    "Fee payer:",
    tx.feePayer.toBase58()
  );

  console.log(
    "Signer:",
    keypair.publicKey.toBase58()
  );

  console.log(
    "Fresh blockhash:",
    blockhash
  );

  // 6️⃣ Sign tx
  tx.sign(keypair);

  // 7️⃣ Serialize signed tx
  const signedBase64 = tx
    .serialize()
    .toString("base64");

  console.log("\n✅ SIGNED TX:\n");

  console.log(signedBase64);
}

main().catch(console.error);