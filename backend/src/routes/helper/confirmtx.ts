// services/txConfirmation.service.ts

import { connection } from "../../services/solana.service";
import { prisma } from "../../config/prisma";
import { createMerchant } from "../../services/merchant.service";

interface ConfirmMerchantTxParams {
  signature: string;
  walletPubkey: string;
  accountId: string;
}

export function confirmMerchantActivationTx({
  signature,
  walletPubkey,
  accountId,
}: ConfirmMerchantTxParams) {
  // runs fully async (fire-and-forget)
  connection.onSignature(
    signature,
    async (result) => {
      try {
        // ❌ tx failed
        if (result.err) {
          console.error("Transaction failed:", signature);

        //   await prisma.merchantActivation.update({
        //     where: { signature },
        //     data: {
        //       status: "failed",
        //     },
        //   });

          return;
        }

        console.log("Transaction confirmed:", signature);

        // ✅ avoid duplicate merchant creation
        const existing = await prisma.merchant.findUnique({
          where: {
            accountId,
          },
        });

        if (!existing) {
          await createMerchant(
            {
              walletPubkey,
            },
            accountId
          );
        }

        // // ✅ mark activation confirmed
        // await prisma.merchantActivation.update({
        //   where: { signature },
        //   data: {
        //     status: "confirmed",
        //   },
        // });

        console.log("Merchant activated:", walletPubkey);
      } catch (err) {
        console.error("Confirmation handler error:", err);
      }
    },
    "confirmed"
  );
}