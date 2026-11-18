# CT-AI Studio — ISTQB Certified Tester AI Testing v2.0

An offline study and mock-exam application for the **ISTQB CT-AI v2.0** certification, built
directly from the official documents: the Syllabus v2.0, Sample Exam set A v2.2 (questions +
answers), and the ISTQB exam structure tables. Everything runs locally — no server, no internet,
no accounts.

## Open it

**Easiest:** double-click `index.html` (works from `file://` in Chrome/Safari).

**Or serve it** (nicer URLs, identical behavior):

```bash
cd site
./tools/start.sh                  # no-store dev server on :8765 (self-heals an occupied port)
# open http://127.0.0.1:8765/
./tools/stop.sh                   # stop it (targets only serve.py, verifies the port is free)
```
`start.sh` reclaims port 8765 from anything holding it (stale copies of itself included), and
re-running it while the server is up is a no-op. Plain `python3 tools/serve.py [port]` works too.

## What's inside

| Area | What you get |
|---|---|
| **Study** | The complete syllabus chapters 1–7, verbatim, chunked per learning objective with K-level chips, estimated minutes, hands-on ribbons, and links to the sample questions that test each LO. Progress tracking ("Understood" per LO) drives the dashboard readiness ring. |
| **Cheatsheets** | One condensed revision sheet per chapter — key terms (verbatim definitions), must-know lists, formulas (accuracy/precision/recall/F1), risk→mitigation tables, and classic exam traps. Every bullet cites its syllabus source. |
| **Glossary** | All 118 AI-specific terms + 31 abbreviations, searchable, with synonyms, standard references, and where each term appears. |
| **Mock Exam** | The official Sample Exam set A v2.2, delivered "as it is" with the real exam's parameters: **Full Simulation** (40 Q, 60:00 countdown, pass 29/44, auto-submit, question palette, flagging, no feedback until submit), **Learning mode** (instant verdicts + official rationales), **Appendix set** (interactive A1/A4/A5 new-type questions), **Quick Quiz** builder. |
| **Results & Review** | Score ring with the pass threshold drawn on it, per-chapter and per-K-level breakdowns, verdict grid, and per-question review with the full official rationale (plus clearly-marked derived explanations where ISTQB gives none). |
| **Exam Intel** | Past-examinee advice (source-labeled, version-tagged v1.0/v2.0) and exam-pattern analysis — official mechanics, chapter weighting, timing arithmetic, the v1.0→v2.0 delta table, and known third-party errors. |
| **Videos** | A curated YouTube companion library — 87 videos from 62 channels (official ISTQB/accredited providers, recognized educators like 3Blue1Brown/StatQuest/IBM, reputed testing trainers) covering **all 51 syllabus sections**, plus a CT-AI-specific exam-prep group. Every video id was live-verified (oEmbed) before shipping; section chips deep-link into Study; v1.0-era material is flagged. **Play in-app** (click-to-stream in a dialog — zero network until you click, playback stops on close) or open on YouTube. A "Coverage notes & gaps" panel honestly flags the 26 topics where no video exists or coverage is thin/partial/uses industry synonyms — your self-study backstops. Rebuild: `python3 tools/build_videos.py` from curated `tools/videos.json`. |

All progress (study, attempts, weak areas, settings) is stored in your browser's localStorage.
System/Light/Dark theme with a sidebar picker (the sun/moon button is a quick flip), full keyboard
control, print-friendly cheatsheets.

## Documentation

- `USERGUIDE.md` — how to use the app as a candidate.
- `ARCHITECTURE.md` — how the system is built.
- `AGENTS.md` — working context for AI sessions (status, conventions, rebuild commands).
- `docs/plans/` — the original design documents (SPEC, three designs, adversarial review, research).

## Attribution

Content: © ISTQB® — Syllabus CT-AI v2.0 and Sample Exam set A v2.2, used here for personal study.
This is an unofficial study aid; verify exam facts with your Member Board. Community advice items
retain their sources and dates.

## Testing

The content, logic, and UI are all machine-verified (run from `site/`):

```
python3 tools/verify_content.py        # Gate A — verbatim syllabus/exam text, cheatsheet traceability (0 errors)
node tools/tests/engine.test.mjs       # Gate B — scoring/threshold/timer logic (49 tests)
node tools/tests/ui.test.mjs           # Gate C — 29 scripted UI scenarios (headless Chrome via raw CDP, zero deps)
node tools/tests/ui.test.mjs "file://$(pwd)"   # Gate C against file:// — the deployment constraint
node tools/probe_layout.mjs            # layout/testid audit: geometry JSON + screenshots to tools/shots/
```
The UI suite lives in `js/selftest.js` (open `#/selftest` in any browser to see the report) and
anchors on stable `data-testid`s across every interactive element — including a coverage walk that
fails if a new control ships without a testid, and layout assertions (no gap above the header,
exam shell flush).
