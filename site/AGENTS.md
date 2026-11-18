# site/AGENTS.md — context for new sessions (CT-AI Studio)

Read this instead of re-deriving the project. Project root: `/Users/zibon-mac/Desktop/Certifications/CT-AI`.
Parent rules live in `../AGENTS.md` (markdown/ is source of truth; multi-agent fan-out within limits).
Last updated: 2026-11-18 (layout/density pass + full testid coverage; Gate C now 24/24).

## What this is
A fully offline static study + mock-exam site for ISTQB CT-AI v2.0, built from the verified markdown
sources in `../markdown/`. Vanilla HTML/CSS/JS, zero CDNs, works from `file://` and any static server.
All content is machine-verified against the sources (verbatim syllabus slices, byte-exact exam text).

## Status (phase plan from docs/plans/SPEC.md §4)
- ✅ Wave 1 designs + research: 3 design docs (D1 content, D2 engine, D3 UI/UX) + 2 research docs (R1 advice, R2 patterns) — kept in `docs/plans/`.
- ✅ Adversarial SPEC review: 8 required fixes adopted → SPEC §6 amendments A–J; Amendment K
  (scripted Gate C: test ids + in-page suite + headless driver) added 2026-11-18; Amendment L
  (layout tokens/density + full testid coverage + layout probe) same day.
- ✅ Phase A data build + **Gate A PASS** (`tools/verify_content.py` → 0 errors).
- ✅ Phase B app build + **Gate B PASS** (49/49 engine tests, syntax clean, no external URLs).
- ✅ Phase C UI verification + **Gate C PASS** — scripted, not manual: `js/selftest.js` (in-page suite,
  24 scenarios) driven by `tools/tests/ui.test.mjs` (headless Chrome via raw CDP, zero deps).
  Green on **http:// AND file://** (`node tools/tests/ui.test.mjs file:///…/site`).
- ✅ Layout/density pass (2026-11-17): the 157px top gap killed (svg sprite), dashboard densified
  2248→1823px @1440×900 (2.5→2.03 viewports), margin rhythm unified on tokens, exam-shell seam fixed,
  every interactive element carries a `data-testid` (probe-verified clean on all main routes).
- ⬜ Phase D final audit + report (README exists; audit pending).

### Phase C — what the suite covers (24 tests, all green)
Dashboard (7 chapter cards), theme quick-flip + System/Light/Dark radio persistence, **layout: shell flush** (topbar at y=0, content
padding = token, dashboard < 2.7 viewports), **testid walk** (every interactive element on 8 routes +
shell chrome anchored — fails the build if a new control ships without a testid), **nav click +
aria-current**, **glossary tabs + A–Z rail**, study understood-toggle, **study TOC deep-link (no 404
hijack)**, glossary search, cheatsheet
blocks, exam hub (4 modes), **examhub switches flip + persist**, learning wrong-reveal (is-incorrect +
shake + lock + vh word + missed-correct dashed + rationale) → Try again → correct-reveal, flag +
palette states, multi_two max-2 + exact-match, practice finish → results math (2/50, threshold 33) +
verdict grid + review filters + j/k nav, appendix A1/A4/A5 answered via test ids + reveals + 6/6,
appendix review widget overlays, full sim via keyboard (a–e, jump buffer, 40/40 correct → 44/44 PASS,
confetti flag, verdict grid), sim leave-guard (cancel keeps / abandon clears), sim resume (re-enter
route, timer + answers persist, drift clamp), mobile palette sheet (chips + jump live, Esc closes),
**layout: exam shell flush** (content padding 0, exam-bar at y=0), **review prev/next buttons**.

### Bugs the suite caught and killed (all fixed)
- `el()` used `document.createElement("svg")` → HTMLUnknownElement → **every ring and icon was
  invisible**. Fixed with createElementNS + SVG tag table; `class` now via setAttribute (SVG
  className is read-only).
- `el()` flattened kids one level → glossary appearsIn nested arrays crashed the whole glossary view
  (blank page). Fixed with `flat(Infinity)`.
- Results routes read `s[2]/s[3]` but the id sits at `s[1]` → **every `#/results/:id` showed
  "Result not found"**. Fixed in router.js.
- Runner called `tickTimer()` before the shell attached → the interval **self-cleared; the exam timer
  never ticked**. Deferred via `setTimeout(tickTimer, 0)`.
- Widgets: runner/review passed wrong `initial` shapes for assign/pair (state lost on re-render);
  learning Check didn't pass `reviewMode` (no green/red overlays). Both fixed.
- Mobile palette sheet was a `cloneNode` copy (inert). Now both grids/jump inputs are real elements
  built by `buildPalette()`/`makeJumpInput()`.
