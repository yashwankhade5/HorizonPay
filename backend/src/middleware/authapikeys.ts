// src/middleware/authapi.ts

import { Request, Response, NextFunction } from "express";
import { authenticate } from "../services/auth.service";

export interface AuthenticatedRequest extends Request {
  merchant?: {
    merchantId: string;
    accountId: string;
    walletPubkey: string;
    keyType: "secret" | "publishable";
  };

  paymentData?: {
    amount: string;
    orderId: string;
  };
}

export async function authApisecret(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    /**
     * 1. Extract API key
     */
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "Missing API key",
      });
    }

    /**
     * 2. Authenticate merchant
     */
    const merchant = await authenticate(apiKey);

    /**
     * 3. Extract body fields
     */
    const { amount, orderId } = req.body;
console.log(amount)
    if (!amount || typeof amount !== "string" || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid orderId",
      });
    }

    /**
     * 4. Attach merchant + payment data to request
     */
    req.merchant = {
      merchantId: merchant.merchantId,
      accountId: merchant.accountId,
      walletPubkey: merchant.walletPubkey,
      keyType: merchant.keyType,
    };

    req.paymentData = {
      amount,
      orderId,
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
}