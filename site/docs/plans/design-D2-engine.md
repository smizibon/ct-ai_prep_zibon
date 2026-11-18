# Design D2 — Mock Exam Engine (ISTQB CT-AI v2.0 Sample Exam Set A)

Status: DESIGN ONLY — no implementation. Owner: design agent D2.
Scope: the exam-engine portion of the static HTML study site (modes, interaction, scoring, state, data pipeline, timer, a11y). Page chrome/navigation shared with the rest of the site is referenced but not designed here.

## 0. Sources & citation convention

Every parameter below carries a bracketed source tag:

- **[QE]** `markdown/ISTQB_CTAI_v2.0_SampleExam-Questions-v2.2.md` (Sample Exam set A, Questions, v2.2, 2026/07/20)
- **[AE]** `markdown/ISTQB_CTAI_v2.0_SampleExam-Answers-v2.2.md` (Sample Exam set A, Answers, v2.2)
- **[REC]** `/tmp/qbank/records/Q1..Q40.json, A1..A6.json` (verified per-question extraction; `raw_*` fields are byte-exact source substrings)
- **[MRG]** `/tmp/qbank/merged.json` (chapter grouping incl. appendix)
- **[DRV]** `/tmp/qbank/derived.json` (derived why-not bullets for Q6, Q7, Q10, Q11, Q17, Q30)
- **[EST]** ISTQB Exam Structure Tables v1.21 — real CT-AI v2.0 exam parameters, supplied in the project brief as verified ground truth
- **[D2]** Decision by this design (used only where no document defines the parameter; each such decision says why)

**Explicit gap statement:** the sample exam documents [QE][AE] define question content, point values, K-levels, LOs and the answer key, but define **no time limit, no pass mark and no question-count rules** — sample exams are self-assessment documents ("These questions cannot be used as-is in any official examination" [QE Introduction]). Where the engine needs such a parameter (timer, pass mark) we apply the official real-exam parameter [EST] and mark it "official real-exam parameter" in the UI.

### Ground-truth numbers used throughout

| Parameter | Value | Source |
|---|---|---|
| Real exam questions / points | 40 Q / 44 points (36×K2 1-pt + 4×K3 2-pt) | [EST] |
| K3 two-point questions | Q15, Q21, Q28, Q34 | [AE Answer Key] |
| Pass mark | 28.60/44 (65%), rounded to 29 | [EST] |
| Duration | 60 min (75 min where extended time applies) | [EST] |
| Official chapter distribution (main 40) | ch1=6, ch2=3, ch3=7, ch4=7, ch5=6, ch6=9, ch7=2 | [EST]; sample set A Q1–Q40 matches exactly [QE] |
| Sample set A total incl. appendix | 46 questions / 50 points (42×K2 + 4×K3) | [QE][AE]; [MRG] phase-2 gate |
| Multi-select questions | Q2, Q39 ("Select TWO answers") | [QE] |
| Appendix ("new question type") | A1–A6, 1 pt each, K2; A1/A4/A5 answered by figure, A2/A3/A6 lettered | [AE Appendix Answer Key] |
| Sample questions sorted by LO | yes — "this cannot be expected of a live exam" | [QE Introduction, footnote ¹] |

Points per chapter (main 40, 44 total): ch1=6, ch2=3, ch3=8, ch4=8, ch5=7, ch6=10, ch7=2 (derived from [AE] key table).
Points per chapter (all 46, 50 total): ch1=9, ch2=3, ch3=11, ch4=8, ch5=7, ch6=10, ch7=2 [MRG].

---

## 1. Exam modes

Four modes, all driven from the same `questions.js` data (§5). Mode selection lives on the site's "Mock Exam" landing page.

### 1.a Full Simulation ("Exam Simulator") — the flagship, "as it is"

Mirrors a real CT-AI v2.0 sitting using Sample Exam set A's 40 main questions.

| Parameter | Value | Source / note |
|---|---|---|
| Questions | Q1–Q40 in document order (see Shuffle below) | [QE]; "as it is" per user demand |
| Points | 44 max; K3 questions (Q15/Q21/Q28/Q34) worth 2, all others 1 | [QE headings, e.g. "### Question 15 (2 Points)"] |
| Timer | 60:00 countdown, starts on explicit "Start Exam" | [EST] official real-exam parameter (sample doc defines none) |
| Extended time | optional 75:00 toggle in settings ("where extended time applies" [EST]) — user-selectable, labeled "accommodation" | [EST], offered as a11y courtesy [D2] |
| Feedback | none until submit: no per-question check, no rationale, no correct/incorrect indication; K-level and points value are **hidden** during the sim (a live exam does not show them) | [D2], consistent with [EST] exam conditions |
| Navigator | question palette: 40 cells, states = unanswered / answered / flagged (answered+flagged shows both via dot); click or number key to jump | [D2] (mirrors common CBT exam UIs) |
| Flag for review | per-question flag toggle; flags never affect scoring; submit screen lists flagged questions | [D2] |
| Pause | **not pausable** (see §6 for justification) | [D2] |
| Auto-submit | at 0:00 the exam submits itself with whatever is on record; unanswered = 0 points | [D2] (real CBT exams behave this way) |
| Pass/fail | PASS at ≥ 29/44; FAIL below; on-screen wording "Pass mark: 28.60 rounded to 29 of 44 (65%) — official real-exam standard; the sample documents define no pass mark" | [EST] |
| Allowed attempts | unlimited; each run archived to history (§4) | [D2] |
| Review | after submit only; full review mode per §3.4 | [D2] |
| Multi-select | Q2, Q39: exactly two selections required; UX per §2.2 | [QE "Select TWO answers."] |
| Shuffle | **default OFF** ("as it is"). Toggle "Exam-like shuffle" (off by default, per-question-order and per-option-order randomization with re-lettered a–e; multi-select and set-based options shuffle safely since they are lettered options). Rationale: real exams may shuffle [QE footnote ¹ implies ordering is not guaranteed], but the user asked for "as it is", so the document order is the default. Seeded per attempt (§4). | [D2] |

