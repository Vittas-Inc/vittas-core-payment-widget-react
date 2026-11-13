# AGENTS.md: vittas-core-payment-widget-react

Public npm package `@vittascore/payment-widget-react`: React bindings that load
the Vittas `widget.js` from the CDN. This is a public repository.

## Code Review Rules

### Public API and releases

- Everything exported from `src/index.ts` (components, hooks, types) is a
  semver contract. Removing or renaming exports or props, or narrowing types,
  is a breaking change and needs a major version bump. Flag it if
  `package.json` isn't bumped accordingly.
- Keep both ESM and CJS builds and their `types` entries working. Don't move
  React into `dependencies`; it stays a peer dependency.

### Hosts and script loading

- Hosts come from `src/constants.ts`: the production API and CDN serve both
  test and live modes. The `mode` prop is kept for backward compatibility and
  must not pick a different host.
- `widget.js` is loaded only over HTTPS from the official Vittas CDN host.
  Flag props, env variables or code paths that let a caller load the script
  from an arbitrary URL. That would be script injection into merchant
  checkouts.

### Secrets

- The component only ever takes a session client secret (`cs_…`). Flag
  props, examples or README snippets that pass a secret key (`sk_…`) to the
  browser, or real keys in examples.
