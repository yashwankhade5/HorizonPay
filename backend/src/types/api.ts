/**
 * ---------------------------------------------------------------------------
 * GENERIC API RESPONSE WRAPPER
 * ---------------------------------------------------------------------------
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * ---------------------------------------------------------------------------
 * ERROR FORMAT
 * ---------------------------------------------------------------------------
 */

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

/**
 * ---------------------------------------------------------------------------
 * CHECKOUT
 * ---------------------------------------------------------------------------
 */

// POST /checkout/session
export interface CreateCheckoutSessionRequest {
  orderId: string;
  amount: string; // string to avoid bigint issues over JSON
  userPubkey: string;
}

export interface CreateCheckoutSessionResponse {
  checkoutUrl: string;
  sessionId: string;
  expiresAt: string; // ISO string
}

// GET /checkout/:sessionId
export interface GetCheckoutSessionResponse {
  id: string;
  merchantId: string;
  orderId: string;
  amount: string;
  userPubkey: string;
  status: "pending" | "submitted" | "confirmed" | "failed";
  expiresAt: string;
}

/**
 * ---------------------------------------------------------------------------
 * PAYMENT
 * ---------------------------------------------------------------------------
 */

// POST /payment/submit
export interface SubmitPaymentRequest {
  paymentIntentId: string;
  signedTxBase64: string;
}

export interface SubmitPaymentResponse {
  signature: string;
}

/**
 * ---------------------------------------------------------------------------
 * WEBHOOKS
 * ---------------------------------------------------------------------------
 */

export interface WebhookEvent<T = any> {
  id: string;
  type: string;
  createdAt: string;
  data: T;
}

// Example: payment.confirmed
export interface PaymentConfirmedPayload {
  paymentIntentId: string;
  signature: string;
  merchantId: string;
  amount: string;
  userPubkey: string;
}

/**
 * ---------------------------------------------------------------------------
 * TRANSACTION
 * ---------------------------------------------------------------------------
 */

export interface TransactionResponse {
  id: string;
  paymentIntentId: string;
  signature: string;
  status: "submitted" | "confirmed" | "failed";
  createdAt: string;
}

/**
 * ---------------------------------------------------------------------------
 * AUTH (OPTIONAL, FUTURE)
 * ---------------------------------------------------------------------------
 */

export interface AuthContext {
  merchantId: string;
  walletPubkey: string;
  keyType: "secret" | "publishable";
}