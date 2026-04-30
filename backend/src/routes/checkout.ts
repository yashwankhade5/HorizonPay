// backend/src/routes/checkout.ts

import { Router } from "express";
import { createCheckoutSessionHandler } from "../services/checkout.service";

const router = Router();

/**
 * POST /checkout/session
 * Create checkout session for payment
 */
router.post("/session", createCheckoutSessionHandler);

export default router;