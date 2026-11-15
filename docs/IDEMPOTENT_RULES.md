# Idempotent rule syncing and page-owned style safety

This PR avoids rewriting Chrome DNR rules on every status read or unchanged setting, which matters for performance and avoids temporary removal/re-addition of trusted-site rules. It also keeps a direct reference to the content script's injected stylesheet, never removing arbitrary page elements with a matching ID.

Run `npm run check` and `npm run build`. After the Chromium test PR is merged, rerun its full browser suite; verify repeated popup opens don't alter DNR state and disabling cosmetic filtering does not remove unrelated page styles.

This change intentionally does **not** add filter lists, analytics, remote code, or extra permissions.
