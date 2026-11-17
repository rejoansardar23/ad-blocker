import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const read = (name) => readFileSync(new URL("../../src/extension/" + name, import.meta.url), "utf8");
const tick = () => new Promise((resolve) => setImmediate(resolve));

function element() {
  return {
    checked: false, disabled: false, hidden: false, value: "", textContent: "",
    children: [], listeners: {}, classList: { toggle() {} },
    addEventListener(name, callback) { this.listeners[name] = callback; },
    setAttribute() {},
    replaceChildren() { this.children = []; },
    append(...children) { this.children.push(...children); },
    appendChild(child) { this.children.push(child); }
  };
}

async function setup(page, { initial = {}, confirmResult = true, deferInitial = false } = {}) {
  const elements = new Map();
  const get = (id) => {
    if (!elements.has(id)) elements.set(id, element());
    return elements.get(id);
  };
  const submit = element();
  get("add-form").querySelector = () => submit;
  get("sites").querySelectorAll = () => get("sites").children.flatMap((item) => item.children.slice(1));
  const saved = { enabled: true, allowlistedSites: [], ...initial };
  const snapshot = () => ({ ...saved, allowlistedSites: [...saved.allowlistedSites] });
  const storageListeners = [];
  const reads = [];
  let delayedReads = deferInitial ? 1 : 0;
  let confirmCount = 0;
  let resolveWrite;
  let rejectWrite;
  const writes = [];
  function notify(values, area = "local") {
    if (area === "local") Object.assign(saved, values);
    const changes = Object.fromEntries(Object.entries(values).map(([key, newValue]) => [key, { newValue }]));
    for (const listener of storageListeners) listener(changes, area);
  }
  const chrome = {
    storage: { onChanged: { addListener(listener) { storageListeners.push(listener); } } },
    runtime: {
      async sendMessage(message) {
        if (message.type === "GET_STATUS") {
          const record = { state: snapshot() };
          reads.push(record);
          if (delayedReads > 0) {
            delayedReads--;
            return new Promise((resolve, reject) => {
              record.resolve = () => resolve({ ok: true, state: record.state });
              record.reject = () => reject(new Error("Stale read failed"));
            });
          }
          return { ok: true, state: record.state };
        }
        writes.push(message);
        return new Promise((resolve, reject) => {
          resolveWrite = () => {
            if (message.type === "SET_ENABLED") saved.enabled = message.enabled;
            if (message.type === "SET_SITE_ALLOWED") {
              const sites = new Set(saved.allowlistedSites);
              if (message.allowed) sites.add(message.site); else sites.delete(message.site);
              saved.allowlistedSites = [...sites].sort();
            }
            if (message.type === "RESET_SETTINGS") {
              saved.enabled = true;
              saved.allowlistedSites = [];
            }
            notify(snapshot());
            resolve({ ok: true, state: snapshot() });
          };
          rejectWrite = () => reject(new Error("Storage unavailable"));
        });
      },
      openOptionsPage() {}
    },
    tabs: { async query() { return [{ id: 1, url: "https://publisher.test/" }]; } }
  };
  const sandbox = vm.createContext({
    chrome, URL,
    confirm() { confirmCount++; return confirmResult; },
    document: { getElementById: get, createElement: element }
  });
  vm.runInContext(read("shared/domain.js"), sandbox);
  vm.runInContext(read(page + "/" + page + ".js"), sandbox);
  await tick();
  return {
    get, submit, writes,
    succeed: () => resolveWrite(),
    fail: () => rejectWrite(),
    confirmCount: () => confirmCount,
    readCount: () => reads.length,
    holdReads: (count = 1) => { delayedReads += count; },
    resolveRead: (index) => reads[index].resolve(),
    rejectRead: (index) => reads[index].reject(),
    async externalChange(values, area = "local") { notify(values, area); await tick(); }
  };
}

