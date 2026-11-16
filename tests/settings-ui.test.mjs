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

async function setup(page) {
  const elements = new Map();
  const get = (id) => {
    if (!elements.has(id)) elements.set(id, element());
    return elements.get(id);
  };
  const submit = element();
  get("add-form").querySelector = () => submit;
  get("sites").querySelectorAll = () => get("sites").children.flatMap((item) => item.children.slice(1));
  const saved = { enabled: true, allowlistedSites: [] };
  let onStorageChanged;
  let resolveWrite;
  let rejectWrite;
  const writes = [];
  const chrome = {
    storage: {
      onChanged: { addListener(listener) { onStorageChanged = listener; } }
    },
    runtime: {
      async sendMessage(message) {
        if (message.type === "GET_STATUS") return { ok: true, state: { ...saved } };
        writes.push(message);
        return new Promise((resolve, reject) => {
          resolveWrite = () => {
            saved.enabled = message.enabled;
            resolve({ ok: true, state: { ...saved } });
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
    document: { getElementById: get, createElement: element }
  });
  vm.runInContext(read("shared/domain.js"), sandbox);
  vm.runInContext(read(page + "/" + page + ".js"), sandbox);
  await tick();
  return {
    get, submit, writes,
    succeed: () => resolveWrite(),
    fail: () => rejectWrite(),
    async externalChange(values, area = "local") {
      if (area === "local") Object.assign(saved, values);
      const changes = Object.fromEntries(Object.entries(values).map(([key, newValue]) => [key, { newValue }]));
      onStorageChanged(changes, area);
      await tick();
    }
  };
}

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

for (const page of ["options", "popup"]) {
  test(page + " updates its controls when another extension view changes settings", async () => {
    const app = await setup(page);
    assert.equal(app.get("enabled").checked, true);
    await app.externalChange({ enabled: false, allowlistedSites: ["publisher.test"] });
    assert.equal(app.get("enabled").checked, false, "External pause must update the open view");
    if (page === "options") {
      assert.deepEqual(app.get("sites").children.map((item) => item.children[0].textContent), ["publisher.test"]);
    } else {
      assert.equal(app.get("site-enabled").checked, false, "Externally trusted site must update the popup");
    }
    await app.externalChange({ enabled: true, allowlistedSites: [] });
    assert.equal(app.get("enabled").checked, true, "External resume must update the open view");
    if (page === "popup") assert.equal(app.get("site-enabled").checked, true);
  });

  test(page + " does not overwrite an in-flight user click with an external update", async () => {
    const app = await setup(page);
    const toggle = app.get("enabled");
    toggle.checked = false;
    toggle.listeners.change();
    await app.externalChange({ enabled: true, allowlistedSites: ["publisher.test"] });
    assert.equal(toggle.checked, false, "Pending click must remain visible");
    assert.equal(toggle.disabled, true);
    app.succeed();
    await tick();
    await tick();
    assert.equal(toggle.checked, false);
    assert.equal(toggle.disabled, false);
    if (page === "options") {
      assert.deepEqual(app.get("sites").children.map((item) => item.children[0].textContent), ["publisher.test"]);
    } else {
      assert.equal(app.get("site-enabled").checked, false);
    }
  });

  test(page + " ignores changes from unrelated storage areas", async () => {
    const app = await setup(page);
    await app.externalChange({ enabled: false }, "sync");
    assert.equal(app.get("enabled").checked, true);
    await app.externalChange({ unrelated: 42 });
    assert.equal(app.get("enabled").checked, true);
  });
}
