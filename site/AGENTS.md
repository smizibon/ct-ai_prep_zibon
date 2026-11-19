# site/AGENTS.md — context for new sessions (CT-AI Studio)

Read this instead of re-deriving the project. Project root: `/Users/zibon-mac/Desktop/Certifications/CT-AI`.
Parent rules live in `../AGENTS.md` (markdown/ is source of truth; multi-agent fan-out within limits).
Last updated: 2026-11-19 (context-file layer: 5 folder AGENTS.md + Gate D drift guard + history
archived to docs/plans/history-archive-2026-11.md; filesystem map dissolved into folder files —
see ../PLAN-context-files.md. Prior: videos v2 29/29, videos page, layout pass).

## What this is
A fully offline static study + mock-exam site for ISTQB CT-AI v2.0, built from the verified markdown
sources in `../markdown/`. Vanilla HTML/CSS/JS, zero CDNs, works from `file://` and any static server.
All content is machine-verified against the sources (verbatim syllabus slices, byte-exact exam text).

## Folder context files (read the nearest AGENTS.md before touching a folder)
- `js/AGENTS.md` (wiring + views conventions), `styles/AGENTS.md` (token discipline + file map),
  `data/AGENTS.md` (globals→builders→regen), `tools/AGENTS.md` (gate ladder + per-tool roles),
  `docs/plans/AGENTS.md` (which plan answers which question). `js/views/` has none by design
  (covered by js/), `../markdown/README.md` is that folder's index.
- Rule: any task that adds/removes/renames files, rebuilds data/, or edits past drift tolerance
  ends with `python3 tools/check_context.py` (Gate D) at 0 — `--update` refreshes the ctx blocks.
- Historical bug post-mortems + suite snapshots: `docs/plans/history-archive-2026-11.md`.

## Status (phase plan from docs/plans/SPEC.md §4)
- ✅ Wave 1 designs + research: 3 design docs (D1 content, D2 engine, D3 UI/UX) + 2 research docs (R1 advice, R2 patterns) — kept in `docs/plans/`.
- ✅ Adversarial SPEC review: 8 required fixes adopted → SPEC §6 amendments A–J; Amendment K
  (scripted Gate C: test ids + in-page suite + headless driver) added 2026-11-18; Amendment L
  (layout tokens/density + full testid coverage + layout probe) same day.
- ✅ Phase A data build + **Gate A PASS** (`tools/verify_content.py` → 0 errors).
- ✅ Phase B app build + **Gate B PASS** (49/49 engine tests, syntax clean, no external URLs).
- ✅ Phase C UI verification + **Gate C PASS** — scripted, not manual: `js/selftest.js` (in-page suite,
  29 scenarios) driven by `tools/tests/ui.test.mjs` (headless Chrome via raw CDP, zero deps).
  Green on **http:// AND file://** (`node tools/tests/ui.test.mjs file:///…/site`).
- ✅ Context-file layer (2026-11-19, ../PLAN-context-files.md): 5 folder AGENTS.md (task→reading-list
  dossiers), site/AGENTS.md slimmed 246→~130 lines (filesystem map dissolved; history archived),
  `tools/check_context.py` = **Gate D** (dossier freshness, runs first).
- ✅ Layout/density pass (2026-11-17): the 157px top gap killed (svg sprite), dashboard densified
  2248→1823px @1440×900 (2.5→2.03 viewports), margin rhythm unified on tokens, exam-shell seam fixed,
  every interactive element carries a `data-testid` (probe-verified clean on all main routes).
- ✅ Videos page (2026-11-18, docs/plans/plan-videos.md): `#/videos` — curated YouTube companion
  library. 8-agent research fan-out (ch1 needed a second attempt after a [1302] rate limit),
  **103/103 candidate ids re-verified via youtube.com/oembed by the main agent**, curated to
  **87 videos / 62 tiered channels / 51-of-51 syllabus sections covered / 0 hard gaps**.
  Section chips deep-link to Study; `tools/videos.json` → `build_videos.py` → `data/videos.js`
  pipeline with its own Gate-A style validation.
