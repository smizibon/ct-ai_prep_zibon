# Research: Advice from Past CT-AI Examinees
**Compiled:** 2026-11-17/18 (research agent R1) · **Subject:** ISTQB Certified Tester AI Testing (CT-AI)
**Version context:** v1.0 (2021) exam still bookable until 2026-04-21 (English) / 2027-10-21 (other languages); v2.0 syllabus released 2026-04-21; sample exam v2.2 (July 2026). Most examinee posts found predate v2.0 — the v2.0-specific experience base is still thin.

**Method note:** The general-purpose web-search API was rate-limited during this research; results were gathered via direct fetches of ISTQB.org, Reddit (via a Redlib mirror), Ministry of Testing's Discourse API, GitHub, Baidu/Sogou, and provider sites. Reddit mirror access was intermittent; for one thread (item 4) only the search snippet plus OP context was readable, not the comments.

---

## 1. Curated advice items

### A. Exam logistics & official preparation (baseline)

**1. Know the exact format and use the free official materials first.**
The current exam is 40 questions worth 44 points, pass at 29 points (~66%), 60 minutes; CTFL is a prerequisite; accredited training is "highly recommended" but self-study with the free Syllabus v2.0 + Sample Exam v2.2 (questions and answers) is officially viable.
- Source: https://www.istqb.org/certifications/certified-tester-ai-testing (official, current page, fetched Nov 2026)
- Version: v2.0 (page also confirms v1.0 retirement dates)
- v2.0 applicability: still-valid (this IS the v2.0 spec)
- Confidence: **high** (corroborated by tsting.cn provider page, item 2)

**2. Reputable providers publish the v2.0 chapter/time breakdown — use it to plan study time.**
Chinese CSTQB partner tsting.cn lists v2.0's 7 chapters with study durations (AI intro 120 min, quality characteristics 45, machine learning 375, testing AI-based systems 195, input-data testing 180, ML model testing 225, ML development testing 30 — approx. 19.5 hours of content) and confirms both versions' scoring (v1.0: 47 pts/pass 31; v2.0: 44 pts/pass 29).
- Source: https://www.tsting.cn/introduce/istqb/cstqb/istqbfl/fl-ai-testing (training provider, current 2026)
- Version: v2.0
- v2.0 applicability: still-valid
- Confidence: **high** (matches official numbers exactly)

**3. v2.0 genuinely restructured the syllabus — don't study v1.0 material for a v2.0 exam.**
Official announcement: reorganization around data/model/system-level testing; "AI-for-testing" content removed; new GenAI/LLM section including exploratory testing and red teaming; new input-data testing (bias, representativeness, label correctness, pipeline validation); adversarial/metamorphic/drift/A-B/back-to-back testing; ISO/IEC 25059 quality characteristics; recommended training cut from 4 days to 3 with more hands-on exercises.
- Source: https://istqb.org/istqb-releases-certified-tester-ai-testing-ct-ai-syllabus-version-2-0/ (official news, 2026-04-21)
- Version: v2.0
- v2.0 applicability: still-valid (definitional)
- Confidence: **high**

### B. First-hand examinee experiences (mostly v1.0 era)

**4. CT-AI is consistently reported as harder than CTFL — some call it one of the hardest ISTQB exams.**
In a 30-comment r/softwaretesting thread (Jan 2026), a passer said it was "tougher than the foundation"; an ISTQB trainer claimed it has one of the highest failure rates of the client exams they administer, on par with Advanced Technical Test Analyst; another commenter failed despite thorough prep, saying the syllabus is more theory-heavy than the actual questions.
- Source: https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/ (reddit, 2026-01-27)
- Version: v1.0 (thread predates v2.0 by ~3 months)
- v2.0 applicability: partially-stale (difficulty perception itself likely persists — pass mark is nearly identical — but question pool/content mix changed with v2.0)
- Confidence: **high** (multiple independent examinees + a trainer agree; see also item 5)