// Adapted from the first-party PR #20 regression goals, with explicit
// deferred-read ordering, rejected refreshes, initialization and reset races.
for (const page of ["options", "popup"]) {
  const statusId = page === "options" ? "status" : "notice";
  const sitesIn = (app) => app.get("sites").children.map((item) => item.children[0].textContent);

  test(page + " reflects protection and trusted-site changes from another view", async () => {
    const app = await setup(page);
    await app.externalChange({ enabled: false, allowlistedSites: ["publisher.test"] });
    assert.equal(app.get("enabled").checked, false);
    if (page === "options") assert.deepEqual(sitesIn(app), ["publisher.test"]);
    else assert.equal(app.get("site-enabled").checked, false);
    await app.externalChange({ enabled: true, allowlistedSites: [] });
    assert.equal(app.get("enabled").checked, true);
    if (page === "options") assert.deepEqual(sitesIn(app), []);
    else assert.equal(app.get("site-enabled").checked, true);
  });

  test(page + " ignores unrelated storage keys and storage areas without extra reads", async () => {
    const app = await setup(page);
    const count = app.readCount();
    await app.externalChange({ enabled: false }, "sync");
    await app.externalChange({ unrelated: 42 });
    assert.equal(app.readCount(), count);
    assert.equal(app.get("enabled").checked, true);
  });

  test(page + " defers an external refresh until the pending save finishes", async () => {
    const app = await setup(page);
    const toggle = app.get("enabled");
    toggle.checked = false;
    toggle.listeners.change();
    const count = app.readCount();
    await app.externalChange({ enabled: true, allowlistedSites: ["publisher.test"] });
    assert.equal(toggle.checked, false);
    assert.equal(toggle.disabled, true);
    assert.equal(app.readCount(), count, "Do not issue reads during the user's save");
    app.succeed();
    await tick();
    assert.equal(toggle.checked, false);
    assert.equal(toggle.disabled, false);
    if (page === "options") assert.deepEqual(sitesIn(app), ["publisher.test"]);
    else assert.equal(app.get("site-enabled").checked, false);
    assert.match(app.get(statusId).textContent, /saved/i, "Background refresh must preserve the save result");
  });

  test(page + " refreshes external state after a rejected pending save", async () => {
    const app = await setup(page);
    const toggle = app.get("enabled");
    toggle.checked = false;
    toggle.listeners.change();
    await app.externalChange({ enabled: true, allowlistedSites: ["publisher.test"] });
    assert.equal(toggle.checked, false);
    app.fail();
    await tick();
    assert.equal(toggle.checked, true);
    assert.equal(toggle.disabled, false);
    if (page === "options") assert.deepEqual(sitesIn(app), ["publisher.test"]);
    else assert.equal(app.get("site-enabled").checked, false);
    assert.match(app.get(statusId).textContent, /Storage unavailable/);
  });

  test(page + " discards an older refresh that resolves after a newer refresh", async () => {
    const app = await setup(page);
    app.holdReads();
    const oldRead = app.readCount();
    await app.externalChange({ enabled: false });
    assert.equal(app.readCount(), oldRead + 1, "Related changes must request authoritative state");
    await app.externalChange({ enabled: true });
    app.resolveRead(oldRead);
    await tick();
    assert.equal(app.get("enabled").checked, true);
  });

  test(page + " discards an older refresh failure after a newer successful save", async () => {
    const app = await setup(page);
    app.holdReads();
    const oldRead = app.readCount();
    await app.externalChange({ allowlistedSites: ["publisher.test"] });
    assert.equal(app.readCount(), oldRead + 1);
    app.get("enabled").checked = false;
    app.get("enabled").listeners.change();
    app.succeed();
    await tick();
    app.rejectRead(oldRead);
    await tick();
    assert.equal(app.get("enabled").checked, false);
    assert.match(app.get(statusId).textContent, /saved/i);
    assert.doesNotMatch(app.get(statusId).textContent, /Stale read failed/);
  });

  test(page + " cannot overwrite a pending click with a previously started read", async () => {
    const app = await setup(page);
    app.holdReads();
    const oldRead = app.readCount();
    await app.externalChange({ allowlistedSites: ["publisher.test"] });
    assert.equal(app.readCount(), oldRead + 1);
    app.get("enabled").checked = false;
    app.get("enabled").listeners.change();
    app.resolveRead(oldRead);
    await tick();
    assert.equal(app.get("enabled").checked, false);
    assert.equal(app.get("enabled").disabled, true);
    app.succeed();
    await tick();
    assert.equal(app.get("enabled").checked, false);
  });

  test(page + " ignores a delayed initial state after a newer external refresh", async () => {
    const app = await setup(page, { deferInitial: true });
    await app.externalChange({ enabled: false });
    assert.equal(app.get("enabled").checked, false);
    app.resolveRead(0);
    await tick();
    assert.equal(app.get("enabled").checked, false);
    assert.equal(app.get("enabled").disabled, false);
  });

  test(page + " ignores an initial read failure after a newer external refresh", async () => {
    const app = await setup(page, { deferInitial: true });
    await app.externalChange({ enabled: false });
    app.rejectRead(0);
    await tick();
    assert.equal(app.get("enabled").checked, false);
    assert.equal(app.get("enabled").disabled, false);
    assert.doesNotMatch(app.get(statusId).textContent, /Stale read failed/);
    if (page === "popup") assert.equal(app.get("badge").textContent, "Paused");
  });
}

