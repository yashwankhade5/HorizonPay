import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export interface AuthenticatedRequest extends Request {
  merchant?: {
    id: string;
    walletPubkey: string;
    keyType: "secret" | "publishable";
  };
}

export async function auth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: "Missing API key",
      });
    }

    /**
     * Fetch merchants with hashed keys
     * NOTE:
     * bcrypt hashes are one-way, so we must compare in memory
     */
    const merchants = await prisma.merchant.findMany({
      select: {
        id: true,
        walletPubkey: true,
        secretKeyHash: true,
        publishableKeyHash: true,
      },
    });

    let matchedMerchant: AuthenticatedRequest["merchant"] | null = null;

    for (const merchant of merchants) {
      const isSecret = await bcrypt.compare(apiKey, merchant.secretKeyHash);
      if (isSecret) {
        matchedMerchant = {
          id: merchant.id,
          walletPubkey: merchant.walletPubkey,
          keyType: "secret",
        };
        break;
      }

      const isPublishable = await bcrypt.compare(
        apiKey,
        merchant.publishableKeyHash
      );

      if (isPublishable) {
        matchedMerchant = {
          id: merchant.id,
          walletPubkey: merchant.walletPubkey,
          keyType: "publishable",
        };
        break;
      }
    }

    if (!matchedMerchant) {
      return res.status(401).json({
        success: false,
        error: "Invalid API key",
      });
    }

    /**
     * Publishable keys are restricted
     */
    if (
      matchedMerchant.keyType === "publishable" &&
      !(req.method === "POST" && req.path === "/session")
    ) {
      return res.status(403).json({
        success: false,
        error: "Publishable key not allowed for this route",
      });
    }

    req.merchant = matchedMerchant;

    next();
  } catch (error) {
    next(error);
  }
}