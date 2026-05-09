import { Keypair, Transaction } from "@solana/web3.js";
import bs58 from "bs58";

// ⚠️ DEV ONLY — never use production keys here
const PRIVATE_KEY = "3CFaCJqLHTNeVFGoH4SiYVuVwKsKCye6cfpwAVqwbDicj5UsA9bHWoQVSSjYFvQhzaTdTMZv22ZL9v3ReXFP9w47";
const BASE64_TX = "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAUIJIDV/mHsUzwAIzlsy0rmU7TaTs8Fz9AqxUN2ybfFtaw8H5B4B3QTk0+b+0ouPyE5RJN6vT3huCyBF7UHE70NUfVKh8lFXgXiA5XFh8+XCMpS+WoZnGB/Km6mfPijpmGZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADLmMXgORYk5LAIXSeqN6F8i3sK70ZrDVreUBLffw1h6/PjVr7LX3+Ji9qhH22zFxWfUQn3yoUryVHS5ZMURjJnCwb5KrliyarFpFRocEvK85VHyLx09IO36kedKZ8ZE6UG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqQaGhZ04yAqXIUgYQWkX4L+PyhV+Rk+YzP0P+p34RRcwAQYHAAUBAgQHAwj5rPVkIHVhnA==";

// 1️⃣ Load keypair
const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

// 2️⃣ Deserialize tx
const tx = Transaction.from(Buffer.from(BASE64_TX, "base64"));

// Debug (optional)
console.log("Fee payer:", tx.feePayer?.toBase58());
console.log("Signer:", keypair.publicKey.toBase58());

// 3️⃣ Sign tx
tx.sign(keypair);

// 4️⃣ Serialize signed tx
const signedBase64 = tx.serialize().toString("base64");

console.log("\n✅ SIGNED TX:\n");
console.log(signedBase64);