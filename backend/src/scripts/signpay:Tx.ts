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
  "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAMI9Q8kklL0PG5aToi4e5AoAIACDRGi21QqjBGObv86pfc8H5B4B3QTk0+b+0ouPyE5RJN6vT3huCyBF7UHE70NUUL4Zh252jCMzNs+HbgUt1YekKrswSGXGARpu5W6uW3z8+NWvstff4mL2qEfbbMXFZ9RCffKhSvJUdLlkxRGMmf1SofJRV4F4gOVxYfPlwjKUvlqGZxgfypupnz4o6Zhmd//CDaF+9omd39JHYnoEOM6G94k/Vkpgsio0HYKspbBCwb5KrliyarFpFRocEvK85VHyLx09IO36kedKZ8ZE6UG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqQaGhZ04yAqXIUgYQWkX4L+PyhV+Rk+YzP0P+p34Rr0LAQYIAAIBAwQCBQcQdxLYQcB1etyguw0AAAAAAA==";

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