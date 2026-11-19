# js/AGENTS.md — app code: helpers, router, selftest + per-route views (loaded by index.html)

If this disagrees with ../AGENTS.md, ../AGENTS.md wins. Line counts live only in the ctx block
at file end — refresh: `python3 tools/check_context.py --update` (from site/). This folder +
views/ are ONE wiring story; views need no separate context file (filename = route segment).

## Task → reading list
- add a page route + nav: `router.js` (`NAV` table, `viewFor()`, `buildNav()`); new `views/<name>.js`
  (register `window.CTAI_VIEWS.<name>`); `../index.html` (script tag after other views, before
  selftest.js; add icon to SVG sprite if needed); `selftest.js` (add the route to the testid-walk
  list + a scenario — the walk fails the suite if a control ships without a testid)
- change scoring/threshold/timer: `engine.js` (pure, node-testable) → `../tools/tests/engine.test.mjs`;
  threshold is a binding fact in ../AGENTS.md — never re-derive; count assertions also live in
  `selftest.js`, `views/results.js`, `views/examhub.js` (copy) — change all or gates fail
- question widgets (A1 assign / A4 pair / A5 order): `widgets.js` + `views/runner.js` (state
  shapes passed to widgets) + `selftest.js` (answerCorrect patterns)
- keyboard shortcuts: `keys.js` (g-chord map + help rows; keep in sync with ../USERGUIDE.md)
- global search overlay: `search.js` (indexes glossary/LOs/cheatsheets/intel)
- videos page work: `views/videos.js` + `../tools/videos.json` → `../tools/build_videos.py`
  (data pipeline; plan/history in ../docs/plans/plan-videos.md)

## Files — one line each (views/ files share this dossier: filename = route segment; register on `CTAI_VIEWS.<name>`)
| file | role / key symbols |
| md.js | tiny markdown-subset renderer (`render`, `--selftest` golden) |
| store.js | localStorage wrapper: progress/session/attempts/qstats/settings (key list in ../AGENTS.md) |
| engine.js | PURE exam logic: sessions, seeded shuffle, scoring, `threshold = ceil(0.65×max)`, timers |
| widgets.js | A1/A4/A5 interactive widgets |
| ui.js | DOM factory `el()`/`icon`, chips/rings/toasts/modals (`UI.modal` opts: wide/fig/cls/testid) |
| router.js | hash router + shell chrome: `parse()`, `viewFor()`, NAV, sim leave-guard + modal sweep |
| selftest.js | #/selftest in-page suite (29 scenarios; count also in ../AGENTS.md header) |
| search.js | ⌘K / `/` search overlay |
| keys.js | global shortcuts, `g`-chord nav, `?` help |

## Local invariants & traps
- Hash router eats bare anchors: any `href="#x"` renders the 404 view — use `#/route` deep-links.
- SVG only via `UI.el` (SVG_TAGS → createElementNS; `class` via setAttribute). Never
  createElement("svg") — silent HTMLUnknownElement (invisible-icon bug, archived history).
- Zero `fetch()` anywhere (file:// constraint) — data arrives via `<script>` tags only.
- index.html script order matters: data → libs (md/store/ui/engine/widgets) → views → selftest
  → search → keys → router LAST.
- router render(): modal sweep runs AFTER the sim leave-guard block and spares testid-less
  UI.confirm dialogs — reordering breaks the guard or orphans player audio.
- Views receive (`params`, route); detached-DOM rule: pass nodes into helpers, never
  `document.getElementById` for nodes you are still building (videos empty-list bug, archived).
- selftest backs up/restores localStorage — don't assume persisted state across scenarios.

## Pointers (not copies)
testid contract, gates, binding facts, rebuild commands → ../AGENTS.md · folder map → ../../PLAN-context-files.md
<!-- ctx:v1 engine.js=162;keys.js=52;md.js=116;router.js=239;search.js=110;selftest.js=769;store.js=99;ui.js=164;views/cheatsheets.js=117;views/dashboard.js=150;views/examhub.js=184;views/glossary.js=110;views/intel.js=176;views/notfound.js=13;views/results.js=126;views/review.js=138;views/runner.js=451;views/study.js=187;views/videos.js=283;widgets.js=183 -->