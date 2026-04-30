// backend/src/routes/webhook.ts

import { Router } from "express";
import {
  updateWebhookHandler,
  resendWebhookHandler,
} from "../services/webhook.service";

const router = Router();

/**
 * POST /webhook
 * Set or update merchant webhook URL
 */
router.post("/", updateWebhookHandler);

/**
 * POST /webhook/resend/:id
 * Retry failed webhook delivery
 */
router.post("/resend/:id", resendWebhookHandler);

export default router;