// backend/src/routes/payment.ts

import { Router } from "express";
import { submitPayment } from "../services/payment.service";

const router = Router();

/**
 * POST /payment/submit
 * Submit signed transaction for payment
 */
router.post("/submit", submitPayment);

export default router;