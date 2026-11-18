# SPEC — CT-AI Studio (study + mock-exam site for ISTQB CT-AI v2.0)

**Status: BINDING.** This document resolves the interfaces between the three design docs and the two
research docs. Where this SPEC and a design doc disagree, this SPEC wins. Where this SPEC is silent,
the design doc wins. Normative inputs:

- D1 content architecture: `/tmp/site/design-D1-content.md`
- D2 exam engine: `/tmp/site/design-D2-engine.md`
- D3 UI/UX system: `/tmp/site/design-D3-uiux.md` (1,183 lines — tokens/components/pages are final values)
- R1 advice research: `/tmp/site/research-advice.md`
- R2 patterns research: `/tmp/site/research-patterns.md`
- Exam data records (byte-exact): `/tmp/qbank/records/{Q1..Q40,A1..A6}.json`, `/tmp/qbank/merged.json`, `/tmp/qbank/derived.json`
- Syllabus source of truth: `/Users/zibon-mac/Desktop/Certifications/CT-AI/markdown/ISTQB_CT-AI_Syllabus_v2.0.md`
- Figures: `/Users/zibon-mac/Desktop/Certifications/CT-AI/markdown/figures/*.png`

## 0. Product scope

Static, offline, no-CDN single-page app at `/Users/zibon-mac/Desktop/Certifications/CT-AI/site/`:
1. **Study by chapter** — verbatim syllabus content per LO + progress tracking.
2. **Cheatsheets** — one condensed sheet per chapter (synthesized, src-cited, no-new-claims).
3. **Glossary** — 118 AI-specific terms + 31 abbreviations, searchable.
4. **Mock exam** — ISTQB Sample Exam set A v2.2 "as it is": Full Simulation (40 Q, 60 min, pass 29/44), Learning mode, Appendix A1–A6 (interactive new-type widgets), Quick Quiz.
5. **Exam intelligence** — past-examinee advice cards + exam-pattern analysis, every item source-labeled.
Brand: **CT-AI Studio**. Two registers (calm study / cockpit exam) per D3 §1.1.

## 1. Resolved interface decisions (conflicts between designs)

| # | Topic | D1 said | D2 said | D3 said | **DECISION** |
|---|---|---|---|---|---|
| 1 | localStorage family | `ctai-progress-v1` | `ctai.session.v1` etc. (dot style) | `ctai.progress.v1` (dot style) | **Dot style everywhere**: `ctai.progress.v1`, `ctai.session.v1`, `ctai.attempts.v1`, `ctai.qstats.v1`, `ctai.settings.v1` |
| 2 | Progress keying | by LO id (`AI-2.1.1`) | — | by subsection id (`3.1.2`) | **Subsection id** — universal across all 51 units (the 8 HO units have no AI- id). Shape: `{ "3.1.2": { understood: true, ts: 169… } }`. Coverage.js already maps LO↔subsection. |
| 3 | Figure asset dir | `assets/figures/` | `assets/fig/` | `assets/fig/` | **`site/assets/fig/`** (both). D1's whitelisted rewrite becomes `figures/ → assets/fig/`. |
| 4 | Total points in coverage | 49 (**WRONG**) | 50 | — | **50 points** (chapter points 9/3/11/8/7/10/2 = 50; verified by summing /tmp/qbank/records). D1 §5's "46Q/49pts" is an arithmetic slip — build must assert 50. |
| 5 | settings schema | — | `{extendedTime, shuffleDefault, reduceMotion}` | adds `theme`, `celebratedPass` | **`{ theme: "auto"\|"light"\|"dark", extendedTime: false, shuffleDefault: false, reduceMotion: "auto"\|"on"\|"off", celebratedPass: false }`** |
| 6 | Data globals | `CTAI_DATA` | `CTAI_QUESTIONS` | consumes both | Keep both, **add `CTAI_INTEL`** (§3 of this SPEC). Declared in load order: chapters → glossary → coverage → questions → intel. |
| 7 | Markdown rendering | runtime renderer (`js/md.js`) | pre-rendered html fields | — | **Runtime renderer only** (D1 §1.3 construct inventory); questions.js ships `*_md` fields and renders through the same `md()`. No duplicated `*_html` fields. |
| 8 | Exam thresholds | — | ceil(0.65 × max): 29/44, 33/50, 4/6 | shows 29/44 | Confirmed; **always computed from totalPoints**, never hard-coded (D2 §3.2). |
| 9 | Appendix figure grading | — | A4 graded against question's own examples + derivation note | — | Confirmed per D2 §2.5 (recorded quirk, note shown verbatim in review). |
| 10 | Site root files | `study.html` mentioned once | `index.html` | `index.html` | **Single `index.html`** entry; all views are hash routes (D3 §5.1). |

