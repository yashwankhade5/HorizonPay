// backend/src/routes/checkout.ts

import { Router } from "express";
import { createCheckoutSession, getPaymentIntentById } from "../services/checkout.service";
import { authApisecret,AuthenticatedRequest } from "../middleware/authapikeys";
import type { Request, Response } from "express";
import { read } from "node:fs";
import { prisma } from "../config/prisma";

const router = Router();

/**
 * POST /checkout/session
 * Create checkout session for payment
 */
router.post("/session",authApisecret, async (req:AuthenticatedRequest, res:Response) => {
if (!req.merchant && !req.paymentData ){
  return res.json({
    "message":""
  })
}

  const merchant = req.merchant!;
  const payment = req.paymentData!;
  let checkout = await  createCheckoutSession({
    merchantId:merchant.merchantId,
    merchantpubkey:merchant.walletPubkey,
    amount:BigInt(payment.amount),
    orderId:payment.orderId
  })

  return res.json({
    checkoutUrl:checkout.checkoutUrl
  });
});


router.get("/:sessionId",async (req:Request,res:Response)=>{
const sessionId = req.params.sessionId as string;

const PaymentIntent = await getPaymentIntentById(sessionId)

  res.json({
    "unsignedtx":PaymentIntent.unsignedTx
  })
})

export default router;