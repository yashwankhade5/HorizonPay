/**
 * ---------------------------------------------------------------------------
 * EVENT TYPES (SOURCE OF TRUTH)
 * ---------------------------------------------------------------------------
 */

export type EventType =
  | "payment.submitted"
  | "payment.confirmed"
  | "payment.failed"
  | "withdraw.submitted"
  | "withdraw.completed"
  | "withdraw.failed";

/**
 * ---------------------------------------------------------------------------
 * BASE EVENT STRUCTURE
 * ---------------------------------------------------------------------------
 */

export interface BaseEvent<T = any> {
  id: string;              // unique event id (uuid)
  type: EventType;
  createdAt: string;       // ISO timestamp
  data: T;
}

/**
 * ---------------------------------------------------------------------------
 * PAYMENT EVENTS
 * ---------------------------------------------------------------------------
 */

export interface PaymentSubmittedEventData {
  paymentIntentId: string;
  signature: string;
  merchantId: string;
  amount: string;
  userPubkey: string;
}

export interface PaymentConfirmedEventData {
  paymentIntentId: string;
  signature: string;
  merchantId: string;
  amount: string;
  userPubkey: string;
}

export interface PaymentFailedEventData {
  paymentIntentId: string;
  merchantId: string;
  reason: string;
}

/**
 * ---------------------------------------------------------------------------
 * WITHDRAW EVENTS
 * ---------------------------------------------------------------------------
 */

export interface WithdrawSubmittedEventData {
  merchantId: string;
  signature: string;
  amount: string;
}

export interface WithdrawCompletedEventData {
  merchantId: string;
  signature: string;
  amount: string;
}

export interface WithdrawFailedEventData {
  merchantId: string;
  reason: string;
}

/**
 * ---------------------------------------------------------------------------
 * EVENT MAP (TYPE-SAFE DISPATCH)
 * ---------------------------------------------------------------------------
 */

export interface EventMap {
  "payment.submitted": PaymentSubmittedEventData;
  "payment.confirmed": PaymentConfirmedEventData;
  "payment.failed": PaymentFailedEventData;

  "withdraw.submitted": WithdrawSubmittedEventData;
  "withdraw.completed": WithdrawCompletedEventData;
  "withdraw.failed": WithdrawFailedEventData;
}

/**
 * ---------------------------------------------------------------------------
 * GENERIC EVENT BUILDER TYPE
 * ---------------------------------------------------------------------------
 */

export type TypedEvent<T extends EventType> = BaseEvent<EventMap[T]>;