// backend/src/routes/checkout.ts

import { Router } from "express";
import { createCheckoutSession } from "../services/checkout.service";
import { authApisecret,AuthenticatedRequest } from "../middleware/authapikeys";
import type { Request, Response } from "express";

const router = Router();

/**
 * POST /checkout/session
 * Create checkout session for payment
 */
router.post("/session",authApisecret, async (req:AuthenticatedRequest, res:Response) => {
  const merchant = req.merchant;
  const payment = req.paymentData;

  return res.json({
    merchant,
    payment,
  });
});;

export default router;