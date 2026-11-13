/* No server, remote executable code or network logging. Rules are applied
 * by Chrome declarativeNetRequest, not by intercepting request contents.
 */
importScripts("../shared/domain.js");

const { normalizeSite } = globalThis.AdBlockerDomain;
const DEFAULTS = Object.freeze({ enabled: true, allowlistedSites: [] });
const RULESET_ID = "starter_rules";
const FIRST_SITE_RULE_ID = 100000;
const MAX_SITES = 100;
let syncQueue = Promise.resolve();

async function getState() {
  const saved = await chrome.storage.local.get(DEFAULTS);
  const allowlistedSites = [...new Set((Array.isArray(saved.allowlistedSites)
    ? saved.allowlistedSites : []).map(normalizeSite).filter(Boolean))].sort();
  return { enabled: saved.enabled !== false, allowlistedSites };
}

// DNR allowAllRequests rules match a top-level/subframe navigation and allow
// that frame's future requests at priority 100. After adding/removing an
// exception, callers should reload the tab so the frame rule is re-evaluated.
function siteRule(site, index) {
  return {
    id: FIRST_SITE_RULE_ID + index,
    priority: 100,
    action: { type: "allowAllRequests" },
    condition: {
      requestDomains: [site],
      resourceTypes: ["main_frame", "sub_frame"]
    }
  };
}

async function syncFromStorage() {
  const { enabled, allowlistedSites } = await getState();
  if (allowlistedSites.length > MAX_SITES) {
    throw new Error("Site exception limit exceeded (100).");
  }

  await chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: enabled ? [RULESET_ID] : [],
    disableRulesetIds: enabled ? [] : [RULESET_ID]
  });

  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const ourIds = existing
    .filter((rule) => rule.id >= FIRST_SITE_RULE_ID && rule.id < FIRST_SITE_RULE_ID + MAX_SITES)
    .map((rule) => rule.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ourIds,
    addRules: enabled ? allowlistedSites.map(siteRule) : []
  });
  return { enabled, allowlistedSites };
}

function queueSync() {
  syncQueue = syncQueue.catch((error) => {
    console.error("Previous DNR sync failed:", error);
  }).then(syncFromStorage);
  return syncQueue;
}

async function handleMessage(message) {
  if (!message || typeof message.type !== "string") {
    throw new Error("Unsupported message.");
  }

  if (message.type === "GET_STATUS") {
    return queueSync();
  }
  if (message.type === "SET_ENABLED") {
    if (typeof message.enabled !== "boolean") throw new Error("Expected boolean enabled.");
    await chrome.storage.local.set({ enabled: message.enabled });
    return queueSync();
  }
  if (message.type === "SET_SITE_ALLOWED") {
    const site = normalizeSite(message.site);
    if (!site || typeof message.allowed !== "boolean") {
      throw new Error("Invalid website or setting.");
    }
    const state = await getState();
    const next = new Set(state.allowlistedSites);
    if (message.allowed) next.add(site);
    else next.delete(site);
    if (next.size > MAX_SITES) throw new Error("Maximum 100 website exceptions.");
    await chrome.storage.local.set({ allowlistedSites: [...next].sort() });
    return queueSync();
  }
  throw new Error("Unknown operation: " + message.type);
}

chrome.runtime.onInstalled.addListener(() => {
  queueSync().catch((error) => console.error("Install rule sync failed:", error));
});
chrome.runtime.onStartup.addListener(() => {
  queueSync().catch((error) => console.error("Startup rule sync failed:", error));
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && ("enabled" in changes || "allowlistedSites" in changes)) {
    queueSync().catch((error) => console.error("Settings rule sync failed:", error));
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  handleMessage(message)
    .then((state) => sendResponse({ ok: true, state }))
    .catch((error) => {
      console.error("Ad Blocker operation failed:", error);
      sendResponse({ ok: false, error: error.message || "Unknown error" });
    });
  return true;
});
