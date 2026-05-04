// backend/src/routes/merchant.ts

import { Router } from "express";
import {
  createMerchant,
  getMerchantById,
  rotateApiKey,
  rotateWebhookSecret,
} from "../services/merchant.service";

const router = Router();

/**
 * POST /merchant
 * Create merchant account
 */
router.post("/",createMerchantprofile)

router.post("/activate", createMerchant);

/**
 * GET /merchant/profile
 * Get current merchant profile
 */
router.get("/profile", getMerchantById);

/**
 * POST /merchant/rotate-keys
 * Rotate publishable + secret keys
 */
router.post("/rotate-keys", rotateApiKey);

/**
 * POST /merchant/webhook
 * Update merchant webhook URL
 */
router.post("/webhook", rotateWebhookSecret);

export default router;