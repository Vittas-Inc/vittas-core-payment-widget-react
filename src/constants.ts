import type { WidgetMode } from './types.js';

/** REST API base URL — used for payment session requests. */
export const API_BASE_URLS: Readonly<Record<WidgetMode, string>> = {
  TEST: 'https://dev-api.core.vittasinternational.com',
  LIVE: 'https://api.core.vittasinternational.com',
} as const;

/** CDN base URL — hosts the widget script and the payment iframe page. */
export const CDN_BASE_URLS: Readonly<Record<WidgetMode, string>> = {
  TEST: 'https://dev-cdn.core.vittasinternational.com',
  LIVE: 'https://cdn.core.vittasinternational.com',
} as const;

/** Full URL to the hosted widget loader script. */
export const CDN_SCRIPT_URLS: Readonly<Record<WidgetMode, string>> = {
  TEST: 'https://dev-cdn.core.vittasinternational.com/latest/widget.js',
  LIVE: 'https://cdn.core.vittasinternational.com/latest/widget.js',
} as const;

/**
 * Expected postMessage origin when the payment iframe sends results back.
 * Must match the origin of the page loaded in the iframe (CDN-hosted frame).
 */
export const WIDGET_ORIGIN: Readonly<Record<WidgetMode, string>> = {
  TEST: 'https://dev-cdn.core.vittasinternational.com',
  LIVE: 'https://cdn.core.vittasinternational.com',
} as const satisfies Readonly<Record<WidgetMode, string>>;
