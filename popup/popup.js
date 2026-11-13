(function () {
  "use strict";
  const enabledInput = document.getElementById("enabled");
  const siteInput = document.getElementById("site-enabled");
  const badge = document.getElementById("badge");
  const headline = document.getElementById("headline");
  const subtitle = document.getElementById("subtitle");
  const siteLabel = document.getElementById("site-label");
  const notice = document.getElementById("notice");
  const reload = document.getElementById("reload");
  const settings = document.getElementById("settings");
  let activeTabId = null;
  let site = null;
  let currentState = null;
  let pending = false;

  async function request(message) {
    const response = await chrome.runtime.sendMessage(message);
    if (!response || !response.ok) throw new Error(response?.error || "Extension service unavailable.");
    return response.state;
  }

  function message(text, error = false) {
    notice.textContent = text;
    notice.classList.toggle("error", error);
  }

  function render() {
    if (!currentState) return;
    const on = currentState.enabled;
    const trusted = site && globalThis.AdBlockerDomain.isAllowlisted(site, currentState.allowlistedSites);
    badge.textContent = on ? "Protected" : "Paused";
    badge.className = "badge " + (on ? "on" : "off");
    headline.textContent = !on ? "Protection is paused" : trusted ? "Trusted website" : "Protection is on";
    subtitle.textContent = on
      ? "A small starter ruleset is active. Full filter lists are coming later."
      : "Known ad requests are not being filtered.";
    enabledInput.checked = on;
    enabledInput.disabled = pending;
    siteInput.checked = !!site && !trusted;
    siteInput.disabled = pending || !site || !on;
  }

  async function change(messageData) {
    if (pending) return;
    pending = true;
    render();
    try {
      currentState = await request(messageData);
      render();
      message("Setting saved. Reload this page to apply site-level changes.");
      reload.hidden = activeTabId === null;
    } catch (error) {
      message(error.message, true);
      try { currentState = await request({ type: "GET_STATUS" }); } catch {}
    } finally {
      pending = false;
      render();
    }
  }

  async function init() {
    settings.addEventListener("click", () => chrome.runtime.openOptionsPage());
    reload.addEventListener("click", async () => {
      if (activeTabId === null) return;
      try { await chrome.tabs.reload(activeTabId); window.close(); }
      catch (error) { message(error.message, true); }
    });
    enabledInput.addEventListener("change", () => change({
      type: "SET_ENABLED", enabled: enabledInput.checked
    }));
    siteInput.addEventListener("change", () => {
      if (site) change({ type: "SET_SITE_ALLOWED", site, allowed: !siteInput.checked });
    });

    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      activeTabId = Number.isInteger(tab?.id) ? tab.id : null;
      site = globalThis.AdBlockerDomain.normalizeSite(tab?.url || "");
      siteLabel.textContent = site || "Unavailable on this page";
      currentState = await request({ type: "GET_STATUS" });
      render();
      message(site ? "A page reload applies site-level exceptions." : "Site controls require an http(s) website.");
    } catch (error) {
      badge.textContent = "Error";
      headline.textContent = "Could not load settings";
      message(error.message, true);
    }
  }

  init();
})();
