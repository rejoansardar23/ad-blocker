# Developer setup — development preview

**State:** basic original MV3 source code exists as of 13 Nov 2026. No external runtime or build dependencies. Chrome/browser end-to-end validation is not yet recorded.

## Prerequisites

- Node.js **20 or newer** (Node.js 22 recommended for CI parity).
- Chrome / Chromium version 121+ to test a Manifest V3 extension.
- Git and a shell. No paid hosting, domain or API keys required.

## Clone, validate and build

```bash
git clone https://github.com/rejoansardar23/ad-blocker.git
cd ad-blocker
npm run check
npm run build
```

`npm run check` validates the manifest, file references, DNR JSON, JavaScript syntax and Node unit tests. `npm run build` copies only the extension runtime to `dist/chrome`. No `npm install` is required for these commands.

## Install in Chrome

1. Open `chrome://extensions`.
2. Turn **Developer mode** on.
3. Click **Load unpacked**.
4. Select **dist/chrome** (not the repo's docs directory).
5. Open an ordinary HTTP(S) page and select the extension action.
6. Toggle protection and trusted-site settings; reload the tab after per-site changes.

Chrome may display broad site-access notices because cosmetic content scripts match HTTP(S) pages. Browser-internal pages are intentionally unsupported. Report installation failures with Chrome version and redacted error output.

## What works by design

- A small packaged DNR ruleset for a handful of known ad-network domains; this is not a full filter subscription.
- Global protection toggle backed by `chrome.storage.local` and DNR ruleset enabling/disabling.
- Domain-based site allowlisting through dynamic `allowAllRequests` rules that take effect on frame navigation/reload.
- A narrow cosmetic CSS rule for common ad placeholders, disabled on trusted sites.
- Local options interface to add/remove trusted websites.

**Verification warning:** the list above describes implemented code paths, not yet independently proven browser success. Use the [implementation checklist](IMPLEMENTATION_CHECKLIST.md) and [testing strategy](TESTING.md).

## Browser smoke test to record

- On a test page, load a JavaScript/image request to `https://ads.adblocker.test/asset.js` (a reserved test domain), and a benign same-site fixture; confirm target reports browser block-by-client versus benign request.
- Disable protection and reload; confirm the target is no longer blocked *by the extension* (DNS resolution still fails for reserved `.test` domains).
- Allowlist test page's domain, reload, and confirm request behaviors and absence of cosmetic CSS.
- Remove exception and reload; confirm blocking restored.
- Restart Chrome and confirm persisted state.
- Record browser version, console errors and exact result; do not claim verification before this is run.

## Troubleshooting

- **Extension won't load:** use `dist/chrome` produced by build, inspect `chrome://extensions` errors, run `npm run verify`.
- **Popup says unavailable:** browser internal pages (`chrome://`, Web Store, etc.) cannot be filtered the same way.
- **Site exception didn't apply:** reload the affected tab to re-evaluate the top-level frame's allow rule.
- **Ad still visible:** starter rules only cover selected domains and selectors; expand after legal list audit and measured tests.
- **Browser API error:** inspect the extension service worker console and include redacted details in an issue.

## Security, licensing and contributions

This public repository has no final project-wide source license selected. Do not import third-party application code without compatible licensing and attribution review. See [REUSE_AND_LICENSES](REUSE_AND_LICENSES.md), [SECURITY](../SECURITY.md), and [CONTRIBUTING](../CONTRIBUTING.md).
