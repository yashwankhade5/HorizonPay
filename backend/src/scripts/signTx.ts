import { Keypair, Transaction } from "@solana/web3.js";
import bs58 from "bs58";

// ⚠️ DEV ONLY — never use production keys here
const PRIVATE_KEY = "3CFaCJqLHTNeVFGoH4SiYVuVwKsKCye6cfpwAVqwbDicj5UsA9bHWoQVSSjYFvQhzaTdTMZv22ZL9v3ReXFP9w47";
const BASE64_TX = "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAUIJIDV/mHsUzwAIzlsy0rmU7TaTs8Fz9AqxUN2ybfFtayZMFNlTseOhv+hpKoBDYuo0eZjp4dYa7z9tafoIl48e8R/TjPfZvEtUHqOmatMkX80Uu1tQZ799J5twSjHUpMFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACkZVN0aNJZPTUjsl5Pj7mjS4fKjJnqsZWzY2reb3cAtPGiQFwQWyxH8jRuCSHdD8YzRb38h/Y/78R7kR80RWChCwb5KrliyarFpFRocEvK85VHyLx09IO36kedKZ8ZE6UG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqQaGhZ04yAqXIUgYQWkX4L+PyhV+Rk+YzP0P+p34RSUzAQYHAAQBAgUHAwj5rPVkIHVhnA==";

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