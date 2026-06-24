import { CDN_SCRIPT_URLS } from '../constants.js';
import type { WidgetMode } from '../types.js';

const pending = new Map<string, Promise<void>>();

/**
 * Dynamically loads the Vittas CDN widget.js script once per mode.
 * Subsequent calls for the same mode return the cached promise.
 */
export function loadWidgetScript(mode: WidgetMode): Promise<void> {
  const src = CDN_SCRIPT_URLS[mode];

  // Already injected into the document
  if (document.querySelector(`script[src="${src}"]`)) {
    return Promise.resolve();
  }

  // In-flight load — reuse the same promise
  const existing = pending.get(src);
  if (existing !== undefined) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      pending.delete(src);
      resolve();
    };
    script.onerror = () => {
      pending.delete(src);
      script.remove();
      reject(new Error(`Failed to load Vittas widget script: ${src}`));
    };
    document.head.appendChild(script);
  });

  pending.set(src, promise);
  return promise;
}