**5. Casual study is not enough: a "few days" left one candidate at 63% (fail).**
Same thread: u/Crushertimo failed with 63% after a few days of casual study that felt like "a walk in the park" going in; retook after studying 2 hours daily and knowing every sample-exam question and formula cold, described the retake as dramatically harder with two plausible answers per question, and barely passed at exactly 65%. Their advice: prepare seriously. Also in r/QualityAssurance (Dec 2025): a candidate failed twice with the identical score of 57.44% despite syllabus study, a course, mocks, and AI tutoring, with one retake left.
- Sources: https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/ (reddit, 2026-01-27); https://www.reddit.com/r/QualityAssurance/comments/1pwdelv/ (reddit, 2025-12-26; comments unread — mirror timed out — score and prep details from OP snippet)
- Version: v1.0
- v2.0 applicability: partially-stale (lesson "prepare over weeks, not days" transfers; exact scores reflect v1.0's 47-point/31-to-pass scale)
- Confidence: **high** (two independent fail reports + trainer's failure-rate claim)

**6. The exam rewards careful reading of qualifier words (MOST/BEST/PARTIALLY), not recall.**
The twice-failed candidate (item 5) felt the exam largely tests "how well you can interpret very specific academic English" and qualifiers such as MOST/BEST. This echoes general ISTQB exam wisdom and the GenAI passer's note that ISTQB wording is exact.
- Source: https://www.reddit.com/r/QualityAssurance/comments/1pwdelv/ (reddit, 2025-12-26)
- Version: v1.0
- v2.0 applicability: still-valid (question style is scheme-wide; v2.0 did not change question methodology)
- Confidence: **medium** (single detailed fail report, but consistent with items 8 and 12)

**7. Non-native English speakers get +25% time — factor this into booking and pacing.**
Confirmed independently on reddit (u/atsqa-team) and by both the official page and tsting.cn (60 min → 75 min where approved).
- Sources: https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/ (reddit, 2026-01); https://www.istqb.org/certifications/certified-tester-ai-testing (official)
- Version: both v1.0 and v2.0
- v2.0 applicability: still-valid
- Confidence: **high**

**8. Prioritize comprehension over memorization; expect scenario questions, few "by the book" ones.**
A detailed pass report for the sibling CT-GenAI exam (Feb 2026): OP passed using only the syllabus + one mock, no paid training; of 40 questions "probably no more than 4-5 were by the book"; questions were contextual cases (e.g., a shadow-AI scenario rather than a definition); do memorize the handful of hard facts (for GenAI: tokenization, seeds/temperature, hallucinations, RAG, fine-tuning trade-offs); recommended mock exams at testyourself.net/all-exams; exam cost in Europe was 230-260 EUR and the hype is "unnecessarily huge."
- Source: https://www.reddit.com/r/softwaretesting/comments/1r3obx7/ (reddit, 2026-02-13, 53 upvotes)
- Version: CT-GenAI v1.x — NOT CT-AI, but directly relevant because CT-AI v2.0 absorbed a GenAI/LLM-testing section
- v2.0 applicability: partially-stale→relevant (advice written for a different exam; its GenAI topics overlap CT-AI v2.0's new chapter, but CT-AI additionally covers classical ML, metrics, and data testing that GenAI doesn't)
- Confidence: **medium** for CT-AI specifically (sibling exam, single detailed report)

**9. Master the official sample exam — but expect the real exam to feel harder than the samples.**
u/Crushertimo's pass came after knowing "all sample-exam questions and formulas cold," yet the real retake still felt far harder; the failed-twice candidate also used mocks; the GenAI passer used one official mock; providers (Brightest/Day consulting) direct candidates to the downloadable syllabus and sample exams.
- Sources: reddit threads above; https://www.brightest.org/zh-hans/training-courses-zh/ISTQB-CTFL-4 (provider course page)
- Version: both
- v2.0 applicability: still-valid, with the caveat that only the official Sample Exam v2.2 reflects v2.0 content
- Confidence: **high**

**10. If you're a manual tester not working on AI systems, examinees steer you to CT-GenAI first — and community beliefs about v1.0≈v2.0 are wrong.**
An Oct 2026 r/QualityAssurance thread (manual tester, CTFL 5 years ago) got pointed toward CT-GenAI; the OP also asserted CT-AI 1.0 and 2.0 are "almost same with less chapters in 2.0" — a misconception: the official announcement (item 3) describes a scope restructuring (AI-for-testing removed, GenAI added), not a trim.
- Source: https://www.reddit.com/r/QualityAssurance/comments/1xek727/ (reddit, ~2026-10-24; top comment deleted by author, so its reasoning is unverified)
- Version: v2.0-era thread
- v2.0 applicability: still-valid as a *sentiment* data point; the version-similarity claim is **stale/inaccurate**
- Confidence: **low** (small thread, deleted advice comment; useful mainly to show misconceptions the study site should correct)

**11. Perceived career value is genuinely split — set expectations accordingly.**
A Sep 2026 "ISTQB in 2026 — still relevant?" thread (47 comments): a hiring manager says "I always look at the ISTQB certified folks first"; others say it mainly gets you past HR filters and matters early-career; a 10-year QA veteran with no certification got offers from ~10/10 interviews; skeptics call ISTQB a "diploma mill." No CT-AI-specific hiring signal appeared. In the Jan 2026 CT-AI thread the top comment (21 upvotes) said skip it "unless your employer requires it."
- Sources: https://www.reddit.com/r/QualityAssurance/comments/1wm8mys/ (reddit, 2026-09-21); https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/
- Version: general ISTQB / v1.0-era CT-AI
- v2.0 applicability: still-valid (career-value perceptions are version-agnostic)
- Confidence: **medium-high** (multiple independent threads agree on "HR filter + early career" value, disagree on more)

**12. Practitioner-forum skepticism about ISTQB teaching AI testing exists — balanced by "AI doesn't change testing theory."**
Ministry of Testing club (Jul-Aug 2025): Steve Green questioned ISTQB's credibility on AI ("WTF do ISTQB know about AI testing?"); in the same forum Mark Benson recommended the free CT-AI syllabus as the reference for what to learn (supervised learning, clustering/association). On reddit, u/leeuwerik countered that AI doesn't change the theory of testing.
- Sources: https://club.ministryoftesting.com/t/how-are-teams-perceiving-genai-llm-today/86145 (forum, 2025-07-30); https://club.ministryoftesting.com/t/ai-testing-standard-and-metrics/86375 (forum, 2025-08-12); reddit 1qoo4w1
- Version: v1.0-era (pre-release discussion)
- v2.0 applicability: partially-stale (v2.0's GenAI/red-teaming content partially answers the "outdated" criticism, but the credibility debate persists)
- Confidence: **medium** (two independent forums show the same split)

**13. v1.0-era Chinese prep guides emphasize high-frequency topics: ML data quality, overfitting, confusion-matrix metrics, metamorphic testing, K-level awareness.**
A CSDN prep guide (dated ~2026-11-12, i.e., days ago, but targeting the v1.0 Chinese exam, which runs until Oct 2027) lists these as high-frequency, and warns of classic mistakes including data leakage and metric misuse. Full text was inaccessible from this environment (CSDN blocks foreign IPs); based on the Baidu search snippet.
- Source: https://blog.csdn.net/weixin_42523670/article/details/170745663 (blog, ~2026-11-12, snippet-verified only)
- Version: v1.0 (Chinese exam)
- v2.0 applicability: partially-stale (metamorphic testing, confusion matrix, data quality all survive in v2.0; but v2.0 adds input-data testing/GenAI/red-teaming emphasis and drops v1.0's separate ethics/AI-for-testing chapters)
- Confidence: **low-medium** (snippet only; consistent with v1.0 syllabus structure)

**14. Beware published "module weightings" — at least one circulating guide invents them and mislabels the syllabus version.**
A CSDN/Tencent Cloud "通关秘籍" guide (2026-01-15) claims v1.0-style weightings (ML testing 35%, AI system characteristics 25%, quality verification 20%, test environment 15%, ethics 5%), a 4-step method for scenario questions, and tool-recognition focus (TensorFlow Data Validation, AI Fairness 360) — but cites a nonexistent "syllabus v4.0." Useful as an example of why third-party guides must be cross-checked against the official syllabus.
- Source: https://tencentcloud.csdn.net/69ea7e440a2f6a37c5a46d7c.html (blog mirror of CSDN article 156987630, 2026-01-15)
- Version: v1.0-era content (published pre-v2.0)
- v2.0 applicability: **stale** (v1.0 chapter structure; v2.0 has no separate ethics or test-environment chapters at these weights)
- Confidence: **low** (self-published, contains verifiable factual error; scenario-question and tool-recognition tips are plausible but unverified)

**15. A structured multi-week self-study plan is a common community pattern.**
GitHub u/ylaufer's CT-AI prep repo (v1.0, July 2025) organizes a 6-week plan (2 chapters/week: fundamentals → quality characteristics/ML → algorithms/metrics → environments+XAI/ethics → lifecycle/AI-for-testing → review). A general ISTQB pass report on reddit (May 2025, likely CTFL) describes the same method: daily syllabus reading, chapter summaries, quizzing with ChatGPT seeded from official mock questions (with caution), heavy mock practice.
- Sources: https://github.com/ylaufer/ct-ai-prep (github, 2025-07); https://www.reddit.com/r/softwaretesting/comments/1kj9u2n/ (reddit, 2025-05-10)
- Version: v1.0
- v2.0 applicability: partially-stale (the plan's chapter split is v1.0; the weekly-cadence method itself transfers to the v2.0 chapter list in item 2)
- Confidence: **medium**

**16. A v2.0-specific open-source study guide already exists (May 2026) — the community is rebuilding prep material for v2.0.**
GitHub reduanmasud/istqb-ct-ai-guide: Next.js static app covering all 7 chapters / 43 LOs with quizzes, hands-on exercises, a 168-term glossary, and a 46-question timed mock built from the official sample v2.1. Also: a free exam-prep web app (Farhod75/ct-ai-exam-prep, ~Mar 2026, 220 CT-AI practice questions + official sample with point-weighted scoring), a Microsoft Store "ISTQB CT-AI v2 Exam Prep" app, and a German Udemy course "ISTQB CT-AI v2.0 Praxistests 2026."
- Sources: https://github.com/reduanmasud/istqb-ct-ai-guide (github, 2026-05); https://github.com/Farhod75/ct-ai-exam-prep; https://apps.microsoft.com/detail/9msnf39bld2g ; https://www.udemy.com/course/istqb-ct-ai-v20-praxistests-ai-testing-zertifizierung/
- Version: v2.0
- v2.0 applicability: still-valid (caveat: Farhod75's README states "65% (26/40)", which matches neither v1.0's 31/47 nor v2.0's 29/44 — treat third-party pass-math skeptically)
- Confidence: **medium-high** for existence and v2.0 targeting (multiple independent artifacts); the apps' quality is unverified

**17. Question dumps and "95% real questions" sites cluster around v1.0 — a trap and a version signal.**
Sogou/Baidu surfaced fast2test ("CT-AI_v1.0" file, $59.98), itrenzheng ("CT-AI_(v1.0)_World... real exam questions"), SPOTO (CT-GenAI dumps), and TestPDF (claims "95% similarity", pass guarantee). None found for v2.0 yet. Reasons to avoid: ISTQB exams are protected, dump material is commonly outdated or wrong, and using real leaked questions risks decertification.
- Sources (as evidence of the ecosystem, not as recommendations): https://tw.fast2test.com/CWNP/CWT-101-cwnp-certified-wireless-technician-cwt-16387-premium-file.html ; https://www.itrenzheng.com/CT-AI_-v1.0-_World.html ; https://www.testpdf.net/certified-tester-ai-testing-exam-exam16386.html
- Version: v1.0
- v2.0 applicability: stale by construction (v1.0 question pools)
- Confidence: **high** that the ecosystem exists; **low** trust in their claims

**18. Booking logistics vary by country/board and can be non-obvious — check before you plan.**
reddit examinees noted the CT-GenAI exam was not listed via the UK's BCS and had to be booked via another member board at higher fees; Brightest/Day consulting lists four exam delivery routes (Pearson VUE private proctoring, 5,200+ test centers, online group exams, paper exams).
- Sources: https://www.reddit.com/r/softwaretesting/comments/1r3obx7/ and 1qoo4w1 (reddit, early 2026); https://www.brightest.org/zh-hans/training-courses-zh/ISTQB-CTFL-4 (provider)
- Version: both
- v2.0 applicability: still-valid
- Confidence: **medium** (single-country anecdote + one provider page)

---

## 2. Synthesis — points recurring across independent sources
(these deserve the strongest display on the website)

1. **The free official syllabus + official sample exam are the core study resources.** Endorsed by ISTQB itself, repeated by both reddit passers, the MoT forum, and every provider page. For v2.0, only Sample Exam v2.2 counts. (Items 1, 8, 9, 12, 15)
2. **CT-AI is harder than people expect — budget weeks, not days.** Fail reports at 63% and 57.44% (twice), a trainer calling it one of the highest-failure ISTQB exams, and a passer who needed 2h/day over a serious stretch. The pass boundary (~65-66%) is unforgiving. (Items 4, 5)
3. **Questions test applied judgment and precise wording (MOST/BEST qualifiers), not definitions.** Reported independently by a CT-AI double-failer, the CT-GenAI passer ("4-5 by the book"), and reflected in v1.0 prep guides' scenario-question tactics. (Items 6, 8, 14)
4. **Verify the syllabus version of everything you buy or read.** v2.0 (Apr 2026) restructured the syllabus; most blogs, dumps, and study repos — including a guide published as recently as Nov 2026 — still target v1.0. (Items 3, 10, 13, 14, 16, 17)
5. **Sample exams are necessary but not sufficient — the real exam feels harder than the samples.** (Item 9, corroborated by 5 and 8)
6. **Non-native English speakers should claim the +25% time allowance.** (Item 7)
7. **Don't confuse CT-AI with CT-GenAI** (a distinct, easier-entry sibling cert); v2.0 now covers GenAI/LLM testing inside CT-AI, which changes the calculus between them. (Items 3, 8, 10)
8. **Career-value expectations should be moderate**: strongest as an HR filter / early-career / employer-mandated credential; contested beyond that. (Items 11, 12)

---

## 3. Conflicts — where sources disagree

- **"Hard vs. manageable":** A trainer ranks CT-AI among the highest-failure ISTQB exams and one candidate failed twice at 57.44%; yet another examinee found their first attempt "a walk in the park" (and still failed at 63%), and the CT-GenAI passer called the hype "unnecessarily huge." Possible reconciliation: first-attempt overconfidence plus a jump in perceived difficulty on retakes; CT-GenAI is genuinely lighter than CT-AI. (Items 4, 5, 8)
- **"Memorize vs. understand":** Reddit passers push comprehension + a small memorize-list; Chinese prep guides push memorized weightings, tool inventories, and K-level taxonomies; the failed-twice candidate says neither is the real bottleneck — it's parsing academic English qualifiers. (Items 6, 8, 13, 14)
- **"Training needed vs. self-study enough":** ISTQB says accredited training is "highly recommended"; the GenAI passer self-studied with syllabus + one mock and passed; but the CT-AI double-failer used a course + mocks + AI tutoring and still failed. (Items 1, 5, 8)
- **"v1.0 ≈ v2.0" misconception:** a late-2026 reddit OP believed the versions are "almost same"; the official announcement describes a major scope restructuring. Good material for a myth-busting box. (Items 3, 10)
- **"Worth it vs. waste":** hiring manager "certified folks first" vs. "diploma mill"/"waste of time and money" (top upvoted comment in the CT-AI thread itself). (Items 11, 12)
- **Third-party pass-marks conflict with official ones** (e.g., a prep app stating 26/40 when official v2.0 is 29/44) — flag which number is authoritative. (Items 1, 16)

---

## 4. v2.0-specific experience gap (explicit statement)

**Genuine v2.0 first-hand exam reports are scarce as of Nov 2026.** All detailed CT-AI pass/fail reports found date from Dec 2025 - Jan 2026 (v1.0). The only v2.0-era artifacts are: the official v2.0 materials (Apr-Jul 2026), provider course pages recut for v2.0 (Brightest/Day, tsting.cn), community-built v2.0 study tools (GitHub guides/apps, a German Udemy practice-test course, all 2026), and a late-Oct 2026 reddit thread choosing between CT-AI and CT-GenAI. **Recommendation for the site:** state plainly that v2.0 examinee track record is still thin, that v1.0 difficulty anecdotes are directional (similar pass threshold, ~66%) but not proof, and that v2.0 adds substantial new territory (GenAI/LLM testing, red teaming, input-data testing, drift/A-B/back-to-back) not covered by any existing exam report.

---

## 5. Sources list (all URLs actually used or attempted-verified)

**Official (ISTQB):**
- https://www.istqb.org/certifications/certified-tester-ai-testing — CT-AI page (v2.0 spec, sample v2.2, retirement dates)
- https://istqb.org/istqb-releases-certified-tester-ai-testing-ct-ai-syllabus-version-2-0/ — v2.0 release announcement, 2026-04-21
- https://www.istqb.org/news-events/news — news index (used to locate the announcement)

**Reddit (read via Redlib mirrors safereddit.com / redlib instances; original URLs):**
- https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/ — CT-AI difficulty thread, 2026-01-27 (30 comments; read in full)
- https://www.reddit.com/r/QualityAssurance/comments/1pwdelv/ — failed twice at 57.44%, 2025-12-26 (snippet + OP only; comments not readable)
- https://www.reddit.com/r/softwaretesting/comments/1r3obx7/ — CT-GenAI pass feedback, 2026-02-13 (read in full)
- https://www.reddit.com/r/QualityAssurance/comments/1xek727/ — CT-AI vs CT-GenAI, ~2026-10-24 (read; top comment deleted)
- https://www.reddit.com/r/QualityAssurance/comments/1wm8mys/ — ISTQB relevance 2026, 2026-09-21 (read in full)
- https://www.reddit.com/r/softwaretesting/comments/1kj9u2n/ — "passed ISTQB yesterday", 2025-05-10 (snippet only)

**Forums:**
- https://club.ministryoftesting.com/t/how-are-teams-perceiving-genai-llm-today/86145 — MoT club, 2025-07/08
- https://club.ministryoftesting.com/t/ai-testing-standard-and-metrics/86375 — MoT club, 2025-08-12

**Providers / ecosystem:**
- https://www.tsting.cn/introduce/istqb/cstqb/istqbfl/fl-ai-testing — CSTQB partner page (v2.0 chapters, both versions' scoring)
- https://www.brightest.org/zh-hans/training-courses-zh/ISTQB-CTFL-4 — Brightest/Day consulting CT-AI v2.0 course page
- https://github.com/ylaufer/ct-ai-prep — v1.0 study repo (2025-07)
- https://github.com/reduanmasud/istqb-ct-ai-guide — v2.0 study guide (2026-05)
- https://github.com/Farhod75/ct-ai-exam-prep — free prep app (2026-03)
- https://www.udemy.com/course/istqb-ct-ai-v20-praxistests-ai-testing-zertifizierung/ — German v2.0 practice tests
- https://apps.microsoft.com/detail/9msnf39bld2g — MS Store CT-AI v2 app
- https://testyourself.net/all-exams — mock-exam site recommended by examinees (catalog not verifiable from here)

**Blogs (Chinese; snippet or mirror only — full CSDN text inaccessible from this environment):**
- https://blog.csdn.net/weixin_42523670/article/details/170745663 — v1.0 prep guide (~2026-11-12; Baidu snippet)
- https://tencentcloud.csdn.net/69ea7e440a2f6a37c5a46d7c.html — mirror of CSDN 156987630 "通关秘籍" (2026-01-15; read in full via mirror)

**Dump-ecosystem evidence (not recommendations):**
- https://tw.fast2test.com/CWNP/CWT-101-cwnp-certified-wireless-technician-cwt-16387-premium-file.html
- https://www.itrenzheng.com/CT-AI_-v1.0-_World.html
- https://www.testpdf.net/certified-tester-ai-testing-exam-exam16386.html
- https://cciedump.spoto.net/zh/istqb-ct-genai-certified-tester-testing-with-generative-ai-dumps.php

**Not verified (excluded from items; flagged for the site team):**
- "Geeltel — Mastering the ISTQB CT-AI Exam" (geeltel.us, dated 2026-07-15 via Sogou): unreachable (TLS certificate mismatch — serves cert for cbtproxy.com), so its content and legitimacy could not be verified. Suspicious; do not cite.
- Baidu/Sogou search-link redirects were used to resolve several CSDN/tsting URLs; the redirect targets above are the real pages.
