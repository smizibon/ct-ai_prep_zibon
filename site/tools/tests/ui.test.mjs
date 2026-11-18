#!/usr/bin/env node
/* ui.test.mjs — Gate C driver: loads the site in headless Chrome (raw CDP, zero deps),
 * opens #/selftest, and reads the JSON report the in-page suite renders.
 * Usage: node tools/tests/ui.test.mjs [baseUrl]     (default http://127.0.0.1:8765)
 * Exit code 0 = all tests passed. */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.argv[2] || "http://127.0.0.1:8765";
const TARGET = BASE.replace(/\/$/, "") + "/index.html#/selftest";
const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];
import { accessSync } from "node:fs";
const CHROME = CHROME_CANDIDATES.find((p) => { try { accessSync(p); return true; } catch { return false; } });
if (!CHROME) { console.error("No Chrome/Chromium/Edge/Brave found for headless UI tests."); process.exit(2); }

const PORT = 9300 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "ctai-ui-test-"));
const proc = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  "--window-size=1280,900", "about:blank",
], { stdio: ["ignore", "pipe", "pipe"] });
const cleanup = () => { try { proc.kill("SIGKILL"); } catch {} };
process.on("exit", cleanup); process.on("SIGINT", () => { cleanup(); process.exit(130); });

/* --- tiny CDP client over global WebSocket --- */
let ws, msgId = 0; const pending = new Map(); const events = [];
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function connect() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === "page");
      if (page) {
        ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((ok, bad) => { ws.onopen = ok; ws.onerror = bad; });
        ws.onmessage = (m) => {
          const d = JSON.parse(m.data);
          if (d.id && pending.has(d.id)) {
            const p = pending.get(d.id); pending.delete(d.id);
            d.error ? p.reject(new Error(d.error.message)) : p.resolve(d.result);
          } else if (d.method) events.push(d);
          while (events.length > 200) events.shift();
        };
        return;
      }
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome DevTools endpoint never came up");
}
const waitEvent = (method, timeoutMs = 30000) => Promise.race([
  new Promise((ok) => {
    const check = () => { if (events.some((e) => e.method === method)) { ok(); return true; } };
    if (!check()) { const t = setInterval(() => { if (check()) clearInterval(t); }, 100); }
  }),
  sleep(timeoutMs).then(() => { throw new Error("timeout waiting for " + method); }),
]);

async function evalJSON(expression) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error("page eval failed: " + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result.value;
}

/* --- run --- */
let report = null;
try {
  await connect();
  await send("Page.enable");
  await send("Page.navigate", { url: TARGET });
  await waitEvent("Page.loadEventFired", 20000);
  console.log(`ui.test: loaded ${TARGET}; waiting for in-page suite…`);
  for (let i = 0; i < 90; i++) {           /* up to 45s */
    await sleep(500);
    report = await evalJSON(`(function(){var el=document.querySelector('[data-testid="test-report"]');return el?el.getAttribute('data-json'):null;})()`);
    if (report) break;
  }
  if (!report) { console.error("ui.test: no test-report rendered (suite crashed?)"); process.exit(1); }
  const parsed = JSON.parse(report);
  for (const r of parsed.results) {
    console.log(`${r.ok ? "ok  " : "FAIL"}  ${r.name}${r.err ? "\n      " + String(r.err.message || r.err).split("\n")[0] : ""}`);
  }
  console.log(`\nui.test: ${parsed.passed}/${parsed.total} passed, ${parsed.failed} failed`);
  process.exit(parsed.failed ? 1 : 0);
} catch (e) {
  console.error("ui.test: driver error —", e.message);
  process.exit(1);
}
