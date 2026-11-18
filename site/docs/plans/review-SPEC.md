# Adversarial Review — SPEC.md (CT-AI Studio) + D1/D2/D3 + R1/R2
Reviewer: design-breaker agent, 2026-11-17. Every claim below was verified against the syllabus,
qbank records, merged/derived JSON, and the answers doc — not against the designs' own assertions.

## A. SPEC's 10 conflict resolutions — are they right?

All 10 checked against ground truth. Correct and verified:
- #4 (50 pts, not 49): merged.json totals 46 Q / 50 pts; per-chapter points 9/3/11/8/7/10/2 = 50.
  D1 §5's "49" was indeed an arithmetic slip (its own per-chapter numbers sum to 50). ✓
- #1/#2/#3/#5/#6/#7/#8/#9/#10: internally consistent after resolution; load order and figure-dir
  (`assets/fig/`) unambiguous; ceil thresholds (#8) verified: ceil(0.65·44)=29, ceil(0.65·50)=33,
  ceil(0.65·6)=4 — all exact; Quick-Quiz examples 10→7 and 11→8 also correct.

**Conflicts the SPEC MISSED (all blocking except S-items):**
1. **Timer warning thresholds & announcements — D2 §6 vs D3 §3.10 contradict.**
   D2: amber ≤10:00, red ≤5:00, single announcements at 5:00 and 1:00.
   D3: warn <10:00, **critical <2:00**, announcements at **10:00, 2:00, 0:30**.
   Different engine behavior; SPEC is silent; "design doc wins" cannot decide between two designs.
2. **Number-key question jumping — D2 §7 vs D3 §3.9/§4.7/§6 contradict.**
   D2: digits 1–9/0 jump directly to Q1–10, `Shift`+digit = decade jump to 11–40, `g`-chord fallback.
   D3: digits type into a jump **buffer**, `Enter` commits ("1" "7" ⏎ → Q17).
   Mutually incompatible keyboard contracts; both are "final" per D3's header claim.
3. **Cross-mode single-slot session collision (feasibility, C).** `ctai.session.v1` holds one
   session. D2 §8.4 blocks a *second sim* start, but says nothing about starting a sim while a
   practice/appendix/quick session is active (or quiz while sim active). As written, the new
   session silently overwrites the old one → user loses an in-progress practice run. Must specify:
   block, or archive-then-replace.
4. (Minor, see S1/S3/S4): progress value shape, appendix pause schema note, quick-timer expiry.

## B. Factual verification of D1/D2 numbers

Verified CORRECT (checked in source, not trusted):
- 51 subsections; 43 AI- LOs; 8 HOs; per-chapter 8/3/13/8/7/10/2; HO subsection lines
  637/690/761/765/795/937/1129/1266; chapter headings at 277/434/502/815/976/1133/1334.
  Caveat: correct only with regex `\d+\.\d+\.\d+` — `6.1.10` (bullet line 1156, heading line 1318)
  breaks naive `\d` patterns. D1 §6's generation regex is already correct; keep it that way.
- Glossary: section 9 table lines 1430–1549 = exactly 118 rows; abbreviations 1394–1426 = 31 rows.
- 3 embedded images in ch1–7 (lines 633, 777, 789). `syllabus_p36_R236.png` is an unembedded
  grayscale duplicate (markdown/README.md:58-61) — SPEC's "3 syllabus PNGs" copy list is right.
- D2: 46 Q / 50 pts (44 main + 6 appendix); per-chapter Q 9/3/10/7/6/9/2 and main-40 distribution
  6/3/7/7/6/9/2 matches merged.json AND the official table in R2; K3 2-pt = Q15/Q21/Q28/Q34
  (answers-doc key table rows confirmed: 15|c|K3|2, 21|d|K3|2, 28|c|K3|2, 34|b|K3|2);
  Q2="c, e" and Q39="b, d" with 5 options each (only multi-selects); Q29 lo_conflict=true
  (key AI-5.1.6 vs section AI-5.1.7, which is indeed HO-only); A1/A4/A5 figure-keyed; Q15 figure
  `questions_p14_Q15.png` exists; derived.json targets exactly Q6/Q7/Q10/Q11/Q17/Q30 with keys
  that are all valid existing option letters (non-correct options only).
- A1 key: record statement order is [art-mind, schedules, science-collab, radiology, French];
  D2 §5.2 index map {0:Super,1:General,2:General,3:Narrow,4:Narrow} AND §2.4's prose both match
  `new_type_answer.assignments`. ✓
- A5 key: pool order and ordered key match `new_type_answer.ordered` exactly. ✓
- A4 derivation (D): SOUND. Right column doc order = [energy, robotic arm, fault logs, bank];
  D2's correct_pairs {Assoc:2, Class:3, RL:1, Regr:0} matches the record's embedded Note
  ("Association → fault logs / patient records, Classification → bank transactions / crop images");
  rationale bullets independently support each mapping (RL and Regression examples are identical
  strings; Association = mining unlabeled records ≈ fault logs; Classification = binary labeled
  legit/suspicious ≈ bank). The `derived_from_answer_figure` transparency treatment is adequate.

**Factual ERRORS found:**
1. **D1 §1.4 worked example**: joins `Q10, answer "b"` to subsection 3.1.2 (AI-3.1.2). Ground
   truth: Q10 → AI-3.1.1, answer "c"; AI-3.1.2's question is Q11 ("d"). Wrong question AND wrong
   answer in the schema exemplar.
2. **D1 §1.5 worked example ("Real output of the conversion")**: `Q25, answer: "a"`. Ground
   truth: Q25 answer "c" (record + merged + answers doc). Wrong answer in the quality-bar sample.
3. Neither error would be caught by Gate A as written — it checks question COUNTS and POINTS per
   chapter, not per-row `answer` equality against merged.json. A wrong answer chip displayed on a
   study page would ship.

## C. Feasibility gaps

1. **BLOCKER — stem_md embeds the options in all 43 lettered questions.** Every main-set
   `stem_markdown` (and A2/A3/A6) ends with the full lettered options list (`- a) …` … `- d) …`)
   plus the select-instruction. D2 §5.1 renders `stem_md` AND `options[]` separately → every
   question renders twice. Worse: with "Exam-like shuffle" re-lettering, the shuffled/re-lettered
   option rows would contradict the original letters still embedded in the stem — a visible
   cardinal-rule break ("you chose b (shown as a)" vs a stem that says "- b) <different text>").
   `build_questions.py` must strip the trailing options+instruction block from stem_md (it already
   must extract `select_instruction`), and Gate A needs an assertion: no option text occurs in
   stem_md; no `- x)` lettered list remains in any lettered question's stem.
2. **BLOCKER — the 25% cheatsheet word cap fails its own quality bar.** Ch2 prose (lines 434–501)
   = 1,579 words → cap ≈ 394. D1 §2.3's worked Chapter 2 cheatsheet — declared "the quality bar
   for the other six" — contains ≈ 777 words of content strings, ~2× its own hard cap. The 8
   verbatim keyTerms definitions alone are ~200+ words. Ch7 is worse: 805 prose words → cap ≈ 201
   words for 5 mandatory block types. Gate A as specced rejects the SPEC's own Phase-A2 exemplar.
   Fix: raise the cap (e.g., 50%) or exclude verbatim/auto-joined blocks (meta, keyTerms defs,
   examPointers) from the counted words — and re-issue the ch2 exemplar to whatever rule is chosen.
3. Cross-mode session overwrite (see A3) — data-loss path, must be specified.
4. Phase C serves via http only; the product's hard constraint is file:// (D1 §4: no fetch because
   Chromium blocks it there). Add a file:// smoke pass (open index.html directly; check data loads,
   figures, dark mode) so http-only regressions can't mask fetch/module accidents.
