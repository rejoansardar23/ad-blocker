/* Narrow, local cosmetic rules. Keep a reference to the style node we own.
 * Page content can use the same IDs as ours; never remove page-owned nodes.
 */
(function () {
  "use strict";
  const CSS = [
    "ins.adsbygoogle",
    "[id^='div-gpt-ad-']",
    "[data-ad-blocker-test='ad']"
  ].join(", ") + " { display: none !important; }";

  let state = { enabled: true, allowlistedSites: [] };
  let ownStyle = null;

  function apply() {
    const active = state.enabled !== false &&
      !globalThis.AdBlockerDomain.isAllowlisted(location.hostname, state.allowlistedSites);

    if (!active) {
      if (ownStyle?.isConnected) ownStyle.remove();
      ownStyle = null;
      return;
    }

    if (ownStyle?.isConnected || !document.documentElement) return;
    const element = document.createElement("style");
    element.textContent = CSS;
    document.documentElement.appendChild(element);
    ownStyle = element;
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
    if (area === "local" && ("enabled" in changes || "allowlistedSites" in changes)) refresh();
  });
})();
