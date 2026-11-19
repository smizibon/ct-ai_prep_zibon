# tools/AGENTS.md — build scripts, verification gates, dev server, probes

If this disagrees with ../AGENTS.md, ../AGENTS.md wins. Counts live only in the ctx block
(refresh: `python3 tools/check_context.py --update` from site/). Gate ladder order: D→A→B→C
(full commands in ../AGENTS.md "Rebuild + verify").

## Task → reading list
- syllabus/cheatsheet content change: `build_chapters.py` (header documents the verbatim-slice
  policy + chapter regexes); cheatsheet edits go in `cheatsheets/N.json`, merged at emit
- exam question text: `build_questions.py` + the qbank records (`qbank/records/*.json` are
  byte-exact snapshots; /tmp/qbank fallback is EPHEMERAL — prefer this snapshot)
- videos curation: `videos.json` (curated source: channels/tiers/notes/mappings) →
  `build_videos.py` (schema + syllabus-TOC + coverage validation, `--check` mode)
- add/verify content gates: `verify_content.py` (Gate A idiom: check() accumulator, exit≠0 fails)
- context-file freshness: `check_context.py` (Gate D; `--update` after edits/rebuilds)
- layout audit: `probe_layout.mjs` (per-route geometry + missing-testid report + shots/)
- serve the site: `start.sh`/`stop.sh` (self-healing :8765) or `serve.py` (no-store header)

## Files — one line each
| file | role |
| build_chapters.py | syllabus + qbank + cheatsheets → data/chapter-*.js, glossary.js, coverage.js |
| build_questions.py | qbank records → data/questions.js (+ copies figures to assets/fig) |
| build_intel.py | R1/R2 research docs → data/intel.js |
| build_videos.py | tools/videos.json → data/videos.js (own Gate-A style validation) |
| check_context.py | GATE D: folder AGENTS.md dossier freshness (lines/unlisted/missing) |
| verify_content.py | GATE A: verbatim slices, joins, cheatsheet caps, glossary, questions, intel |
| tests/engine.test.mjs | GATE B: 49 engine unit tests (node, zero deps) |
| tests/ui.test.mjs | GATE C driver: headless Chrome via raw CDP → #/selftest report (http + file://) |
| probe_layout.mjs | layout/testid audit probe (screenshots to shots/, gitignored) |
| serve.py / start.sh / stop.sh | no-store dev server on :8765 |
| videos.json | CURATED videos source (the only hand-edited file here besides cheatsheets/); id re-verification protocol: docs/plans/plan-videos.md D5 |

## Local invariants & traps
- Python tools are stdlib-only and re-runnable; generated outputs are deterministic.
- tests/ui.test.mjs needs Chrome/Chromium/Edge/Brave (headless) and any static server on :8765,
  or pass `file://$(pwd)` as base — both must stay green.
- shots/, .server.pid/.log, __pycache__ are runtime artifacts (gitignored; ctx-ignored).

## Pointers (not copies)
gate ladder + rebuild commands → ../AGENTS.md · context-file plan → ../../PLAN-context-files.md
<!-- ctx:v1 build_chapters.py=314;build_intel.py=232;build_questions.py=225;build_videos.py=145;check_context.py=118;probe_layout.mjs=158;serve.py=35;start.sh=72;stop.sh=60;tests/engine.test.mjs=141;tests/ui.test.mjs=105;verify_content.py=313;videos.json=2764 -->