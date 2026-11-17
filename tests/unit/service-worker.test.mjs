import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const extension = path.join(root, "src", "extension");
const worker = readFileSync(path.join(extension, "background/service-worker.js"), "utf8");
const shared = readFileSync(path.join(extension, "shared/domain.js"), "utf8");

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function setup(initial = {}, { emitStorageEvents = false } = {}) {
  const stored = { enabled: true, allowlistedSites: [], ...initial };
  let dynamic = [];
  let lastRuleset = null;
  let enabledRulesets = ["starter_rules"];
  let dynamicUpdateCount = 0;
  let staticUpdateCount = 0;
  let storageWriteCount = 0;
  let onMessage = null;
  let onInstalled = null;
  let onStartup = null;
  let onStorageChanged = null;
  let nextReadPause = null;
  let failNextWrite = false;
  let failNextStaticUpdate = false;
  let failNextDynamicUpdate = false;
  const chrome = {
    storage: {
      local: {
        async get(defaults) {
          // Chrome returns a snapshot, not a live reference to mutable storage.
          const snapshot = JSON.parse(JSON.stringify({ ...defaults, ...stored }));
          const pause = nextReadPause;
          nextReadPause = null;
          if (pause) {
            pause.started.resolve();
            await pause.release.promise;
          }
          return snapshot;
        },
        async set(changes) {
          storageWriteCount++;
          if (failNextWrite) {
            failNextWrite = false;
            throw new Error("Injected storage write failure");
          }
          const events = {};
          for (const [key, value] of Object.entries(changes)) {
            if (JSON.stringify(stored[key]) !== JSON.stringify(value)) {
              events[key] = { oldValue: stored[key], newValue: value };
            }
          }
          Object.assign(stored, JSON.parse(JSON.stringify(changes)));
          if (emitStorageEvents && Object.keys(events).length) onStorageChanged?.(events, "local");
        }
      },
      onChanged: { addListener(callback) { onStorageChanged = callback; } }
    },
    declarativeNetRequest: {
      async getEnabledRulesets() { return [...enabledRulesets]; },
      async updateEnabledRulesets(value) {
        staticUpdateCount++;
        if (failNextStaticUpdate) {
          failNextStaticUpdate = false;
          throw new Error("Injected ruleset update failure");
        }
        lastRuleset = value;
        enabledRulesets = [...new Set(enabledRulesets.filter((x) => !value.disableRulesetIds.includes(x)).concat(value.enableRulesetIds))];
      },
      async getDynamicRules() { return dynamic; },
      async updateDynamicRules({ removeRuleIds, addRules }) {
        dynamicUpdateCount++;
        if (failNextDynamicUpdate) {
          failNextDynamicUpdate = false;
          throw new Error("Injected dynamic rule update failure");
        }
        dynamic = dynamic.filter((rule) => !removeRuleIds.includes(rule.id)).concat(addRules);
      }
    },
    runtime: {
      onInstalled: { addListener(callback) { onInstalled = callback; } },
      onStartup: { addListener(callback) { onStartup = callback; } },
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
    async startup() { onStartup(); await this.send({ type: "GET_STATUS" }); },
    pauseNextRead() {
      nextReadPause = { started: deferred(), release: deferred() };
      const pause = nextReadPause;
      return { started: pause.started.promise, release: () => pause.release.resolve() };
    },
    rejectNextWrite() { failNextWrite = true; },
    rejectNextDnrUpdate(kind) {
      if (kind === "static") failNextStaticUpdate = true;
      else if (kind === "dynamic") failNextDynamicUpdate = true;
      else throw new Error("Unknown injection kind");
    },
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

test("concurrent site additions retain both exceptions and return ordered state", { timeout: 2000 }, async () => {
  const app = setup();
  const pause = app.pauseNextRead();
  const first = app.send({ type: "SET_SITE_ALLOWED", site: "one.example", allowed: true });
  await pause.started;
  const second = app.send({ type: "SET_SITE_ALLOWED", site: "two.example", allowed: true });
  pause.release();
  const [one, two] = await Promise.all([first, second]);
  assert.equal(one.ok, true);
  assert.equal(two.ok, true);
  assert.deepEqual(JSON.parse(JSON.stringify(one.state.allowlistedSites)), ["one.example"]);
  assert.deepEqual(JSON.parse(JSON.stringify(two.state.allowlistedSites)), ["one.example", "two.example"]);
  assert.deepEqual(app.snapshot().stored.allowlistedSites, ["one.example", "two.example"]);
  assert.deepEqual(app.snapshot().dynamic.map((rule) => rule.condition.requestDomains[0]), ["one.example", "two.example"]);
});

test("overlapping site addition and removal do not lose either change", { timeout: 2000 }, async () => {
  const app = setup({ allowlistedSites: ["old.example"] });
  const pause = app.pauseNextRead();
  const add = app.send({ type: "SET_SITE_ALLOWED", site: "new.example", allowed: true });
  await pause.started;
  const remove = app.send({ type: "SET_SITE_ALLOWED", site: "old.example", allowed: false });
  pause.release();
  assert.ok((await Promise.all([add, remove])).every((result) => result.ok));
  assert.deepEqual(app.snapshot().stored.allowlistedSites, ["new.example"]);
  assert.deepEqual(app.snapshot().dynamic.map((rule) => rule.condition.requestDomains[0]), ["new.example"]);
});

for (const resetFirst of [true, false]) {
  test("reset and site mutation follow dispatch order: " + (resetFirst ? "reset then add" : "add then reset"), { timeout: 2000 }, async () => {
    const app = setup({ allowlistedSites: ["old.example"] });
    const reset = { type: "RESET_SETTINGS" };
    const add = { type: "SET_SITE_ALLOWED", site: "new.example", allowed: true };
    const results = await Promise.all((resetFirst ? [reset, add] : [add, reset]).map((message) => app.send(message)));
    assert.ok(results.every((result) => result.ok));
    const expected = resetFirst ? ["new.example"] : [];
    assert.deepEqual(app.snapshot().stored, { enabled: true, allowlistedSites: expected });
    assert.deepEqual(app.snapshot().dynamic.map((rule) => rule.condition.requestDomains[0]), expected);
  });
}

test("overlapping global pause and site addition preserve both preferences", { timeout: 2000 }, async () => {
  const app = setup();
  const pause = app.pauseNextRead();
  const site = app.send({ type: "SET_SITE_ALLOWED", site: "one.example", allowed: true });
  await pause.started;
  const toggle = app.send({ type: "SET_ENABLED", enabled: false });
  pause.release();
  assert.ok((await Promise.all([site, toggle])).every((result) => result.ok));
  assert.deepEqual(app.snapshot().stored, { enabled: false, allowlistedSites: ["one.example"] });
  assert.deepEqual(app.snapshot().enabledRulesets, []);
  assert.deepEqual(app.snapshot().dynamic, []);
});

test("a rejected storage mutation does not poison later queued operations", { timeout: 2000 }, async () => {
  const app = setup();
  app.rejectNextWrite();
  const [failed, next] = await Promise.all([
    app.send({ type: "SET_SITE_ALLOWED", site: "failed.example", allowed: true }),
    app.send({ type: "SET_SITE_ALLOWED", site: "next.example", allowed: true })
  ]);
  assert.equal(failed.ok, false);
  assert.match(failed.error, /Injected storage write failure/);
  assert.equal(next.ok, true);
  assert.deepEqual(app.snapshot().stored.allowlistedSites, ["next.example"]);
  assert.deepEqual(app.snapshot().dynamic.map((rule) => rule.condition.requestDomains[0]), ["next.example"]);
});

test("status repair cannot overwrite a concurrently requested state mutation", { timeout: 2000 }, async () => {
  const app = setup({ enabled: "invalid", allowlistedSites: ["Example.COM", "bad domain"] });
  const pause = app.pauseNextRead();
  const status = app.send({ type: "GET_STATUS" });
  await pause.started;
  const change = app.send({ type: "SET_ENABLED", enabled: false });
  pause.release();
  const results = await Promise.all([status, change]);
  assert.ok(results.every((result) => result.ok));
  assert.deepEqual(app.snapshot().stored, { enabled: false, allowlistedSites: ["example.com"] });
  assert.deepEqual(app.snapshot().enabledRulesets, []);
});

test("storage events and install/startup reconciliation complete without deadlock or rule churn", { timeout: 2000 }, async () => {
  const app = setup({}, { emitStorageEvents: true });
  await app.install();
  assert.equal((await app.send({ type: "SET_SITE_ALLOWED", site: "one.example", allowed: true })).ok, true);
  // A status request acts as a barrier behind synchronous storage-event work.
  await app.send({ type: "GET_STATUS" });
  await app.startup();
  assert.equal(app.snapshot().dynamicUpdateCount, 1);
  assert.equal(app.snapshot().staticUpdateCount, 0);
  assert.deepEqual(app.snapshot().dynamic.map((rule) => rule.condition.requestDomains[0]), ["one.example"]);
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


test("failed dynamic-rule addition rolls preferences back and allows a later retry", async () => {
  const app = setup();
  app.rejectNextDnrUpdate("dynamic");
  const failed = await app.send({ type: "SET_SITE_ALLOWED", site: "recover.example", allowed: true });
  assert.equal(failed.ok, false);
  assert.match(failed.error, /previous settings restored/);
  assert.deepEqual(app.snapshot().stored, { enabled: true, allowlistedSites: [] });
  assert.deepEqual(app.snapshot().dynamic, []);

  const retried = await app.send({ type: "SET_SITE_ALLOWED", site: "recover.example", allowed: true });
  assert.equal(retried.ok, true);
  assert.deepEqual(app.snapshot().stored.allowlistedSites, ["recover.example"]);
  assert.deepEqual(app.snapshot().dynamic.map((rule) => rule.condition.requestDomains[0]), ["recover.example"]);
});

test("failed static ruleset toggle restores enabled setting without disabling protection", async () => {
  const app = setup();
  app.rejectNextDnrUpdate("static");
  const failed = await app.send({ type: "SET_ENABLED", enabled: false });
  assert.equal(failed.ok, false);
  assert.match(failed.error, /previous settings restored/);
  assert.deepEqual(app.snapshot().stored, { enabled: true, allowlistedSites: [] });
  assert.deepEqual(app.snapshot().enabledRulesets, ["starter_rules"]);
  assert.equal((await app.send({ type: "SET_ENABLED", enabled: false })).ok, true);
  assert.deepEqual(app.snapshot().enabledRulesets, []);
});

test("failed dynamic update after static pause restores both browser rule states", async () => {
  const app = setup();
  assert.equal((await app.send({ type: "SET_SITE_ALLOWED", site: "trusted.example", allowed: true })).ok, true);
  app.rejectNextDnrUpdate("dynamic");
  const failed = await app.send({ type: "SET_ENABLED", enabled: false });
  assert.equal(failed.ok, false);
  assert.match(failed.error, /previous settings restored/);
  assert.equal(app.snapshot().stored.enabled, true);
  assert.deepEqual(app.snapshot().enabledRulesets, ["starter_rules"]);
  assert.deepEqual(app.snapshot().dynamic.map((rule) => rule.condition.requestDomains[0]), ["trusted.example"]);
});

test("failed reset restores the previous allowlist and preserves installed exceptions", async () => {
  const app = setup();
  assert.equal((await app.send({ type: "SET_SITE_ALLOWED", site: "trusted.example", allowed: true })).ok, true);
  app.rejectNextDnrUpdate("dynamic");
  const failed = await app.send({ type: "RESET_SETTINGS" });
  assert.equal(failed.ok, false);
  assert.match(failed.error, /previous settings restored/);
  assert.deepEqual(app.snapshot().stored, { enabled: true, allowlistedSites: ["trusted.example"] });
  assert.deepEqual(app.snapshot().dynamic.map((rule) => rule.condition.requestDomains[0]), ["trusted.example"]);
});
