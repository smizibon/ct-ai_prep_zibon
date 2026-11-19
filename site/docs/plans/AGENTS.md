# plans/AGENTS.md — the kept design/plan documents (historical; amend via addenda, don't rewrite)

If this disagrees from ../../AGENTS.md, ../../AGENTS.md wins. Read ON DEMAND — the one-liners
below say which document answers which question; do not open these to bootstrap ordinary tasks.

## Files — one line each
| file | what it settles |
| SPEC.md | product spec + phase plan + amendments A–L (the contract everything else defers to) |
| design-D1-content.md | content model: verbatim slices, qbank, cheatsheet synthesis rules |
| design-D2-engine.md | exam engine: sessions, scoring, thresholds, timers, attempt storage |
| design-D3-uiux.md | UI/UX: design tokens (§1), layouts, a11y budget, per-view specs |
| research-advice.md | R1: examinee advice research (sources labeled; feeds intel.js) |
| research-patterns.md | R2: exam-pattern analysis (feeds intel.js) |
| review-SPEC.md | adversarial SPEC review → the amendment list |
| plan-videos.md | videos page: pipeline, agent debate verdicts, stage log v1–v5 |
| history-archive-2026-11.md | archived bug-kills + suite coverage snapshots (pointed to from ../../AGENTS.md) |

## Task → reading list
- why does X exist / what did the spec decide → `SPEC.md` (+ its §6 amendments)
- changing tokens/layout rules → `design-D3-uiux.md` §1/§7 first
- changing scoring/session semantics → `design-D2-engine.md` + engine tests
- videos page behavior/rationale → `plan-videos.md` (§9–10 user requests + debate)
- past bug post-mortems → `history-archive-2026-11.md`

## Invariants
- These are HISTORICAL RECORDS: correct errors by appending addenda, never by rewriting history
  (same policy as ../../markdown/README.md "Known Deviations").

## Pointers (not copies)
workspace context-file plan → ../../../PLAN-context-files.md · session context → ../../AGENTS.md
<!-- ctx:v1 SPEC.md=270;design-D1-content.md=456;design-D2-engine.md=461;design-D3-uiux.md=1216;history-archive-2026-11.md=132;plan-videos.md=254;research-advice.md=216;research-patterns.md=172;review-SPEC.md=181 -->