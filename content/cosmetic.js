/* Keep cosmetic selectors intentionally narrow to avoid damaging websites.
 * This stylesheet is removed when protection is paused or the site is trusted.
 */
(function () {
  "use strict";
  const STYLE_ID = "ad-blocker-cosmetic";
  const CSS = [
    "ins.adsbygoogle",
    "[id^='div-gpt-ad-']",
    "[data-ad-blocker-test='ad']"
  ].join(", ") + " { display: none !important; }";

  let state = { enabled: true, allowlistedSites: [] };

  function apply() {
    const active = state.enabled !== false &&
      !globalThis.AdBlockerDomain.isAllowlisted(location.hostname, state.allowlistedSites);
    const current = document.getElementById(STYLE_ID);
    if (!active) {
      if (current) current.remove();
      return;
    }
    if (current || !document.documentElement) return;
    const element = document.createElement("style");
    element.id = STYLE_ID;
    element.textContent = CSS;
    document.documentElement.appendChild(element);
  }

  async function refresh() {
    try {
      state = await chrome.storage.local.get({ enabled: true, allowlistedSites: [] });
      apply();
    } catch {
      // Chrome can disconnect extension contexts during updates.
    }
  }

  if (document.documentElement) apply();
  document.addEventListener("DOMContentLoaded", apply, { once: true });
  refresh();

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if ("enabled" in changes || "allowlistedSites" in changes) refresh();
  });
})();
