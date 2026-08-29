// sign.js
import crypto from "crypto";
import { prisma } from "../config/prisma";

// 1. Paste your webhook secret here (watch for stray whitespace!)
const secret = "1b1a923cd82a9473a3c00281da3f733841073a45591a7aed3f13c2089aeb642b";

async function main() {
  const webhook = {"fee":"20000864","user":"3TVcyXxsrLbpYBqQ7y8fWXwfe1cFUBsKzx2qxkkdtSDR","amount":"980042337","merchant":"E5rNuwzGTTHMEDtFbqYhFTwBsa8hv3KjkVhgLZtsDNCf","timestamp":"1787759859","txSignature":"3BdBSooH6v7WWPZQCP4BufNo95SzDjQ8oYtv2vG1ZnpVcqpjj6uCJV8pgfC5yVANhb6HePF7znDP4og1Z9VJwYH8"}

  if (!webhook) {
    console.error("No webhook_log row found");
    return;
  }

  // This must match row.payload exactly — the SAME object the dispatcher stringified
  const payloadStr = JSON.stringify(webhook);

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadStr)
    .digest("hex");

  console.log("payloadStr:", payloadStr);
  console.log("Signature:", signature);
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());