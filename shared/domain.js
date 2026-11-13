/* Global helper used by the MV3 worker, isolated content scripts and extension pages.
 * No network access and no external dependencies.
 */
(function (root) {
  "use strict";

  function normalizeSite(input) {
    if (typeof input !== "string") return null;
    const trimmed = input.trim();
    if (!trimmed || /\s|\*/.test(trimmed)) return null;

    let url;
    try {
      url = new URL(/^[a-z]+:\/\//i.test(trimmed) ? trimmed : "https://" + trimmed);
    } catch {
      return null;
    }

    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    // Restrict exceptions to ordinary DNS hostnames; IP literals and internal
    // browser pages are deliberately not supported in the first release.
    if (host.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(host)) return null;
    return host;
  }

  function isAllowlisted(host, sites) {
    if (typeof host !== "string" || !Array.isArray(sites)) return false;
    const name = host.toLowerCase().replace(/\.$/, "");
    return sites.some((site) => name === site || name.endsWith("." + site));
  }

  root.AdBlockerDomain = Object.freeze({ normalizeSite, isAllowlisted });
})(globalThis);