for (const succeeds of [true, false]) {
  test("options preserves live synchronization and recovery status after reset " + (succeeds ? "succeeds" : "fails"), async () => {
    const app = await setup("options", { initial: { enabled: false, allowlistedSites: ["old.test"] } });
    app.get("reset").listeners.click();
    await app.externalChange({ allowlistedSites: ["new.test"] });
    assert.equal(app.get("reset").disabled, true);
    assert.equal(app.get("sites").children[0].children[0].textContent, "old.test");
    if (succeeds) app.succeed(); else app.fail();
    await tick();
    assert.equal(app.get("reset").disabled, false);
    assert.equal(app.get("enabled").checked, succeeds);
    assert.deepEqual(app.get("sites").children.map((item) => item.children[0].textContent), succeeds ? [] : ["new.test"]);
    assert.match(app.get("status").textContent, succeeds ? /Default settings restored/ : /Storage unavailable/);
  });
}

test("options restores defaults after confirmation", async () => {
  const app = await setup("options", {
    initial: { enabled: false, allowlistedSites: ["publisher.test"] }
  });
  assert.equal(app.get("enabled").checked, false);
  assert.equal(app.get("sites").children.length, 1);

  app.get("reset").listeners.click();
  assert.equal(app.confirmCount(), 1);
  assert.deepEqual(JSON.parse(JSON.stringify(app.writes)), [{ type: "RESET_SETTINGS" }]);
  assert.equal(app.get("reset").disabled, true);
  app.succeed();
  await tick();

  assert.equal(app.get("enabled").checked, true);
  assert.equal(app.get("sites").children.length, 0);
  assert.equal(app.get("reset").disabled, false);
  assert.match(app.get("status").textContent, /Default settings restored/);
});

test("options leaves settings unchanged when recovery is cancelled", async () => {
  const app = await setup("options", { confirmResult: false });
  app.get("reset").listeners.click();
  assert.equal(app.confirmCount(), 1);
  assert.deepEqual(app.writes, []);
});

for (const page of ["options", "popup"]) {
  test(page + " keeps the selected checkbox state and disables input while a save is pending", async () => {
    const app = await setup(page);
    const toggle = app.get("enabled");
    assert.equal(toggle.checked, true);
    toggle.checked = false;
    toggle.listeners.change();
    assert.equal(toggle.checked, false, "Do not restore old saved state inside the change event");
    assert.equal(toggle.disabled, true, "Prevent another click from being silently dropped");
    if (page === "options") {
      assert.equal(app.get("site").disabled, true);
      assert.equal(app.submit.disabled, true);
    } else {
      assert.equal(app.get("site-enabled").disabled, true);
    }
    app.succeed();
    await tick();
    assert.equal(toggle.checked, false);
    assert.equal(toggle.disabled, false);
    assert.equal(app.writes.length, 1);
  });

  test(page + " restores saved state and re-enables inputs after a failed save", async () => {
    const app = await setup(page);
    const toggle = app.get("enabled");
    toggle.checked = false;
    toggle.listeners.change();
    app.fail();
    await tick();
    assert.equal(toggle.checked, true);
    assert.equal(toggle.disabled, false);
    assert.match(app.get(page === "options" ? "status" : "notice").textContent, /Storage unavailable/);
  });
}
