import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const worker = readFileSync(path.join(root, "background/service-worker.js"), "utf8");
const shared = readFileSync(path.join(root, "shared/domain.js"), "utf8");

function setup(initial = {}) {
  const stored = { enabled: true, allowlistedSites: [], ...initial };
  let dynamic = [];
  let lastRuleset = null;
  let enabledRulesets = ["starter_rules"];
  let dynamicUpdateCount = 0;
  let staticUpdateCount = 0;
  let storageWriteCount = 0;
  let onMessage = null;
  let onInstalled = null;
  const chrome = {
    storage: {
      local: {
        async get(defaults) { return { ...defaults, ...stored }; },
        async set(changes) { storageWriteCount++; Object.assign(stored, changes); }
      },
      onChanged: { addListener() {} }
    },
    declarativeNetRequest: {
      async getEnabledRulesets() { return [...enabledRulesets]; },
      async updateEnabledRulesets(value) {
        staticUpdateCount++;
        lastRuleset = value;
        enabledRulesets = [...new Set(enabledRulesets.filter((x) => !value.disableRulesetIds.includes(x)).concat(value.enableRulesetIds))];
      },
      async getDynamicRules() { return dynamic; },
      async updateDynamicRules({ removeRuleIds, addRules }) {
        dynamicUpdateCount++;
        dynamic = dynamic.filter((rule) => !removeRuleIds.includes(rule.id)).concat(addRules);
      }
    },
    runtime: {
      onInstalled: { addListener(callback) { onInstalled = callback; } },
      onStartup: { addListener() {} },
      onMessage: { addListener(callback) { onMessage = callback; } }
    }
  };
  const sandbox = { chrome, console, URL };
  vm.createContext(sandbox);
  sandbox.importScripts = () => vm.runInContext(shared, sandbox);
  vm.runInContext(worker, sandbox);
  return {
    async send(message) {
      return new Promise((resolve) => {
        const retainedChannel = onMessage(message, {}, resolve);
        assert.equal(retainedChannel, true);
      });
    },
    async install() { onInstalled(); await this.send({ type: "GET_STATUS" }); },
    seedDynamic(rules) { dynamic = JSON.parse(JSON.stringify(rules)); },
    snapshot() {
      return { stored: JSON.parse(JSON.stringify(stored)), dynamic: JSON.parse(JSON.stringify(dynamic)), lastRuleset: JSON.parse(JSON.stringify(lastRuleset)), enabledRulesets: JSON.parse(JSON.stringify(enabledRulesets)), storageWriteCount, staticUpdateCount, dynamicUpdateCount };
    }
  };
}

test("status reads do not rewrite installed rules", async () => {
  const app = setup();
  const result = await app.send({ type: "GET_STATUS" });
  assert.equal(result.ok, true);
  assert.equal(result.state.enabled, true);
  assert.equal(app.snapshot().storageWriteCount, 0);
  assert.equal(app.snapshot().staticUpdateCount, 0);
  assert.equal(app.snapshot().dynamicUpdateCount, 0);
});

test("status reads repair malformed stored settings", async () => {
  const app = setup({
    enabled: "false",
    allowlistedSites: ["Example.COM", "bad domain", "example.com", 42, "news.example.com"]
  });
  const result = await app.send({ type: "GET_STATUS" });
  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(JSON.stringify(result.state)), {
    enabled: true,
    allowlistedSites: ["example.com", "news.example.com"]
  });
  assert.deepEqual(app.snapshot().stored, JSON.parse(JSON.stringify(result.state)));
  assert.equal(app.snapshot().storageWriteCount, 1);
});

test("site exceptions create and remove allowAllRequests DNR rules", async () => {
  const app = setup();
  const added = await app.send({ type: "SET_SITE_ALLOWED", site: "example.com", allowed: true });
  assert.equal(added.ok, true);
  assert.deepEqual(app.snapshot().dynamic.map((rule) => rule.condition.requestDomains[0]), ["example.com"]);
  assert.equal(app.snapshot().dynamic[0].action.type, "allowAllRequests");
  const removed = await app.send({ type: "SET_SITE_ALLOWED", site: "example.com", allowed: false });
  assert.equal(removed.ok, true);
  assert.deepEqual(app.snapshot().dynamic, []);
});

