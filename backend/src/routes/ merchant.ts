// backend/src/routes/merchant.ts

import { Router } from "express";
import { PublicKey } from "@solana/web3.js";
import { env } from "../config/env";
import type { Request, Response } from "express";
import {
  createMerchant,
  getMerchantById,
  getMerchantTransactions,
  rotateApiKey,
  rotateWebhookSecret,
} from "../services/merchant.service";
import { buildActivateTransaction, deriveAdminPDA, getMerchantPDAandVaultState, getMerchantState, sendSignedTransaction } from "../services/solana.service";
import { confirmMerchantActivationTx } from "../routes/helper/confirmtx";
import jwt from "jsonwebtoken";
import { loginmerchant, verifyJWT, signupmerchantprofile, AuthRequest } from "../middleware/auth";
import { success } from "zod";
import { TransactionEvent } from "../generated/prisma/enums";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
const router = Router();



/**
 * POST /merchant
 * Create merchant account
 */
router.post("/signup", signupmerchantprofile);



router.post("/login", loginmerchant);



router.post("/create-merchant", verifyJWT, async (req: AuthRequest, res: Response) => {
  const { walletPubkey } = req.body
  if (req.userId == undefined) {
    return res.json({
      success: false,
      message: "no userID"
    })
  }
  else if (req.activated == false) {
    return res.json({
      success: false,
      message: "user not activated"
    })
  }
  const userId = req.userId

  const merchantinfo = await createMerchant({ walletPubkey, }, userId)
   // 4. Create JWT
    const token = jwt.sign(
      { userId: userId,
        activated:true
       },
      process.env.JWT_SECRET!, // must be 32+ chars
      { expiresIn: "7d" }
    );

  res.status(200).json({
    message: {

      walletPubkey: merchantinfo.walletPubkey,
      secretKey: merchantinfo.secretKey,
      publishableKey: merchantinfo.publishableKey,
      webhookSecret: merchantinfo.webhookSecret,

    },
    token:token,
    success: true
  })

});



router.post("/build-activate-tx", verifyJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { walletPubkey } = req.body;

    if (!walletPubkey) {
      return res.status(400).json({ error: "walletPubkey required" });
    }
    try {
      new PublicKey(walletPubkey);
    } catch {
      return res.status(400).json({ error: "Invalid walletPubkey" });
    }

    const adminPubkey = env.ADMIN_PUBLICKEY;
    const mint = env.MINT_ADDRESS;

    const result = await buildActivateTransaction({
      merchantPubkey: walletPubkey,
      adminPubkey,
    });

    return res.json({
      unsignedtx: result.tx,
      merchantPda: result.merchantPda,
      merchantVault: result.merchantVault,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


router.post("/activate", verifyJWT, async (req: AuthRequest, res: Response) => {

  try {
    console.log(req.body)
    const { signedTx, walletPubkey } = req.body;

    if (!signedTx || !walletPubkey) {
      return res.status(400).json({
        error: "signedTx and walletPubkey required",
      });
    }

    // 1️⃣ submit tx
    const signature = await sendSignedTransaction(signedTx);



    // 4️⃣ immediate response
    return res.json({
      status: "submitted",
      signature,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message
    });
  }
}
)


/**
 * GET /merchant/profile
 * Get current merchant profile
 */
router.get("/profile", verifyJWT, async (req: AuthRequest, res: Response) => {


  try {

    // validate auth payload
    const merchantId = req.userId;

    if (!merchantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: missing user identity"
      });
    }


    // fetch merchant
    const merchant = await getMerchantById(
      merchantId
    );


    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found"
      });
    }

    const merchnatTXs = await getMerchantTransactions(merchantId, 0, 10, TransactionEvent.PAYMENT)

    const merchnatState = await getMerchantPDAandVaultState(merchant.merchantPda)

    return res.status(200).json({
      success: true,
      data: {
        merchantwallet: merchant.walletPubkey,
        merchantpda: merchant.merchantPda,
        merchantvault: merchant.merchantVault,
        merchantsecretkeyhash: merchant.secretKeyId + merchant.secretKeyHash,
        merchantpublishablehash: merchant.publishableKeyId + merchant.publishableKeyHash


      },

      MerchantState: merchnatState,
      Transactions: merchnatTXs

    });


  } catch (error) {

    console.error(
      "GET /profile error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

});

/**
 * POST /merchant/rotate-keys
 * Rotate publishable + secret keys
 */
// router.post("/rotate-keys", rotateApiKey);

/**
 * POST /merchant/webhook
 * Update merchant webhook URL
 */
// router.post("/webhook", rotateWebhookSecret);

router.get("/transactions", verifyJWT, async (req: AuthRequest, res: Response) => {


  try {

    // validate auth payload
    const merchantId = req.userId;

    if (!merchantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: missing user identity"
      });
    }


    // fetch merchant
    const merchant = await getMerchantById(
      merchantId
    );


    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found"
      });
    }

    const merchnatTXs = await getMerchantTransactions(merchantId, 0, 10, TransactionEvent.PAYMENT)



    return res.status(200).json({
      success: true,
      Transactions: merchnatTXs

    });


  } catch (error) {

    console.error(
      "GET /profile error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }

});




export default router;