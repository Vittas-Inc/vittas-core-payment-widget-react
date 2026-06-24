import { useCallback, useEffect, useRef, useState } from 'react';
import { WIDGET_ORIGIN } from '../constants.js';
import type {
  PaymentError,
  PaymentSuccessData,
  UseVittasPaymentOptions,
  UseVittasPaymentReturn,
  WidgetMessage,
} from '../types.js';
import { buildFrameUrl } from '../utils/buildFrameUrl.js';

export function useVittasPayment(options: UseVittasPaymentOptions): UseVittasPaymentReturn {
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const handleMessage = useCallback((event: MessageEvent<WidgetMessage>) => {
    const expectedOrigin = WIDGET_ORIGIN[optionsRef.current.mode];
    if (event.origin !== expectedOrigin) return;

    const { type, payload } = event.data;

    if (type === 'VITTAS_SUCCESS') {
      optionsRef.current.onSuccess?.(payload as PaymentSuccessData);
      setIsOpen(false);
    } else if (type === 'VITTAS_ERROR') {
      optionsRef.current.onError?.(payload as PaymentError);
      setIsOpen(false);
    } else if (type === 'VITTAS_CLOSE') {
      optionsRef.current.onClose?.();
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  useEffect(() => {
    if (!isOpen) {
      containerRef.current?.remove();
      iframeRef.current = null;
      containerRef.current = null;
      return;
    }

    const frameUrl = buildFrameUrl(optionsRef.current);

    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed;inset:0;z-index:9999',
      'display:flex;align-items:center;justify-content:center',
      'background:rgba(0,0,0,0.55);backdrop-filter:blur(2px)',
    ].join(';');

    const iframe = document.createElement('iframe');
    iframe.src = frameUrl;
    iframe.style.cssText = [
      'width:min(480px,100vw - 32px)',
      'height:min(640px,100vh - 32px)',
      'border:none;border-radius:12px',
      'background:#fff',
    ].join(';');
    iframe.setAttribute('allow', 'payment');
    iframe.setAttribute('title', 'Vittas payment');

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        optionsRef.current.onClose?.();
        setIsOpen(false);
      }
    });

    overlay.appendChild(iframe);
    document.body.appendChild(overlay);

    iframeRef.current = iframe;
    containerRef.current = overlay;

    return () => {
      overlay.remove();
      iframeRef.current = null;
      containerRef.current = null;
    };
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    optionsRef.current.onClose?.();
    setIsOpen(false);
  }, []);

  return { open, close, isOpen };
}
