# Working Agreements — CT-AI Workspace

## Source of truth

The canonical sources for ALL work in this workspace are the Markdown files in `markdown/` — NOT the PDFs in the root folder. The PDFs are archival references only; do not extract from them unless explicitly asked or unless verifying the markdown itself.

- `markdown/README.md` — status, verification history, known deviations, figures inventory. Read it before assuming anything about the set.
- `markdown/figures/` — extracted figure PNGs, referenced by the markdown files via relative paths. Keep this folder next to the .md files.

## Multi-agent planning rules

When planning any non-trivial task, plan for parallel agent fan-out from the start:

- Divide work by independent units (per document, per section, per question range), not one monolithic agent.
- **Concurrency ceiling: ~10–12 agents at once.** Launching ~30+ concurrent agents causes provider rate-limit failures ([1302]). If a fan-out exceeds the ceiling, batch it (e.g. regroup sections into ~6 agents per wave).
- If an agent fails at launch with a rate-limit error, regroup its share into the next wave — don't retry the same fan-out shape.
- For audit/verification fan-outs over the same source material, pre-extract shared dumps to /tmp once (with `=== PAGE N ===` markers) so agents don't each re-extract.
- Agents' findings are only proposals — verify any claimed defect against the actual file before editing (past false positive: an auditor's script stripped underscores and blamed the file).

## Verification conventions (for any edits to the markdown set)

- Preserve source typos verbatim; document them in README "Known Deviations" instead of fixing.
- Underscores in identifiers (LO IDs like `FL-4.1.2`, `monthly_payment`) must be preserved in any token diffing.
- Per-page headers/footers/page numbers are intentionally excluded chrome.
- After editing, update the README if the edit affects status, deviations, or inventory.

## "Update docs" — standing definition (site work)

When the user says **"update docs"**, they mean keeping these five artifacts current (not the markdown set above):

1. `site/docs/plans/` — the seven kept plan files (SPEC, design-D1/D2/D3, research-advice, research-patterns, review-SPEC). Historical records: amend via addenda, don't rewrite history.
2. `site/AGENTS.md` — session context: phase/gate status, filesystem map, binding facts, rebuild + verify commands, remaining checklist, known issues.
3. `site/ARCHITECTURE.md` — system architecture and key decisions.
4. `site/USERGUIDE.md` — end-user guide (modes, shortcuts, printing).
5. `site/README.md` — entry point (open/verify/docs pointers), plus the site's registration in `markdown/README.md`.

Rule: after any meaningful change to the site (feature, fix, data rebuild, status change), refresh whichever of these five it touches — status/known-issues go to AGENTS.md, behavior to USERGUIDE.md, structure to ARCHITECTURE.md.
