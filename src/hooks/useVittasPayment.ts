import { useCallback, useRef, useState } from 'react';
import type { UseVittasPaymentOptions, UseVittasPaymentReturn } from '../types.js';
import { loadWidgetScript } from '../utils/loadWidgetScript.js';

export function useVittasPayment(options: UseVittasPaymentOptions): UseVittasPaymentReturn {
  const [isOpen, setIsOpen] = useState(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const open = useCallback(() => {
    const config = optionsRef.current;

    setIsOpen(true);

    loadWidgetScript(config.mode)
      .then(() => {
        if (typeof window.VittasPay?.init !== 'function') {
          throw new Error('window.VittasPay.init is not available after script load.');
        }

        window.VittasPay.init({
          clientSecret: config.clientSecret,
          // Forwarded so the hosted widget hits the matching REST host. Without
          // it the widget falls back to sniffing the cs_ prefix, which reflects
          // the API key mode, not the environment that issued the session.
          mode: config.mode,
          onSuccess: (reference) => {
            setIsOpen(false);
            void config.onSuccess?.(reference);
          },
          onError: (err) => {
            setIsOpen(false);
            void config.onError?.(err);
          },
          onCancel: () => {
            setIsOpen(false);
            config.onCancel?.();
          },
        });
      })
      .catch((err: unknown) => {
        setIsOpen(false);
        void config.onError?.({
          message: err instanceof Error ? err.message : 'Failed to load payment widget.',
          status: 'failed',
        });
      });
  }, []);

  return { open, isOpen };
}
