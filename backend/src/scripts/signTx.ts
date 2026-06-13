// import { Keypair, Transaction } from "@solana/web3.js";
// import bs58 from "bs58";
// import { connection } from "../services/solana.service";

// // ⚠️ DEV ONLY — never use production keys here
// const PRIVATE_KEY = "3CFaCJqLHTNeVFGoH4SiYVuVwKsKCye6cfpwAVqwbDicj5UsA9bHWoQVSSjYFvQhzaTdTMZv22ZL9v3ReXFP9w47";
// const BASE64_TX = "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAUIJIDV/mHsUzwAIzlsy0rmU7TaTs8Fz9AqxUN2ybfFtaw8H5B4B3QTk0+b+0ouPyE5RJN6vT3huCyBF7UHE70NUfVKh8lFXgXiA5XFh8+XCMpS+WoZnGB/Km6mfPijpmGZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADz41a+y19/iYvaoR9tsxcVn1EJ98qFK8lR0uWTFEYyZ/qznXleMg/nxOdg8iBfmwo3OXQAzmM8xFiNJWQ8Z49MCwb5KrliyarFpFRocEvK85VHyLx09IO36kedKZ8ZE6UG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqQaGhZ04yAqXIUgYQWkX4L+PyhV+Rk+YzP0P+p34RR8aAQYHAAQBAgUHAwj5rPVkIHVhnA==";

// // 1️⃣ Load keypair
// const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

// // 2️⃣ Deserialize tx
// const tx = Transaction.from(Buffer.from(BASE64_TX, "base64"));
//   const { blockhash } = await connection.getLatestBlockhash("confirmed");


//   tx.recentBlockhash = blockhash;

// // Debug (optional)
// console.log("Fee payer:", tx.feePayer?.toBase58());
// console.log("Signer:", keypair.publicKey.toBase58());

// // 3️⃣ Sign tx
// tx.sign(keypair);

// // 4️⃣ Serialize signed tx
// const signedBase64 = tx.serialize().toString("base64");

// console.log("\n✅ SIGNED TX:\n");
// console.log(signedBase64);

import {
  Keypair,
  Transaction
} from "@solana/web3.js";

import bs58 from "bs58";

import {
  connection
} from "../services/solana.service";

async function main() {

  // ⚠️ DEV ONLY
  const PRIVATE_KEY =
    "3CFaCJqLHTNeVFGoH4SiYVuVwKsKCye6cfpwAVqwbDicj5UsA9bHWoQVSSjYFvQhzaTdTMZv22ZL9v3ReXFP9w47";

  const BASE64_TX =
    "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAUIJIDV/mHsUzwAIzlsy0rmU7TaTs8Fz9AqxUN2ybfFtaw8H5B4B3QTk0+b+0ouPyE5RJN6vT3huCyBF7UHE70NUfVKh8lFXgXiA5XFh8+XCMpS+WoZnGB/Km6mfPijpmGZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACiv2j5/MJXUojjTbjHMRN7nf8+HRdkNV3mbumhqUucDvPjVr7LX3+Ji9qhH22zFxWfUQn3yoUryVHS5ZMURjJnCwb5KrliyarFpFRocEvK85VHyLx09IO36kedKZ8ZE6UG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqQaGhZ04yAqXIUgYQWkX4L+PyhV+Rk+YzP0P+p34RSXsAQYHAAUBAgQHAwj5rPVkIHVhnA==";

  // 1️⃣ Load keypair
  const keypair =
    Keypair.fromSecretKey(
      bs58.decode(PRIVATE_KEY)
    );

  // 2️⃣ Deserialize tx
  const tx = Transaction.from(
    Buffer.from(BASE64_TX, "base64")
  );

  // 3️⃣ Fetch fresh blockhash
  const { blockhash } =
    await connection.getLatestBlockhash(
      "confirmed"
    );

  // 4️⃣ Replace stale blockhash
  tx.recentBlockhash = blockhash;

  // 5️⃣ Optional
  tx.feePayer = keypair.publicKey;

  console.log(
    "Fee payer:",
    tx.feePayer?.toBase58()
  );

  console.log(
    "Signer:",
    keypair.publicKey.toBase58()
  );

  // 6️⃣ Sign tx
  tx.sign(keypair);

  // 7️⃣ Serialize signed tx
  const signedBase64 =
    tx.serialize().toString("base64");

  console.log("\n✅ SIGNED TX:\n");

  console.log(signedBase64);
}

main().catch(console.error);