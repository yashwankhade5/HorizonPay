// backend/src/routes/webhook.ts

import { Router } from "express";
import { AuthRequest } from "../middleware/auth";
import { Response } from "express";
import { updateWebhookHandler } from "../services/webhook.service";
import { verifyJWT } from "../middleware/auth";
import { getMerchantWebhookLogs } from "../services/webhook.service";
import { z } from "zod";

const router = Router();

/**
 * POST /webhook
 * Set or update merchant webhook URL
 */

router.post("/updtae-webhook-url", verifyJWT, async (req: AuthRequest, res: Response) => {



  const userId = req.userId
  const { webhookURL } = req.body

  if (!webhookURL || typeof webhookURL !== "string") {
    res.status(400).json({
      success: false,
      error: "url is required"
    });
    return;
  }

  if (!userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }



  try {


    const updatewebhookurl = await updateWebhookHandler(userId, webhookURL)


    return res.status(200).json({
      success: true,

      webhookurl: updatewebhookurl.webhookUrl
    })

  } catch (err: any) {
    if (err.message === "Merchant not found for account") {
      res.status(404).json({
        success: false,
        error: err.message
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }

});






const webhookLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  delivered: z.enum(["true", "false"]).optional(),
  eventType: z.string().optional(),
});

router.get("/webhook-logs", verifyJWT, async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }



  const parsed = webhookLogsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid query parameters",
      details: parsed.error.flatten(),
    });
  }

  try {

    const result = await getMerchantWebhookLogs(userId, parsed.data);


    return res.status(200).json({
      success: true,
      data: result.logs,
      pagination: {
        page: parsed.data.page,
        limit: parsed.data.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / parsed.data.limit),
      },
    });

  } catch (err) {
    console.error("[GET /webhook-logs] failed", { userId, err });
    return res.status(500).json({
      success: false,
      error: "Failed to fetch webhook logs",
    });
  }
});



/**
 * POST /webhook/resend/:id
 * Retry failed webhook delivery
 */
// router.post("/resend/:id", resendWebhookHandler);

export default router;