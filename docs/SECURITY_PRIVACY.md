# Security, privacy and threat model

**Status:** design requirements. No runtime implementation has been audited because there is no application code yet.

## Security assets and threat actors

Protect user browsing privacy, security of content-script boundaries, integrity of filter rules, configuration state, packaged extension updates, contributor repositories and release credentials.

Possible threats:
- malicious or compromised filter sources that trigger breakage or unexpected behavior;
- compromised dependency or build pipeline;
- compromised extension update/signing account;
- page content attempting to influence privileged extension messages;
- unsafe imported settings/custom selectors or injection/scriptlets;
- accidental telemetry or verbose logs of personal browsing history;
- overly broad optional/required host permissions;
- denial-of-service from expensive selectors or runaway DOM observers.

## Privacy commitments for proposed product

- No sale of user data or third-party advertising SDKs.
- Default local processing and locally stored preferences.
- No collection of full browsing histories or URLs by default.
- Optional support reports must be previewable, redact secrets and require user consent.
- Avoid collecting account identifiers, cookies or page text.
- Be transparent about any future network access, update checks or telemetry, with explicit choices and a documented policy.
- Use privacy-preserving synthetic test data, not real user browsing histories.

## Security engineering checklist

- Review every manifest permission and host permission; prefer least privilege.
- Separate untrusted page context from extension execution and validate message senders/payloads.
- Escape/sanitize displayed data and validate custom rules/imported settings.
- Avoid unsafe DOM HTML injection, eval and remote executable JavaScript.
- Check Chrome MV3 Content Security Policy and Chrome Web Store requirements.
- Validate/filter third-party list content, handle timeouts and recover from failed updates.
- Pin/audit dependencies, keep release builds reproducible and use automated scanning.
- Protect code signing keys, GitHub tokens and deployment credentials; never put them in the repository.
- Run site-breakage and abuse-case tests for every advanced rule capability.
- Document vulnerability reporting using the root [SECURITY.md](../SECURITY.md).

## Future release privacy policy topics

Clearly disclose data processed, local storage, update sources, optional reports, website permissions, retention (if any), third-party services and user deletion controls. Publish an actual policy before distribution rather than treating this engineering note as a finalized legal document.

## No disguised counters

If Chrome MV3 does not expose a publishable exact count for all blocked requests, do not invent one. Any estimate must be explained. Development-only debugging APIs are not a production analytics solution.
