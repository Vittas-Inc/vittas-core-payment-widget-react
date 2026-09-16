# Developer Guide — @vittascore/payment-widget-react

This document covers everything you need to contribute to, test locally, and publish this package.
For **integration docs** (how to use it in an app) see [README.md](./README.md).

---

## Credential model — clientSecret vs secret key

The widget uses a **session client secret** pattern, not a public key.

| Credential | Starts with | Lives where | Purpose |
|------------|-------------|-------------|---------|
| Secret API key | `sk_…` | Server only | Create sessions, refunds, webhooks — never in the browser |
| Client secret | `cs_…` | Short-lived, frontend | One-time credential that opens a single payment session |

**Flow:**

```
Browser                          Your Server                    Vittas API
  │                                    │                              │
  │  POST /api/payment-session ──────► │                              │
  │                                    │  POST /api/widget/sessions ► │
  │                                    │ ◄──────────── { clientSecret }│
  │ ◄─────────── { clientSecret } ─────│                              │
  │                                    │                              │
  │  VittasPay.init({ clientSecret })  │                              │
  │ ──────────────────────────────────────────────────────────────── ►│
```

The `clientSecret` encodes everything about the session (amount, currency, allowed origins, branding).
Your frontend never needs to know the amount — it just hands the secret to the widget.

**Never hard-code `clientSecret` values.** Fetch a fresh one from your backend every time the user
is about to pay.

---

## Infrastructure URLs

TEST and LIVE share the same host — the environment is determined by the secret key used to create
the session (`sk_test_…` / `sk_live_…`), not by a separate subdomain.

| Purpose | URL |
|---------|-----|
| REST API | `https://api.core.vittasinternational.com` |
| CDN (widget script + frame) | `https://cdn.core.vittasinternational.com` |
| Widget script | `/latest/widget.js` |
| Payment iframe | `/latest/frame.html` |

The React package dynamically loads `widget.js` from the CDN at runtime and calls
`window.VittasPay(config)` — the same global the vanilla embed exposes. The npm package
is a typed React wrapper around that CDN script; it does not re-implement the payment UI.

---

## Local setup

```bash
git clone https://github.com/Vittas-Inc/vittas-core-payment-widget-react.git
cd vittas-core-payment-widget-react
npm install
npm run dev        # watch mode — rebuilds on every save
npm run type-check # tsc --noEmit (no output files)
npm run lint       # eslint
npm run build      # one-off production build → dist/
```

---

## Linking locally to a consumer app

Use `npm link` to test the package in another project (e.g. `vittas-core-frontend`)
without publishing to npm first:

```bash
# 1. In this repo — build and register the global symlink
npm run build
npm link

# 2. In your consumer app
npm link @vittascore/payment-widget-react

# 3. Import as you normally would
import { PaymentWidget } from '@vittascore/payment-widget-react';

# When you are done testing
# (in the consumer app)
npm unlink @vittascore/payment-widget-react

# (in this repo)
npm unlink --global @vittascore/payment-widget-react
```

> **Tip** — keep `npm run dev` (watch mode) running in this repo while you develop.
> Every time you save a source file the `dist/` folder updates automatically, and the
> consumer app picks up the change on its next hot-reload.

---

## Publishing to npm

### One-time setup

1. Create an account on [npmjs.com](https://www.npmjs.com) and join the `vittascore` organisation.
2. Generate an **Automation** token: npm → Settings → Access Tokens → Generate New Token → Automation.
3. Add it as a GitHub repository secret named `NPM_TOKEN`
   (repo → Settings → Secrets and variables → Actions → New repository secret).

### Releasing a version

```bash
# Bump the version — choose patch | minor | major
npm version patch   # e.g. 0.1.0 → 0.1.1

# Push the commit and the tag together
git push origin main --follow-tags
```

The `publish.yml` GitHub Actions workflow triggers automatically on any `v*` tag and
publishes the package with npm provenance.

### Manual publish (fallback)

```bash
npm run build
npm publish --access public
```

---

## Pushing to GitHub (first time)

Create the repo on GitHub first at <https://github.com/new>, then:

```bash
git remote add origin https://github.com/Vittas-Inc/vittas-core-payment-widget-react.git
git push -u origin main
```

---

## Repo conventions

This package follows the same conventions as all `@vittascore` SDK packages:

| Convention | Detail |
|------------|--------|
| **Branch strategy** | `main` is the published branch. Work in `dev` or short-lived feature branches. |
| **Commit messages** | [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `chore:`, `docs:`, etc. |
| **Versioning** | [Semantic Versioning](https://semver.org/) via `npm version`. |
| **Build** | `tsup` — outputs ESM (`dist/index.js`) + CJS (`dist/index.cjs`) + type declarations (`dist/index.d.ts`). |
| **CI** | GitHub Actions (`ci.yml`) — type-checks, lints, and builds on every PR and push to `main`/`dev`. |
| **Publish** | GitHub Actions (`publish.yml`) — publishes to npm automatically on every `v*` tag. |
| **Framework variants** | `@vittascore/payment-widget-{framework}` — start a new repo per framework, copy this one as the template. |