5. Timer drift clamp logic is sound in intent (backward clock: shift `endsAt` by delta so remaining
   time cannot inflate; forward jumps accepted) but the spec should pin the sign of the shift and
   require `lastHeartbeatAt` to be rewritten when shifting (else repeated resumes double-shift).
6. Byte-equality gate is genuinely equality after the whitelisted substitution (D1 §7.1 applies the
   `figures/ → assets/fig/` rewrite to the SOURCE side, then compares) — workable. Note D1's
   normalize also collapses trailing whitespace; SPEC's "byte-equal (modulo figure-path rewrite)"
   should cite D1 §7.1's normalize as the single definition.

## D. UX / engine spec bugs

1. Shuffle vs "original wording everywhere": internally consistent (opt-in toggle, §2's exception
   clause), but broken in practice by C1 (embedded letters). Fixing C1 fixes this.
2. Sim K-level hiding vs learning reveal: no structural leak found. Metadata lives in the same
   questions.js global (unavoidable client-side; not in DOM), palette aria-labels carry status not
   correctness, results/review reveal only post-submit, and SPEC Phase D includes a no-spoiler DOM
   audit. The first-visit toast is fine. One nit: D3 §4.6's toast text itself reveals nothing
   sensitive. OK.
3. A4 grading key derivation: verified sound (B above).
4. D3 §4.10 timing-strategy card: "90s per K2 question, bank the rest for the four K3" is
   arithmetically incoherent — 36×90s = 54:00, leaving 6:00 for four 3-minute K3s — and
   contradicts the official 1 min/K2 + 3 min/K3 ≈ 48-min budget it claims to align with (R2 §1
   and implication #4). It is also site-authored analysis on the Patterns tab, which conflicts
   with SPEC §3's "mechanical restructure, no new claims" rule for intel.js. Replace with R2 #4.

## E. Scope coverage vs user demands

- "Study by chapter, deep level + cheatsheet": covered (D1 51 verbatim units; D3 §4.2–4.4).
- "Same mock exams as-is with all parameters": covered (sim 40Q/60min/29-44, shuffle off default,
  appendix A1–A6, official distribution, all-or-nothing multi-select; thresholds computed, not
  hard-coded). Quick Quiz is a sensible extra, clearly labeled "equivalent".
- "Past-examinee advice": covered (R1 18 items / 8 synthesis / 6 conflicts / gap note — all counts
  verified present in R1; SPEC §3 contract matches).
- "Internet exam patterns": covered (R2 official table, community items, third-party error list,
  delta, 10 implications — all present and consistent with local ground truth).
- "World-class UI/UX": D3 is thorough (contrast math re-verified for the worked pairs; 1170 min
  curriculum figure correct). No missing demand found.

## Verdict summary

The data layer is in remarkably good shape — every headline number in D1/D2 reproduced exactly.
The failures are concentrated in: (a) two unresolved D2↔D3 behavioral conflicts the SPEC missed,
(b) one systemic data-shape landmine (options embedded in stems) that breaks both rendering and
the shuffle feature, (c) a cheatsheet cap that its own exemplar violates by 2×, and (d) three
small factual errors in D1's worked examples that the current gates cannot catch.

---

## REQUIRED changes (blocking)

1. **Strip embedded options from stem_md at build; add Gate A assertions** (no option text in
   stem_md; no residual `- a)` list; select_instruction extracted exactly once). Otherwise every
   lettered question double-renders and shuffle re-lettering contradicts the stem (C1/D1).
2. **Resolve the timer-warning conflict** (D2 §6: red ≤5:00, announce 5:00/1:00 vs D3 §3.10:
   red <2:00, announce 10:00/2:00/0:30) in SPEC §1 with one binding row (A1).
3. **Resolve the number-key jump conflict** (D2 §7 direct-jump+Shift vs D3 buffer+Enter) —
   recommend D3's buffer+Enter as sole mechanism (A2).
4. **Define cross-mode session-slot behavior**: starting a new session while another mode's
   session is active must block (like second-sim) or explicitly archive-and-replace; add to Gate B
   state-machine tests (A3/C3).
5. **Fix the cheatsheet word cap**: raise to a feasible value or exempt verbatim/auto-joined
   blocks from the count, and update D1 §2.3's ch2 exemplar (≈777 words) to comply — today Gate A
   fails the SPEC's own quality bar; ch7's 201-word budget needs the same ruling (C2).
6. **Correct D1's worked-example data**: §1.4 Q10→AI-3.1.1 answer "c" (or use Q11/"d" for 3.1.2);
   §1.5 Q25 answer "c". Add Gate A per-row equality (q, answer, k, pts) against merged.json, not
   just per-chapter counts (B1–B3).
7. **Replace D3 §4.10's timing-card arithmetic** with R2 implication #4 (36×1min + 4×3min ≈ 48 min
   + 12 min slack); the "90s per K2" rule is self-contradictory and violates the no-new-claims
   intel rule (D4).