Chapter/K-level breakdown on results uses the official distribution above; per-chapter bars labeled "Ch. 1 — Introduction to Artificial Intelligence" etc. with syllabus chapter titles from [MRG].

### 1.b Learning / Practice mode

| Parameter | Value | Source / note |
|---|---|---|
| Question pool | Q1–Q40 by default; **or** all 46 (main + appendix interleaved by chapter per [MRG] order); filterable by chapter (1–7), K-level (K2/K3), type (single / multi-select / figure / new-type), and "only questions I got wrong before" (from §4 stats) | [D2]; chapter membership from [MRG] |
| Timer | none; optional count-up stopwatch (informational) | [D2] |
| Feedback | per-question "Check answer" → instant verdict (correct/incorrect/partial-selection-invalid), then rationale reveal: correct answer, per-option verdicts verbatim from [AE], preamble rationale where present (Q6, Q7, Q10, Q11, Q17, Q30, Q34 style), derived why-not bullets [DRV] marked *[derived]*, LO / K-level / points shown **before** answering in this mode | [AE][REC][DRV] |
| Retries | a question may be re-attempted immediately after revealing (button "Try again"); only the first attempt counts into qstats (§4) | [D2] |
| Session grading | when a filtered/all-questions run is completed, show the same results screen as the sim minus pass/fail pressure: score, per-chapter, per-K — and, if the run covered all 46, the equivalent threshold of **33/50** (see §3.2) | [D2] |
| Pause | pausable (no timer to game; progress saved) | [D2] |
| Session resume | yes, via same session object as sim (§4) | [D2] |

### 1.c Appendix set A1–A6 ("New Question Types" practice set)

| Parameter | Value | Source / note |
|---|---|---|
| Questions | A1–A6 in document order, 6 points total, all K2 1-pt | [QE Appendix][AE Appendix key] |
| Timer | untimed | [D2] — these are interaction-practice items |
| Interaction | A1 = assign-to-category widget; A4 = click-pair matching; A5 = click-to-sequence (§2.4–2.6); A2/A3/A6 ordinary radio | [QE] |
| Feedback | same as Learning mode: instant check + rationale; for A1/A4/A5 the "correct answer" reveal shows (a) our interactive key rendered in the same widget (green), (b) the original answers-document figure (`answers_p32/35/36.png`), and (c) the verbatim transcription from [AE]; A5 additionally shows the explanation figure `answers_p37.png` + transcription | [AE][REC A1/A4/A5 `answer_figures`] |
| Grading | all-or-nothing per question (all assignments / pairs / the exact sequence) — see §3.3 | [D2], consistent with ISTQB all-or-nothing multi-select rule |
| Standalone threshold | if run as a scored set: 65% of 6 = 3.90 → **4/6**, labeled "equivalent only; appendix questions are not part of the official 40-question exam" | [EST] rule + [D2] |
| Disclosure note | the set intro reproduces the answers-doc fact that these are "New question type" items whose keys are given as figures | [AE] |

### 1.d Quick Quiz — YES, offer it

Decision: include a "Quick Quiz" builder because the engine already supports filtering; it serves spaced practice without the 60-minute commitment. Specification:

- Source: any mix of the 46 (default: main 40 only; toggle "include appendix A1–A6").
- Size: 5 / 10 (default) / 20 / custom up to 46.
- Selection: random sample, seeded per attempt, optionally constrained to chapters, K-levels, or "weak areas" (§4).
- Pacing: optional countdown computed from the official budget — **1 min per K2 question, 3 min per K3 question** [EST: "K2 ≈1 min each, K3 ≈3 min each"], e.g. 9×K2 + 1×K3 → 12:00. Default OFF (untimed), toggle "official pacing timer".
- Threshold: `ceil(0.65 × total points of selected questions)` — e.g. 10 one-pointers → ceil(6.5) = 7; a selection containing one K3 → e.g. 11 points → ceil(7.15) = 8. Displayed as "equivalent 65% standard" [EST rule], never as "the ISTQB pass mark".
- Feedback style: chosen at creation — "instant" (behaves like Learning mode) or "at end" (behaves like a mini-sim with palette + review). Default instant.

---

## 2. Question types & interaction

