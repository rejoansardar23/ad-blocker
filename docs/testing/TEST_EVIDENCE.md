# Grouped test evidence

## Recovery mission, 18 November 2026 (Asia/Kolkata)

Baseline `ce77ac5` passed frozen install, lockfile guard, 18 Node tests, matching 11-file build, audit (0 reported vulnerabilities), SBOM, and ten local Chromium scenarios. See [the baseline report](BASELINE_TEST_REPORT.md).

Audit checkpoint `c9e54b2` adds seven inventory and five boundary-check regressions: **30 tests passed**, no failures/skips. [Exact-commit CI 44182569555](https://github.com/rejoansardar23/ad-blocker/actions/runs/44182569555) passed the full pipeline. `npm run audit:repository` accounts for every tracked path and verifies 1,384 imported-file hashes plus both ZIP hashes without executing imports.

Local browser capability changed with the machine: official download and side-loading now pass on Playwright 1.65.0 / Chromium **158.0.8127.18**, Node 24.22.1, npm 11.9.0. Historical HTTP 403 and administrator-policy limitations below describe the earlier workspace only. Actual Chrome Stable toolbar, accessibility, outbound privacy capture, real-site breadth, performance, release, and platform groups remain NOT RUN.

## Historical grouping checkpoint

The following results apply to commit [`ee0519f`](https://github.com/rejoansardar23/ad-blocker/commit/ee0519fabd738059e67e0121d57b1bedd5790326). They are preserved as dated evidence; they do not replace the newer checkpoint above.

- **Recorded:** 17 November 2026 (Asia/Kolkata)
- **GitHub Actions:** [run 37, success in 46 seconds](https://github.com/rejoansardar23/ad-blocker/actions/runs/44002405205)
- **Local runtime:** Node.js 24.22.1, npm 11.9.0
- **CI runtime:** Node.js 22
- **Locked browser dependency:** Playwright 1.65.0

## Results by test group

| Group | Evidence | Result |
|---|---|---|
| Frozen dependency install | `npm ci --cache /workspace/.cache/npm --no-audit --no-fund`; `package-lock.json` remained unchanged | Pass |
| Structure and syntax | `npm run verify` checked required files, JSON, manifest/rules references, JavaScript syntax and remote-script guards | Pass |
| Unit behavior | `npm run test`: 18 tests run (2 domain, 9 service-worker/DNR, 1 cosmetic, 6 popup/options), 18 passed, 0 failed, 0 skipped | Pass |
| Combined local checks | `npm run check` repeated structure and unit groups successfully | Pass |
| Package integrity | `npm run build`; 11 source files became 11 packaged files, `diff -qr src/extension dist/chrome` found no difference, package size 76 KiB | Pass |
| Dependency audit | `npm audit --audit-level=high` reported 0 vulnerabilities | Pass |
| Dependency inventory | `npm sbom --sbom-format cyclonedx` produced a valid CycloneDX 1.5 document with 2 components | Pass |
| Chromium integration | Exact-commit GitHub workflow installed Playwright Chromium and ran `npm run test:browser` after a clean build | Pass in CI |
| Documentation and patch hygiene | Repository-relative Markdown targets were checked for missing files; `git diff --check` found no whitespace errors | Pass |
| Quarantined material | `AnalyseFuture/` was deliberately excluded from installation, builds and tests | Not executed |

The Chromium script first requires extension service-worker startup and the options page to load. Its ten page-level scenarios cover default DNR blocking with a benign control; global pause and cosmetic restoration; an exact site exception; inherited subdomain trust; rejection of a similarly named unrelated domain; blocking after trust removal; trust persistence and later removal after restart; global-pause persistence after another restart; and reset-to-default recovery. Each scenario also checks server request counts, legitimate-content visibility and preservation of page-owned elements. It uses loopback fixtures and reserved `.test` hostnames; it does not contact public ad networks.

## Local browser limitation

The browser group could not be counted as a local pass or application failure in this managed workspace:

- Playwright Chromium downloads from the available official endpoints returned HTTP 403 `Domain forbidden`.
- The installed system Chromium 156.0.8078.79 is managed with `ExtensionInstallBlocklist: ["*"]` and rejected the unpacked extension with "Loading of unpacked extensions is disabled by the administrator."

The exact same commit was therefore validated by GitHub Actions, where the browser can be downloaded and the extension can be side-loaded. The test harness was restored unchanged after the local diagnosis; no policy-bypass code was retained.

The default npm cache also failed during extraction in this workspace. A repository-scoped cache at `/workspace/.cache/npm` completed the locked install successfully; this is an environment workaround, not an application change.

## What this does not prove

The successful pipeline is a strong development baseline, not proof of universal ad blocking or release readiness. The following remain open test groups:

- Chrome Stable manual checks of the real toolbar popup, options UX, keyboard use and screen-reader behavior.
- Broad HTTPS and real-site compatibility across news, shopping, media, SPA, authenticated and anti-adblock pages.
- Licensed production filter-list compilation, regional/language coverage, list updates, integrity failure and last-known-good rollback.
- Performance, memory, CPU, battery, page-load and DNR quota benchmarks against a no-extension baseline.
- Privacy verification of outbound traffic and a formal review of permissions, release packaging and store disclosures.
- Concurrent settings/exception writes, DNR API failures after storage writes, service-worker suspension and schema migration.
- Exact production blocking statistics and guaranteed server-inserted video-ad removal; browser/API limits make universal claims invalid.

Future evidence should keep these groups separate, record failures as failures, and always attach results to the tested commit and browser version.
