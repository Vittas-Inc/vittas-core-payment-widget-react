import type { CSSProperties } from 'react';

export type WidgetMode = 'TEST' | 'LIVE';

// ── Callback payloads (mirrors vittas-core-payment-widget contract) ─────────────

export interface PaymentReference {
  id: string;
  reference: string;
  status: string;
}

export interface VittasPayError {
  message: string;
  status: 'failed';
}

// ── SDK config ─────────────────────────────────────────────────────────────────

export interface VittasPaymentConfig {
  /**
   * 'TEST' loads the widget from the dev CDN; 'LIVE' from production CDN.
   */
  mode: WidgetMode;
  /**
   * Session client secret obtained from your backend (cs_...).
   * Never hard-code this — request it from your server right before opening
   * the widget, then pass it here.
   */
  clientSecret: string;
}

// ── Component props ────────────────────────────────────────────────────────────

export interface PaymentWidgetProps extends VittasPaymentConfig {
  /** Fires when the payment completes successfully. */
  onSuccess?: (reference: PaymentReference) => void | Promise<void>;
  /** Fires when a payment error occurs. */
  onError?: (err: VittasPayError) => void | Promise<void>;
  /** Fires when the user closes the widget before completing. */
  onCancel?: () => void;
  /** Pass a custom trigger element. Defaults to a styled "Pay Now" button. */
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Disables the trigger button. */
  disabled?: boolean;
}

// ── Hook types ─────────────────────────────────────────────────────────────────

export interface UseVittasPaymentOptions extends VittasPaymentConfig {
  onSuccess?: (reference: PaymentReference) => void | Promise<void>;
  onError?: (err: VittasPayError) => void | Promise<void>;
  onCancel?: () => void;
}

export interface UseVittasPaymentReturn {
  open: () => void;
  isOpen: boolean;
}

// ── Global injected by the CDN widget.js script ────────────────────────────────

interface VittasWidgetConfig {
  clientSecret: string;
  onSuccess?: (reference: PaymentReference) => void | Promise<void>;
  onError?: (err: VittasPayError) => void | Promise<void>;
  onCancel?: () => void;
}

export interface VittasPayGlobal {
  init: (config: VittasWidgetConfig) => unknown;
}

declare global {
  interface Window {
    VittasPay?: VittasPayGlobal;
  }
}