8. **Add a file:// smoke test to Phase C** (open site/index.html directly; data/figures/dark-mode
   load check) — the no-fetch architecture exists solely for this constraint (C4).

## SUGGESTED changes (non-blocking)

1. Add errata line for progress value shape: SPEC row 2 `{id:{understood,ts}}` is binding; D3 §4.3's
   bare-boolean example and D1 §5's `studied` field name are stale (A4).
2. Pin drift-clamp details: shift sign, and rewrite `lastHeartbeatAt` after shifting (C5).
3. D2 §4.1 `pausedRemainingMs` comment says "practice/quick only" but appendix is pausable
   (§4.2, D3) — align.
4. Specify Quick-Quiz pacing-timer expiry behavior (D3's matrix says auto-submit; D2 §1.d silent).
5. Rename intel advice ids (`A1..A18`) to a non-colliding namespace (`AD1..`) — they clash with
   appendix question ids A1–A6 in the global search index.
6. Specify where `window.CTAI_DATA = {}` is declared (inline head preamble per D1 §1.4 note) —
   SPEC §2's layout omits it; per-chapter files assume it exists.
7. In SPEC Gate A wording, cite D1 §7.1's `normalize` (trailing-whitespace + source-side figure
   rewrite) as the single definition of "byte-equal modulo rewrite".
8. Record in SPEC §2 that `syllabus_p36_R236.png` is deliberately NOT copied (unembedded
   duplicate per markdown/README.md) so no later agent "fixes" its absence.
9. Build-parser caution note: subsection/LO regexes must use `\d+` (6.1.10) — add a Gate A
   assertion that the parsed subsection set includes `6.1.10`.

**VERDICT: CHANGES REQUIRED**
