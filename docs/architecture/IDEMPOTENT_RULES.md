# Idempotent rule syncing and page-owned style safety

This PR avoids rewriting Chrome DNR rules on every status read or unchanged setting, which matters for performance and avoids temporary removal/re-addition of trusted-site rules. It also keeps a direct reference to the content script's injected stylesheet, never removing arbitrary page elements with a matching ID.

Run `npm run check` and `npm run build`. After the Chromium test PR is merged, rerun its full browser suite; verify repeated popup opens don't alter DNR state and disabling cosmetic filtering does not remove unrelated page styles.

This change intentionally does **not** add filter lists, analytics, remote code, or extra permissions.

Review found that the original partial signature ignored additional rule conditions and treated reordered resource-type lists as changes. The signature now compares every property with deterministic object keys and normalizes the order of the two set-valued conditions used by site exceptions. Regression tests seed stale conditions, reorder equivalent rules, and check that unrelated rule IDs survive reconciliation.

The combined Chromium suite now includes a real page-owned element named `ad-blocker-cosmetic`, including a check immediately after pausing before navigation. Node tests independently cover stylesheet ownership and DNR mutation counts.
