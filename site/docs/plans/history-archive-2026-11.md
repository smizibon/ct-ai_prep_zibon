# history-archive-2026-11.md — archived from site/AGENTS.md (2026-11-19)

Historical record: bug post-mortems and suite-coverage snapshots extracted from site/AGENTS.md
when folder context files took over the filesystem map (../../PLAN-context-files.md §3).
Do not rewrite history; append new entries at the bottom of the relevant section.

Live lessons survive as one-line invariants in the owning folder AGENTS.md files
(js/, styles/, tools/); this file keeps the full stories for reference.

### Phase C — what the suite covers (29 tests, all green)
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
**layout: exam shell flush** (content padding 0, exam-bar at y=0), **review prev/next buttons**,
**videos: tabs/tier-chips/search filter the library** (chapter tab narrows, tier chip never adds
cards, search narrows→zero→restores, empty-scaffold branch covered), **videos: every card links out
canonically** (external hrefs carry `target=_blank rel=noopener`; shipped data ids unique + 11-char
YouTube format, mirroring build_videos.py), **videos: coverage notes & gaps render and scope to the
chapter tab** (all rows + nearest-pick links + warn markers; ch3 tab leaks nothing), **videos: card
text is contained** (every card walked for unclipped horizontal overflow — the vid-card-V1-01
tooltip regression), **videos: play-in-modal opens, tears down, and the router sweep closes it**
(lazy nocookie iframe derived from v.url, allowfullscreen, canonical open-on-YT link, close removes
iframe + scrim, Play→Replay marker, route change sweeps the modal).


### Bugs the suite caught and killed (all fixed)
- **videos v2: the router modal-sweep broke the sim leave-guard** — the judge-specified "close all
  modals on route change" line swept away the guard's own confirm dialog, because the guard's
  hash-revert re-renders onto the exam route (guard block skipped → sweep ran). Fixed: sweep runs
  after the guard block AND spares testid-less `UI.confirm` dialogs (mid-decision prompts);
  player/fig/kbd modals still die on navigation. Guarded by the leave-guard + player-sweep tests.
- **video cards overflowed their boxes** (`vid-card-V1-01` et al.) — chips.css `[data-tip]::after`
  tooltips inflate `scrollWidth` even while invisible; the tier chip carried the long channel
  credential note. Pseudo-element tips dropped from all video-page chips (native `title` attrs
  remain); `min-width:0` + `overflow-wrap` on flex children. Guarded by the containment selftest
  (probe: 20/20 cards overflowed before → 0 after).
- **card design pass (2026-11-19, user feedback on vid-card-V6-03)** — hierarchy was muddy
  (3-line credential caption competed with an unclamped title) and the action row mixed a text
  caption with two equal buttons that wrapped per-card. New anatomy: one quiet meta head
  (channel w/ credential tooltip, tier chip, duration — names wrap to 2 clamped lines, no
  avatar box), clamped title/why/topics, chips row carries published date, and an isolated
  divider-topped action bar (content-sized Play + compact YouTube, right-aligned, identical
  height per card). Card heights now uniform per grid row. Player modal enlarged to
  `modal--player` (min(1024px, 96vw) — 992×558 embed) via the new `UI.modal` `opts.cls` hook.
- **videos view rendered an empty list on first paint** — `renderList` resolved `#vidList` via
  `document.getElementById` while the page node was still detached (the router attaches it only
  after `render()` returns), so the initial render silently no-oped and only later interactions
  populated the list. Fixed by passing the host/count nodes in directly (closure, not DOM lookup).
  Found via a raw-CDP console probe; guarded by the two videos selftests.
- A tier-filter chip button built class `chip-btntrue` when inactive (ternary fell through to
  `"true"` instead of `""`) — invisible style bug, caught while fixing the above.
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

#
## Filesystem map
```
site/
  index.html            # shell + SVG sprite + theme bootstrap + all <script> tags (load order matters)
  styles/*.css          # 15 files, exact token values from D3 (docs/plans/design-D3-uiux.md §1; +videos.css)
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
    videos.js           # window.CTAI_VIDEOS (curated YouTube library; oEmbed-verified ids)
  assets/fig/           # 11 PNGs (8 exam + 3 syllabus)
  tools/
    build_chapters.py   # ../markdown syllabus + qbank → chapter-*.js, glossary.js, coverage.js
    build_questions.py  # qbank records → questions.js (+ copies figures)
    build_intel.py      # embeds the R1/R2 research → intel.js (mechanical, counts asserted)
    videos.json         # CURATED source for the videos page (channel tiers + verified ids + mappings)
    build_videos.py     # videos.json → data/videos.js; validates schema + section mappings vs
                        # the syllabus TOC + coverage completeness (its own Gate-A; --check = validate only)
    verify_content.py   # GATE A: verbatim slices, joins, cheatsheet caps, glossary, questions, intel
    tests/engine.test.mjs  # GATE B: 49 unit tests (`node tools/tests/engine.test.mjs`)
    tests/ui.test.mjs   # GATE C: headless-Chrome driver for the selftest suite (raw CDP, zero deps)
    probe_layout.mjs    # layout + testid audit probe: per-route geometry, missing-testid report,
                        # JPEG screenshots to tools/shots/ (token-cheap: numbers first, images on demand)
    qbank/              # self-contained snapshot of the extraction records (records/*.json ×46,
                        # merged.json, derived.json) — tools prefer this, fall back to /tmp/qbank
    cheatsheets/*.json  # hand-curated cheatsheet sources (7 files; meta/examPointers auto-added)
  docs/plans/           # SPEC.md, design-D1/D2/D3, research-advice/patterns, review-SPEC (KEPT)
                        # + plan-videos.md (2026-11-18 videos-page feature plan + stage log)
```