## 2. File layout (normative)

```
site/
  index.html              # shell, SVG sprite, inline theme bootstrap, all <script> tags
  styles/                 # D3 §8.1: tokens, base, shell, nav, cards, chips, progress,
                          # exam, widgets, feedback, charts, search, pages, print
  js/
    md.js                 # tiny markdown renderer (D1 §1.3) + selftest mode
    router.js  store.js   # hash router (D3 §5), localStorage wrapper + settings
    ui.js                 # component factory (el(), chip(), ring(), toast(), modal()…)
    views/                # one module per route: dashboard, study, cheatsheet, glossary,
                          # examhub, runner, results, review, intel, search, notfound
    engine.js             # exam session state machine + scoring (D2 §3–4), pure functions
    widgets.js            # A1 assign / A4 pair / A5 order (D2 §2.4–2.6, D3 §3.20–3.22)
    keys.js  search.js
  data/
    chapter-1.js … chapter-7.js    # CTAI_DATA.chapters[n] = study tree + cheatsheet
    glossary.js coverage.js        # CTAI_DATA.glossary / .coverage
    questions.js                   # CTAI_QUESTIONS (D2 §5.1–5.2 schema)
    intel.js                       # CTAI_INTEL (§3 below)
  assets/fig/             # 8 exam PNGs + 3 syllabus PNGs (copied from markdown/figures/)
  tools/
    build_chapters.py     # syllabus+merged.json → chapter-*.js, coverage.js, glossary.js
    build_questions.py    # qbank records → questions.js (+ copies assets)
    build_intel.py        # R1/R2 markdown → intel.js (restructuring only, mechanical)
    cheatsheets/N.js      # hand-curated cheatsheet sources, merged at emit time
    verify_content.py     # Gate A (§5)
    tests/engine.test.mjs # Gate B unit tests (node)
```

## 3. intel.js contract (new — from R1 + R2)

