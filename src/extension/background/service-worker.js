/* No server, remote executable code or network logging. Rules are applied
 * by Chrome declarativeNetRequest, not by intercepting request contents.
 */
importScripts("../shared/domain.js");

const { normalizeSite } = globalThis.AdBlockerDomain;
const DEFAULTS = Object.freeze({ enabled: true, allowlistedSites: Object.freeze([]) });
const RULESET_ID = "starter_rules";
const FIRST_SITE_RULE_ID = 100000;
const MAX_SITES = 100;
let operationQueue = Promise.resolve();

function sameSites(left, right) {
  return Array.isArray(left) && left.length === right.length &&
    left.every((site, index) => site === right[index]);
}

async function getState() {
  const saved = await chrome.storage.local.get(DEFAULTS);
  const state = {
    enabled: typeof saved.enabled === "boolean" ? saved.enabled : DEFAULTS.enabled,
    allowlistedSites: [...new Set((Array.isArray(saved.allowlistedSites)
      ? saved.allowlistedSites : []).map(normalizeSite).filter(Boolean))]
      .sort()
      .slice(0, MAX_SITES)
  };
  const repairs = {};
  if (saved.enabled !== state.enabled) repairs.enabled = state.enabled;
  if (!sameSites(saved.allowlistedSites, state.allowlistedSites)) {
    repairs.allowlistedSites = state.allowlistedSites;
  }
  if (Object.keys(repairs).length > 0) {
    await chrome.storage.local.set(repairs);
  }
  return state;
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

// Compare the complete rule so stale restrictions are repaired. Chrome may
// return object keys and set-valued conditions in a different order.
function ruleSignature(rules) {
  function canonical(value, key = "") {
    if (Array.isArray(value)) {
      const items = value.map((item) => canonical(item));
      return ["requestDomains", "resourceTypes"].includes(key) ? items.sort() : items;
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.keys(value).sort().map((name) => [name, canonical(value[name], name)]));
    }
    return value;
  }
  return JSON.stringify(canonical(rules));
}

async function syncFromStorage() {
  const { enabled, allowlistedSites } = await getState();
  if (allowlistedSites.length > MAX_SITES) {
    throw new Error("Site exception limit exceeded (100).");
  }

  // Read actual browser state before mutating rules. Re-applying unchanged
  // dynamic rules on every popup open creates avoidable work and a brief
  // remove/re-add window in which a trusted site could get blocked.
  const activeRulesets = await chrome.declarativeNetRequest.getEnabledRulesets();
  const currentlyEnabled = activeRulesets.includes(RULESET_ID);
  if (currentlyEnabled !== enabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: enabled ? [RULESET_ID] : [],
      disableRulesetIds: enabled ? [] : [RULESET_ID]
    });
  }

  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const managed = existing
    .filter((rule) => rule.id >= FIRST_SITE_RULE_ID && rule.id < FIRST_SITE_RULE_ID + MAX_SITES)
    .sort((a, b) => a.id - b.id);
  const desired = enabled ? allowlistedSites.map(siteRule) : [];
  if (ruleSignature(managed) !== ruleSignature(desired)) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: managed.map((rule) => rule.id),
      addRules: desired
    });
  }
  return { enabled, allowlistedSites };
}

function queueOperation(operation) {
  // Serialize reads/repairs, complete mutations, and DNR reconciliation together.
  // Keep each caller's rejection, while allowing subsequent work to recover.
  const result = operationQueue.then(operation);
  operationQueue = result.catch(() => {});
  return result;
}

function queueSync() {
  return queueOperation(syncFromStorage);
}

// Browser rule APIs and local storage are separate systems. If rule application
// fails after a settings write, restore the affected previous preferences and
// reconcile the installed rules before reporting a failed user action.
async function saveAndReconcile(nextSettings, previousSettings) {
  await chrome.storage.local.set(nextSettings);
  try {
    return await syncFromStorage();
  } catch (applyError) {
    try {
      await chrome.storage.local.set(previousSettings);
      await syncFromStorage();
    } catch (recoveryError) {
      throw new Error("Protection update failed and automatic settings recovery failed: " +
        (recoveryError.message || String(recoveryError)));
    }
    throw new Error("Protection update failed; previous settings restored: " +
      (applyError.message || String(applyError)));
  }
}

async function handleMessage(message) {
  if (!message || typeof message.type !== "string") {
    throw new Error("Unsupported message.");
  }

  if (message.type === "GET_STATUS") {
    // Reading the popup must not rewrite Chrome DNR rules.
    return getState();
  }
  if (message.type === "SET_ENABLED") {
    if (typeof message.enabled !== "boolean") throw new Error("Expected boolean enabled.");
    const before = await getState();
    return saveAndReconcile({ enabled: message.enabled }, { enabled: before.enabled });
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
    return saveAndReconcile(
      { allowlistedSites: [...next].sort() },
      { allowlistedSites: state.allowlistedSites }
    );
  }
  if (message.type === "RESET_SETTINGS") {
    const before = await getState();
    return saveAndReconcile(
      { enabled: true, allowlistedSites: [] },
      { enabled: before.enabled, allowlistedSites: before.allowlistedSites }
    );
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
  // GET_STATUS also belongs in the queue because malformed-state repair writes.
  // A queued mutation calls syncFromStorage directly: awaiting queueSync from
  // inside itself would deadlock. Storage events enqueue a later idempotent sync.
  queueOperation(() => handleMessage(message))
    .then((state) => sendResponse({ ok: true, state }))
    .catch((error) => {
      console.error("Ad Blocker operation failed:", error);
      sendResponse({ ok: false, error: error.message || "Unknown error" });
    });
  return true;
});
