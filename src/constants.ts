import type { WidgetMode } from './types.js';

export const API_BASE_URLS: Readonly<Record<WidgetMode, string>> = {
  TEST: 'https://dev-api.core.vittasinternational.com',
  LIVE: 'https://api.core.vittasinternational.com',
} as const;

export const WIDGET_ORIGIN = {
  TEST: 'https://dev-api.core.vittasinternational.com',
  LIVE: 'https://api.core.vittasinternational.com',
} as const satisfies Readonly<Record<WidgetMode, string>>;
