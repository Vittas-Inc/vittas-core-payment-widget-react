import { API_BASE_URLS } from '../constants.js';
import type { VittasPaymentConfig } from '../types.js';

/** Generates a random reference string with a `vtx_` prefix. */
export function generateReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'vtx_';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/** Builds the iframe URL for the given payment configuration. */
export function buildFrameUrl(config: VittasPaymentConfig): string {
  const base = API_BASE_URLS[config.mode];
  const params = new URLSearchParams({
    key: config.publicKey,
    amount: String(config.amount),
    currency: config.currency,
    ref: config.reference ?? generateReference(),
  });

  if (config.email !== undefined && config.email !== '') {
    params.set('email', config.email);
  }

  if (config.metadata !== undefined) {
    params.set('metadata', JSON.stringify(config.metadata));
  }

  return `${base}/pay/widget?${params.toString()}`;
}
