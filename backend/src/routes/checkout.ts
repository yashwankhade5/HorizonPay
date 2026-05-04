// backend/src/routes/checkout.ts

import { Router } from "express";
import { createCheckoutSession } from "../services/checkout.service";

const router = Router();

/**
 * POST /checkout/session
 * Create checkout session for payment
 */
router.post("/session", createCheckoutSession);

export default router;