- Learning options weren't locked after Check and had no per-option verdict classes/icons —
  implemented per D3 §3.8 (`is-correct`/`is-incorrect`/`is-missed`, trailing icons, vh status word,
  one-shot shake gated on reduced-motion).
- **Study TOC links used bare in-page anchors (`href="#lo-2.2.1"`)** — the hash router parsed them
  as routes and rendered the 404 view instead of scrolling to the lesson (user-reported). Fixed:
  TOC links now use the deep-link route `#/study/ch{n}/{subId}`; guarded by the TOC selftest.

### Bugs the 2026-11-17 layout pass caught and killed
- **`<svg hidden>` sprite rendered as a 300×150 inline box** — the HTML `hidden` attribute does not
  apply to SVG elements → a ~157px dead band above the topbar on EVERY page (the reported "gap").
  Fixed: `svg[hidden] { display: none }` (base.css); guarded by the "shell flush" selftest.
- **Exam shell inherited `.content` padding** → cockpit started 32px down with a bg-0/bg-1 seam and a
  100vh overflow. Fixed: `.app[data-shell="exam"] .content { padding: 0 }` (shell.css).
- **`setActiveNav` compared `/study` against `#/study`** → no nav item was ever `aria-current` on any
  non-home route (dormant since Phase B; caught by the new nav selftest). Fixed by stripping the `#`.
- `.reading-progress`'s negative margin was hard-coupled to `.content` top padding. Both now derive
  from `--content-pad-top` / `--topbar-h` / `--ch-card-min` tokens (tokens.css) — change the token,
  not the rule.

### Known issues (open)
- `beforeunload` handlers accumulate across runner re-renders (harmless: no reloads in-app; noted).
- A4 pair connectors hidden below 768px by design; review overlays rely on `reveal()`.
- aria-checked on option rows uses role=radio on <button> — screen readers read it, but native
  radiogroup semantics are approximated (acceptable per D3 a11y budget).

## Filesystem map
```
site/
  index.html            # shell + SVG sprite + theme bootstrap + all <script> tags (load order matters)
  styles/*.css          # 14 files, exact token values from D3 (docs/plans/design-D3-uiux.md §1)
  js/
    md.js               # tiny markdown renderer (syllabus subset); `node js/md.js --selftest`
    store.js            # localStorage wrapper (see keys below)
    engine.js           # pure exam logic (sessions, scoring, thresholds, timers) — node-testable
    widgets.js          # A1 assign / A4 pair / A5 order widgets
    ui.js router.js keys.js search.js
    selftest.js         # #/selftest: in-page UI suite (24 scenarios), backs up/restores localStorage
    views/*.js          # one per route, registered on window.CTAI_VIEWS
  data/                 # GENERATED (except intel.js which is generated too) — regenerate via tools/
    chapter-1..7.js     # window.CTAI_DATA.chapters[n] = study tree + cheatsheet
    glossary.js coverage.js questions.js intel.js
  assets/fig/           # 11 PNGs (8 exam + 3 syllabus)
  tools/
    build_chapters.py   # ../markdown syllabus + qbank → chapter-*.js, glossary.js, coverage.js
    build_questions.py  # qbank records → questions.js (+ copies figures)
    build_intel.py      # embeds the R1/R2 research → intel.js (mechanical, counts asserted)
    verify_content.py   # GATE A: verbatim slices, joins, cheatsheet caps, glossary, questions, intel
    tests/engine.test.mjs  # GATE B: 49 unit tests (`node tools/tests/engine.test.mjs`)
    tests/ui.test.mjs   # GATE C: headless-Chrome driver for the selftest suite (raw CDP, zero deps)
    probe_layout.mjs    # layout + testid audit probe: per-route geometry, missing-testid report,
                        # JPEG screenshots to tools/shots/ (token-cheap: numbers first, images on demand)
    qbank/              # self-contained snapshot of the extraction records (records/*.json ×46,
                        # merged.json, derived.json) — tools prefer this, fall back to /tmp/qbank
    cheatsheets/*.json  # hand-curated cheatsheet sources (7 files; meta/examPointers auto-added)
  docs/plans/           # SPEC.md, design-D1/D2/D3, research-advice/patterns, review-SPEC (KEPT)
```

## Binding facts (do not re-derive; all gate-verified)
- Exam: **46 sample questions = 50 points** (Q1–Q40 main = 44 pts incl. 2-point K3s Q15/Q21/Q28/Q34;
  A1–A6 appendix = 6 pts). Real exam: 40 Q / 44 pts / pass **29** / 60 min (75 extended).
- Thresholds always computed `Math.ceil(0.65 × maxPoints)` → 29@44, 33@50, 4@6.
- Multi-select (Q2 "c,e", Q39 "b,d"): all-or-nothing, max-2 enforced.
- A4 grades against the question's own examples (answer figure uses different examples — derivation
  note stored verbatim in `interaction.derivation_note`).