test("pause disables static rules and restores them on resume", async () => {
  const app = setup();
  await app.send({ type: "SET_ENABLED", enabled: false });
  assert.deepEqual(app.snapshot().lastRuleset.disableRulesetIds, ["starter_rules"]);
  await app.send({ type: "SET_ENABLED", enabled: true });
  assert.deepEqual(app.snapshot().lastRuleset.enableRulesetIds, ["starter_rules"]);
  assert.equal(app.snapshot().staticUpdateCount, 2);
});

test("reset restores defaults and removes only managed exception rules", async () => {
  const app = setup();
  await app.send({ type: "SET_SITE_ALLOWED", site: "example.com", allowed: true });
  const managed = app.snapshot().dynamic[0];
  const unrelated = { ...managed, id: 42 };
  await app.send({ type: "SET_ENABLED", enabled: false });
  app.seedDynamic([unrelated, managed]);

  const result = await app.send({ type: "RESET_SETTINGS" });
  assert.equal(result.ok, true);
  assert.deepEqual(app.snapshot().stored, { enabled: true, allowlistedSites: [] });
  assert.deepEqual(app.snapshot().enabledRulesets, ["starter_rules"]);
  assert.deepEqual(app.snapshot().dynamic, [unrelated]);
});

test("rejects invalid site and invalid global toggle types", async () => {
  const app = setup();
  const invalidSite = await app.send({ type: "SET_SITE_ALLOWED", site: "chrome://extensions", allowed: true });
  assert.equal(invalidSite.ok, false);
  const invalidToggle = await app.send({ type: "SET_ENABLED", enabled: "false" });
  assert.equal(invalidToggle.ok, false);
});

test("repeated settings avoid unnecessary DNR mutation", async () => {
  const app = setup();
  await app.send({ type: "SET_ENABLED", enabled: true });
  await app.send({ type: "SET_ENABLED", enabled: true });
  assert.equal(app.snapshot().staticUpdateCount, 0);
  assert.equal(app.snapshot().dynamicUpdateCount, 0);

  await app.send({ type: "SET_SITE_ALLOWED", site: "example.com", allowed: true });
  assert.equal(app.snapshot().dynamicUpdateCount, 1);
  await app.send({ type: "SET_SITE_ALLOWED", site: "example.com", allowed: true });
  await app.send({ type: "GET_STATUS" });
  assert.equal(app.snapshot().dynamicUpdateCount, 1);
});

test("sync replaces managed rules with stale extra conditions and preserves unrelated rules", async () => {
  const app = setup();
  await app.send({ type: "SET_SITE_ALLOWED", site: "example.com", allowed: true });
  const expected = app.snapshot().dynamic[0];
  const unrelated = { ...expected, id: 42 };
  app.seedDynamic([
    unrelated,
    { ...expected, condition: { ...expected.condition, excludedRequestDomains: ["example.com"] } }
  ]);

  await app.send({ type: "SET_ENABLED", enabled: true });
  assert.deepEqual(app.snapshot().dynamic, [unrelated, expected]);
  assert.equal(app.snapshot().dynamicUpdateCount, 2, "Stale conditions must be repaired");
});

test("semantically identical managed rules do not churn when Chrome reorders properties or lists", async () => {
  const app = setup();
  await app.send({ type: "SET_SITE_ALLOWED", site: "example.com", allowed: true });
  const expected = app.snapshot().dynamic[0];
  app.seedDynamic([{
    condition: {
      resourceTypes: [...expected.condition.resourceTypes].reverse(),
      requestDomains: expected.condition.requestDomains
    },
    action: expected.action,
    priority: expected.priority,
    id: expected.id
  }]);

  await app.send({ type: "SET_ENABLED", enabled: true });
  assert.equal(app.snapshot().dynamicUpdateCount, 1, "Equivalent rules should not be rewritten");
});