```js
CTAI_INTEL = {
  compiled: "2026-11-17",
  advice: {
    gapNote: "<R1 §4 v2.0-experience-gap statement, verbatim-ish>",
    items: [{ id: "A1".."A18", group: "logistics|experiences|community|ecosystem",
              title, text, url, host, sourceType: "official|provider|reddit|forum|blog|github",
              date, version: "v1.0|v2.0|both|sibling", applicability, confidence }],
    synthesis: [{ rank, text, itemIds }],      // R1 §2, 8 items
    conflicts: [{ topic, text, itemIds }]      // R1 §3, 6 items
  },
  patterns: {
    official: [{ id, title, text, url }],      // R2 §1, CONFIRMED-OFFICIAL only
    community: [{ id, title, text, url, date, version, note }],  // R2 §2
    thirdPartyErrors: [{ source, error, correct }],               // R2 §2 error list
    delta: { rows: [[dimension, v1, v2]], addedTopics: [] },      // R2 §3 table
    implications: [{ n, text, derivedFrom }]                      // R2 §4, 10 items
  },
  sources: [{ url, label, type }]              // union of R1 §5 + R2 §5
}
```
Build rule: `build_intel.py` restructures the two markdown docs **mechanically** — no new claims,
no rewording beyond trimming headers; every item keeps its URL/date/label. Items with unverifiable
provenance (R1's excluded geeltel.us) stay excluded.

## 4. Phased plan with gates

**Phase A — data build.**
A1 `build_chapters.py` + `build_questions.py` + `build_intel.py` (mechanical, written against D1/D2
schemas, amendments above). A2 cheatsheets: 7 agents (one per chapter) write `tools/cheatsheets/N.js`
per D1 §2 (worked Chapter 2 example = quality bar; mandatory blocks; src on every item; ≤25% word cap).
**Gate A (`verify_content.py`, exit≠0 fails):** 51 subsection slices byte-equal to syllabus (modulo
figure-path rewrite); LO multiset equals syllabus bullets; 43 examinable; coverage totals 46 Q / **50 pts**
and per-chapter 9/3/10/7/6/9/2 Q; questions.js = 46 objects, correct_keys ⊆ option keys, |keys|=2 for
Q2/Q39, interaction structs only for A1/A4/A5, points 44+6=50, all figure files exist, derived bullets
land on their 6 questions; glossary 118 terms/31 abbrs, no leaked `Synonym:`/`(ISO` fragments; intel
items all carry url+label; cheatsheet src-ranges exist, digit-traceability, word-cap; md.js golden test.
Plus an independent **fact-check agent** spot-verifies 10 cheatsheet claims/chapter against the syllabus.

**Phase B — app build.** Core first (index.html, tokens/base CSS, router, store, md.js, ui.js, engine,
runner, widgets), then views (dashboard, study, cheatsheet, glossary, examhub, results, review, intel,
search). Per D3 exact values. **Gate B:** `node tools/tests/engine.test.mjs` — scoring (single/multi/
assign/pair/order, unanswered, K3 2pts), threshold math (29@44, 33@50, 4@6, ceil rule), session state
transitions, timer-drift clamp, shuffle determinism; `node --check` every js file; md.js selftest;
static scan: zero external URLs outside comments; every data global loads under `node:vm`.

**Phase C — live GUI verification (main agent, browser).** Serve via local http server; walk: dashboard →
study ch2 (+understood toggle, deep link) → cheatsheet ch2 → glossary search → exam hub → learning mode
(answer + rationale + derived markers) → appendix set (A1 assign / A4 pair / A5 order + reveals) →
simulation (start, answer subset, submit gate, results math vs hand-computed, review filters) → dark
mode → mobile viewport → reload-mid-session resume. Screenshot every screen; fix and re-verify.

**Phase D — audit + docs.** Fresh-eyes audit agent: engine params vs D2, data vs sources (spot), UI vs
D3 wireframes, a11y spot (contrast tokens, focus, aria), no-spoiler check (sim hides answers — no
correct-key leakage into DOM during sim). Update `markdown/README.md` (site registered), write
`site/README.md` (how to open). Final report.

## 5. Non-goals
Server-side anything, accounts, external fonts/CDNs, print-to-PDF generation beyond browser print,
v1.0 syllabus content, dump-site content (only labeled warnings about them).

## 6. AMENDMENTS after adversarial review (2026-11-17; review at /tmp/site/review-SPEC.md — all REQUIRED items verified by main agent before adoption; these override everything above and the design docs)

**A. Question stem/options separation (build_questions.py, binding).**
Records' `stem_markdown` embeds the lettered options list and the trailing select-instruction
(verified: Q1). The UI-facing object must separate them:
- `stem_md` = `stem_markdown` with (a) the trailing lettered-options list block removed and (b) the
  trailing select-instruction paragraph removed. Item-set lists (statement/example lists of
  Q6/Q7/Q10/Q11/Q17/Q30, A1–A6 tables) STAY inside `stem_md`; the `item_sets` record field is
  metadata only and is never rendered (anti-double-render).
- `options[]` and `select_instruction` render from their own fields.
- Appendix A1/A4/A5 (options null): `stem_md` = stem minus trailing select-instruction only.
- Gate A assertions: for every lettered question no option `text` appears in `stem_md`; `stem_md`
  does not end with a `*Select …*` line; every option text is a byte-substring of the record's
  `raw_question_markdown`.

**B. Timer warnings (resolves D2 §6 vs D3 §3.10):** D3 wins — warn `< 10:00` (amber + dot pulse),
critical `< 2:00` (red, faster pulse, pill bg), `aria-live` announcements at 10:00, 2:00 and 0:30.

**C. Number-key jumping (resolves D2 §7 vs D3 §3.9):** D3 wins — digits feed a jump buffer shown in
the palette header; `Enter` jumps, `Esc` clears. No Shift-decade scheme.

**D. Single session slot across modes:** starting any new session while `ctai.session.v1` is active
requires an explicit discard confirmation (modal shows current mode + answered count). Discard
deletes without archiving. Second-tab sim start remains hard-blocked. Pausable modes = practice,
appendix, quick (appendix added to D2's list). Quick-mode pacing timer expiry auto-submits like sim
(flagged `autoSubmitted`). Drift clamp pinned: at resume `delta = lastHeartbeatAt − now; if
delta > 60_000 → endsAt += delta − 60_000`; heartbeat written on every response/flag write and every
30 s tick.

**E. Cheatsheet caps (replaces D1 §2.1 sizing rule; D1's own ch2 exemplar was ~2× over the old cap):**
- Total rendered sheet words ≤ **50%** of chapter prose words (budgets: ch1 3130→1565, ch2 1651→825,
  ch3 4439→2219, ch4 3394→1697, ch5 2475→1237, ch6 3798→1899, ch7 786→393).
- Synthesized prose (mustKnow + traps item text) ≤ **25%** of chapter prose words.
- `meta` and `examPointers` blocks are auto-generated by the build (never hand-written) and exempt.
  `keyTerms` definitions are verbatim glossary/chapter copies and exempt from the synthesized cap
  (still counted in the 50% total).
- Cheatsheet hand-sources are `tools/cheatsheets/N.json` (pure JSON, not .js).

**F. Per-row join equality (Gate A addition):** every question join emitted into chapter files and
coverage.js (`{q, answer, lo, k, pts}`) must equal `merged.json`'s rows byte-for-byte. (Caught D1
worked-example errors: Q10 is `c` @ AI-3.1.1, Q11 `d` @ AI-3.1.2, Q25 `c` — D1 §1.4/§1.5 examples
were wrong; builds read merged.json, never the examples.)

**G. Intel timing card:** uses R2 implication #4 official arithmetic only (36×1 min + 4×3 min ≈ 48
of 60 min; ~12 min slack; deliberate 3-min slots for the four K3s; flag-and-return). The D3 §4.10
"90s per K2 question" card is withdrawn (self-contradictory).

**H. Phase C adds a `file://` smoke pass** (open index.html directly from disk; dashboard boots,
data loads, zero console errors) alongside the http walkthrough.

**I. Intel id scheme (avoids clash with appendix A1–A6):** advice items `AD1..ADn`, patterns
`PT1..`, third-party errors `OE1..`, implications `IMP1..`, delta rows by index.

**J. Misc errata:** `window.CTAI_DATA = {}` is declared inline in `index.html` before data scripts;
verbatim-equality definition = D1 §7.1 normalize rule (trailing-ws collapse + `figures/ → assets/fig/`
substitution on the source side); progress values are `{understood: true, ts}` (supersedes D3 §4.3's
bare boolean); LO parsing regex must accept two-digit third components (`AI-\d+\.\d+\.\d{1,2}` with
boundary) and Gate A asserts `AI-6.1.10` is present; `syllabus_p36_R236.png` is documented-excluded
(0 references in the syllabus markdown — Figure 4 uses R237) and is not copied to the site.

### Amendment K — scripted Gate C: test ids, in-page suite, headless driver (2026-11-18)
Manual browser walkthroughs are deprecated for regression purposes. Phase C verification is now
scripted and repeatable, per the user's direction ("UI elements needed test ids so that you can
programmatically click them"):

1. **Test-id contract.** Every interactive element carries a stable `data-testid` (full list in
   site/AGENTS.md "Content rules"). Duplicate testids are forbidden; parallel instances get prefixes
   (`pal-`/`spal-`, `jump-input`/`sheet-jump-input`). New UI work must extend, not break, this list.
2. **In-page suite.** `site/js/selftest.js` registers the `#/selftest` route and runs 16 scenarios
   through real DOM events (`el.click()`, dispatched `KeyboardEvent`s) — no browser-automation
   dependency, immune to synthetic-input flakiness. It backs up and restores all `ctai.*`
   localStorage keys, resets state, and renders a JSON report at
   `[data-testid="test-report"][data-json]`. Coverage: dashboard, theme persistence, study
   understood-toggle, glossary search, cheatsheets, exam hub, learning wrong/correct reveals
   (classes, icons, lock, vh words), flag+palette, multi_two max-2 + exact-match, practice finish →
   results math (2/50, threshold 33) + verdict grid + review filters + j/k, appendix A1/A4/A5 +
   reveals + 6/6, review widget overlays, full sim keyboard flow → 44/44 PASS + confetti flag,
   leave-guard cancel/abandon, sim resume (timer + answers + drift clamp), mobile palette sheet.
3. **Driver.** `site/tools/tests/ui.test.mjs` launches headless Chrome (Chrome/Brave/Edge/Chromium —
   first found) over raw CDP using Node 22's global WebSocket + fetch — zero npm dependencies, no
   Playwright. It opens `index.html#/selftest`, polls the report, prints per-test results, exits
   non-zero on failure. Accepts a base URL argument, so **Gate C runs identically against http://
   and file://** (the deployment constraint; file:// smoke is now automated).
4. **Bugs the suite exposed and killed** (all fixed, all would have shipped):
   `createElement("svg")` → HTMLUnknownElement (all rings/icons invisible; createElementNS + SVG
   table + setAttribute("class") fix); `el()` flat(1) crashed the glossary view on nested kid
   arrays (flat(Infinity)); results routes read s[2]/s[3] instead of s[1] ("Result not found"
   everywhere); runner's initial tickTimer() ran pre-attachment and self-cleared its interval (the
   exam timer never ticked); wrong `initial` shapes for assign/pair widgets (state lost on
   re-render); learning Check passed no `reviewMode` (no overlays); palette sheet built via
   cloneNode (inert on mobile).