Cardinal rule: **original wording everywhere.** Stems, item sets, options, select-instructions and figure transcriptions are rendered verbatim from [REC] (`stem_markdown`, `options[].text`, `item_sets`, `select_instruction_verbatim`, `figures[].transcription`), including documented typos (Q5 "*Select ONE answer" without period; Q28 option c trailing comma "Comparison correlate constraint,"; Q34 options spanning two indented lines; source typo "AppendiDx" preserved in the study-guide content pages but not reused in engine UI labels). No paraphrasing, no reordering, no re-lettering unless the shuffle toggle (1.a) is active.

### 2.1 Single-select (36 of the main 40; A2, A3, A6)

- Widget: radio group, one option per row, letter chip (a/b/c/d) + verbatim text; options render as markdown (Q34's multi-line options keep their line breaks).
- Item-set questions (Q6, Q7, Q10, Q11, Q17, Q30 — roman/numbered statement lists and lettered example lists inside the stem) render those lists verbatim above the options; they are display-only, not interactive.
- Answer model: `selected: "a" | null`.

### 2.2 Multi-select TWO (Q2, Q39) — all-or-nothing

- Widget: checkbox group (5 options each — Q2 and Q39 both have a–e [QE]); space/checkbox toggles.
- **Max-2 enforcement:** a third checkbox cannot be checked; the attempt checks nothing and shows an inline notice + `aria-live` announcement: "This question requires exactly TWO answers. Deselect one to choose another." (The submitted answer must equal the key exactly, so a 3-selection state is unsatisfiable and is prevented rather than erroring at submit. [EST: all-or-nothing])
- Submit guard: if only 1 (or 0) is selected when leaving/submitting, the palette marks it "incomplete" and the submit dialog lists it under "Questions without exactly two answers selected" (still submittable — real exams allow unanswered questions [EST: unanswered = 0 points]).
- Answer model: `selected: ["c","e"]` (order-insensitive at compare time; stored sorted).

### 2.3 Figure question in the main set (Q15, K3, 2 pts)

- Render, in order: stem intro line ("Consider the following confusion matrix…"), the markdown-table **transcription** of the figure, the original PNG (`figures/questions_p14_Q15.png`) with its alt text, then the four formula options verbatim (asterisks unescaped as in [QE]) and "*Select ONE answer.*" [REC Q15].
- The transcription and the image are both shown (the image is tiny in the PDF and machine-unreadable; the transcription restores accessibility; the image preserves fidelity) [D2].
- Interaction: ordinary radio (§2.1).

### 2.4 A1 — assign each of 5 systems to one of 3 forms of AI

Data (verbatim from [QE]/[REC A1]):
- Statements (5): the five example AI systems, in document order.
- Categories (3): Narrow AI, General AI, Super AI.
- Constraint from the stem: "No form of AI can be left empty." — the UI enforces full assignment before "Check" is meaningful (Check always available; incomplete = incorrect, with a note quoting that constraint sentence).

Widget — **row-segmented assignment** (chosen over free drag because the correct data is many-to-one, and a per-row control is keyboard/screen-reader native):
- One bordered row per statement; right side holds a 3-button segmented control (Narrow AI / General AI / Super AI), radio semantics (`role=radiogroup`, one `fieldset` per row with the statement text as `legend`).
- Pointer alternative: click-pair — click a statement, then click one of three drop-zone category cards at top; the statement chip flies into that card. Both mechanisms write the same `assignment` map.
- Answer model: `assignment: { "<statement-index 0..4>": "Narrow AI" | "General AI" | "Super AI" }`.
- Key (from `answer.new_type_answer.assignments` [REC A1], itself the transcription of `answers_p32.png` [AE]): radiology→Narrow, French→Spanish→Narrow, schedules→General, science-collab→General, art-mind→Super.
- Review render: three category cards with the correct statements placed (green), the user's placements overlaid (red where misplaced), plus `answers_p32.png` + verbatim transcription + the five per-statement rationale paragraphs [AE A1].

### 2.5 A4 — pair 4 forms of ML with 4 example systems

Data (verbatim): left column Association / Classification / Reinforcement Learning / Regression; right column the four example systems in document order (energy, robotic arm, factory fault logs, bank) [QE][REC A4].

Widget — **click-pair matching with SVG connectors**:
- Two columns; click (or Enter) a left item → it becomes "armed" (highlighted); click a right item → a connector line is drawn and the pair is locked. Clicking an armed/locked item again disarms/unpairs. Drag-and-drop (drag left item onto right item) is supported as a pointer shortcut; keyboard flow: Tab to left item, Enter, Tab to right item, Enter.
- Exactly one right item per left item; pairing is a bijection (a right item already paired becomes unpaired from its old left partner — standard matching behavior, matches "Drag to pair each form of machine learning with an example machine learning system." [QE]).
- Answer model: `pairs: { "Association": "<right-index>", … }` (indices into the verbatim right-column list).
- **Grading key derivation (documented):** the answers figure pairs the *forms* to *its own two differing examples* (patient records / satellite crops instead of fault logs / bank transactions) — a known source quirk recorded in [REC A4 quirks] and in the transcription's own Note, which states the mapping is analogous either way: "Association → fault logs / patient records, Classification → bank transactions / crop images." Therefore the graded key against the question's own examples is:
  Association→factory fault logs, Classification→bank transactions, Reinforcement Learning→robotic arm, Regression→energy [REC A4 + embedded Note]. This mapping is stored as `interaction.correct` and marked `derived_from_answer_figure: true`; the mismatch Note is displayed verbatim in review so the derivation is transparent.
- Review render: the widget with correct connectors in green, user's wrong connectors in red, plus `answers_p35.png`, the verbatim transcription (including the Note), and the four per-form rationale bullets [AE A4]. The rationale bullets discuss the answer-figure's examples — kept verbatim; the Note explains why.

### 2.6 A5 — order 5 ML-workflow activities earliest→latest

Data (verbatim): the five activities in the shuffled exam order [QE]; axis labels EARLIER/LATER from the figure [REC A5 alt].

Widget — **click-to-sequence + reorder list**:
- Top: pool of five chips in the exam's shuffled order. Click a chip (or Enter) → it appends to the sequence lane (a horizontal EARLIER→LATER track on wide screens, vertical top→bottom on narrow). Click a sequenced chip to send it back to the pool.
- Sequenced chips have ↑/↓ buttons and native drag reorder; keyboard: focus a chip, arrow keys move it within the lane.
- Answer model: `sequence: ["<activity-text>", …]` (compared to the key as an exact ordered list).
- Key (from `answer.new_type_answer.ordered` [REC A5], transcription of `answers_p36.png` [AE]): Prepare & Test Data → Evaluate the Model → Test the Model → Deploy the Model → Monitor & Tune the Model.
- Review render: sequence lane with correct order in green and per-position user marks, plus `answers_p36.png` + transcription, the explanation figure `answers_p37.png` + transcription (which is the only rationale this question has — `rationale_style: figure_only` [REC A5]), and the doc's own Note that this workflow figure differs from syllabus Figure 1.

### 2.7 Mode × type interaction matrix

| Type | Sim | Learning | Appendix set | Quick Quiz |
|---|---|---|---|---|
| single radio (36 main + A2/A3/A6) | radio | radio + check | radio + check | radio |
| multi-TWO (Q2, Q39) | checkbox max-2 | same + check | — | same |
| figure radio (Q15) | image+table+radio | same + check | — | same |
| assign (A1) | — | — | widget + check | only if "include appendix" |
| pair (A4) | — | — | widget + check | only if "include appendix" |
| order (A5) | — | — | widget + check | only if "include appendix" |

The appendix interactive types never appear in the 40-question Simulation: the official exam's 40 questions map to Q1–Q40, and A1–A6 are explicitly "Additional Questions" outside that structure [QE][EST].

---

## 3. Scoring & results

### 3.1 Scoring rules

1. Single-select: 1 or 2 points iff selected letter ∈ `correct_keys` [AE key].
2. Multi-select (Q2, Q39): all-or-nothing — the set of selected letters must **exactly equal** the key set ("c, e" / "b, d"); no partial credit [EST ISTQB multi-select scoring; AE key].
3. K3 questions (Q15, Q21, Q28, Q34) are worth 2 points, awarded whole [QE point headings; AE key].
4. Unanswered = 0 points, not an error (see §8 edge cases).
5. Appendix interactives (A1/A4/A5): all-or-nothing against the full assignment map / pair bijection / exact sequence (§2.4–2.6 keys) [D2 — mirrors rule 2, since the answer figure defines one complete arrangement; AE presents each as a single 1-point question].
6. Points are integers only; no scaling.

### 3.2 Pass thresholds per mode (all derived from the official 65% rule)

Official anchor [EST]: pass mark = 65% of maximum, carried to two decimals (44 × 0.65 = 28.60) and stated as the next achievable whole score (29).

| Mode | Max | Threshold | Derivation & label shown to user |
|---|---|---|---|
| Full Simulation (40 Q) | 44 | **29** | "29/44 (official pass mark 28.60, rounded) — real-exam standard" [EST] |
| Full Practice run over all 46 | 50 | **33** | 50 × 0.65 = 32.50 → 33. Justification: identical 65% rule applied to the sample's 50 points; 32.5 is unachievable with integer point totals so the effective bar is 33. Labeled: "Equivalent threshold (65% of 50) — the appendix questions are not part of the official 40-question exam." [EST rule, D2 application] |
| Appendix set (6 Q) | 6 | **4** | 6 × 0.65 = 3.90 → 4, "equivalent only" [EST rule, D2] |
| Quick Quiz (n Q) | Σ pts | `ceil(0.65 × Σ)` | per-selection, "equivalent 65% standard" [EST rule, D2] |
| Chapter-filtered practice run | Σ pts | shown informatively as %, with 65% reference line | [D2] |

The engine computes thresholds from `totalPoints` at session creation — never hard-codes 29/33/4 — so a future Sample Exam set B drops in unchanged.

### 3.3 Scoring pseudocode

```
function scoreQuestion(q, resp):            # q = question object (§5), resp = stored response
    if resp is null or resp.selected/pairs/assignment/sequence is empty:
        return { points: 0, verdict: "unanswered" }
    switch q.type:
      "single":     ok = (resp.selected == q.correct_keys[0])
      "multi_two":  ok = (sort(resp.selected) == sort(q.correct_keys))   # all-or-nothing [EST]
      "assign":     ok = (resp.assignment deep-equals q.interaction.correct_assignment)  # all 5 rows
      "pair":       ok = (resp.pairs   deep-equals q.interaction.correct_pairs)         # all 4 pairs
      "order":      ok = (resp.sequence array-equals q.interaction.correct_sequence)    # exact order
    return { points: ok ? q.points : 0,
             verdict: ok ? "correct" : "incorrect" }

function scoreSession(session):             # runs at submit (or per-check in instant modes)
    r = { perQuestion: [], points: 0, max: 0 }
    for q in session.questions:
        s = scoreQuestion(q, session.responses[q.id])
        r.perQuestion.push({ id: q.id, ...s, flagged: session.flags[q.id] })
        r.points += s.points; r.max += q.points
    r.threshold = ceil(0.65 * r.max)        # reproduces 29 @44, 33 @50, 4 @6 [EST 65% rule]
    r.passed   = (r.points >= r.threshold)  # only surfaced as PASS/FAIL in Simulation
    r.byChapter = group(r.perQuestion, q -> q.chapter)   # {n, pointsEarned, pointsMax, correct, total}
    r.byKLevel  = group(r.perQuestion, q -> q.k_level)   # K2 36/40, K3 4/40 for the sim
    r.timeUsed  = session.endsAt - session.startedAt (sim) or stopwatch (practice)
    return r
```

### 3.4 Results screen (after submit)

- **Score ring:** `points / max` with the threshold drawn as a tick at `threshold/max` fraction; center text = points; caption "PASS" / "FAIL" (Simulation only) with the exact threshold wording from §3.2.
- **Time used:** mm:ss (and "auto-submitted at time limit" badge when applicable).
- **Per-chapter bars:** 7 rows (Ch. 1–7 with syllabus titles [MRG]), each `pointsEarned / pointsMax` with question counts; appendix-inclusive runs show the same 7 chapters with appendix points folded into their chapters per [MRG].
- **Per-K-level:** two rows — K2 `correct/36 questions`, K3 `correct/4 questions` (proportions of correct *questions*, points shown alongside).
- **Question verdict list:** 40 (or n) compact rows — number, verdict icon (correct / incorrect / unanswered), flag marker, "2 pts" chip for K3; click → review mode.
- **Actions:** "Review all", "Review incorrect only", "Review flagged", "Retake exam", "Back to mode picker".

### 3.5 Review mode (shared by all modes post-completion)

Read-only traversal over the same question cards used during the exam, augmented:
1. The user's answer (highlighted), the correct answer (green) — for multi-select, per-letter ✓/✗ against the key; for A1/A4/A5, the overlays described in §2.4–2.6.
2. Verbatim blocks: question (stem + item sets + figures + select-instruction), then from [AE] via [REC]: "Correct answer: c" (or the answers figure + transcription), per-option rationale bullets ("a) Is not correct. …"), preamble rationale where present, conclusion where present.
3. Derived why-not bullets [DRV] appended under the matching options for Q6, Q7, Q10, Q11, Q17, Q30, prefixed `*[derived]*` exactly as in [DRV].
4. Metadata line: `LO AI-x.y.z · K-level · Points · Chapter n` — for Q29 the engine displays the key-table LO **AI-5.1.6** (authoritative; the section metadata's AI-5.1.7 is a recorded source discrepancy — 5.1.7 is HO-only in the syllabus — shown as a footnote in review, not used for grouping) [REC Q29 `lo_conflict: true`].
5. Navigation: prev/next through the reviewed subset, `1–9/0` jump, return-to-results link; filters (all / incorrect / unanswered / flagged) carried over.

---

## 4. State & persistence (localStorage)

All state in a single namespaced key family `ctai.*`, JSON, versioned (`v: 1`) with a migration hook. Site is static/offline; localStorage is the only store. Graceful degradation: if storage is unavailable (private mode/quota), the engine runs session-only (answers kept in memory, history skipped) with a one-time banner.

### 4.1 Keys & schema

```
ctai.session.v1        # the single active/in-progress session (sim or practice). Absent = none.
{
  mode: "sim" | "practice" | "appendix" | "quick",
  sessionId: "s-1699…",              # created_at + random
  questionIds: ["Q1", …],            # ordered; shuffle already applied
  orderMap?: {Q1: ["a","c","b","d"]},# present only if shuffle ON: display-order of option keys per question
  responses: { Q1: {selected:"a"}, Q2: {selected:["c","e"]},
               A1: {assignment:{…}}, A4: {pairs:{…}}, A5: {sequence:[…]}, … },   # typed per §2
  flags:    { Q15: true, … },
  startedAt: 1699…,                  # epoch ms
  endsAt:    1699…,                  # sim only: startedAt + 60*60_000 (+15 min if extended)
  pausedRemainingMs?: 421_000,       # practice/quick only (pausable modes); sim never writes this
  timerStyle: "countdown" | "countup" | "none",
  checkMode: "instant" | "at_end",
  threshold: 29, maxPoints: 44,      # computed at creation (§3.2)
  uiState: { currentIndex: 14 },
  lastHeartbeatAt: 1699…             # written every answer + every 30 s (§6 clock-drift clamp)
}

ctai.attempts.v1       # array of completed attempts, newest first, capped at 50 (oldest dropped)
[{
  sessionId, mode, startedAt, submittedAt, timeUsedMs, autoSubmitted: bool,
  points, maxPoints, threshold, passed, shuffle: bool,
  perQuestion: [{ id, verdict, selected, points }],
  byChapter, byKLevel
}]

ctai.qstats.v1         # per-question lifetime stats (first-attempt-only from instant-check modes)
{ "Q15": { seen: 3, correct: 1, incorrect: 2, lastVerdict: "incorrect", lastAttemptAt: … },
  … }
# → "Weak areas" indicator: chapters and LOs where correct/seen < 0.60 with seen ≥ 2, plus any
#   single question incorrect ≥ 2 times. Surfaced on the mode picker as chips ("Ch. 5 — 2/5",
#   "Q28 missed twice") that pre-filter Learning mode / Quick Quiz. [D2 thresholds]

ctai.settings.v1       # { extendedTime: bool, shuffleDefault: bool, reduceMotion: "auto"|"on"|"off" }
```

### 4.2 Resume & timer persistence

- On load, if `ctai.session.v1` exists: **sim** → offer "Resume exam" (shows remaining time computed from `endsAt`) or "Abandon & restart" (abandon archives nothing — it is a fresh start, mirroring a real sitting [D2]); **practice/appendix/quick** → auto-resume at `uiState.currentIndex`.
- Timer correctness across reloads: the sim stores `endsAt` (absolute wall-clock), not a ticking number, so reloads cannot extend it. If the page was closed and reopened **after** `endsAt`, the session auto-submits immediately with stored responses (timeUsed = full duration).
- Clock-drift clamp: each heartbeat stores `lastHeartbeatAt`; on resume, if `Date.now() < lastHeartbeatAt − 60_000` (system clock moved backwards), `endsAt` is shifted by the observed delta so the remaining time cannot be inflated. Forward jumps are accepted as elapsed time (conservative).
- Multi-tab: `storage` events propagate; answers merge last-write-wins per question (each response write is a full-object write keyed by question id); a second tab trying to start a sim while one is active is blocked with "An exam is in progress in another tab."
- History & qstats feed: on submit, push to `attempts`, then for instant-check modes fold **first-attempt** verdicts into `qstats` (re-tries after rationale reveal do not inflate `seen`).

### 4.3 State machine (pseudocode)

```
states: idle → running → submitted → review           (practice/appendix/quick: running ⇄ paused)

idle:
  on startSession(mode, opts)      -> create session, persist, -> running
  on openAttempt(id)               -> -> review (historical attempt)

running (sim):                      running (practice/appendix/quick):
  on select/answer  -> persist response    on pause()  -> store pausedRemainingMs -> paused
  on flag(q)        -> toggle             on resume() -> recompute from stored    -> running
  on tick()==0      -> autoSubmit()       on check(q) -> verdict (no state change)
  on manualSubmit() -> confirm-dlg        on finish() -> submitSession()
       (lists unanswered +                      -> submitted
        single-selected multis)
  on submit         -> submitSession() -> submitted

submitted: renderResults(); push attempt; fold qstats
  on review(filter?) -> review
  on retake()        -> idle → startSession(same opts)

review:
  on navigate(q)    -> stay
  on backToResults()-> submitted (re-render from attempts entry)
  on exit()         -> idle
```

---

## 5. Data pipeline — `questions.js`

One build artifact, `assets/js/questions.js`, defining `window.CTAI_QUESTIONS = […]` (plain script tag, no modules needed for the static site). Generated by a small build script from `/tmp/qbank/records/*.json` + `/tmp/qbank/merged.json` + `/tmp/qbank/derived.json` (generation is mechanical; the engine never parses markdown at runtime — markdown fields are pre-rendered to HTML at build time, or rendered by the site's existing tiny md renderer; both fields shipped: `*_md` source + `*_html`).

### 5.1 UI-facing question object

```
{
  id: "Q15", set: "main",                     // "main" (Q1–Q40) | "appendix" (A1–A6)
  number: 15, label: "Question 15",
  chapter: 3, chapter_title: "Machine Learning",     // from [MRG] entries
  lo: "AI-3.3.1",                              // answer.lo_key; Q29 → "AI-5.1.6" (+ lo_note, §3.5)
  lo_note: null | "Answer-key table: AI-5.1.6; section metadata: AI-5.1.7 (HO-only in syllabus)",
  k_level: "K3", points: 2,
  type: "single" | "multi_two" | "assign" | "pair" | "order",
  stem_md:  <REC .stem_markdown>,              // verbatim, incl. tables & figure embeds
  stem_html: <pre-rendered>,
  item_sets: [ {role, items:[{key,text}]} ] | [],   // verbatim display-only lists (Q6/Q7/Q10/Q11/Q17/Q30, A1/A4/A5)
  options: [ {key:"a", text_md, text_html} ] | null,   // null for A1/A4/A5
  select_instruction: "*Select ONE answer.*" | null,   // verbatim [REC select_instruction_verbatim]
  figures: [ {src:"assets/fig/questions_p14_Q15.png", alt, caption_note, transcription_md} ],
  correct_keys: ["c"] ,                        // from [AE] key table via [REC]; [] for A1/A4/A5
  rationale: {
    preamble_md | null,                        // Q6/Q7/Q10/Q11/Q17/Q30/Q34 style preambles
    units: [ {key:"a", verdict:"not_correct", phrase:"Is not correct.", text_md, text_html} ],
    conclusion_md | null,
    answer_figures: [ {kind:"answer"|"explanation", src, alt, context_note, transcription_md} ]  // A1/A4/A5
  },
  why_not_derived: [ {key:"a", text_md, text_html} ] | [],   // from [DRV]; rendered with *[derived]* marker
  interaction: null | (see §5.2),
  source_refs: { questions_md: "ISTQB_CTAI_v2.0_SampleExam-Questions-v2.2.md#question-15",
                 answers_md:   "…Answers…#question-15", record: "/tmp/qbank/records/Q15.json" },
  quirks: [...]                                // surfaced in a collapsed "Source notes" drawer in review
}
```

### 5.2 Appendix interactive structures (A1/A4/A5)

Their "options" ARE the figure content; the structures below keep every string verbatim from [REC] and add the graded key derived from the answers figures (§2.4–2.6):

```
A1  type:"assign"
  interaction: {
    statements: [5 verbatim strings in document order],       // render order fixed
    categories: ["Narrow AI","General AI","Super AI"],
    correct_assignment: { "0":"Super AI", "1":"General AI", "2":"General AI",
                          "3":"Narrow AI", "4":"Narrow AI" }, // indices↔statements; from [REC A1 new_type_answer]
    derived_from_answer_figure: true, answer_figure: "assets/fig/answers_p32.png" }

A4  type:"pair"
  interaction: {
    left:  ["Association","Classification","Reinforcement Learning","Regression"],
    right: [4 verbatim example strings in document order],    // energy, robotic arm, fault logs, bank
    correct_pairs: { "Association": 2, "Classification": 3, "Reinforcement Learning": 1,
                     "Regression": 0 },                        // left → index into right; derived per §2.5
    derivation_note: <verbatim Note from [REC A4 transcription] about the answer-figure example mismatch>,
    derived_from_answer_figure: true, answer_figure: "assets/fig/answers_p35.png" }

A5  type:"order"
  interaction: {
    items: [5 verbatim activity strings in the exam's shuffled order],
    axis: {start:"EARLIER", end:"LATER"},
    correct_sequence: ["Prepare & Test Data","Evaluate the Model","Test the Model",
                       "Deploy the Model","Monitor & Tune the Model"],  // [REC A5 new_type_answer.ordered]
    derived_from_answer_figure: true,
    answer_figure: "assets/fig/answers_p36.png",
    explanation_figure: "assets/fig/answers_p37.png" }         // sole rationale for A5 (figure_only)
```

Index-keyed grading (statement index / right-column index / ordered list) avoids string-compare fragility while the arrays keep the verbatim text for display.

### 5.3 Build rules & asset copying

- Order in the file: Q1…Q40 then A1…A6 (document order [QE]); mode builders re-order per [MRG] chapter sequences where needed.
- Figures copied at build time from `markdown/figures/` → `assets/fig/`: exam-side `questions_p14_Q15.png`, `questions_p26_A1.png`, `questions_p27_A4.png`, `questions_p28_A5.png`; review-side `answers_p32.png`, `answers_p35.png`, `answers_p36.png`, `answers_p37.png`. `figures[].src` rewritten to `assets/fig/…`; alt/caption/transcription copied verbatim [REC].
- Validation gates at build (fail loudly): 46 objects; ids exactly Q1–Q40+A1–A6; `correct_keys ⊆ options.keys` where options exist; |correct_keys| = 2 for Q2/Q39; `interaction` non-null exactly for A1/A4/A5 with `correct_*` covering every index; points sum = 50 (44 main / 6 appendix); every `figures[].src` and `answer_figures[].src` resolves to a copied file. (Mirrors the phase-1/2 gates already proven against the records in /tmp/qbank/SPEC.md.)
- `derived.json` is merged only onto its 6 target questions, keys must match existing option letters, and the `*[derived]*` marker text is preserved — build fails if a [DRV] key has no matching option.

---

## 6. Timer & integrity

- Display: sticky header chip `mm:ss`, `tab`-title mirrored ("29:41 · CT-AI Exam"). Updates every second from `endsAt − now`.
- Low-time states [D2 — UX additions; no official document defines in-exam warnings]: ≤ 10:00 amber; ≤ 5:00 red + gentle pulse (suppressed under `prefers-reduced-motion`); a single `aria-live` announcement at 5:00 and 1:00.
- Auto-submit at 0:00: answers locked, submit path identical to manual submit, results flagged `autoSubmitted`, review notes "auto-submitted at the time limit."
- **Pause policy:** Simulation is **not pausable** — justification: (1) fidelity, the real 60-minute sitting has no pause [EST]; (2) anti-gaming, a pausable countdown invites pausing on every question, destroying the pacing the sim exists to train; (3) resume-safety, an absolute `endsAt` is trivially reload-proof (§4.2) whereas pause+resume invites clock manipulation edge cases. Learning / Appendix / Quick modes **are** pausable: they are explicitly low-pressure, timer (if any) is informational or derived pacing (§1.d), and pausing aids the study use-case. Closing the tab mid-sim does not pause anything — wall clock runs, exactly like leaving a real exam room.
- `beforeunload` guard while a sim is `running`: browser-native "Leave site?" dialog; also intercept internal site-nav links out of the exam shell. Not applied to practice modes (they auto-save).
- Extended time (75:00) is a settings toggle (§1.a) honored at session creation; switching it mid-exam is disabled.

---

## 7. Accessibility & keyboard

- Keys (documented in an on-exam "?" shortcut sheet):
  - `a`–`e` select option for single-select (letter shown on the option chip; `e` active only where a 5th option exists — Q2, Q39); for multi-TWO, `a`–`e` toggle with max-2 enforcement announced via `aria-live`.
  - `←`/`→` (and `j`/`k`) previous/next question; `1`–`9`, `0` jump to question 1–10; with `Shift` for 11–40 (`Shift`+digit = decade jump UX: plain digits 1–9/0 target 1–10; `g` then digits = "go to" prompt is the accessible fallback).
  - `f` toggle flag; `Enter` on focused interactive element activates (arm/pair/sequence per §2.4–2.6).
  - All shortcuts disabled when focus is in a text-input control (none currently exist inside the exam; future-proofing).
- Screen readers: each question card is a `fieldset` with
  `legend` = "Question 15, 2 points" (sim hides points → "Question 15"); options in a `role=radiogroup`/`group` with `aria-describedby` pointing at the select-instruction ("Select TWO answers."); verdicts after Check are announced politely; the timer chip has `role="timer"` + `aria-live="off"` (announcements only at 5:00/1:00 milestones, §6).
- Widgets: A1 rows are per-statement radio fieldsets; A4 pairing is operable entirely by keyboard (Enter-arm / Enter-connect, `Escape` disarm); A5 reorder uses ↑/↓ buttons with `aria-roledescription="draggable item"`; all three degrade to a no-JS-DOM-DnD path (buttons only) — pointer drag is enhancement.
- Color is never the sole signal (verdicts pair icons + text); contrast ≥ 4.5:1; `prefers-reduced-motion` disables pulse/chip-fly animations; palette cells have text labels ("Q15 answered flagged") in tooltips/`aria-label`.

---

## 8. Edge cases (explicit)

1. **Unanswered questions:** submittable; score 0; verdict list & review mark "Not answered"; submit dialog counts them ("3 unanswered, incl. Q12"); multi-select with ≠2 selections counted separately (§2.2).
2. **Multi-select with only 1 selected:** never auto-rejected; warned pre-submit; scores 0 unless exactly matching the 2-letter key (all-or-nothing [EST]).
3. **Reload mid-sim:** resume with correct remaining time from `endsAt`; reopened after expiry → auto-submit (§4.2). Clock moved backwards → drift clamp shifts `endsAt`; clock moved forwards → time accepted as elapsed.
4. **Two tabs / two exams:** second sim start blocked; practice sessions are single-slot too (`ctai.session.v1` holds one); answer writes last-write-wins per question id.
5. **Appendix grading:** A1/A4/A5 are all-or-nothing against index keys (§5.2); A4 grades against the question's own examples with the documented derivation note shown in review; an incomplete assignment/pairing/ordering at Check scores incorrect with the stem's constraint quoted (A1 "No form of AI can be left empty.").
6. **Shuffle determinism:** shuffle seed stored in the session; review and history render the *original* letters alongside the presented ones ("you chose b (shown as a) — original key: c") so attempts stay comparable with the printed documents.
7. **localStorage full / disabled:** engine runs in-memory, banner explains no persistence; results screen still works; sim beforeunload guard becomes the only reload protection.
8. **Q29 LO discrepancy:** stats/grouping use key-table AI-5.1.6; the AI-5.1.7 metadata is displayed as a footnote only [REC Q29].
9. **Multi-line / typo-laden options (Q34 two-line options, Q28 trailing comma, Q5 missing period):** rendered verbatim from `options[].text_md`; markdown renderer must preserve single newlines + indentation inside options (build-time check compares rendered text content to source text).
10. **Attempt history cap (50):** oldest dropped; qstats are cumulative and survive the cap (weak-areas data degrades gracefully, never breaks).
11. **Future set B:** thresholds computed from totals (§3.2); build gates assert point sums, so a second sample set cannot silently mix into the 40-question sim pool (`set: "main"` filter).

---

## 9. Out of scope / deferred

- Server-side scoring, accounts, sync (site is static by requirement).
- Printing/export of results beyond the browser's print-to-PDF of the results page.
- Timed appendix simulation (appendix is practice-only per §1.c rationale).
- Audio proctoring theater (pause-lock + beforeunload is the entire integrity model; honest about being self-administered).
