# CT-AI Studio — User Guide

A practical guide to studying for the ISTQB CT-AI v2.0 exam with this app.

## Opening the app

Double-click `index.html`, or run `./tools/start.sh` inside the `site/` folder and open
http://127.0.0.1:8765/. Everything is offline and private — your progress lives in this browser's
storage on this machine (clearing site data resets it; the sidebar's ↻ button does the same on purpose).

**Theme:** the sidebar's THEME picker is a three-way radio — System (follows your OS, live), Light,
Dark. The sun/moon icon button next to it is a one-click flip between light and dark; the `t` key
does the same.

## A suggested study path

1. **Orient on the Dashboard.** The readiness ring = ½ study progress + ½ best simulation score.
   Before your first simulation it shows study progress only.
2. **Study chapter by chapter** (Study → chapter card). Each syllabus subsection is a learning
   objective card: open it, read the verbatim syllabus text, note the K-level chip and the sample
   questions linked at the bottom. Click **Understood** when you could explain it — that's what
   feeds your progress rings. Hands-on units (H1/H2) are marked and not directly examinable.
3. **Weight your time like the exam does.** Chapter 3 (Machine Learning) + Chapter 6 (Model
   Testing) = 16 of 40 questions ≈ 41% of the points. Chapter 7 is tiny (2 questions, 30 minutes).
4. **Revise with the Cheatsheets.** Every bullet carries a small `src` chip (e.g. `6.1.7 L1279-L1280`)
   pointing at the exact syllabus lines it compresses — click through whenever a claim surprises you.
   The formula block in Chapter 3 (accuracy/precision/recall/F1) is the exam's only calculation LO.
5. **Drill the Glossary.** For Specialist exams every syllabus keyword is examinable at definition
   level — the cheapest points on the test. Filter box + A–Z rail; "must-know" badges mark chapter
   keywords.
6. **Check the Exam Intel tab** before booking: past-examinee advice (labeled official / reddit /
   provider / v1.0-era), the v1.0→v2.0 delta (don't study removed topics!), and the timing arithmetic.

## The mock exam — four modes

| Mode | What it simulates | Feedback | Timer |
|---|---|---|---|
| **Full Simulation** | The real thing: Q1–Q40, 44 points, pass at 29 | None until submit; K-levels hidden like the real exam | 60:00 countdown (optionally 75:00 with the official +25% non-native extension), auto-submit at 0:00 |
| **Learning Mode** | Any chapter / all 46 | Instant per-question verdict + the full official rationale, per-option verdicts, and `derived` chips where ISTQB publishes no explanation | Optional stopwatch |
| **Appendix set** | A1–A6 "new question types" | Instant + the official answer figures | Untimed |
| **Quick Quiz** | 5/10/20 random questions | Instant | Optional "official pacing" countdown (1 min per K2, 3 per K3) |

Simulation rules that matter: multi-select questions ("Select TWO") are **all-or-nothing** — exactly
two answers, no partial credit; unanswered questions score 0 but are allowed; flagging never affects
scoring. The exam is not pausable (like the real sitting) — closing the tab keeps the clock running;
reloading resumes with the correct remaining time.

### The appendix interactives (A1, A4, A5)
- **A1**: assign each system to Narrow / General / Super AI using the per-row segmented control.
- **A4**: click a form of learning (left), then its example system (right) to draw a connector;
  re-pairing steals a matched item. Note: ISTQB's own answer figure uses two different examples —
  the review screen shows their note explaining the analogy.
- **A5**: click the five activities in order (earliest → latest); arrows re-order; click to remove.

### Results & review
After submitting you get the score ring (the pass-threshold tick is drawn on it), per-chapter and
per-K-level bars, and a verdict grid. **Review** walks each question with your answer marked, the
official answer highlighted, per-option rationale bullets, and Q29's LO discrepancy footnote.

## Keyboard shortcuts

| Keys | Action |
|---|---|
| `/` or `⌘K` | Search everything (glossary, LOs, cheatsheets, intel) |
| `g` then `d/s/c/g/e/i/r` | Go to Dashboard / Study / Cheatsheets / Glossary / Exam / Intel / Results |
| `t` | Toggle dark/light · `?` all shortcuts |
| **In an exam** | `a b c d e` select option · `f` flag · `←`/`→` or `p`/`n` navigate · digits + `⏎` jump · `s` submit/finish |
| **In review** | `j`/`k` next/prev · `1–4` switch filters |

## Printing

Cheatsheet and study pages print cleanly (browser print → save as PDF): chrome hidden, light theme
forced, each cheatsheet block kept together.

## Honest small print

- The sample exam is ISTQB's set A v2.2 (July 2026) reproduced verbatim, including its typos;
  sample questions "cannot be used as-is in any official examination" — they're for practice.
- v2.0 first-hand exam reports are still scarce (Nov 2026); v1.0-era difficulty anecdotes are
  version-tagged where they appear.
- Unofficial study aid. Confirm exam logistics (booking, fees, retakes, extended time) with your
  Member Board.

## Self-test (for maintainers)

Open `#/selftest` (or run `node tools/tests/ui.test.mjs` from `site/` with the dev server up) to run
the scripted UI suite — 24 scenarios covering reveals, widgets, the full simulation, review filters,
resume, the mobile sheet, layout invariants (no gap above the header, exam shell flush), and a
`data-testid` coverage walk over every interactive element. It backs up and restores your progress
automatically. The same command with `file://$(pwd)` proves the site works when opened directly from
disk, and `node tools/probe_layout.mjs` prints per-route geometry (page heights, paddings) with
screenshots into `tools/shots/`.
