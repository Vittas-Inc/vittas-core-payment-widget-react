import type { PaymentWidgetProps } from '../types.js';
import { useVittasPayment } from '../hooks/useVittasPayment.js';

export function PaymentWidget({
  mode,
  clientSecret,
  onSuccess,
  onError,
  onCancel,
  children,
  className,
  style,
  disabled = false,
}: PaymentWidgetProps) {
  const { open } = useVittasPayment({
    mode,
    clientSecret,
    ...(onSuccess !== undefined && { onSuccess }),
    ...(onError !== undefined && { onError }),
    ...(onCancel !== undefined && { onCancel }),
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
