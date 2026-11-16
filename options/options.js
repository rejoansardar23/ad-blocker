(function () {
  "use strict";
  const enabled = document.getElementById("enabled");
  const list = document.getElementById("sites");
  const empty = document.getElementById("empty");
  const form = document.getElementById("add-form");
  const siteInput = document.getElementById("site");
  const status = document.getElementById("status");
  let state = null;
  let busy = false;
  let refreshEpoch = 0;
  let refreshQueued = false;

  async function send(message) {
    const response = await chrome.runtime.sendMessage(message);
    if (!response || !response.ok) throw new Error(response?.error || "Could not contact extension.");
    return response.state;
  }

  function show(text, error = false) {
    status.textContent = text;
    status.classList.toggle("error", error);
  }

  function render() {
    if (!state) return;
    enabled.checked = state.enabled;
    enabled.disabled = busy;
    siteInput.disabled = busy;
    form.querySelector("button").disabled = busy;
    list.replaceChildren();
    empty.hidden = state.allowlistedSites.length > 0;
    for (const site of state.allowlistedSites) {
      const item = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = site;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Remove";
      button.disabled = busy;
      button.setAttribute("aria-label", "Remove " + site);
      button.addEventListener("click", () => change({ type: "SET_SITE_ALLOWED", site, allowed: false }));
      item.append(label, button);
      list.appendChild(item);
    }
  }

  // Keep open settings windows in sync, without overwriting an unsaved click.
  // Epochs discard responses that were started before a newer write/refresh.
  function refreshState(initial = false) {
    if (busy) {
      refreshQueued = true;
      return;
    }
    const epoch = ++refreshEpoch;
    send({ type: "GET_STATUS" })
      .then((saved) => {
        if (busy) {
          refreshQueued = true;
          return;
        }
        if (epoch !== refreshEpoch) return;
        state = saved;
        render();
        if (initial) show("Settings loaded.");
      })
      .catch((error) => {
        if (epoch === refreshEpoch) show("Could not refresh settings: " + error.message, true);
      });
  }

  async function change(message) {
    if (busy) return;
    ++refreshEpoch;
    busy = true;
    // Do not redraw the old saved checkbox state inside its change event:
    // restoring it synchronously makes a real user click appear to revert.
    enabled.disabled = true;
    siteInput.disabled = true;
    form.querySelector("button").disabled = true;
    for (const button of list.querySelectorAll("button")) button.disabled = true;
    show("Saving…");
    try {
      state = await send(message);
      siteInput.value = "";
      show("Saved. Reload affected tabs to apply website exceptions.");
    } catch (error) {
      show(error.message, true);
      try { state = await send({ type: "GET_STATUS" }); } catch {}
    } finally {
      busy = false;
      render();
      if (refreshQueued) {
        refreshQueued = false;
        refreshState();
      }
    }
  }

  enabled.addEventListener("change", () => change({
    type: "SET_ENABLED", enabled: enabled.checked
  }));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const site = globalThis.AdBlockerDomain.normalizeSite(siteInput.value);
    if (!site) {
      show("Enter a valid http(s) hostname, such as example.com.", true);
      return;
    }
    change({ type: "SET_SITE_ALLOWED", site, allowed: true });
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && ("enabled" in changes || "allowlistedSites" in changes)) {
      refreshState();
    }
  });

  refreshState(true);
})();
