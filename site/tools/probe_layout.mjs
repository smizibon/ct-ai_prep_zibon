#!/usr/bin/env node
/* probe_layout.mjs — layout + testid audit probe (raw CDP, zero deps).
 * Loads the site headless, per route:
 *   - measures shell geometry (topbar/content paddings, page height vs viewport)
 *   - counts interactive elements (button/a/input/select/label[for]) missing data-testid
 *   - captures a viewport JPEG (and a full-page JPEG for the dashboard)
 * Usage: node tools/probe_layout.mjs [baseUrl]     (default http://127.0.0.1:8765)
 * Writes shots to tools/shots/, prints a compact JSON report. */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = (process.argv[2] || "http://127.0.0.1:8765").replace(/\/$/, "");
const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(HERE, "shots");
mkdirSync(SHOTS, { recursive: true });

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];
import { accessSync } from "node:fs";
const CHROME = CHROME_CANDIDATES.find((p) => { try { accessSync(p); return true; } catch { return false; } });
if (!CHROME) { console.error("No Chrome found."); process.exit(2); }

const PORT = 9700 + Math.floor(Math.random() * 200);
const profile = mkdtempSync(join(tmpdir(), "ctai-probe-"));
const proc = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  "--window-size=1440,900", "about:blank",
], { stdio: ["ignore", "pipe", "pipe"] });
const cleanup = () => { try { proc.kill("SIGKILL"); } catch {} };
process.on("exit", cleanup); process.on("SIGINT", () => { cleanup(); process.exit(130); });

let ws, msgId = 0; const pending = new Map();
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
          }
        };
        return;
      }
    } catch {}
    await sleep(250);
  }
  throw new Error("DevTools endpoint never came up");
}
async function evalJSON(expression) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error("page eval failed: " + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result.value;
}

const MEASURE = `(() => {
  const px = (el, p) => parseFloat(getComputedStyle(el)[p]);
  const rect = (sel) => { const el = document.querySelector(sel); if (!el) return null;
    const r = el.getBoundingClientRect(); return { top: +r.top.toFixed(1), h: +r.height.toFixed(1) }; };
  const content = document.querySelector(".content");
  const page = content && content.querySelector(":scope > .page");
  const first = page && page.firstElementChild;
  return {
    bodyMarginTop: px(document.body, "marginTop"),
    topbar: rect(".topbar"),
    contentPadTop: content ? px(content, "paddingTop") : null,
    contentPadBottom: content ? px(content, "paddingBottom") : null,
    contentTop: content ? +content.getBoundingClientRect().top.toFixed(1) : null,
    pageFirstChild: first ? first.className.split(" ").slice(0,2).join(".") : null,
    pageFirstChildTop: first ? +first.getBoundingClientRect().top.toFixed(1) : null,
    firstChildPadTop: first ? px(first, "paddingTop") : null,
    docHeight: document.documentElement.scrollHeight,
    viewportH: innerHeight,
    viewportW: innerWidth,
    overflowPages: +(document.documentElement.scrollHeight / innerHeight).toFixed(2)
  };
})()`;

const TESTID_AUDIT = `(() => {
  const sels = "button, a, input, select, textarea, [role=button], [role=switch], [role=tab], [role=radio], label[for]";
  const missing = [];
  document.querySelectorAll("#content " + sels).forEach((el) => {
    if (el.closest("[data-testid-ignore]")) return;
    if (!el.getAttribute("data-testid")) {
      const name = (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40);
      missing.push(el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : "") + ' "' + name + '"');
    }
  });
  return { missingCount: missing.length, missing: missing.slice(0, 40) };
})()`;

const ROUTES = [
  { name: "dashboard", hash: "#/" },
  { name: "study", hash: "#/study" },
  { name: "cheatsheets", hash: "#/cheatsheets" },
  { name: "videos", hash: "#/videos" },
  { name: "glossary", hash: "#/glossary" },
  { name: "examhub", hash: "#/exam" },
  { name: "intel", hash: "#/intel" },
];

async function shot(name, { fullPage = false } = {}) {
  const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 72, captureBeyondViewport: fullPage });
  const file = join(SHOTS, name + ".jpg");
  writeFileSync(file, Buffer.from(r.data, "base64"));
  return file;
}

const report = {};
try {
  await connect();
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  for (const rt of ROUTES) {
    await send("Page.navigate", { url: BASE + "/index.html" + rt.hash });
    await sleep(900);
    report[rt.name] = { geo: await evalJSON(MEASURE), testids: await evalJSON(TESTID_AUDIT) };
    await shot(rt.name + "-1440");
    if (rt.name === "dashboard") { await shot(rt.name + "-full", { fullPage: true }); }
  }

  /* dashboard at a small laptop viewport too */
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: BASE + "/index.html#/" });
  await sleep(900);
  report.dashboard_1280 = { geo: await evalJSON(MEASURE) };
  await shot("dashboard-1280");

  console.log(JSON.stringify(report, null, 1));
  process.exit(0);
} catch (e) {
  console.error("probe error:", e.message);
  process.exit(1);
}
