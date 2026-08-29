// backend/src/routes/merchant.ts

import { Router } from "express";
import { PublicKey,Transaction } from "@solana/web3.js";

import { env } from "../config/env";
import type { Request, Response } from "express";
import {
  createMerchant,
  getMerchantById,
  getMerchantTransactions,
} from "../services/merchant.service";
import { buildActivateTransaction,  getMerchantPDAandVaultState,  sendSignedTransaction } from "../services/solana.service";

import jwt from "jsonwebtoken";
import { loginmerchant, verifyJWT, signupmerchantprofile, AuthRequest } from "../middleware/auth";
import { TransactionEvent } from "../generated/prisma/enums";
import { prisma } from "../config/prisma";

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
  else if (req.activated = false) {
    // return res.json({
    //   success: false,
    //   message: "user not activated"
    // })
  }
  const userId = req.userId

  const merchantinfo = await createMerchant({ walletPubkey, }, userId)
  // 4. Create JWT


  res.status(200).json({
    message: {

      walletPubkey: merchantinfo.walletPubkey,
      secretKey: merchantinfo.secretKey,
      publishableKey: merchantinfo.publishableKey,
      webhookSecret: merchantinfo.webhookSecret,

    },

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

    const { signedTx, walletPubkey } = req.body;

    const tx = Transaction.from(Buffer.from(signedTx,"base64"))

    const message = tx.compileMessage()
    const numsigner = message.header.numRequiredSignatures;
    const signerPubkeys = message.accountKeys.slice(0, numsigner);

  const singleSigner = signerPubkeys[0];

    if (numsigner !=1 ) {
      return res.status(400).json({
        error:"only one signer is allowed"
      })
    }

 

    if (!signedTx ) {
      return res.status(400).json({
        error: "signedTx  required",
      });
    }
    

    // 1️⃣ submit tx
    const signature = await sendSignedTransaction(signedTx);
       const user = await prisma.merchantAccount.update({
      where: { id: req.userId },
      data:{
        walletPubkey:singleSigner.toString()
      }
    })
  

     if (!user) {
      return res.json({
        status: "user not found ",
        signature: undefined,
        token: undefined,
      })
    }
    const token = jwt.sign(
      {
        userId: user.id,
        activated: true,
        walletPubkey: user.walletPubkey,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );


    // 4️⃣ immediate response
    return res.json({
      status: "submitted",
      signature,
      token: token
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

    const merchnatTXs = await getMerchantTransactions(merchant.id, 0, 10, TransactionEvent.PAYMENT)

    const merchnatState = await getMerchantPDAandVaultState(merchant.merchantPda)

    return res.status(200).json({
      success: true,
      data: {
        merchantwallet: merchant.walletPubkey,
        merchantpda: merchant.merchantPda,
        merchantvault: merchant.merchantVault,
        merchantsecretkeyhash: merchant.secretKeyId + merchant.secretKeyHash,
        merchantpublishablehash: merchant.publishableKeyId + merchant.publishableKeyHash,
        merchantwebhooksecret:merchant.webhookSecretEncrypt



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


    const merchnatTXs = await getMerchantTransactions(merchant.id, 0, 10, TransactionEvent.PAYMENT)



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
      message: "Internal server error",

    });
  }

});






export default router;