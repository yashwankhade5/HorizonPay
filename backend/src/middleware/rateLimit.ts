import rateLimit from "express-rate-limit";
import { Response } from "express";
import { AuthenticatedRequest } from "./auth";

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

export const apiRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req: AuthenticatedRequest): string =>
    req.merchant?.id || req.header("x-api-key") || "missing-api-key",

  handler: (req: AuthenticatedRequest, res: Response) => {
    const retryAfter = Math.ceil(WINDOW_MS / 1000);

    res.setHeader("Retry-After", retryAfter.toString());

    return res.status(429).json({
      error: "Too many requests",
      retryAfter,
    });
  },
});