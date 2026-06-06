// backend/src/routes/merchant.ts

import { Router } from "express";
import { PublicKey } from "@solana/web3.js";
import { env } from "../config/env";
import type { Request, Response } from "express";
import {
  createMerchant,
  getMerchantById,
  rotateApiKey,
  rotateWebhookSecret,
} from "../services/merchant.service";
import { buildActivateTransaction,deriveAdminPDA,sendSignedTransaction } from "../services/solana.service";
import { confirmMerchantActivationTx } from "../routes/helper/confirmtx";

import { loginmerchant, verifyJWT,signupmerchantprofile,AuthRequest } from "../middleware/auth";
const router = Router();



/**
 * POST /merchant
 * Create merchant account
 */
router.post("/signup",signupmerchantprofile);
router.post("/login",loginmerchant);



router.post("/build-activate-tx",verifyJWT,async (req: AuthRequest, res: Response)=> {
  try {
    const {walletPubkey}  = req.body;

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
      tx: result.tx,
      merchantPda: result.merchantPda,
      merchantVault: result.merchantVault,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


router.post("/activate",verifyJWT,async (req: AuthRequest, res: Response)=> {

      try {
        console.log(req.body)
      const { signedTx, walletPubkey } = req.body;

      if (!signedTx || !walletPubkey) {
        return res.status(400).json({
          error: "signedTx and walletPubkey required",
        });
      }
 console.log("send tx")
      // 1️⃣ submit tx
      const signature = await sendSignedTransaction(signedTx);

   
 console.log("fire confirmtx")
      // 3️⃣ fire async confirmation
      confirmMerchantActivationTx({
        signature,
        walletPubkey,
        accountId: req.userId!,
      });
      console.log("accountID----------------",req.userId)

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
router.get("/profile",verifyJWT,async (req: AuthRequest, res: Response)=> { 
  
  
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


      return res.status(200).json({
        success: true,
        data: { merchantwallet:merchant.walletPubkey,
          merchantpda:merchant.merchantPda,
          merchantvault:merchant.merchantVault,
          merchantsecretkeyhash:merchant.secretKeyId+merchant.secretKeyHash,
          merchantpublishablehash:merchant.publishableKeyId+merchant.publishableKeyHash


        }
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

export default router;