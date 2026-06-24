import type { CSSProperties } from 'react';

export type WidgetMode = 'TEST' | 'LIVE';

export type Currency = string; // ISO 4217, e.g. 'NGN', 'USD', 'GHS'

export interface VittasPaymentConfig {
  /** 'TEST' routes to dev-api; 'LIVE' routes to production api. */
  mode: WidgetMode;
  /** Your public API key from the Vittas dashboard. */
  publicKey: string;
  /** Amount in the smallest currency unit (e.g. kobo for NGN, cents for USD). */
  amount: number;
  /** ISO 4217 currency code. */
  currency: Currency;
  /** Unique payment reference. Auto-generated if omitted. */
  reference?: string;
  /** Customer email address. */
  email?: string;
  /** Arbitrary key-value pairs attached to the transaction. */
  metadata?: Record<string, unknown>;
}

export interface PaymentSuccessData {
  reference: string;
  transactionId: string;
  amount: number;
  currency: Currency;
}

export interface PaymentError {
  code: string;
  message: string;
}

// ── Component props ────────────────────────────────────────────────────────────

export interface PaymentWidgetProps extends VittasPaymentConfig {
  /** Called when the payment is completed successfully. */
  onSuccess?: (data: PaymentSuccessData) => void;
  /** Called when the user closes the payment modal without completing. */
  onClose?: () => void;
  /** Called when a payment error occurs. */
  onError?: (error: PaymentError) => void;
  /** Pass a custom trigger element. Defaults to a styled "Pay Now" button. */
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Whether the widget is disabled. */
  disabled?: boolean;
}

// ── Hook types ─────────────────────────────────────────────────────────────────

export interface UseVittasPaymentOptions extends VittasPaymentConfig {
  onSuccess?: (data: PaymentSuccessData) => void;
  onClose?: () => void;
  onError?: (error: PaymentError) => void;
}

export interface UseVittasPaymentReturn {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

// ── Internal postMessage protocol ──────────────────────────────────────────────

export type WidgetMessageType = 'VITTAS_SUCCESS' | 'VITTAS_ERROR' | 'VITTAS_CLOSE';

export interface WidgetMessage {
  type: WidgetMessageType;
  payload?: PaymentSuccessData | PaymentError;
}
