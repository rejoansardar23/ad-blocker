# Worldwide ad-blocking product plan

## Goal

Develop a privacy-first browser ad blocker using the supplied uBlock Origin and Ghostery Adblocker ZIP projects. Aim for broad coverage across websites, languages, and regions while preserving normal website functionality.

Universal blocking of every advertisement cannot be guaranteed. Advertising can be embedded in video or delivered through the same endpoints as essential content. Measure coverage and website breakage, and describe supported behavior accurately.

## Supplied foundations

| Project | Proposed role | Current evidence |
|---|---|---|
| `projects/ublock-origin` | Main candidate for the browser extension foundation, including its MV3 implementation and filtering architecture | Extraction verified; Node engine builds and passes a synthetic block/exception/control test; full MV3 build needs missing submodule contents |
| `projects/ghostery-adblocker` | Parser research, compatibility testing, and a narrowly selected component if it demonstrates a benefit | Extraction verified; workspace installation, builds, and tests remain incomplete |

Keep both projects separate until integration is explicitly chosen. Select one active filtering pipeline. Preserve licenses, copyright notices, and upstream source boundaries; define the distribution model before combining code. No additional filtering engine is proposed.

The existing original Chrome MV3 preview remains available for regression comparison. Its unit tests and packaging pass. Those results do not establish that either full upstream browser product builds or that broad website coverage works.

## Product behavior

- Protection enabled by default, with a global pause control and per-site exceptions.
- Network filtering for supported advertising and tracking requests.
- Cosmetic filtering to hide advertising elements and leftover spaces.
- Carefully tested scriptlets or page-behavior rules where supported.
- Clear settings, truthful status, and optional privacy-preserving reports of missed ads or broken pages.
- Accessible interfaces and translations for the audiences supported by testing.

Chrome MV3 network blocking uses the browser's declarative rules engine. Content scripts provide page-level cosmetic behavior. These layers must have consistent exceptions and protection settings. Normal articles, videos, sign-ins, and payment flows must remain usable.

## Worldwide coverage

Build a coverage matrix spanning website categories, languages, target regions, browsers, and representative devices. Measure missed ads separately from false positives and site breakage. Expand from reproducible reports rather than country counts or unsupported marketing claims.

Start with the capabilities and available material in the supplied archives. Inventory missing filter data. Develop reviewed rules for confirmed gaps; additional external datasets require a separate decision and license review. Filter syntax can include URL rules, exceptions, cosmetic selectors, and scriptlets, so data must be evaluated against the actual browser capabilities.

Validate other browsers independently using the platform code present in the foundations. Mobile feasibility depends on extension support and platform restrictions. A browser extension does not automatically filter advertising in every installed application.

## Updates, privacy, and reliability

Version and validate filter updates before release. Test changes against known advertising fixtures and benign controls, and retain a rollback mechanism for faulty rules. Keep executable filtering code in reviewed extension releases.

Perform filtering locally where supported. Do not routinely upload browsing history or page contents. Make user-submitted diagnostics transparent and minimize collected data. Display blocking statistics only when browser APIs support accurate measurement.

Test CPU use, memory use, page-load effects, permissions, and update failures. Record dependency versions and licenses. Preserve required notices in any distributed package and review security before release.

## Delivery gates

| Stage | Deliverable | Required evidence |
|---|---|---|
| Restore foundations | Reproducible builds from the supplied source trees | Compatible existing dependencies recovered; relevant builds and tests complete successfully |
| Choose the browser foundation | Evaluate uBlock MV3 and define Ghostery's specific role | Architecture choice, license-compatible scope, and passing prototype checks |
| First Chrome version | Packaged network filtering, cosmetics, settings, pause, and exceptions | Actual Chromium tests for blocking, benign requests, controls, and restart persistence |
| Coverage expansion | Reviewed regional rules and supported page behavior | Reproducible website tests demonstrate useful coverage with acceptable breakage |
| Release preparation | Reliable updates, accessibility, performance, and security review | Tested rollback, reviewed permissions, accurate documentation, and resolved release blockers |
| Browser expansion | Additional independently supported platforms | The same release gates pass on each declared browser and platform |

For every browser release, record the exact source revision, browser version, test conditions, passed and failed checks, and remaining limitations. An open browser window or successful package build alone does not prove filtering behavior.

## Immediate next step

Make the supplied uBlock MV3 build reproducible by resolving its declared missing dependencies at compatible versions. Evaluate it as the first browser foundation. Keep Ghostery isolated for focused evaluation until a tested integration benefit is established. Publish no claim of complete worldwide coverage before representative browser and website evidence exists.
