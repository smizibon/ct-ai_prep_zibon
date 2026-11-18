window.CTAI_INTEL = {
 "compiled": "2026-11-17",
 "advice": {
  "gapNote": "Genuine v2.0 first-hand exam reports are scarce as of Nov 2026. All detailed CT-AI pass/fail reports found date from Dec 2025 - Jan 2026 (v1.0). The only v2.0-era artifacts are: the official v2.0 materials (Apr-Jul 2026), provider course pages recut for v2.0 (Brightest/Day, tsting.cn), community-built v2.0 study tools (GitHub guides/apps, a German Udemy practice-test course, all 2026), and a late-Oct 2026 reddit thread choosing between CT-AI and CT-GenAI. State plainly that the v2.0 examinee track record is still thin, that v1.0 difficulty anecdotes are directional (similar pass threshold, ~66%) but not proof, and that v2.0 adds substantial new territory (GenAI/LLM testing, red teaming, input-data testing, drift/A-B/back-to-back) not covered by any existing exam report.",
  "items": [
   {
    "id": "AD1",
    "group": "logistics",
    "title": "Know the exact format and use the free official materials first",
    "text": "The current exam is 40 questions worth 44 points, pass at 29 points (~66%), 60 minutes; CTFL is a prerequisite; accredited training is \"highly recommended\" but self-study with the free Syllabus v2.0 + Sample Exam v2.2 (questions and answers) is officially viable.",
    "url": "https://www.istqb.org/certifications/certified-tester-ai-testing",
    "host": "istqb.org",
    "sourceType": "official",
    "date": "current page, fetched Nov 2026",
    "version": "v2.0",
    "applicability": "still-valid",
    "confidence": "high"
   },
   {
    "id": "AD2",
    "group": "logistics",
    "title": "Reputable providers publish the v2.0 chapter/time breakdown — use it to plan study time",
    "text": "Chinese CSTQB partner tsting.cn lists v2.0's 7 chapters with study durations (AI intro 120 min, quality characteristics 45, machine learning 375, testing AI-based systems 195, input-data testing 180, ML model testing 225, ML development testing 30 — approx. 19.5 hours of content) and confirms both versions' scoring (v1.0: 47 pts/pass 31; v2.0: 44 pts/pass 29).",
    "url": "https://www.tsting.cn/introduce/istqb/cstqb/istqbfl/fl-ai-testing",
    "host": "tsting.cn",
    "sourceType": "provider",
    "date": "2026",
    "version": "v2.0",
    "applicability": "still-valid",
    "confidence": "high"
   },
   {
    "id": "AD3",
    "group": "logistics",
    "title": "v2.0 genuinely restructured the syllabus — don't study v1.0 material for a v2.0 exam",
    "text": "Official announcement: reorganization around data/model/system-level testing; \"AI-for-testing\" content removed; new GenAI/LLM section including exploratory testing and red teaming; new input-data testing (bias, representativeness, label correctness, pipeline validation); adversarial/metamorphic/drift/A-B/back-to-back testing; ISO/IEC 25059 quality characteristics; recommended training cut from 4 days to 3 with more hands-on exercises.",
    "url": "https://istqb.org/istqb-releases-certified-tester-ai-testing-ct-ai-syllabus-version-2-0/",
    "host": "istqb.org",
    "sourceType": "official",
    "date": "2026-04-21",
    "version": "v2.0",
    "applicability": "still-valid",
    "confidence": "high"
   },
   {
    "id": "AD4",
    "group": "experiences",
    "title": "CT-AI is consistently reported as harder than CTFL — some call it one of the hardest ISTQB exams",
    "text": "In a 30-comment r/softwaretesting thread (Jan 2026), a passer said it was \"tougher than the foundation\"; an ISTQB trainer claimed it has one of the highest failure rates of the client exams they administer, on par with Advanced Technical Test Analyst; another commenter failed despite thorough prep, saying the syllabus is more theory-heavy than the actual questions.",
    "url": "https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/",
    "host": "reddit.com",
    "sourceType": "reddit",
    "date": "2026-01-27",
    "version": "v1.0",
    "applicability": "partially-stale",
    "confidence": "high"
   },
   {
    "id": "AD5",
    "group": "experiences",
    "title": "Casual study is not enough: a \"few days\" left one candidate at 63% (fail)",
    "text": "Same thread: u/Crushertimo failed with 63% after a few days of casual study that felt like \"a walk in the park\" going in; retook after studying 2 hours daily and knowing every sample-exam question and formula cold, described the retake as dramatically harder with two plausible answers per question, and barely passed at exactly 65%. Their advice: prepare seriously. Also in r/QualityAssurance (Dec 2025): a candidate failed twice with the identical score of 57.44% despite syllabus study, a course, mocks, and AI tutoring, with one retake left.",
    "url": "https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/",
    "host": "reddit.com",
    "sourceType": "reddit",
    "date": "2026-01-27 / 2025-12-26",
    "version": "v1.0",
    "applicability": "partially-stale",
    "confidence": "high"
   },
   {
    "id": "AD6",
    "group": "experiences",
    "title": "The exam rewards careful reading of qualifier words (MOST/BEST/PARTIALLY), not recall",
    "text": "The twice-failed candidate felt the exam largely tests \"how well you can interpret very specific academic English\" and qualifiers such as MOST/BEST. This echoes general ISTQB exam wisdom and the GenAI passer's note that ISTQB wording is exact.",
    "url": "https://www.reddit.com/r/QualityAssurance/comments/1pwdelv/",
    "host": "reddit.com",
    "sourceType": "reddit",
    "date": "2025-12-26",
    "version": "v1.0",
    "applicability": "still-valid",
    "confidence": "medium"
   },
   {
    "id": "AD7",
    "group": "logistics",
    "title": "Non-native English speakers get +25% time — factor this into booking and pacing",
    "text": "Confirmed independently on reddit (u/atsqa-team) and by both the official page and tsting.cn (60 min → 75 min where approved).",
    "url": "https://www.istqb.org/certifications/certified-tester-ai-testing",
    "host": "istqb.org",
    "sourceType": "official",
    "date": "2026",
    "version": "both",
    "applicability": "still-valid",
    "confidence": "high"
   },
   {
    "id": "AD8",
    "group": "experiences",
    "title": "Prioritize comprehension over memorization; expect scenario questions, few \"by the book\" ones",
    "text": "A detailed pass report for the sibling CT-GenAI exam (Feb 2026): OP passed using only the syllabus + one mock, no paid training; of 40 questions \"probably no more than 4-5 were by the book\"; questions were contextual cases (e.g., a shadow-AI scenario rather than a definition); do memorize the handful of hard facts (for GenAI: tokenization, seeds/temperature, hallucinations, RAG, fine-tuning trade-offs); exam cost in Europe was 230-260 EUR and the hype is \"unnecessarily huge.\"",
    "url": "https://www.reddit.com/r/softwaretesting/comments/1r3obx7/",
    "host": "reddit.com",
    "sourceType": "reddit",
    "date": "2026-02-13",
    "version": "sibling (CT-GenAI)",
    "applicability": "partially-stale",
    "confidence": "medium"
   },
   {
    "id": "AD9",
    "group": "experiences",
    "title": "Master the official sample exam — but expect the real exam to feel harder than the samples",
    "text": "u/Crushertimo's pass came after knowing \"all sample-exam questions and formulas cold,\" yet the real retake still felt far harder; the failed-twice candidate also used mocks; the GenAI passer used one official mock; providers (Brightest/Day consulting) direct candidates to the downloadable syllabus and sample exams.",
    "url": "https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/",
    "host": "reddit.com",
    "sourceType": "reddit",
    "date": "2026-01/02",
    "version": "both",
    "applicability": "still-valid",
    "confidence": "high"
   },
   {
    "id": "AD10",
    "group": "community",
    "title": "Manual testers are steered to CT-GenAI first — and community beliefs about v1.0≈v2.0 are wrong",
    "text": "An Oct 2026 r/QualityAssurance thread (manual tester, CTFL 5 years ago) got pointed toward CT-GenAI; the OP also asserted CT-AI 1.0 and 2.0 are \"almost same with less chapters in 2.0\" — a misconception: the official announcement describes a scope restructuring (AI-for-testing removed, GenAI added), not a trim.",
    "url": "https://www.reddit.com/r/QualityAssurance/comments/1xek727/",
    "host": "reddit.com",
    "sourceType": "reddit",
    "date": "~2026-10-24",
    "version": "v2.0-era",
    "applicability": "stale claim; still-valid sentiment",
    "confidence": "low"
   },
   {
    "id": "AD11",
    "group": "community",
    "title": "Perceived career value is genuinely split — set expectations accordingly",
    "text": "A Sep 2026 \"ISTQB in 2026 — still relevant?\" thread (47 comments): a hiring manager says \"I always look at the ISTQB certified folks first\"; others say it mainly gets you past HR filters and matters early-career; a 10-year QA veteran with no certification got offers from ~10/10 interviews; skeptics call ISTQB a \"diploma mill.\" In the Jan 2026 CT-AI thread the top comment (21 upvotes) said skip it \"unless your employer requires it.\"",
    "url": "https://www.reddit.com/r/QualityAssurance/comments/1wm8mys/",
    "host": "reddit.com",
    "sourceType": "reddit",
    "date": "2026-09-21",
    "version": "general",
    "applicability": "still-valid",
    "confidence": "medium-high"
   },
   {
    "id": "AD12",
    "group": "community",
    "title": "Practitioner-forum skepticism about ISTQB teaching AI testing exists — balanced by \"AI doesn't change testing theory\"",
    "text": "Ministry of Testing club (Jul-Aug 2025): Steve Green questioned ISTQB's credibility on AI (\"WTF do ISTQB know about AI testing?\"); in the same forum Mark Benson recommended the free CT-AI syllabus as the reference for what to learn (supervised learning, clustering/association). On reddit, u/leeuwerik countered that AI doesn't change the theory of testing.",
    "url": "https://club.ministryoftesting.com/t/how-are-teams-perceiving-genai-llm-today/86145",
    "host": "club.ministryoftesting.com",
    "sourceType": "forum",
    "date": "2025-07-30",
    "version": "v1.0-era",
    "applicability": "partially-stale",
    "confidence": "medium"
   },
   {
    "id": "AD13",
    "group": "community",
    "title": "v1.0-era Chinese prep guides emphasize high-frequency topics: ML data quality, overfitting, confusion-matrix metrics, metamorphic testing, K-level awareness",
    "text": "A CSDN prep guide (dated ~2026-11-12, targeting the v1.0 Chinese exam, which runs until Oct 2027) lists these as high-frequency, and warns of classic mistakes including data leakage and metric misuse. Full text was inaccessible from this environment (CSDN blocks foreign IPs); based on the Baidu search snippet.",
    "url": "https://blog.csdn.net/weixin_42523670/article/details/170745663",
    "host": "blog.csdn.net",
    "sourceType": "blog",
    "date": "~2026-11-12 (snippet-verified only)",
    "version": "v1.0",
    "applicability": "partially-stale",
    "confidence": "low-medium"
   },
   {
    "id": "AD14",
    "group": "ecosystem",
    "title": "Beware published \"module weightings\" — at least one circulating guide invents them and mislabels the syllabus version",
    "text": "A CSDN/Tencent Cloud guide (2026-01-15) claims v1.0-style weightings (ML testing 35%, AI system characteristics 25%, quality verification 20%, test environment 15%, ethics 5%), a 4-step method for scenario questions, and tool-recognition focus (TensorFlow Data Validation, AI Fairness 360) — but cites a nonexistent \"syllabus v4.0.\" Useful as an example of why third-party guides must be cross-checked against the official syllabus.",
    "url": "https://tencentcloud.csdn.net/69ea7e440a2f6a37c5a46d7c.html",
    "host": "tencentcloud.csdn.net",
    "sourceType": "blog",
    "date": "2026-01-15",
    "version": "v1.0-era",
    "applicability": "stale",
    "confidence": "low"
   },
   {
    "id": "AD15",
    "group": "ecosystem",
    "title": "A structured multi-week self-study plan is a common community pattern",
    "text": "GitHub u/ylaufer's CT-AI prep repo (v1.0, July 2025) organizes a 6-week plan (2 chapters/week). A general ISTQB pass report on reddit (May 2025, likely CTFL) describes the same method: daily syllabus reading, chapter summaries, quizzing with ChatGPT seeded from official mock questions (with caution), heavy mock practice.",
    "url": "https://github.com/ylaufer/ct-ai-prep",
    "host": "github.com",
    "sourceType": "github",
    "date": "2025-07",
    "version": "v1.0",
    "applicability": "partially-stale",
    "confidence": "medium"
   },
   {
    "id": "AD16",
    "group": "ecosystem",
    "title": "A v2.0-specific open-source study ecosystem already exists (May 2026)",
    "text": "GitHub reduanmasud/istqb-ct-ai-guide: Next.js static app covering all 7 chapters / 43 LOs with quizzes, hands-on exercises, a 168-term glossary, and a 46-question timed mock built from the official sample v2.1. Also: a free exam-prep web app (Farhod75/ct-ai-exam-prep, ~Mar 2026, 220 CT-AI practice questions + official sample with point-weighted scoring), a Microsoft Store \"ISTQB CT-AI v2 Exam Prep\" app, and a German Udemy course \"ISTQB CT-AI v2.0 Praxistests 2026.\" Caveat: Farhod75's README states \"65% (26/40)\", which matches neither v1.0's 31/47 nor v2.0's 29/44 — treat third-party pass-math skeptically.",
    "url": "https://github.com/reduanmasud/istqb-ct-ai-guide",
    "host": "github.com",
    "sourceType": "github",
    "date": "2026-05",
    "version": "v2.0",
    "applicability": "still-valid",
    "confidence": "medium-high"
   },
   {
    "id": "AD17",
    "group": "ecosystem",
    "title": "Question dumps and \"95% real questions\" sites cluster around v1.0 — a trap and a version signal",
    "text": "Sogou/Baidu surfaced fast2test (\"CT-AI_v1.0\" file, $59.98), itrenzheng (\"CT-AI_(v1.0)_World... real exam questions\"), SPOTO (CT-GenAI dumps), and TestPDF (claims \"95% similarity\", pass guarantee). None found for v2.0 yet. Reasons to avoid: ISTQB exams are protected, dump material is commonly outdated or wrong, and using real leaked questions risks decertification.",
    "url": "https://www.itrenzheng.com/CT-AI_-v1.0-_World.html",
    "host": "itrenzheng.com",
    "sourceType": "blog",
    "date": "2026",
    "version": "v1.0",
    "applicability": "stale by construction",
    "confidence": "high that the ecosystem exists; low trust in their claims"
   },
   {
    "id": "AD18",
    "group": "logistics",
    "title": "Booking logistics vary by country/board and can be non-obvious — check before you plan",
    "text": "reddit examinees noted the CT-GenAI exam was not listed via the UK's BCS and had to be booked via another member board at higher fees; Brightest/Day consulting lists four exam delivery routes (Pearson VUE private proctoring, 5,200+ test centers, online group exams, paper exams).",
    "url": "https://www.brightest.org/zh-hans/training-courses-zh/ISTQB-CTFL-4",
    "host": "brightest.org",
    "sourceType": "provider",
    "date": "2026",
    "version": "both",
    "applicability": "still-valid",
    "confidence": "medium"
   }
  ],
  "synthesis": [
   {
    "rank": 1,
    "text": "The free official syllabus + official sample exam are the core study resources. Endorsed by ISTQB itself, repeated by both reddit passers, the MoT forum, and every provider page. For v2.0, only Sample Exam v2.2 counts.",
    "itemIds": [
     "AD1",
     "AD8",
     "AD9",
     "AD12",
     "AD15"
    ]
   },
   {
    "rank": 2,
    "text": "CT-AI is harder than people expect — budget weeks, not days. Fail reports at 63% and 57.44% (twice), a trainer calling it one of the highest-failure ISTQB exams, and a passer who needed 2h/day over a serious stretch. The pass boundary (~65-66%) is unforgiving.",
    "itemIds": [
     "AD4",
     "AD5"
    ]
   },
   {
    "rank": 3,
    "text": "Questions test applied judgment and precise wording (MOST/BEST qualifiers), not definitions. Reported independently by a CT-AI double-failer, the CT-GenAI passer (\"4-5 by the book\"), and reflected in v1.0 prep guides' scenario-question tactics.",
    "itemIds": [
     "AD6",
     "AD8",
     "AD14"
    ]
   },
   {
    "rank": 4,
    "text": "Verify the syllabus version of everything you buy or read. v2.0 (Apr 2026) restructured the syllabus; most blogs, dumps, and study repos — including a guide published as recently as Nov 2026 — still target v1.0.",
    "itemIds": [
     "AD3",
     "AD10",
     "AD13",
     "AD14",
     "AD16",
     "AD17"
    ]
   },
   {
    "rank": 5,
    "text": "Sample exams are necessary but not sufficient — the real exam feels harder than the samples.",
    "itemIds": [
     "AD9",
     "AD5",
     "AD8"
    ]
   },
   {
    "rank": 6,
    "text": "Non-native English speakers should claim the +25% time allowance.",
    "itemIds": [
     "AD7"
    ]
   },
   {
    "rank": 7,
    "text": "Don't confuse CT-AI with CT-GenAI (a distinct, easier-entry sibling cert); v2.0 now covers GenAI/LLM testing inside CT-AI, which changes the calculus between them.",
    "itemIds": [
     "AD3",
     "AD8",
     "AD10"
    ]
   },
   {
    "rank": 8,
    "text": "Career-value expectations should be moderate: strongest as an HR filter / early-career / employer-mandated credential; contested beyond that.",
    "itemIds": [
     "AD11",
     "AD12"
    ]
   }
  ],
  "conflicts": [
   {
    "topic": "Hard vs. manageable",
    "text": "A trainer ranks CT-AI among the highest-failure ISTQB exams and one candidate failed twice at 57.44%; yet another examinee found their first attempt \"a walk in the park\" (and still failed at 63%), and the CT-GenAI passer called the hype \"unnecessarily huge.\" Possible reconciliation: first-attempt overconfidence plus a jump in perceived difficulty on retakes; CT-GenAI is genuinely lighter than CT-AI.",
    "itemIds": [
     "AD4",
     "AD5",
     "AD8"
    ]
   },
   {
    "topic": "Memorize vs. understand",
    "text": "Reddit passers push comprehension + a small memorize-list; Chinese prep guides push memorized weightings, tool inventories, and K-level taxonomies; the failed-twice candidate says neither is the real bottleneck — it's parsing academic English qualifiers.",
    "itemIds": [
     "AD6",
     "AD8",
     "AD13",
     "AD14"
    ]
   },
   {
    "topic": "Training needed vs. self-study enough",
    "text": "ISTQB says accredited training is \"highly recommended\"; the GenAI passer self-studied with syllabus + one mock and passed; but the CT-AI double-failer used a course + mocks + AI tutoring and still failed.",
    "itemIds": [
     "AD1",
     "AD5",
     "AD8"
    ]
   },
   {
    "topic": "v1.0 ≈ v2.0 misconception",
    "text": "A late-2026 reddit OP believed the versions are \"almost same\"; the official announcement describes a major scope restructuring. Good material for a myth-busting box.",
    "itemIds": [
     "AD3",
     "AD10"
    ]
   },
   {
    "topic": "Worth it vs. waste",
    "text": "Hiring manager \"certified folks first\" vs. \"diploma mill\"/\"waste of time and money\" (top upvoted comment in the CT-AI thread itself).",
    "itemIds": [
     "AD11",
     "AD12"
    ]
   },
   {
    "topic": "Third-party pass-marks vs official",
    "text": "Third-party pass-marks conflict with official ones (e.g., a prep app stating 26/40 when official v2.0 is 29/44) — flag which number is authoritative.",
    "itemIds": [
     "AD1",
     "AD16"
    ]
   }
  ]
 },
 "patterns": {
  "official": [
   {
    "id": "PT1",
    "title": "Exam structure (v2.0 vs v1.0)",
    "text": "CT-AI v2.0: 40 questions, 44 points, pass mark 65% = 28.60 → 29 points; duration 60 min (75 min with +25% extension); K1/K2/K3/K4 = 0/36/4/0 questions (≈48 min budgeted at K2=1, K3=3 min). v1.0 for comparison: 47 pts, pass 31, K mix 4/29/3/4 (≈58 min). Closed book.",
    "url": "https://www.istqb.org/certifications/certified-tester-ai-testing"
   },
   {
    "id": "PT2",
    "title": "Chapter distribution (v2.0)",
    "text": "Ch1 Introduction to AI: 6 Q (6 pts); Ch2 Quality Characteristics: 3 Q (3 pts); Ch3 Machine Learning: 7 Q (8 pts); Ch4 Testing AI-Based Systems: 7 Q (8 pts); Ch5 Input Data Testing: 6 Q (7 pts); Ch6 Model Testing: 9 Q (10 pts); Ch7 ML Development Testing: 2 Q (2 pts). Total 40 Q / 44 pts.",
    "url": "https://www.istqb.org/?sdm_process_download=1&download_id=3832"
   },
   {
    "id": "PT3",
    "title": "The four 2-point K3 questions are knowable in advance",
    "text": "Official LO tables name them: AI-3.3.1 confusion-matrix metrics (= sample Q15), AI-4.2.2 red teaming for GenAI (Q21), AI-5.1.5 dataset constraint testing (Q28), AI-6.1.5 metamorphic testing (Q34). K3 typically 2 points per Exam Structures & Rules §5.2.2.",
    "url": "https://www.istqb.org/?sdm_process_download=1&download_id=3832"
   },
   {
    "id": "PT4",
    "title": "No partial scoring",
    "text": "Official help page: \"There is no partial scoring\" — on multi-select questions you must choose all correct answers (\"you will not receive half the points for selecting one\"). All ISTQB exams are multiple-choice.",
    "url": "https://istqb.org/help/exam/"
   },
   {
    "id": "PT5",
    "title": "+25% extended time rule (exact wording)",
    "text": "Exam Structures & Rules v1.2 §6.2.1: \"If the candidates' native language is not the Exam set language, the candidate is allowed an additional 25% time.\" It is an entitlement, not a special accommodation request; contact your Member Board/Exam Provider for how it's applied. For CT-AI: 60 → 75 minutes.",
    "url": "https://www.istqb.org/?sdm_process_download=1&download_id=3829"
   },
   {
    "id": "PT6",
    "title": "Keywords are examinable",
    "text": "Exam Structures & Rules §4.1.3–4.1.4: \"All keywords in the Glossary related to the syllabus are Examinable\"; for Foundation & Specialist exams keywords are examinable \"for understanding their definition (K2).\"",
    "url": "https://www.istqb.org/?sdm_process_download=1&download_id=3829"
   },
   {
    "id": "PT7",
    "title": "Prerequisites, validity, transitions",
    "text": "CTFL is a prerequisite for CT-AI v2.0 (v1.0 had an Extension Certificate route without CTFL). v1.0 certificates remain valid; no bridge/upgrade exam exists. v1.0 English exams until 2027-04-21, other languages until 2027-10-21. Pass rule: \"A score of at least 65% is required to pass.\"",
    "url": "https://www.istqb.org/help/ct-ai-v2/"
   },
   {
    "id": "PT8",
    "title": "Retakes, results, delivery",
    "text": "\"You can take the exams as many times as necessary to pass them\"; retake fees and minimum intervals are set by the local Member Board/Exam Provider. ISTQB does not publish pass-rate data. ASTQB (US board): exams at \"Home, Online, Public, or Onsite\" (remote-proctored, test centers, supervised groups). US pricing signals: ≈USD $199; ASTQB ran a $99 retake promotion through year-end 2026.",
    "url": "https://istqb.org/help/exam/"
   }
  ],
  "community": [
   {
    "id": "CM1",
    "title": "Difficulty vs Foundation Level",
    "text": "\"Tougher than the foundation\" (Reddit r/softwaretesting, Jan 2026, v1.0-era). Same thread: CT-GenAI is \"~60-70% similar (conceptually)\" to CT-AI.",
    "url": "https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/",
    "date": "2026-01-27",
    "version": "v1.0-era",
    "note": "via Brave snippet; thread blocked to scrapers"
   },
   {
    "id": "CM2",
    "title": "Wording/interpretation trap",
    "text": "A candidate reported failing twice with the identical score of 57.44% despite heavy prep, saying the exam tests \"how well you can interpret very specific academic English\" and picking \"the most formally unassailable sentence.\" Note 57.44% of 47 ≈ 27/47 vs v1.0's pass mark of 31 — consistent with v1.0's 47-point scale.",
    "url": "https://www.reddit.com/r/QualityAssurance/comments/1pwdelv/",
    "date": "2025-12-26",
    "version": "v1.0-era",
    "note": "via Brave snippet"
   },
   {
    "id": "CM3",
    "title": "Confusion-matrix metrics are a recurring exam item",
    "text": "\"Be comfortable calculating precision, recall, and F1 score from confusion matrices … these appear frequently on exams\" (MasterSoftwareTesting guide, updated 2026-01-25). Consistent with official v2.0 structure: the metric-calculation question is one of only four 2-pointers (AI-3.3.1).",
    "url": "https://mastersoftwaretesting.com/certification-guides/istqb/ct-ai/ct-ai-complete-guide",
    "date": "2026-01-25",
    "version": "v1.0-era advice, topic survives as K3 LO AI-3.3.1",
    "note": ""
   },
   {
    "id": "CM4",
    "title": "Four questions carry extra weight",
    "text": "Mock Exam Network's v2.0 study guide warns that four questions carry extra weight and cites \"40 questions, 44 total points, pass at 29 points (~66%)\" — matches official tables exactly.",
    "url": "https://mockexamnetwork.com/guides/how-to-pass-istqb-ct-ai/",
    "date": "2026-05-31",
    "version": "v2.0",
    "note": "via Brave snippet; page Cloudflare-blocked"
   },
   {
    "id": "CM5",
    "title": "Question style: application/scenario-heavy",
    "text": "\"Many questions are structured to test understanding through application\"; expect scenarios on model behavior and data quality (TestPrepTraining.ai, ~Aug 2026; mixes v1.0 facts). Sample exam A v2.2 itself shows long scenario stems for K3 items (Q21, Q28, Q34) and short definitional stems for many K2 items.",
    "url": "https://testpreptraining.ai/blog/how-to-prepare-for-the-istqb-certified-tester-ai-testing-ct-ai-exam/",
    "date": "~2026-08",
    "version": "v2.0-era but mixed",
    "note": ""
   },
   {
    "id": "CM6",
    "title": "Common trap pairs named by trainers",
    "text": "Confusing A/B vs back-to-back vs metamorphic testing; explainability vs interpretability vs transparency; data drift vs concept drift; statistical vs social bias; expecting deterministic outputs; treating AI-testing fundamentals as irrelevant. Also warned: don't prep from cloud-vendor ML material (AWS/GCP/Azure certs).",
    "url": "https://mastersoftwaretesting.com/certification-guides/istqb/ct-ai/ct-ai-complete-guide",
    "date": "2026-01 / 2026-08",
    "version": "mixed",
    "note": ""
   },
   {
    "id": "CM7",
    "title": "Time pressure is the main operational risk",
    "text": "Multiple sources: \"90 seconds per question,\" answer easy items first, flag and return, never leave blanks (no negative marking). ANALYSIS note: v2.0's official budget is actually easier than v1.0's (48 vs 58 budgeted minutes for the same 60-minute window, because K4/K1 questions vanished), so v1.0-era time-pressure anecdotes likely overstate v2.0 pressure.",
    "url": "https://mastersoftwaretesting.com/certification-guides/istqb/ct-ai/ct-ai-complete-guide",
    "date": "2026-01",
    "version": "v1.0-era",
    "note": ""
   },
   {
    "id": "CM8",
    "title": "v2.0 application-level objectives flagged by trainers",
    "text": "Metamorphic test design, red teaming, dataset constraint testing, hands-on metric work (QASkills guide, 2026-07-14; Mock Exam Network, May 2026).",
    "url": "https://qaskills.sh/blog/istqb-ct-ai-v2-guide-2026",
    "date": "2026-07-14",
    "version": "v2.0",
    "note": "via Brave snippet"
   },
   {
    "id": "CM9",
    "title": "Study-time anecdotes",
    "text": "2-3 weeks part-time with strong AI/ML background; 4-5 weeks with strong testing but weak AI; 6-8 weeks weak in both (MasterSoftwareTesting, Jan 2026 — directionally useful, unverified).",
    "url": "https://mastersoftwaretesting.com/certification-guides/istqb/ct-ai/ct-ai-complete-guide",
    "date": "2026-01",
    "version": "v1.0-era",
    "note": ""
   },
   {
    "id": "CM10",
    "title": "Self-study is officially allowed but community-debated",
    "text": "ISTQB: \"Self-study, using the syllabus, sample exam, etc., is also an option.\" Codelattice blog (2025-12-18) calls self-study \"not recommended because of the difficulty\"; ProcessHub lists \"skipping an official course\" among mistakes.",
    "url": "https://istqb.org/help/exam/",
    "date": "2025-12",
    "version": "v1.0-era debate; official line current",
    "note": ""
   },
   {
    "id": "CM11",
    "title": "Pass-rate data: none found",
    "text": "No provider or board publishes CT-AI pass rates; the only quantitative community datapoint is the single Reddit double-fail score (57.44%, v1.0).",
    "url": "https://istqb.org/help/exam/",
    "date": "2026-11",
    "version": "n/a",
    "note": ""
   }
  ],
  "thirdPartyErrors": [
   {
    "id": "OE1",
    "source": "istqb.guru",
    "error": "Claims a 120-minute (150 extended) v2.0 exam",
    "correct": "Official: 60 min / 75 min extended (Exam Structure Tables v1.21)"
   },
   {
    "id": "OE2",
    "source": "TestPrepTraining.ai",
    "error": "States \"40 questions, 40 marks; pass mark 29\"",
    "correct": "29 is out of 44 in v2.0 (v1.0's threshold was 31/47)"
   },
   {
    "id": "OE3",
    "source": "ProcessExam blog (Jun 2026)",
    "error": "Lists v2.0 facts correctly (29/44) but topic list still includes v1.0 content (\"test environments\", \"using AI to improve testing itself\") and links a v1.0 syllabus",
    "correct": "Those topics were removed in v2.0 (moved to CT-GenAI / dropped)"
   },
   {
    "id": "OE4",
    "source": "v1.0-era advice keyed to 11 chapters (e.g., ProcessHub)",
    "error": "\"Don't underestimate Section 11: Using AI for Testing\"",
    "correct": "That content was removed from v2.0 and moved to the separate CT-GenAI certification"
   }
  ],
  "delta": {
   "rows": [
    [
     "Chapters",
     "11",
     "7, restructured around the ML lifecycle (input data testing, model testing, ML development testing)"
    ],
    [
     "Chapter names",
     "1 Introduction to AI; 2 Quality Characteristics; 3 ML in Practice; 4 ML-Data; 5 ML Functional Performance Metrics; 6 ML-Neural Networks and Testing; 7 Testing AI-Based Systems Overview; 8 Testing AI-Specific Quality Characteristics; 9 Methods and Techniques for Testing AI-Based Systems; 10 Test Environments; 11 Using AI for Testing",
     "1 Introduction to AI; 2 Quality Characteristics for AI-Based Systems (ISO/IEC 25059-aligned); 3 Machine Learning (incl. neural networks, performance metrics); 4 Testing AI-Based Systems (incl. GenAI/LLM testing, ML test levels); 5 Input Data Testing for ML Systems; 6 Model Testing for ML Systems; 7 ML Development Testing"
    ],
    [
     "\"Using AI for testing\"",
     "Chapter 11 (4 exam questions)",
     "Removed — moved to the separate CT-GenAI certification"
    ],
    [
     "Test environments",
     "Chapter 10 (1 exam question)",
     "Removed from scope"
    ],
    [
     "GenAI/LLM testing",
     "Brief intro only",
     "Added: dedicated coverage — exploratory testing of LLMs, red teaming (K3 LO AI-4.2.2), prompt injection, non-determinism, RAG vs fine-tuning distinction"
    ],
    [
     "Standards",
     "ISO/IEC 25010 context",
     "Aligned to ISO/IEC 25059 AI quality characteristics; EU AI Act, ISO/IEC TR 29119-11, ISO/IEC 42119 referenced"
    ],
    [
     "Exam points",
     "40 q / 47 pts / pass 31",
     "40 q / 44 pts / pass 29"
    ],
    [
     "K-level mix",
     "K1=4, K2=29, K3=3, K4=4 (~58 min budget)",
     "K1=0, K2=36, K3=4, K4=0 (~48 min budget)"
    ],
    [
     "Heaviest chapters",
     "spread over 11",
     "Ch 6 (9 q/10 pts) and Ch 3+4 (7 q/8 pts each)"
    ],
    [
     "Training length",
     "4 days (~26 h)",
     "3 days (19.5 h), more hands-on exercises"
    ],
    [
     "Prerequisite",
     "CTFL for full cert; \"Extension Certificate\" route without CTFL",
     "CTFL prerequisite (v2.0 page states flat prerequisite)"
    ],
    [
     "Transition",
     "—",
     "No bridge exam; v1.0 certs stay valid; English v1.0 exams until 2027-04-21, other languages until 2027-10-21"
    ],
    [
     "Exam sample set",
     "Sample exam v1.0 (2021)",
     "Sample Exam set A v2.2 (2026-07-20): Q1-40 mirror the real exam + appendix A1-A6 new-type questions"
    ]
   ],
   "addedTopics": "Added v2.0 specifics worth teaching (community change analysis, istqb.guru 2026-04-23): frontier/agentic AI concepts in Ch1; k-fold cross-validation with stratified sampling; NN coverage measures (neuron coverage, kMNC, NBC); four-step disparate-impact bias procedure; label-correctness approaches with Cohen's Kappa; statistical performance testing reported as \"accuracy of X% ±Y% at Z% confidence level\"; static (Kolmogorov-Smirnov) vs dynamic drift testing; deployment tests (canary, shadow, rollback, model conversion, cross-device)."
  },
  "implications": [
   {
    "n": 1,
    "text": "Weight chapters 3 + 6 first: 16 of 40 questions and 18 of 44 points (≈41%) come from Machine Learning + Model Testing. Add chapter 4 and 55% of the exam sits in three chapters.",
    "derivedFrom": "chapter-distribution table"
   },
   {
    "n": 2,
    "text": "Drill exactly four K3 skills, because all four 2-point questions are known in advance from the official LO list: (a) computing precision/recall/accuracy/F1 from a confusion matrix (AI-3.3.1), (b) applying the red-teaming process to GenAI scenarios (AI-4.2.2), (c) dataset constraint testing on typed/unique/range attributes (AI-5.1.5), (d) deriving metamorphic relations from a scenario (AI-6.1.5). Losing all four costs 8 of the 15 points you can afford to lose (29/44 pass).",
    "derivedFrom": "official LO list + point values"
   },
   {
    "n": 3,
    "text": "Practice metrics numerically, not just verbally — sample exam Q15 asks for the correct precision formula given a confusion matrix, and the syllabus K3 verb is \"Calculate\"; work numeric examples until formula selection is automatic.",
    "derivedFrom": "Q15 + LO wording; corroborated by MasterSoftwareTesting's \"appear frequently\" advice"
   },
   {
    "n": 4,
    "text": "Budget time as 36 × 1 min + 4 × 3 min ≈ 48 min with 12 min of slack in a 60-minute exam. The 2-pointers deserve a deliberate 3-minute slot each; flag and return rather than burning slack on K2 items.",
    "derivedFrom": "official timing rules and the K-mix"
   },
   {
    "n": 5,
    "text": "Treat \"Select TWO\" questions as all-or-nothing: there is no partial scoring, and sample-exam select-TWO items present 5 options — practice eliminating the 3 wrong statements before committing.",
    "derivedFrom": "official no-partial-scoring rule + Q2/Q39 format"
   },
   {
    "n": 6,
    "text": "Drill the glossary: for Specialist exams every syllabus keyword is examinable at K2 definition level — straight definition questions are the cheapest points on the exam.",
    "derivedFrom": "Exam Structures & Rules §4.1.3-4.1.4"
   },
   {
    "n": 7,
    "text": "Learn the trap pairs the community keeps naming (A/B vs back-to-back vs metamorphic; data vs concept drift; static vs dynamic drift testing; explainability vs transparency; RAG vs fine-tuning) — v2.0 added explicit sections making several of these newly examinable distinctions.",
    "derivedFrom": "v2.0 delta + trainer lists; version-applicable"
   },
   {
    "n": 8,
    "text": "Ignore v1.0-era advice topics that no longer exist — anything about \"Using AI for Testing\" (old ch11), \"Test Environments\" (old ch10), or an 11-chapter plan will waste study time and can cost real points; also mentally re-scale old anecdotes: v1.0's pass mark was 31/47 and it included 4 K4 questions, so v1.0 difficulty stories overstate v2.0.",
    "derivedFrom": "delta table + tables v1.21"
   },
   {
    "n": 9,
    "text": "Use Sample Exam A v2.2 as the primary mock — its Q1-40 mirror the real 40-question, 44-point structure including the four 2-pointers at positions 15/21/28/34; sit it under 60-minute closed-book conditions (the appendix A1-A6 are extras, not part of the real 40).",
    "derivedFrom": "the sample exam's structure"
   },
   {
    "n": 10,
    "text": "If English isn't your first language, take the 75-minute sitting — the +25% extension is an automatic entitlement under the official exam rules, and the one quantitative community report (a double fail at 57.44%) blamed English-interpretation difficulty specifically.",
    "derivedFrom": "Exam Structures & Rules §6.2.1 + the Dec 2025 Reddit report (v1.0-era; wording style carries over)"
   }
  ]
 },
 "sources": [
  {
   "url": "https://www.istqb.org/certifications/certified-tester-ai-testing",
   "label": "ISTQB CT-AI official page (structure, prerequisite, retirement dates)",
   "type": "official"
  },
  {
   "url": "https://istqb.org/istqb-releases-certified-tester-ai-testing-ct-ai-syllabus-version-2-0/",
   "label": "v2.0 release announcement (2026-04-21)",
   "type": "official"
  },
  {
   "url": "https://www.istqb.org/help/ct-ai-v2/",
   "label": "Official v2.0 FAQ (what changed, no bridge exam)",
   "type": "official"
  },
  {
   "url": "https://istqb.org/help/exam/",
   "label": "ISTQB exam FAQ (retakes, no partial scoring, +25% rule)",
   "type": "official"
  },
  {
   "url": "https://www.istqb.org/?sdm_process_download=1&download_id=3829",
   "label": "Exam Structures & Rules v1.2 (official PDF)",
   "type": "official"
  },
  {
   "url": "https://www.istqb.org/?sdm_process_download=1&download_id=3832",
   "label": "Exam Structure Tables v1.21 (2026-11-09, official PDF)",
   "type": "official"
  },
  {
   "url": "https://www.istqb.org/?sdm_process_download=1&download_id=9558",
   "label": "CT-AI Syllabus v2.0 GA (2026-04-17, official PDF)",
   "type": "official"
  },
  {
   "url": "https://www.istqb.org/?sdm_process_download=1&download_id=9561",
   "label": "Sample Exam set A v2.2 Questions (official PDF)",
   "type": "official"
  },
  {
   "url": "https://www.istqb.org/?sdm_process_download=1&download_id=9564",
   "label": "Sample Exam set A v2.2 Answers (official PDF)",
   "type": "official"
  },
  {
   "url": "https://astqb.org/certifications/istqb-ai-testing/",
   "label": "ASTQB US CT-AI page (delivery options)",
   "type": "board"
  },
  {
   "url": "https://astqb.org/istqb-remote-proctored-exam/",
   "label": "ASTQB remote-proctoring mechanics",
   "type": "board"
  },
  {
   "url": "https://astqb.org/istqb-ai-testing-or-istqb-testing-with-generative-ai-which-certification-should-you-take/",
   "label": "ASTQB: CT-AI vs CT-GenAI guidance (2026-07-01)",
   "type": "board"
  },
  {
   "url": "https://astqb.org/get-99-retakes-for-istqb-ai-testing-istqb-genai-exams-through-year-end/",
   "label": "ASTQB $99 retake promotion",
   "type": "board"
  },
  {
   "url": "https://www.reddit.com/r/softwaretesting/comments/1qoo4w1/",
   "label": "Reddit: CT-AI difficulty thread (2026-01-27, v1.0-era)",
   "type": "reddit"
  },
  {
   "url": "https://www.reddit.com/r/QualityAssurance/comments/1pwdelv/",
   "label": "Reddit: failed twice at 57.44% (2025-12-26, v1.0-era)",
   "type": "reddit"
  },
  {
   "url": "https://www.reddit.com/r/softwaretesting/comments/1r3obx7/",
   "label": "Reddit: CT-GenAI pass feedback (2026-02-13)",
   "type": "reddit"
  },
  {
   "url": "https://www.reddit.com/r/QualityAssurance/comments/1xek727/",
   "label": "Reddit: CT-AI vs CT-GenAI (~2026-10-24)",
   "type": "reddit"
  },
  {
   "url": "https://www.reddit.com/r/QualityAssurance/comments/1wm8mys/",
   "label": "Reddit: ISTQB relevance 2026 (2026-09-21)",
   "type": "reddit"
  },
  {
   "url": "https://www.reddit.com/r/softwaretesting/comments/1kj9u2n/",
   "label": "Reddit: passed ISTQB yesterday (2025-05-10, snippet only)",
   "type": "reddit"
  },
  {
   "url": "https://club.ministryoftesting.com/t/how-are-teams-perceiving-genai-llm-today/86145",
   "label": "Ministry of Testing club thread (2025-07/08)",
   "type": "forum"
  },
  {
   "url": "https://club.ministryoftesting.com/t/ai-testing-standard-and-metrics/86375",
   "label": "Ministry of Testing club: AI testing standards (2025-08-12)",
   "type": "forum"
  },
  {
   "url": "https://www.tsting.cn/introduce/istqb/cstqb/istqbfl/fl-ai-testing",
   "label": "tsting.cn CSTQB partner page (v2.0 chapters, scoring)",
   "type": "provider"
  },
  {
   "url": "https://www.brightest.org/zh-hans/training-courses-zh/ISTQB-CTFL-4",
   "label": "Brightest/Day consulting CT-AI v2.0 course page",
   "type": "provider"
  },
  {
   "url": "https://github.com/ylaufer/ct-ai-prep",
   "label": "GitHub: ylaufer CT-AI prep repo (v1.0, 2025-07)",
   "type": "github"
  },
  {
   "url": "https://github.com/reduanmasud/istqb-ct-ai-guide",
   "label": "GitHub: reduanmasud istqb-ct-ai-guide (v2.0, 2026-05)",
   "type": "github"
  },
  {
   "url": "https://github.com/Farhod75/ct-ai-exam-prep",
   "label": "GitHub: Farhod75 ct-ai-exam-prep (2026-03)",
   "type": "github"
  },
  {
   "url": "https://www.udemy.com/course/istqb-ct-ai-v20-praxistests-ai-testing-zertifizierung/",
   "label": "Udemy: German v2.0 practice tests",
   "type": "provider"
  },
  {
   "url": "https://apps.microsoft.com/detail/9msnf39bld2g",
   "label": "Microsoft Store: CT-AI v2 Exam Prep app",
   "type": "provider"
  },
  {
   "url": "https://testyourself.net/all-exams",
   "label": "testyourself.net mock exams (recommended by examinees)",
   "type": "community"
  },
  {
   "url": "https://blog.csdn.net/weixin_42523670/article/details/170745663",
   "label": "CSDN v1.0 prep guide (~2026-11-12, snippet only)",
   "type": "blog"
  },
  {
   "url": "https://tencentcloud.csdn.net/69ea7e440a2f6a37c5a46d7c.html",
   "label": "CSDN/Tencent '通关秘籍' guide (2026-01-15; contains errors)",
   "type": "blog"
  },
  {
   "url": "https://istqb.guru/ai-testing-ct-ai-v2/",
   "label": "istqb.guru CT-AI v2 page (contains 120-min error)",
   "type": "blog"
  },
  {
   "url": "https://istqb.guru/istqb-ct-ai-v2-syllabus-changes-vs-v1/",
   "label": "istqb.guru v1→v2 change analysis (2026-04-23)",
   "type": "blog"
  },
  {
   "url": "https://processexam.com/blog/istqb-ct-ai-master-ai-testing-certification-career",
   "label": "ProcessExam blog (Jun 2026; mixed v1.0 topics)",
   "type": "blog"
  },
  {
   "url": "https://mastersoftwaretesting.com/certification-guides/istqb/ct-ai/ct-ai-complete-guide",
   "label": "MasterSoftwareTesting complete guide (2026-01-25, v1.0-era)",
   "type": "blog"
  },
  {
   "url": "https://testpreptraining.ai/blog/how-to-prepare-for-the-istqb-certified-tester-ai-testing-ct-ai-exam/",
   "label": "TestPrepTraining.ai prep article (2026; mixed facts)",
   "type": "blog"
  },
  {
   "url": "https://processhub.hashnode.dev/9-mistakes-avoid-istqb-ai-testing-certification-ct-ai",
   "label": "ProcessHub: 9 mistakes (2025-10-25, v1.0-era)",
   "type": "blog"
  },
  {
   "url": "https://mockexamnetwork.com/guides/how-to-pass-istqb-ct-ai/",
   "label": "Mock Exam Network v2.0 guide (2026-05-31, via snippet)",
   "type": "blog"
  },
  {
   "url": "https://qaskills.sh/blog/istqb-ct-ai-v2-guide-2026",
   "label": "QASkills v2.0 guide (2026-07-14, via snippet)",
   "type": "blog"
  },
  {
   "url": "https://www.anztb.org/certification/ai-testing-ct-i/",
   "label": "ANZTB CT-AI page (2026-08-07, via snippet)",
   "type": "board"
  },
  {
   "url": "https://tw.fast2test.com/CWNP/CWT-101-cwnp-certified-wireless-technician-cwt-16387-premium-file.html",
   "label": "fast2test dump listing (evidence of dump ecosystem)",
   "type": "dump-evidence"
  },
  {
   "url": "https://www.itrenzheng.com/CT-AI_-v1.0-_World.html",
   "label": "itrenzheng v1.0 dump listing (evidence)",
   "type": "dump-evidence"
  },
  {
   "url": "https://www.testpdf.net/certified-tester-ai-testing-exam-exam16386.html",
   "label": "TestPDF dump listing (evidence)",
   "type": "dump-evidence"
  },
  {
   "url": "https://cciedump.spoto.net/zh/istqb-ct-genai-certified-tester-testing-with-generative-ai-dumps.php",
   "label": "SPOTO CT-GenAI dumps (evidence)",
   "type": "dump-evidence"
  }
 ]
};
