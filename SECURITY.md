# Security policy

**Project stage:** early Chrome MV3 development-preview source code; no production release or completed browser-security audit yet.

## Reporting

If you discover a security issue in future code or build artifacts, use GitHub's **Report a vulnerability** / private security advisory option for this repository if available. If private reporting is not enabled, contact the repository maintainers privately via an approved channel; do **not** publish exploitation details, tokens, browsing records or personal data in a public issue.

Include affected commit/version, minimum reproduction, expected vs actual outcome and any privacy exposure. Do not test against other people's accounts or browsing data.

## Security principles

- Local-first filtering; no sale or collection of browsing history.
- Least-privilege extension permissions and host access; explain every request.
- No remotely hosted executable JavaScript in extension code.
- Validate downloaded filter data and third-party dependencies; preserve last-known-good rules when updates fail.
- Secure build and release practices; never commit credentials, signing keys or secrets.
- Follow Chrome extension security, Manifest V3 and store policies.
- Maintain test coverage for content script injection, XSS, URL matching, allowlist rules and privacy guarantees.

Security response timelines and supported-version policy will be formalized before the first public release.
