# @vittascore/payment-widget-react

Official Vittas payment widget for React. Fully typed with TypeScript.

> **Naming convention** — framework-specific packages follow the pattern `@vittascore/payment-widget-{framework}`.
> Other packages in this family: `@vittascore/payment-widget-vue` (planned), `@vittascore/payment-widget-angular` (planned).

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

## Quick start

### Component

```tsx
import { PaymentWidget } from '@vittascore/payment-widget-react';

export default function CheckoutPage() {
  return (
    <PaymentWidget
      mode="TEST"
      publicKey="pk_test_xxxxxxxxxxxx"
      amount={5000}       // 5000 kobo = ₦50
      currency="NGN"
      email="user@example.com"
      onSuccess={(data) => console.log('paid', data)}
      onClose={() => console.log('closed')}
      onError={(err) => console.error(err)}
    />
  );
}
```

### Hook (programmatic)

```tsx
import { useVittasPayment } from '@vittascore/payment-widget-react';

export default function CheckoutPage() {
  const { open, isOpen } = useVittasPayment({
    mode: 'TEST',
    publicKey: 'pk_test_xxxxxxxxxxxx',
    amount: 5000,
    currency: 'NGN',
    email: 'user@example.com',
    onSuccess: (data) => console.log('paid', data),
    onClose: () => console.log('closed'),
  });

  return <button onClick={open}>Pay ₦50 {isOpen && '(loading…)'}</button>;
}
```

### Custom trigger

Pass any element as `children` and it becomes the click target:

```tsx
<PaymentWidget mode="LIVE" publicKey="pk_live_xxx" amount={10000} currency="NGN">
  <img src="/pay-button.svg" alt="Pay with Vittas" />
</PaymentWidget>
```

---

## Props / options

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `mode` | `'TEST' \| 'LIVE'` | ✅ | `TEST` uses dev API; `LIVE` uses production API |
| `publicKey` | `string` | ✅ | Your Vittas public key |
| `amount` | `number` | ✅ | Amount in smallest currency unit (kobo, cents…) |
| `currency` | `string` | ✅ | ISO 4217 code e.g. `'NGN'`, `'USD'`, `'GHS'` |
| `reference` | `string` | — | Payment reference (auto-generated if omitted) |
| `email` | `string` | — | Pre-fill customer email |
| `metadata` | `Record<string, unknown>` | — | Arbitrary data attached to the transaction |
| `onSuccess` | `(data: PaymentSuccessData) => void` | — | Fires on successful payment |
| `onClose` | `() => void` | — | Fires when widget is dismissed |
| `onError` | `(err: PaymentError) => void` | — | Fires on payment error |
| `children` | `ReactNode` | — | Custom trigger (component only) |
| `disabled` | `boolean` | — | Disable the trigger (component only) |

### API endpoints by mode

| Mode | Base URL |
|------|----------|
| `TEST` | `https://dev-api.core.vittasinternational.com` |
| `LIVE` | `https://api.core.vittasinternational.com` |

---

## Development

### Local setup

```bash
git clone https://github.com/Vittas-Inc/vittas-core-payment-widget-react.git
cd vittas-core-payment-widget-react
npm install
npm run dev        # watch mode — rebuilds on change
npm run type-check # run TypeScript compiler without emitting
npm run lint       # eslint
```

### Linking locally to another project

Use `npm link` to test the package in a consumer app without publishing:

```bash
# 1. In this repo — build and create the global symlink
npm run build
npm link

# 2. In your consumer app (e.g. vittas-core-frontend)
npm link @vittascore/payment-widget-react

# 3. Import as normal
import { PaymentWidget } from '@vittascore/payment-widget-react';

# When done, unlink in the consumer app
npm unlink @vittascore/payment-widget-react

# And remove the global link
npm unlink --global @vittascore/payment-widget-react
```

> **Tip** — run `npm run dev` (watch mode) in this repo while developing so the consumer
> always gets the latest compiled output after each save.

---

## Publishing to npm

### One-time setup

1. Create an account on [npmjs.com](https://www.npmjs.com) and join the `vittascore` organisation.
2. Generate an **Automation** token on npm (Settings → Access Tokens → Generate).
3. Add it as a GitHub repository secret named `NPM_TOKEN`.

### Releasing a version

```bash
# 1. Bump the version (patch | minor | major)
npm version patch   # e.g. 0.1.0 → 0.1.1

# 2. Push the commit and the tag
git push origin main --follow-tags
```

The `publish.yml` GitHub Actions workflow triggers on the tag push and publishes automatically.

### Manual publish (fallback)

```bash
npm run build
npm publish --access public
```

---

## Pushing to GitHub (first time)

```bash
# Create the repo on GitHub first (https://github.com/new), then:
git remote add origin https://github.com/Vittas-Inc/vittas-core-payment-widget-react.git
git add .
git commit -m "feat: initial package scaffold"
git push -u origin main
```

---

## Repo conventions

This package follows the same conventions as all `@vittascore` SDK packages:

- **Branch strategy** — `main` is the published branch; work in `dev` or feature branches.
- **Commit messages** — Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).
- **Versioning** — Semantic Versioning via `npm version`.
- **Build** — `tsup` produces ESM + CJS + `.d.ts`.
- **CI** — GitHub Actions type-checks and builds on every PR.
- **Publish** — GitHub Actions publishes on every `v*` tag.