- Q29 LO = AI-5.1.6 (key table) with `lo_note` about the AI-5.1.7 conflict.
- localStorage keys: `ctai.progress.v1` (keyed by subsection id, values `{understood, ts}`),
  `ctai.session.v1`, `ctai.attempts.v1`, `ctai.qstats.v1`, `ctai.settings.v1`.
- Data globals: `CTAI_DATA` (chapters/glossary/coverage), `CTAI_QUESTIONS`, `CTAI_INTEL`.
- Timer warnings: <10:00 amber, <2:00 critical; announcements 10:00/2:00/0:30 (SPEC §6B).
- No `fetch()` anywhere (file:// constraint) — data via `<script>` tags only.

## Rebuild + verify (run from site/)
```
python3 tools/build_chapters.py     # regenerates data/chapter-*.js glossary.js coverage.js
python3 tools/build_questions.py    # regenerates data/questions.js (+figures)
python3 tools/build_intel.py        # regenerates data/intel.js
python3 tools/verify_content.py     # GATE A — must exit 0
node js/md.js --selftest            # renderer golden
node tools/tests/engine.test.mjs    # GATE B — 49/49
node tools/tests/ui.test.mjs        # GATE C — 24/24 (needs any static server on :8765, or pass a file:// base)
node tools/tests/ui.test.mjs "file://$(pwd)"   # GATE C on file:// (the deployment constraint)
node tools/probe_layout.mjs         # layout/testid audit: geometry JSON + screenshots to tools/shots/
./tools/start.sh                    # dev server on :8765 — self-healing (evicts port squatters); stop with ./tools/stop.sh
python3 tools/serve.py              # same server, manual (no-store header — stale-JS guard)
```
Edits to `tools/cheatsheets/N.json` require re-running build_chapters.py (they are merged at emit time).
`tools/qbank/` is a snapshot — if `../markdown` changes, regenerate records first (see ../markdown/README.md
for the qbank pipeline provenance; the generator scripts live in /tmp/qbank/*.py, also ephemeral).

## Content rules (enforced by Gate A)
- Syllabus study bodies are **verbatim slices** (only whitelist: `figures/ → assets/fig/`).
- Cheatsheets: every item cites `src`; digits must appear in the cited range (section-id cross-refs
  exempt); caps: total ≤ 50% of chapter prose, synthesized (mustKnow+traps) ≤ 25%.
- Exam text verbatim incl. typos; options/stem separated at build (SPEC §6A); derived why-not bullets
  keep the `*[derived]*` marker.
- intel.js items all carry url + source type + version label; official vs community clearly separated.
- Every interactive element carries a stable `data-testid` (opt-{qid}-{key}, pal-{i}, spal-{i},
  btn-check/again/prev/next/finish/submit/flag/sheet, jump-input, sheet-jump-input, start-{mode},
  modal/modal-ok/modal-cancel/modal-keep-working/modal-submit, filter-{name}, vgrid,
  results-review-all, results-review-{incorrect|unanswered|flagged}, results-attempt-{i},
  results-back, results-retake, results-empty-exam, review-back/prev/next, runner-back,
  notfound-home, assign-cell (+data-row/data-cat), pair-left-{i}/pair-right-{i}, order-chip
  (+data-text), dash-ch{n}, dash-{resume,start-study,continue,weak-practice,weak-ch{n},weak-{qid},
  attempt-{i},empty-exam,intel-link}, understood-{subId}, lo-head-{subId}, lo-q-{qid},
  study-ch{n}(+-sheet), study-toc-{subId}, study-{back,prev-ch,next-ch}, sheet-ch{n}, sheet-tab-ch{t},
  sheet-q-{qid}, sheet-back, glossary-search, gloss-tab-{terms,abbr}, az-{L}, gloss-clear,
  gloss-appear-{sid}, switch-{ext,shuffle,wrong,pacing}, exam-weak-ch{n}/exam-weak-{qid},
  exam-learn-start, exam-attempt-{i}, intel-tab-{advice,patterns}, nav-{home,study,cheatsheets,
  glossary,exam,results,intel}, brand-link, theme-btn, theme-seg (+theme-auto/theme-light/theme-dark),
  kbd-btn, reset-btn, drawer-btn, drawer-scrim,
  search-input, search-result-{i}, search-modal, kbd-modal, toast, fig-zoom, fig-modal).
  Content-generated external links are exempt via a `data-testid-ignore` attribute on the element
  (intel source links, cheatsheet src-chips). New UI work must keep this contract — the selftest
  "testid walk" fails the suite if any interactive element ships without a testid.
- Layout shell values live in tokens.css (`--topbar-h`, `--content-pad-top`, `--ch-card-min`); sticky
  offsets and the `.reading-progress` negative margin derive from them — don't hard-code px against
  `.content` padding anywhere.
