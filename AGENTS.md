# Working Agreements — CT-AI Workspace

## How to work here (reading + writing loop)

**Reading — context files first, always:** before opening ANY source file, read the AGENTS.md chain in order — this file → `site/AGENTS.md` → the target folder's `AGENTS.md`. The folder dossiers' task→reading-list tables say exactly which files/functions a task needs; open only those. Do not browse folders or re-derive what a dossier already answers. If a dossier disagrees with the code, trust the code, fix the dossier (`site/tools/check_context.py --update`), and note why.

**Writing — the context files are the FIRST docs to update, not the last:** they are the entry point for every future session, so a stale dossier poisons all subsequent work (worse than no dossier). After any change that adds/removes/renames files, edits a covered file's contents meaningfully, or rebuilds `site/data/`: refresh the touched folder's AGENTS.md (roles/invariants if behavior changed; ctx block via `--update`) and end with Gate D (`python3 site/tools/check_context.py`) at 0. A task is not done while Gate D is red.

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

When the user says **"update docs"**, they mean keeping these six artifact groups current (not the markdown set above) — and the folder context files (item 2) come FIRST in priority, because every session starts by reading them:

1. `site/docs/plans/` — the kept plan files (SPEC, design-D1/D2/D3, research-advice, research-patterns, review-SPEC; feature plans like plan-videos.md). Historical records: amend via addenda, don't rewrite history.
2. **Folder context files** — `AGENTS.md` in site/js, site/styles, site/data, site/tools, site/docs/plans: task→reading-list dossiers with generated `ctx` line-count blocks. Any task that adds/removes/renames files, rebuilds `site/data/`, or edits a covered file past drift tolerance must end with `python3 site/tools/check_context.py` exiting 0 (Gate D; `--update` refreshes the blocks). A task may not claim done while Gate D is red.
3. `site/AGENTS.md` — session context: phase/gate status, binding facts, rebuild + verify commands (ladder D→A→B→C), known issues.
4. `site/ARCHITECTURE.md` — system architecture and key decisions.
5. `site/USERGUIDE.md` — end-user guide (modes, shortcuts, printing).
6. `site/README.md` — entry point (open/verify/docs pointers), plus the site's registration in `markdown/README.md`.

Rule: after any meaningful change to the site (feature, fix, data rebuild, status change), refresh whichever of these it touches — status/known-issues go to site/AGENTS.md, behavior to USERGUIDE.md, structure to ARCHITECTURE.md, folder contents to that folder's AGENTS.md. Design of the context layer: `PLAN-context-files.md`.

**Context economy rule:** before reading source files in any folder, read that folder's `AGENTS.md` (and `site/AGENTS.md` first for cross-folder contracts) — the task→reading-list tables say exactly which files/functions a task needs. Do not re-read whole folders when the dossier answers the question; if a dossier disagrees with reality, trust the code and fix the dossier (`check_context.py --update`).