5. **Gate C definition (supersedes §4 Phase C gate).** `node tools/tests/ui.test.mjs` → 16/16 on
   http://127.0.0.1:8765 AND `node tools/tests/ui.test.mjs "file://$(pwd)"` → 16/16. A visual
   screenshot pass (headless capture, vision-checked) accompanies releases: dashboard light/dark,
   learning reveal, A4 pairs, sim results.

### Amendment L (2026-11-18) — layout/density pass, full testid coverage, layout probe
User-reported UI bugs ("gap above the title bar on home", "whole page not visible at once",
"problems in margins") were reproduced with measurement, fixed, and locked behind new gates.

1. **Root causes fixed.**
   a. The `<svg hidden>` icon sprite rendered as a 300×150 inline box (the HTML `hidden` attribute
      does not apply to SVG elements) → a ~157px dead band above the topbar on every page. Fix:
      `svg[hidden] { display: none }` (base.css).
   b. The exam shell inherited `.content` padding → cockpit started 32px down with a background
      seam and a 100vh overflow. Fix: `.app[data-shell="exam"] .content { padding: 0 }` (shell.css).
   c. `setActiveNav` compared route paths (`/study`) against hrefs (`#/study`) → no nav item was
      ever `aria-current="page"` except on Dashboard. Dormant since Phase B; fixed in router.js.
   d. `.reading-progress`'s negative top margin was hard-coupled to `.content` padding. Both now
      derive from tokens.
