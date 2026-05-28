// backend/src/routes/payment.ts

import { Router,Response,Request } from "express";
import { submitPayment } from "../services/payment.service";

const router = Router();

/**
 * POST /payment/submit
 * Submit signed transaction for payment
 */
router.post("/submit", async (req:Request,res:Response)=>{

let body = req.body
try {
    const result = await submitPayment(body)


    res.status(200).json({
        signature:result.signature
    })
} catch (error:any) {
    res.status(
        error.statusCode || 500
    ).json({
        "message":error.message
    })
}


    
});

export default router;