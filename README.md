# @vittascore/payment-widget-react

Official Vittas payment widget for React. Fully typed with TypeScript.

> **Naming convention** — framework-specific packages follow the pattern `@vittascore/payment-widget-{framework}`.
> Other packages in this family: `@vittascore/payment-widget-vue` (planned), `@vittascore/payment-widget-angular` (planned).

For contributing, local linking, and publishing instructions see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## How it works

```
Your Backend  ──POST /api/widget/sessions──►  Vittas API
              ◄── { clientSecret: "cs_..." } ──

Your Frontend ──clientSecret──► PaymentWidget ──loads widget.js──► Vittas CDN
```

1. Your backend creates a payment session (amount locked server-side) and receives a `clientSecret`.
2. Your frontend receives the `clientSecret` and passes it to this package.
3. The package loads the Vittas CDN `widget.js` script and calls `VittasPay.init({ clientSecret })`.
4. The widget handles everything — UI, polling, success/failure — then fires your callbacks.

The amount and currency are **locked server-side** and cannot be tampered with by the browser.

---

## Installation

```bash
npm install @vittascore/payment-widget-react
# or
yarn add @vittascore/payment-widget-react
# or
pnpm add @vittascore/payment-widget-react
```

React 17+ and react-dom are peer dependencies — install them alongside the package if you haven't already.

---

## Step 1 — Create a session on your backend

Your server calls the Vittas API with your **secret key** to create a payment session.
The response includes a `clientSecret` (`cs_...`) that you forward to the frontend.

**Endpoint:** `POST {api_base}/api/widget/sessions`
**Auth:** `Authorization: Bearer sk_test_…` (your secret key, never exposed to the browser)

```http
POST https://dev-api.core.vittasinternational.com/api/widget/sessions
Authorization: Bearer sk_test_xxxxxxxxxxxx
Content-Type: application/json

{
  "amount": 500000,
  "currency": "NGN",
  "reference": "order_abc123",
  "payerName": "Ada Lovelace",
  "payerEmail": "ada@example.com",
  "payerPhone": "+2348012345678",
  "metadata": { "orderId": "abc123" }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | `number` | ✅ | Amount in kobo (₦1 = 100 kobo) — minimum 100 |
| `currency` | `string` | ✅ | ISO 4217 code, e.g. `'NGN'` |
| `reference` | `string` | — | Your idempotency key — auto-generated if omitted |
| `payerName` | `string` | — | Pre-fills the customer name |
| `payerEmail` | `string` | — | Pre-fills the customer email |
| `payerPhone` | `string` | — | Pre-fills the customer phone |
| `metadata` | `object` | — | Arbitrary data echoed back in webhooks |

The response contains a `clientSecret` (`cs_...`). Pass that to your frontend.

---

## Step 2 — Open the widget on the frontend

Pass the `clientSecret` your backend returned directly to the component or hook.

### Component

```tsx
import { PaymentWidget } from '@vittascore/payment-widget-react';

// clientSecret comes from your backend — e.g. server-side props, an API route, etc.
export default function CheckoutPage({ clientSecret }: { clientSecret: string }) {
  return (
    <PaymentWidget
      mode="TEST"
      clientSecret={clientSecret}
      onSuccess={(ref) => console.log('paid', ref)}
      onCancel={() => console.log('cancelled')}
      onError={(err) => console.error(err.message)}
    />
  );
}
```

### Hook (programmatic)

```tsx
import { useVittasPayment } from '@vittascore/payment-widget-react';

export default function CheckoutPage({ clientSecret }: { clientSecret: string }) {
  const { open, isOpen } = useVittasPayment({
    mode: 'TEST',
    clientSecret,
    onSuccess: (ref) => console.log('paid', ref),
    onCancel: () => console.log('cancelled'),
  });

  return (
    <button onClick={open} disabled={isOpen}>
      {isOpen ? 'Opening…' : 'Pay Now'}
    </button>
  );
}
```

### Custom trigger

Pass any element as `children` and it becomes the click target:

```tsx
<PaymentWidget mode="LIVE" clientSecret={clientSecret}>
  <img src="/pay-button.svg" alt="Pay with Vittas" />
</PaymentWidget>
```

---

## Props / options

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `mode` | `'TEST' \| 'LIVE'` | ✅ | Determines which CDN and API environment to use |
| `clientSecret` | `string` | ✅ | Session client secret from your backend (`cs_...`) |
| `onSuccess` | `(ref: PaymentReference) => void \| Promise<void>` | — | Fires when the payment completes |
| `onError` | `(err: VittasPayError) => void \| Promise<void>` | — | Fires on payment failure |
| `onCancel` | `() => void` | — | Fires when the user closes the widget |
| `children` | `ReactNode` | — | Custom trigger element (component only) |
| `disabled` | `boolean` | — | Disables the trigger (component only) |

---

## Environments

| Mode | CDN | API |
|------|-----|-----|
| `TEST` | `https://dev-cdn.core.vittasinternational.com` | `https://dev-api.core.vittasinternational.com` |
| `LIVE` | `https://cdn.core.vittasinternational.com` | `https://api.core.vittasinternational.com` |

Widget script loaded at runtime: `{cdn}/latest/widget.js`

---

## TypeScript

All types are exported from the package root:

```ts
import type {
  WidgetMode,
  VittasPaymentConfig,
  PaymentWidgetProps,
  PaymentReference,
  VittasPayError,
} from '@vittascore/payment-widget-react';
```
