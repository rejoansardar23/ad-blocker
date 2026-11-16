import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const read = (name) => readFileSync(new URL("../" + name, import.meta.url), "utf8");
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

async function setup(page, { initial = {}, confirmResult = true } = {}) {
  const elements = new Map();
  const get = (id) => {
    if (!elements.has(id)) elements.set(id, element());
    return elements.get(id);
  };
  const submit = element();
  get("add-form").querySelector = () => submit;
  get("sites").querySelectorAll = () => get("sites").children.flatMap((item) => item.children.slice(1));
  const saved = { enabled: true, allowlistedSites: [], ...initial };
  let confirmCount = 0;
  let resolveWrite;
  let rejectWrite;
  const writes = [];
  const chrome = {
    runtime: {
      async sendMessage(message) {
        if (message.type === "GET_STATUS") return { ok: true, state: { ...saved } };
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
            resolve({ ok: true, state: { ...saved, allowlistedSites: [...saved.allowlistedSites] } });
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
    confirmCount: () => confirmCount
  };
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
