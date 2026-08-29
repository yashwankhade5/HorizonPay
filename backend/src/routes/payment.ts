// backend/src/routes/payment.ts

import { Router, Response, Request } from "express";
import { submitPayment } from "../services/payment.service";
import { verifyJWT } from "../middleware/auth";
import { buildWithdrawTransaction, deriveAdminPDA, deriveATA, sendSignedTransaction } from "../services/solana.service";
import { env } from "../config/env";

const router = Router();

/**
 * POST /payment/submit
 * Submit signed transaction for payment
 */
router.post("/submit", async (req: Request, res: Response) => {


    let body = req.body
    try {
        const result = await submitPayment(body)

        res.status(200).json({
            success: true,
            txHash: result.signature,
            message: "payment submitted"
        })
    } catch (error: any) {
        console.log(error)
        res.status(
            error.statusCode || 500
        ).json({
            "message": error.message
        })
    }



});



router.post("/withdraw", verifyJWT, async (req: Request, res: Response) => {
    let {signedtx} = req.body
    try {
        const result = await sendSignedTransaction(signedtx)

        res.status(200).json({
            success: true,
            txsignature: result,
            message: "amount withdrawal txs submitted"
        })
    } catch (error: any) {
        console.log(error)
        res.status(
            error.statusCode || 500
        ).json({
            "message": error.message
        })
    }
});

router.post("/build-withdraw-tx", verifyJWT, async (req: Request, res: Response) => {
   
let {walletPubkey,amount}=req.body

let mint = env.MINT_ADDRESS
let adminPubkey = env.ADMIN_PUBLICKEY


let merchantAta = await deriveATA(walletPubkey,mint)


    try {
     const withdrawTx =await buildWithdrawTransaction({merchantPubkey:walletPubkey,merchantAta:merchantAta.toString(),adminPubkey,mint,amount})

        res.status(200).json({
            success: true,
          unsignedWithdrawTx:withdrawTx
        })
    } catch (error: any) {
        console.log(error)
        res.status(
            error.statusCode || 500
        ).json({
            "message": error.message
        })
    }
});




export default router;