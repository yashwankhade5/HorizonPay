// backend/src/routes/payment.ts

import { Router } from "express";
import { submitPaymentHandler } from "../services/payment.service";

const router = Router();

/**
 * POST /payment/submit
 * Submit signed transaction for payment
 */
router.post("/submit", submitPaymentHandler);

export default router;