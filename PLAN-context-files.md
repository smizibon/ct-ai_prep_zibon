# Plan — Folder-level context files (context economy for AI sessions)

Date: 2026-11-19 · Status: in-session (user: "maintain folder level context files so AI does not
need to read all files"; expert-panel synthesis below) · Owner: session agent

## 1. Problem

AI sessions in this workspace burn context re-reading whole folders (site/js 1,894 ln,
js/views 1,935, docs/plans 3,226, styles 858, data 12,723 generated). Meanwhile the single
session-context file (site/AGENTS.md, 246 ln) is doing all the work — and rotting: its filesystem
map still claimed "selftest.js (24 scenarios)" after the suite grew to 29 (found by Expert B).

## 2. Expert panel (memos in /tmp/ctai-context/, verbatim quotes in §7)

- **A — schema**: one `AGENTS.md` per folder (harness auto-discovery), ≤50 lines, purpose +
  per-file dossier + **task→reading-list** + local invariants + pointers (never copies);
  generated folders get globals+regen maps, not dossiers.
- **B — drift**: record per-file line counts, machine-checked by `tools/check_context.py`
  (two-tier tolerance: silent ≤max(5,10%), warn ≤max(20,20%), error beyond; unlisted/missing
  files are errors; `--update` regenerates); new **Gate D, first** in the ladder; protocol =
  refresh at task end + after rebuilds, Gate D red blocks "done".
- **C — skeptic**: cold-start drill answered 4 real tasks in ~460 lines using filenames +
  docstrings + grep; site/AGENTS.md already answers all four; the ONE artifact with real value
  is the task→reading-list; kill per-folder ceremony for styles/data/plans/markdown, kill
  prose line-counts ("rot on every edit"), kill dossiers for js/views (filename = route name).

## 3. Ruling (synthesis — binding)

| Decision | Ruling | From |
|---|---|---|
| Filename | `AGENTS.md` per folder — auto-read by harnesses on touch | A |
| Folder set | **5 files**: `site/js/` (+views wiring merged), `site/styles/`, `site/data/`, `site/tools/`, `site/docs/plans/`. NO file for `js/views/` (merged), `markdown/` (README.md canonical), assets/PDFs | A∩C |
| Core artifact | TASK→READING-LIST table in every file; per-file tables are one-liners, no prose counts | A+C |
| Counts & rot | Line counts live ONLY in a generated `<!-- ctx:v1 -->` block per file (human prose stays count-free); `check_context.py --update` owns it | B+C |
| Drift guard | `tools/check_context.py` (stdlib, check()-idiom, exit 0/1): unlisted/missing = error, drift tolerances per B, `--update` mode; **Gate D, listed first** (D→A→B→C) | B |
| Protocol | Task ends with Gate D green; `--update` after edits/rebuilds/file-adds; folded into root AGENTS.md standing rules; site/AGENTS.md rebuild block gains the Gate D line | B |
| site/AGENTS.md | Filesystem map DISSOLVES into folder files; bug-history blocks + suite list ARCHIVE to `docs/plans/history-archive-2026-11.md` (one-line pointers remain); binding facts / gates / testid contract / known issues STAY. 246 → ~110 ln | A |
| Traps | C's 10 verified traps distribute to their owning folder files as one-liners; cross-folder ones stay in site/AGENTS.md | C |
| Trust rule | Every folder file carries: "If this disagrees with site/AGENTS.md, site/AGENTS.md wins." Named symbols over line numbers in prose. | C |

Explicitly rejected: separate views/ file (C); prose-quoted counts anywhere (C, proven by the
24-scenario rot); sha256/mtime recording and prose anchors in v1 (B offered; over-engineered at
this repo size — noted as v2 options if rot classes appear).

## 4. Folder file template (~25-45 lines each)

```markdown
# <folder>/AGENTS.md — <one-line role>
If this disagrees with site/AGENTS.md, site/AGENTS.md wins. Counts live only in the ctx block
(refresh: python3 tools/check_context.py --update).

## Task → reading list
- to <task>: `file` (`symbol`), `file` (`symbol`) — in order
## Files (one line each)
| file | role / key symbols |
## Local invariants & traps
- <one-liners>
## Pointers (not copies)
- testid contract, gates, binding facts → ../AGENTS.md
<!-- ctx:v1 file=lines;... -->
```
`data/` variant: Files table replaced by globals map (file → `window.X` → builder) + regenerate
commands + "GENERATED — never hand-edit" as invariant #1.

## 5. Phases

| # | What | Done when |
|---|---|---|
| c-0 | This plan + expert panel | written + shown |
| c-1 | Design freeze | §3 rulings |
| c-2 | Write the 5 folder files (from inventory + reading lists); archive history blocks to `docs/plans/history-archive-2026-11.md`; slim site/AGENTS.md; update root AGENTS.md (new standing rule + pointer fixes) | files exist; site/AGENTS.md keeps status/binding-facts/gates/testid/known-issues (size: see its ctx/Gate D, not prose) |
| c-3 | `tools/check_context.py` + Gate D wiring (first in ladder) | `python3 tools/check_context.py` exits 0 |
| c-4 | `--update` generates ctx blocks; full Gate D green | 5/5 folders validated |
| c-5 | Cold-start validation: fresh agent answers 2 probe tasks reading ONLY the AGENTS.md chain (root → site → folder), no source files | answers correct, no source files opened (line budget: prose counts rot — measure, don't pre-commit) |
| c-6 | Re-run Gates A/B/C (nothing broken); report. Commit only when asked | all green |

## 6. Phase log
- 2026-11-19 — c-0/c-1 complete: three experts ran (schema/drift/practitioner), ruling §3.
- 2026-11-19 — c-2..c-4 complete: 5 folder AGENTS.md written (js dossier covers views/ — one
  wiring story, 20 files in its ctx block); history blocks + filesystem map archived to
  docs/plans/history-archive-2026-11.md; site/AGENTS.md restructured (context-file section,
  Gate D first in ladder); root AGENTS.md "update docs" now six artifact groups + context-economy
  rule; `tools/check_context.py` shipped (negative-tested: stray file → exit 1, clean → 0).
- 2026-11-19 — c-5 complete: cold-start probe (fresh agent, ONLY the md chain, zero source
  files opened) answered Task A (route+nav wiring) 5/5 and Task B (videos pipeline + gate
  ladder) 4/5; task-minimal chain ~300 lines vs the practitioner's ~460 lines of SOURCE reading
  for four cold tasks — and no re-reading on follow-ups. Probe findings all fixed: views/ added
  to the js ctx block (unlisted-file check now covers new views), oEmbed re-verification pointer
  added, this plan's own prose line-counts removed (the exact rot class Expert B warned about).
  Note: the session-start injected copy of root AGENTS.md predates Gate D — on-disk wins.
- 2026-11-19 — user ratified the protocol and set priority: context files are read FIRST (chain:
  root → site → folder dossier → only the listed files) and are therefore the FIRST docs to
  update after any change. Encoded as the leading "How to work here" section of root AGENTS.md;
  "update docs" list reordered to put folder context files at priority 2.

## 7. Expert quotes load-bearing for the ruling
- A: "The task table converts 'read 1885 lines' into 'read 3 functions'."
- B: "Zero-tolerance = noisy gate = habitually disabled = dead." / "the checker's error list IS the to-do list."
- C: "Post-drill shock: site/AGENTS.md ALREADY answers all four for free… only cross-file wiring
  needed synthesis, and that's the reading-list table (~15 rows)." / "Size/line-count records rot
  on every edit; the drill never needed them."
