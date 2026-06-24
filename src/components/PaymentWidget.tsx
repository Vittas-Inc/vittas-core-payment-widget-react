import type { PaymentWidgetProps } from '../types.js';
import { useVittasPayment } from '../hooks/useVittasPayment.js';

export function PaymentWidget({
  mode,
  publicKey,
  amount,
  currency,
  reference,
  email,
  metadata,
  onSuccess,
  onClose,
  onError,
  children,
  className,
  style,
  disabled = false,
}: PaymentWidgetProps) {
  const { open } = useVittasPayment({
    mode,
    publicKey,
    amount,
    currency,
    ...(reference !== undefined && { reference }),
    ...(email !== undefined && { email }),
    ...(metadata !== undefined && { metadata }),
    ...(onSuccess !== undefined && { onSuccess }),
    ...(onClose !== undefined && { onClose }),
    ...(onError !== undefined && { onError }),
  });

  if (children) {
    return (
      <span
        onClick={disabled ? undefined : open}
        style={{ display: 'contents', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
        className={className}
      >
        {children}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      disabled={disabled}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 24px',
        background: disabled ? '#94a3b8' : '#1a56db',
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: 600,
        lineHeight: 1,
        border: 'none',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'background 150ms ease',
        ...style,
      }}
    >
      Pay Now
    </button>
  );
}
