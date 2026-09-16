import type { WidgetMode } from './types.js';

const PRODUCTION_API_URL = 'https://api.core.vittasinternational.com';
const PRODUCTION_CDN_URL = 'https://cdn.core.vittasinternational.com';

/**
 * The published package targets production, where a single host serves both test
 * and live traffic — the key that created the session picks the environment, so
 * both modes resolve to the same host. (Staging keeps a separate test host, but
 * it is not a published target for this package.)
 */

/** REST API base URL — used for payment session requests. */
export const API_BASE_URLS: Readonly<Record<WidgetMode, string>> = {
  TEST: PRODUCTION_API_URL,
  LIVE: PRODUCTION_API_URL,
} as const;

/** CDN base URL — hosts the widget script and the payment iframe page. */
export const CDN_BASE_URLS: Readonly<Record<WidgetMode, string>> = {
  TEST: PRODUCTION_CDN_URL,
  LIVE: PRODUCTION_CDN_URL,
} as const;

/** Full URL to the hosted widget loader script. */
export const CDN_SCRIPT_URLS: Readonly<Record<WidgetMode, string>> = {
  TEST: `${PRODUCTION_CDN_URL}/latest/widget.js`,
  LIVE: `${PRODUCTION_CDN_URL}/latest/widget.js`,
} as const;

/**
 * Expected postMessage origin when the payment iframe sends results back.
 * Must match the origin of the page loaded in the iframe (CDN-hosted frame).
 */
export const WIDGET_ORIGIN: Readonly<Record<WidgetMode, string>> = {
  TEST: PRODUCTION_CDN_URL,
  LIVE: PRODUCTION_CDN_URL,
} as const satisfies Readonly<Record<WidgetMode, string>>;