- ✅ Videos v2 (same day, plan §9–10 — user requests): (1) **coverageNotes** — 26 honest
  partial/thin/terminology admissions (e.g. "no video uses the ISTQB term 'dataset constraint
  testing'") rendered as a chapter-scoped panel + warn-marked section chips, build-validated;
  (2) **in-site playback** after a 2-advocate + judge agent debate (verdict in plan §10):
  click-to-play modal player, lazy `youtube-nocookie.com/embed` iframe (src derived from v.url),
  offline toast, Close + Open-on-YT, Play→Replay markers, router modal sweep (guard-safe);
  (3) **card containment** — the V1-01 overflow was `chips.css [data-tip]::after` tooltips
  inflating scrollWidth; channel notes are now visible captions, pseudo-element tips dropped
  from video-page chips, min-width:0 + overflow-wrap everywhere. Suite 26→29, green on http://
  AND file://; probe clean.
- ⬜ Phase D final audit + report (README exists; audit pending).

## Known issues (open)
- In the video player, once focus enters the cross-origin iframe, Esc no longer closes the modal
  (key events don't cross origins). Focus opens on the wrapper (Esc works until the frame is
  clicked); Close button + scrim click always work. Accepted per the debate verdict (plan §10).
- `beforeunload` handlers accumulate across runner re-renders (harmless: no reloads in-app; noted).
- A4 pair connectors hidden below 768px by design; review overlays rely on `reveal()`.
- aria-checked on option rows uses role=radio on <button> — screen readers read it, but native
  radiogroup semantics are approximated (acceptable per D3 a11y budget).

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
- Data globals: `CTAI_DATA` (chapters/glossary/coverage), `CTAI_QUESTIONS`, `CTAI_INTEL`, `CTAI_VIDEOS`.
- Timer warnings: <10:00 amber, <2:00 critical; announcements 10:00/2:00/0:30 (SPEC §6B).
- No `fetch()` anywhere (file:// constraint) — data via `<script>` tags only.

## Rebuild + verify (run from site/; ladder order D→A→B→C)
```
python3 tools/check_context.py   # GATE D — folder AGENTS.md dossiers fresh (--update after edits/rebuilds)
python3 tools/build_chapters.py     # regenerates data/chapter-*.js glossary.js coverage.js
python3 tools/build_questions.py    # regenerates data/questions.js (+figures)
python3 tools/build_intel.py        # regenerates data/intel.js
python3 tools/build_videos.py       # regenerates data/videos.js (schema + coverage validated; fails loudly)
python3 tools/verify_content.py     # GATE A — must exit 0
node js/md.js --selftest            # renderer golden
node tools/tests/engine.test.mjs    # GATE B — 49/49
node tools/tests/ui.test.mjs        # GATE C — 29/29 (needs any static server on :8765, or pass a file:// base)
node tools/tests/ui.test.mjs "file://$(pwd)"   # GATE C on file:// (the deployment constraint)
node tools/probe_layout.mjs         # layout/testid audit: geometry JSON + screenshots to tools/shots/
./tools/start.sh                    # dev server on :8765 — self-healing (evicts port squatters); stop with ./tools/stop.sh
python3 tools/serve.py              # same server, manual (no-store header — stale-JS guard)
```
Edits to `tools/cheatsheets/N.json` require re-running build_chapters.py (they are merged at emit time).
Edits to `tools/videos.json` require re-running build_videos.py (data/videos.js is generated).
`tools/qbank/` is a snapshot — if `../markdown` changes, regenerate records first (see ../markdown/README.md
for the qbank pipeline provenance; the generator scripts live in /tmp/qbank/*.py, also ephemeral).

## Content rules (enforced by Gate A)
- Syllabus study bodies are **verbatim slices** (only whitelist: `figures/ → assets/fig/`).
- Cheatsheets: every item cites `src`; digits must appear in the cited range (section-id cross-refs
  exempt); caps: total ≤ 50% of chapter prose, synthesized (mustKnow+traps) ≤ 25%.
- Exam text verbatim incl. typos; options/stem separated at build (SPEC §6A); derived why-not bullets
  keep the `*[derived]*` marker.
- intel.js items all carry url + source type + version label; official vs community clearly separated.
- videos.js entries all carry canonical oEmbed titles/channels, a tier from {official, educator,
  trainer, community}, ≥1 syllabus section mapping that exists in the TOC, and every x.y.z unit is
  covered or explicitly listed in `uncovered` — enforced by `tools/build_videos.py`. `coverageNotes`
  (level ∈ partial/thin/terminology + nearest shipped pick) are validated the same way: the note's
  `nearest` video must actually cover the noted section.
- Embeds are click-to-play only (plan §9–10): no iframe exists in the DOM until a deliberate Play
  click; src is derived from `v.url` at runtime (no external URL literal in js/); route changes
  sweep testid-bearing modals so audio can never be orphaned.
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
  exam-learn-start, exam-attempt-{i}, intel-tab-{advice,patterns}, nav-{home,study,cheatsheets,videos,
  glossary,exam,results,intel}, brand-link, theme-btn, theme-seg (+theme-auto/theme-light/theme-dark),
  kbd-btn, reset-btn, drawer-btn, drawer-scrim,
  vid-tab-all/ch{n}/exam, vid-tier-{all,official,educator,trainer,community}, vid-search,
  vid-count, vid-card-{id}, vid-watch-{id}, vid-title-{id}, vid-sec-{section}, vid-fallback-study,
  vid-play-{id}, vid-modal, vid-modal-close, vid-open-yt-{id},
  cov-panel, cov-note-{section}(-{i} for EXAM), cov-sec-{section}, cov-near-{section},
  dash-videos-link,
  search-input, search-result-{i}, search-modal, kbd-modal, toast, fig-zoom, fig-modal).
  Content-generated external links are exempt via a `data-testid-ignore` attribute on the element
  (intel source links, cheatsheet src-chips). New UI work must keep this contract — the selftest
  "testid walk" fails the suite if any interactive element ships without a testid.
- Layout shell values live in tokens.css (`--topbar-h`, `--content-pad-top`, `--ch-card-min`); sticky
  offsets and the `.reading-progress` negative margin derive from them — don't hard-code px against
  `.content` padding anywhere.
