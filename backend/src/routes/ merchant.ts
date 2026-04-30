// backend/src/routes/merchant.ts

import { Router } from "express";
import {
  createMerchantHandler,
  getMerchantProfileHandler,
  rotateApiKeysHandler,
  updateWebhookHandler,
} from "../services/merchant.service";

const router = Router();

/**
 * POST /merchant
 * Create merchant account
 */
router.post("/", createMerchantHandler);

/**
 * GET /merchant/profile
 * Get current merchant profile
 */
router.get("/profile", getMerchantProfileHandler);

/**
 * POST /merchant/rotate-keys
 * Rotate publishable + secret keys
 */
router.post("/rotate-keys", rotateApiKeysHandler);

/**
 * POST /merchant/webhook
 * Update merchant webhook URL
 */
router.post("/webhook", updateWebhookHandler);

export default router;