2. **Layout tokens (tokens.css).** `--topbar-h: 48px`, `--content-pad-top: var(--sp-6)`,
   `--ch-card-min: 250px` are the single source for sticky offsets (topbar, study TOC,
   reading-progress), content padding (24px top / 48px bottom, was 32/96), and the chapter-grid
   column floor. Vertical rhythm unified: section gap sp-6, panel labels sp-6 0 sp-3,
   page-head sp-6. Card-grid density: chapter cards 4-across at 1080px content width (2 rows for
   7 chapters), padding sp-5, 64px "sm" rings (added to ui.js + progress.css), keyword chips
   capped at 3 (no "+N" on the dashboard), progress bars bottom-aligned via flex. Dashboard
   greeting t-display → t-h1 (in-app headings are not marketing-scale; Geist/Primer norms).
   Result: dashboard 2248→1823px at 1440×900 (2.5→2.03 viewports); study/cheatsheets/examhub
   fit one screen. All inline raw-px margins in views were moved onto --sp-* tokens.
3. **Testid coverage completed** (full contract in site/AGENTS.md): shell (brand-link, nav-{route},
   theme/kbd/reset/drawer buttons, drawer-scrim), dashboard CTAs/weak-chips/attempts, study cards/
   LO heads/question chips/TOC/prev-next, cheatsheet cards/tabs/q-links, glossary tabs/A–Z rail/
   clear/appears-in, examhub switches/weak chips/deep-link/attempts, results actions, review
   prev/next, search overlay, kbd modal, toasts, figure zoom. Content-generated external links
   carry `data-testid-ignore` (exempt from the contract by design).
4. **Gate C extended to 23 scenarios** (supersedes Amendment K item 5 counts): + layout shell
   flush (topbar y=0, content padding = token, dashboard < 2.7 viewports), + testid walk (every
   interactive element on 8 routes + shell chrome — the build fails if a control ships unanchored),
   + nav click/aria-current, + glossary tabs/A–Z, + examhub switches persist, + exam shell flush
   (padding 0, exam-bar y=0), + review prev/next buttons. **Gate C = 23/23 on http:// AND file://.**
5. **Layout probe.** `site/tools/probe_layout.mjs` (raw CDP, zero deps) measures per-route
   geometry (topbar offset, content paddings, docHeight/viewport), audits missing testids, and
   captures JPEG screenshots to `tools/shots/` — the token-efficient visual check: numbers in
   stdout, images read only when needed.
