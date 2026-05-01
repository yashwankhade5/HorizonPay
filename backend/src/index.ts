import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";

import checkoutRoutes from "./routes/checkout";
import paymentRoutes from "./routes/payment";
import merchantRoutes from "./routes/ merchant";
import webhookRoutes from "./routes/webhook";

import { errorHandler } from "./middleware/errorHandler";

const app = express();

/**
 * Security middleware
 */
app.use(helmet());

/**
 * CORS
 */
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

/**
 * Logging
 */
app.use(morgan("combined"));

/**
 * Body parsing
 * NOTE:
 * webhook route needs raw body for HMAC verification,
 * so mount webhook route BEFORE express.json()
 */
app.use("/webhook", express.raw({ type: "application/json" }), webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
app.use("/checkout", checkoutRoutes);
app.use("/payment", paymentRoutes);
app.use("/merchant", merchantRoutes);

/**
 * 404 fallback
 */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

/**
 * Global error handler
 */
app.use(errorHandler);

/**
 * Start server
 */
app.listen(env.PORT, () => {
  console.log(`Backend server running on port ${env.PORT}`);
});