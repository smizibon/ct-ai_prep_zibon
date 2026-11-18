# ISTQB CT-AI v2.0 — Exam Pattern Intelligence
**Research date: 2026-11-17.** Prepared for a CT-AI v2.0 study website. Labels used on every item:
- **CONFIRMED-OFFICIAL** — from istqb.org pages or official ISTQB PDFs (syllabus, sample exam, Exam Structures & Rules).
- **OFFICIAL (Member Board)** — from an official ISTQB Member Board (ASTQB/AT*SQA, US).
- **COMMUNITY** — third-party blogs, forums, or search-result snippets; anecdotal, may be v1.0-era.
- **ANALYSIS** — this report's own derivation from official structure data; not a quote.

Version context: CT-AI v2.0 syllabus GA is dated **2026/04/17** in the official syllabus PDF; ISTQB announced it ~April 21, 2026. As of Nov 2026 the version is ~7 months old, and **first-person v2.0 exam-experience write-ups are essentially absent** — the Reddit experience threads that exist are v1.0-era (pre-April 2026). Community pattern data below is therefore thin and explicitly version-tagged.

---

## 1. Official exam mechanics

### Structure (CONFIRMED-OFFICIAL — cross-verified against local ground truth, which it matches exactly)
Source: ISTQB Exam Structure Tables v1.21 (Nov 9, 2026), PDF `download_id=3832` from https://www.istqb.org/certifications/certified-tester-ai-testing ; same figures on the ISTQB CT-AI page and in Sample Exam A v2.2.

| Item | CT-AI v2.0 | CT-AI v1.0 (for comparison) |
|---|---|---|
| Questions | 40 | 40 |
| Total points | 44 | 47 |
| Pass mark | 65% = 28.60 → **29 points** | 65% = 30.55 → 31 points |
| Duration | 60 min (75 min with +25% extension) | 60 / 75 min |
| K1 / K2 / K3 / K4 questions | 0 / 36 / 4 / 0 | 4 / 29 / 3 / 4 |
| Budgeted time (K2=1 min, K3=3 min) | ≈48 min | ≈58 min (K1=1, K4=4 min) |
| Book type | Closed book (per ISTQB CT-AI page / FAQ; community sources also state "closed book, no negative marking") | same |

Question timing rule (CONFIRMED-OFFICIAL, Exam Structures & Rules v1.2 §6.1, `download_id=3829`): K1 = 1 min, K2 = 1–2 min, K3 = 3 min, K4 = 4 min; described as "only a guideline for an average time."

Point-value rule for Specialist exams (CONFIRMED-OFFICIAL, same doc §5.2.2): K2 questions = 1 point; K3 typically 2 points ("may be set at 1, 2, or 3 points"); K4 typically 3. In CT-AI v2.0 all four K3 questions are set at 2 points (Exam Structure Tables v1.21 + Sample Exam A: Q15, Q21, Q28, Q34 are the 2-point questions).

Chapter distribution, v2.0 (CONFIRMED-OFFICIAL, Exam Structure Tables v1.21):
| Ch | Topic | Qs | K2/K3 | Points |
|---|---|---|---|---|
| 1 | Introduction to AI | 6 | 6/0 | 6 |
| 2 | Quality Characteristics for AI-Based Systems | 3 | 3/0 | 3 |
| 3 | Machine Learning | 7 | 6/1 | 8 |
| 4 | Testing AI-Based Systems | 7 | 6/1 | 8 |
| 5 | Input Data Testing for ML Systems | 6 | 5/1 | 7 |
| 6 | Model Testing for ML Systems | 9 | 8/1 | 10 |
| 7 | ML Development Testing | 2 | 2/0 | 2 |
| | **Total** | **40** | 36/4 | **44** |

The four 2-point K3 questions map to exactly these learning objectives (CONFIRMED-OFFICIAL — Exam Structure Tables v1.21 LO list cross-referenced with Syllabus v2.0, `download_id=9558`):
- **AI-3.3.1 (K3)** "Calculate common ML functional performance metrics from a given set of confusion matrix data" (sample exam Q15: pick the correct precision formula from a confusion matrix)
- **AI-4.2.2 (K3)** "Implement red teaming for GenAI systems" (sample Q21: prioritize prompt-injection vs bias red-teaming for a GenAI legal-document generator)
- **AI-5.1.5 (K3)** "Apply dataset constraint testing" (sample Q28: constraint testing on a loan-approval dataset's attributes)
- **AI-6.1.5 (K3)** "Use metamorphic testing to derive test cases for a given scenario" (sample Q34: metamorphic relations for a phone-recommendation system)

### Question types and scoring
- All Foundation, Specialist (incl. CT-AI), and Advanced ISTQB exams are multiple-choice (CONFIRMED-OFFICIAL, https://istqb.org/help/exam/).
- Sample exam phrasing is "Select ONE answer." / "Select TWO answers." In Sample Exam A v2.2 (46 questions incl. appendix), 41 are select-ONE (4 options, a–d) and 2 are select-TWO (5 options, a–e: Q2 and Q39) (CONFIRMED-OFFICIAL, `download_id=9561`).
- **No partial scoring**: official help page states "There is no partial scoring" — on a multi-select question you must choose all correct answers; "(you will not receive half the points for selecting one)" (CONFIRMED-OFFICIAL, https://istqb.org/help/exam/). The sample-exam answer key shows single combined answers (e.g., Q2 = "c, e") for one point value, consistent with all-or-nothing.
- Glossary/syllabus keywords are examinable: "All keywords in the Glossary related to the syllabus are Examinable," and for Foundation & Specialist exams keywords are examinable "for understanding their definition (K2)" (CONFIRMED-OFFICIAL, Exam Structures & Rules v1.2 §4.1.3–4.1.4).
- Sample Exam set A v2.2: 46 questions (Q1–40 mirroring the real 40-question structure + A1–A6 appendix), 50 points total, released 2026/07/20 (CONFIRMED-OFFICIAL; matches local ground truth).

### Extended-time rule (CONFIRMED-OFFICIAL)
Exact wording, Exam Structures & Rules v1.2 §6.2.1: "If the candidates' native language is not the Exam set language, the candidate is allowed an additional 25% time." Help-page phrasing: a candidate sitting "the exam in a language that is not your first language … is entitled" to "a time extension (25% of the usual exam length)" (https://istqb.org/help/exam/). Scope: this document covers all Foundation, Advanced, and Specialist Module exams regardless of language/media — the rule is not CT-AI-specific. For CT-AI, 25% of 60 min = 15 extra minutes (75 total). It is an entitlement, not a special accommodation request; contact your Member Board/Exam Provider for how it's applied (help page directs candidates there).

### Prerequisites and certification rules (CONFIRMED-OFFICIAL)
- "The ISTQB® Certified Tester Foundation Level (CTFL) is a prerequisite for the CT-AI v2.0 certification" (ISTQB CT-AI page). Note: this differs from v1.0, where non-CTFL holders could earn an "Extension Certificate" — the v2.0 page states CTFL as a flat prerequisite.
- v1.0 certificates remain valid; no bridging/upgrade exam exists — v2.0 is a separate exam if you want it (https://www.istqb.org/help/ct-ai-v2/).
- v1.0 exams/training remain available for English "until April 21, 2027," other languages until October 21, 2027 (ISTQB CT-AI page and FAQ).
- Passing score rule for all exams: "A score of at least 65% is required to pass" (Exam Structures & Rules v1.2 §5.3.1); the Exam Structure Tables fix CT-AI v2.0 at 29/44.

### Retakes and results (CONFIRMED-OFFICIAL)
- "You can take the exams as many times as necessary to pass them." Retake fees and "rules on the minimum time interval allowed between exams" are set by the local Member Board or Exam Provider (https://istqb.org/help/exam/).
- Results come from your Member Board/Exam Provider; ISTQB does not publish pass-rate data (same help page; no provider pass-rate figures found in this research).

### Delivery / proctoring (OFFICIAL — Member Board)
- ISTQB itself delivers via Member Boards and Exam Providers, which handle "exam dates, exam delivery options, applicable fees, and booking information" (CONFIRMED-OFFICIAL, https://istqb.org/help/exam/).
- ASTQB/AT*SQA (US): exams can be taken "at Home, Online, Public, or Onsite" — i.e., remote-proctored from home (laptop/desktop with working camera; proctor inspects the room; no papers/equipment), electronically at test centers, or in supervised groups (training courses, conferences; onsite usually has a minimum headcount). Registration via AT*SQA (https://astqb.org/istqb-remote-proctored-exam/, https://astqb.org/certifications/istqb-ai-testing/).
- US pricing signals (COMMUNITY/Member Board pages): exam ≈ USD $199 (ProcessExam blog, June 2026); ASTQB ran a **$99 retake** promotion for CT-AI and CT-GenAI "through year end" (https://astqb.org/get-99-retakes-for-istqb-ai-testing-istqb-genai-exams-through-year-end/), and a free retake may follow an ASTQB-accredited course (https://astqb.org/registration/retake-istqb-free/). Fees vary by country/board — treat prices as indicative only.

---

## 2. Community-reported patterns (date-stamped; version applicability noted)

**Version caveat (ANALYSIS):** v2.0 went live April 2026. The only first-person difficulty reports found (Reddit, Dec 2025 / Jan 2026) predate it and describe the **v1.0** exam. No v2.0 pass/fail write-ups surfaced in searches as of Nov 2026; one Brave search explicitly noted "No first-person v2.0 pass write-ups appear." v2.0-era sources are mostly vendor guides (May–Oct 2026) whose facts should be checked against official docs — several contain errors (see "known third-party errors" below).

1. **Difficulty vs Foundation Level** — "tougher than the foundation" (Reddit r/softwaretesting, 2026-01-27, v1.0-era, accessed via Brave snippet; full thread blocked to scrapers: https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/). Same thread: CT-GenAI is "~60–70% similar (conceptually)" to CT-AI.
2. **Wording/interpretation trap** — a candidate reported failing **twice with the identical score of 57.44%** despite heavy prep, saying the exam tests "how well you can interpret very specific academic English" and picking "the most formally unassailable sentence" (Reddit r/QualityAssurance, 2025-12-26, v1.0-era: https://www.reddit.com/r/QualityAssurance/comments/1pwdelv/). Note 57.44% of 47 ≈ 27/47 vs the v1.0 pass mark of 31 — the score is consistent with v1.0's 47-point scale (ANALYSIS cross-check).
3. **Confusion-matrix metrics are a recurring exam item** — "Be comfortable calculating precision, recall, and F1 score from confusion matrices … these appear frequently on exams" (MasterSoftwareTesting guide, updated 2026-01-25, v1.0-era advice but the topic survives as K3 LO AI-3.3.1 in v2.0). Consistent with official v2.0 structure: the metric-calculation question is one of only four 2-pointers (CONFIRMED-OFFICIAL).
4. **Four questions carry extra weight** — Mock Exam Network's v2.0 study guide (2026-05-31, via Brave snippet; page Cloudflare-blocked) warns that four questions carry extra weight and cites "40 questions, 44 total points, pass at 29 points (~66%)" — matches official tables exactly.
5. **Question style: application/scenario-heavy** — "many questions are structured to test understanding through application"; expect scenarios on model behavior and data quality (TestPrepTraining.ai, ~Aug 2026, v2.0-era but mixes v1.0 facts). Sample exam A v2.2 itself shows long scenario stems for K3 items (Q21, Q28, Q34) and short definitional stems for many K2 items (CONFIRMED-OFFICIAL observation).
6. **Common trap pairs named by trainers** (TestPrepTraining, ~Aug 2026, v2.0-era; MasterSoftwareTesting, Jan 2026, v1.0-era): confusing A/B vs back-to-back vs metamorphic testing; explainability vs interpretability vs transparency; data drift vs concept drift; statistical vs social bias; expecting deterministic outputs; treating AI-testing fundamentals as irrelevant. MasterSoftwareTesting also warns against prepping from cloud-vendor ML material (AWS/GCP/Azure certs).
7. **Time pressure is the main operational risk** — multiple sources: "90 seconds per question," answer easy items first, flag and return, never leave blanks (no negative marking) (MasterSoftwareTesting v1.0-era; ProcessHub "9 mistakes," v1.0-era; Certachieve, 2026). ANALYSIS note: v2.0's official budget is actually easier than v1.0's (48 vs 58 budgeted minutes for the same 60-minute window, because K4/K1 questions vanished), so v1.0-era time-pressure anecdotes likely overstate v2.0 pressure.
8. **v2.0 application-level objectives flagged by trainers** — metamorphic test design, red teaming, dataset constraint testing, hands-on metric work (QASkills guide, 2026-07-14, via Brave snippet; Mock Exam Network, May 2026).
9. **Study-time anecdotes** — 2–3 weeks part-time with strong AI/ML background; 4–5 weeks with strong testing but weak AI; 6–8 weeks weak in both (MasterSoftwareTesting, Jan 2026, v1.0-era — directionally useful, unverified).
10. **Self-study is officially allowed but community-debated** — ISTQB: "Self-study, using the syllabus, sample exam, etc., is also an option" (CONFIRMED-OFFICIAL). Codelattice blog (2025-12-18, v1.0-era) calls self-study "not recommended because of the difficulty"; ProcessHub (v1.0-era) lists "skipping an official course" among mistakes.
11. **Pass-rate data: none found.** No provider or board publishes CT-AI pass rates; the only quantitative community datapoint is the single Reddit double-fail score above.

**Known third-party errors to warn site users about (ANALYSIS of fetched pages):**
- istqb.guru's CT-AI page claims a **120-minute** (150 extended) v2.0 exam — contradicts the official 60/75 minutes in Exam Structure Tables v1.21.
- TestPrepTraining.ai states "40 questions, 40 marks; pass mark 29" — mixes v1.0's 1-point scheme with v2.0's 29-point threshold (29 is out of 44 in v2.0; v1.0's threshold was 31/47).
- ProcessExam's June 2026 blog lists v2.0 facts correctly (29/44) but its topic list still includes v1.0 content ("test environments," "using AI to improve testing itself") and links a v1.0 syllabus.
- v1.0-era advice keyed to 11 chapters (e.g., ProcessHub's "don't underestimate Section 11: Using AI for Testing") is actively misleading for v2.0 — that content was removed from v2.0 and moved to CT-GenAI.

---

## 3. v1.0 → v2.0 delta (sources: official FAQ https://www.istqb.org/help/ct-ai-v2/, official release announcement https://www.istqb.org/istqb-releases-certified-tester-ai-testing-ct-ai-syllabus-version-2-0/, Exam Structure Tables v1.21, Syllabus v2.0; details enriched by istqb.guru's change article, 2026-04-23 — COMMUNITY)

| Dimension | v1.0 (2021; GA 2021-10-01 sample exam) | v2.0 (GA 2026-04-17) |
|---|---|---|
| Chapters | 11 | 7, restructured around the ML lifecycle (input data testing, model testing, ML development testing) |
| Chapter names | 1 Introduction to AI; 2 Quality Characteristics; 3 ML in Practice; 4 ML–Data; 5 ML Functional Performance Metrics; 6 ML–Neural Networks and Testing; 7 Testing AI-Based Systems Overview; 8 Testing AI-Specific Quality Characteristics; 9 Methods and Techniques for Testing AI-Based Systems; 10 Test Environments for AI-Based Systems; 11 Using AI for Testing | 1 Introduction to AI; 2 Quality Characteristics for AI-Based Systems (ISO/IEC 25059-aligned); 3 Machine Learning (incl. neural networks, performance metrics); 4 Testing AI-Based Systems (incl. GenAI/LLM testing, ML test levels); 5 Input Data Testing for ML Systems; 6 Model Testing for ML Systems; 7 ML Development Testing |
| "Using AI for testing" | Chapter 11 (4 exam questions) | **Removed** — moved to the separate CT-GenAI certification |
| Test environments | Chapter 10 (1 exam question) | **Removed** from scope |
| GenAI/LLM testing | Brief intro only | **Added**: dedicated coverage — exploratory testing of LLMs, red teaming (K3 LO AI-4.2.2), prompt injection, non-determinism, RAG vs fine-tuning distinction |
| Standards | ISO/IEC 25010 context | Aligned to **ISO/IEC 25059** AI quality characteristics; EU AI Act, ISO/IEC TR 29119-11, ISO/IEC 42119 referenced (COMMUNITY detail) |
| Exam points | 40 q / 47 pts / pass 31 | 40 q / 44 pts / pass 29 |
| K-level mix | K1=4, K2=29, K3=3, K4=4 (~58 min budget) | K1=0, K2=36, K3=4, K4=0 (~48 min budget) |
| Heaviest chapters | spread over 11 | Ch 6 (9 q/10 pts) and Ch 3+4 (7 q/8 pts each) |
| Training length | 4 days (~26 h) | 3 days (19.5 h), more hands-on exercises |
| Prerequisite | CTFL for full cert; "Extension Certificate" route without CTFL | CTFL prerequisite (v2.0 page states flat prerequisite) |
| Transition | — | No bridge exam; v1.0 certs stay valid; English v1.0 exams until 2027-04-21, other languages until 2027-10-21 |

Added v2.0 specifics worth teaching (COMMUNITY, istqb.guru change analysis): frontier/agentic AI concepts in Ch1; k-fold cross-validation with stratified sampling; NN coverage measures (neuron coverage, kMNC, NBC); four-step disparate-impact bias procedure; label-correctness approaches with Cohen's Kappa; statistical performance testing reported as "accuracy of X% ±Y% at Z% confidence level"; static (Kolmogorov–Smirnov) vs dynamic drift testing; deployment tests (canary, shadow, rollback, model conversion, cross-device).

---

## 4. Implications for studying (ANALYSIS — derived from the official structure data above)

1. **Weight chapters 3 + 6 first: 16 of 40 questions and 18 of 44 points (≈41%) come from Machine Learning + Model Testing** (derives from the chapter-distribution table). Add chapter 4 and 55% of the exam sits in three chapters.
2. **Drill exactly four K3 skills, because all four 2-point questions are known in advance from the official LO list**: (a) computing precision/recall/accuracy/F1 from a confusion matrix (AI-3.3.1), (b) applying the red-teaming process to GenAI scenarios (AI-4.2.2), (c) dataset constraint testing on typed/unique/range attributes (AI-5.1.5), (d) deriving metamorphic relations from a scenario (AI-6.1.5). Losing all four costs 8 of the 15 points you can afford to lose (29/44 pass).
3. **Practice metrics numerically, not just verbally** — sample exam Q15 asks for the correct precision formula given a confusion matrix, and the syllabus K3 verb is "Calculate"; work numeric examples until formula selection is automatic (derives from Q15 + LO wording; corroborated by MasterSoftwareTesting's "appear frequently" advice).
4. **Budget time as 36 × 1 min + 4 × 3 min ≈ 48 min with 12 min of slack in a 60-minute exam** (derives from official timing rules and the K-mix). The 2-pointers deserve a deliberate 3-minute slot each; flag and return rather than burning slack on K2 items.
5. **Treat "Select TWO" questions as all-or-nothing**: there is no partial scoring, and sample-exam select-TWO items present 5 options — practice eliminating the 3 wrong statements before committing (derives from the official no-partial-scoring rule + Q2/Q39 format).
6. **Drill the glossary**: for Specialist exams every syllabus keyword is examinable at K2 definition level — straight definition questions are the cheapest points on the exam (derives from Exam Structures & Rules §4.1.3–4.1.4).
7. **Learn the trap pairs the community keeps naming** (A/B vs back-to-back vs metamorphic; data vs concept drift; static vs dynamic drift testing; explainability vs transparency; RAG vs fine-tuning) — v2.0 added explicit sections making several of these newly examinable distinctions (derives from v2.0 delta + trainer lists; version-applicable).
8. **Ignore v1.0-era advice topics that no longer exist** — anything about "Using AI for Testing" (old ch11), "Test Environments" (old ch10), or an 11-chapter plan will waste study time and can cost real points; also mentally re-scale old anecdotes: v1.0's pass mark was 31/47 and it included 4 K4 questions, so v1.0 difficulty stories overstate v2.0 (derives from the delta table + tables v1.21).
9. **Use Sample Exam A v2.2 as the primary mock** — its Q1–40 mirror the real 40-question, 44-point structure including the four 2-pointers at positions 15/21/28/34; sit it under 60-minute closed-book conditions (derives from the sample exam's structure; the appendix A1–A6 are extras, not part of the real 40).
10. **If English isn't your first language, take the 75-minute sitting** — the +25% extension is an automatic entitlement under the official exam rules, and the one quantitative community report (a double fail at 57.44%) blamed English-interpretation difficulty specifically (derives from Exam Structures & Rules §6.2.1 + the Dec 2025 Reddit report; the anecdote is v1.0-era but the wording style carries over).

---

## 5. Sources

**Official (ISTQB.org + official PDFs):**
- https://www.istqb.org/certifications/certified-tester-ai-testing (CT-AI page: structure, prerequisite, v1.0 retirement dates, document links)
- https://www.istqb.org/help/ct-ai-v2/ (official v2.0 FAQ: what changed, no bridge exam, format unchanged)
- https://www.istqb.org/istqb-releases-certified-tester-ai-testing-ct-ai-syllabus-version-2-0/ (v2.0 release announcement)
- https://istqb.org/help/exam/ (exam FAQ: retakes, no partial scoring, +25% rule, delivery via boards/providers)
- https://istqb.org/help/ (help-center index)
- Exam Structures & Rules v1.2 (2025-05-02): https://www.istqb.org/?sdm_process_download=1&download_id=3829
- Exam Structure Tables v1.21 (2026-11-09): https://www.istqb.org/?sdm_process_download=1&download_id=3832
- CT-AI Syllabus v2.0 GA (2026-04-17): https://www.istqb.org/?sdm_process_download=1&download_id=9558
- Sample Exam set A v2.2 Questions (2026-07-20): https://www.istqb.org/?sdm_process_download=1&download_id=9561
- Sample Exam set A v2.2 Answers (2026-07-20): https://www.istqb.org/?sdm_process_download=1&download_id=9564

**Official Member Board (ASTQB/AT*SQA, US):**
- https://astqb.org/ (index; links to pricing/retake FAQs)
- https://astqb.org/certifications/istqb-ai-testing/ (US CT-AI page; 40 Q / 60 min; delivery options)
- https://astqb.org/istqb-remote-proctored-exam/ (remote-proctoring mechanics)
- https://astqb.org/istqb-ai-testing-or-istqb-testing-with-generative-ai-which-certification-should-you-take/ (CT-AI vs CT-GenAI guidance, 2026-07-01)
- https://astqb.org/get-99-retakes-for-istqb-ai-testing-istqb-genai-exams-through-year-end/ and https://astqb.org/registration/retake-istqb-free/ (referenced, not fetched)

**Community / third-party (v2.0-era unless noted):**
- https://istqb.guru/ai-testing-ct-ai-v2/ (contains a 120-min error — flagged above)
- https://istqb.guru/istqb-ct-ai-v2-syllabus-changes-vs-v1/ (2026-04-23; detailed change analysis)
- https://processexam.com/blog/istqb-ct-ai-master-ai-testing-certification-career (Jun 2026; $199, 29/44; mixed v1.0 topics)
- https://mastersoftwaretesting.com/certification-guides/istqb/ct-ai/ct-ai-complete-guide (2026-01-25; **v1.0-era**)
- https://testpreptraining.ai/blog/how-to-prepare-for-the-istqb-certified-tester-ai-testing-ct-ai-exam/ (2026; mixed facts)
- https://processhub.hashnode.dev/9-mistakes-avoid-istqb-ai-testing-certification-ct-ai (2025-10-25; **v1.0-era**, 11 chapters)
- https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/ (2026-01-27; **v1.0-era**; via Brave snippet, thread blocked)
- https://www.reddit.com/r/QualityAssurance/comments/1pwdelv/ (2025-12-26; **v1.0-era**; via Brave snippet)
- https://mockexamnetwork.com/guides/how-to-pass-istqb-ct-ai/ (2026-05-31; via Brave snippet, page Cloudflare-blocked)
- https://qaskills.sh/blog/istqb-ct-ai-v2-guide-2026 (2026-07-14; via Brave snippet)
- https://www.anztb.org/certification/ai-testing-ct-ai/ (2026-08-07; via Brave snippet — cites April 21, 2026 launch)
- Brave search result pages: https://search.brave.com/search?q=ISTQB+CT-AI+exam+experience+tips and https://search.brave.com/search?q=ISTQB+CT-AI+2.0+exam+passed+experience+2026

**Method note:** WebSearch and the webReader MCP were rate-limited during this research (reset 2026-11-28); Reddit and DuckDuckGo were bot-blocked. Community items marked "via Brave snippet" could not be opened in full — quotes are limited to snippet text. All official PDFs were downloaded and text-extracted locally, so CONFIRMED-OFFICIAL items are verified from primary documents.
