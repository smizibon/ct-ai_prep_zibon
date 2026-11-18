# D1 — Content Architecture: "Study by Chapter" (deep content + cheatsheets)

Site: static HTML study site for ISTQB CT-AI v2.0. Vanilla JS/HTML/CSS, offline, runs from `file://`, no CDNs, data in JS files loaded via `<script>` tags.

Source of truth (all line numbers refer to this file):
`/Users/zibon-mac/Desktop/Certifications/CT-AI/markdown/ISTQB_CT-AI_Syllabus_v2.0.md` (1,860 lines, 186,673 bytes).

Question→LO mapping: `/tmp/qbank/merged.json` (46 questions; shape described in §7).

---

## 0. Grounding facts verified in the syllabus (basis for every decision below)

| Fact | Evidence |
|---|---|
| Chapters 1–7 occupy lines 277–1391; chapter heading format is `# N Title – X minutes` | lines 277, 434, 502, 815, 976, 1133, 1334 |
| Each chapter preamble has `**Keywords**` and `**AI-Specific Keywords**` blocks, then `**Learning Objectives for Chapter N:**` with bullets `- AI-x.y.z (K2) …` / `- HO-x.y.z (H2) …` | e.g. lines 279–298, 436–453, 504–537, 986–996 |
| **Subsections are 1:1 with LO/HO ids.** Script check over all 7 chapters: 51 LO bullets, 51 `### N.M.K` subsections, ids equal in every chapter (ch1:8, ch2:3, ch3:13, ch4:8, ch5:7, ch6:10, ch7:2). 43 are `AI-` LOs (examinable), 8 are `HO-` hands-on | verified by regex over lines 277–1391 |
| Hands-on subsections are titled `Hands-on Exercise: …` | lines 637, 690, 761, 765, 795, 937, 1129, 1266 |
| Sections (`## N.M`) open with 1–2 intro paragraphs before the first subsection | e.g. 1.1 at 300–302, 2.1 at 455–457, 2.2 at 481–483, 3.1 at 539–543, 5.1 at 998–1000 |
| Only chapter-level time budgets exist ("timing is not provided at the chapter level" i.e. not below it) | lines 251, and per-chapter headings |
| All sections examinable **except** Introduction, Hands-On Objectives, References, Appendices | line 213 |
| Chapter keywords must be recalled (K1) even if not in an LO | line 203 |
| K-levels K1–K4 defined in Appendix A; H-levels H0–H2 defined in §0.5 | lines 1591–1655, 205–209 |
| Glossary "9 AI-Specific Terms" is a clean 2-column table `Term Name \| Definition`, 118 rows | lines 1430–1549 |
| Abbreviations is a 2-column table, 31 rows | lines 1394–1426 |
| Only 3 embedded images in chapters 1–7, all in ch3, each with long descriptive alt text + italic caption line | lines 633/635, 777/779, 789/791. "Figure 2: Confusion Matrix" is a markdown **table**, not an image (733–739) |
| Markdown constructs present in chapters 1–7: headings, paragraphs, bullet lists nested up to 3 levels, ordered lists with nested bullets, pipe tables (with `<br>` inside cells), `**bold**`, `*italic*`, images, `\*`-escaped asterisks in formulas | nesting: 665–681; ordered+nested: 1035–1038, 1066–1084; table with `<br>`: 491–500; formulas: 745–757 |
| Constructs **absent** from chapters 1–7: code fences, backticks, markdown links, inline HTML other than `<br>` | verified by script scan (0 fences, no backticks, no `[..](http)`, no other HTML tags) |
| Sizes: ch1–7 markdown = 131.5 KB (ch1 21.7 / ch2 11.2 / ch3 29.1 / ch4 22.5 / ch5 16.9 / ch6 24.7 / ch7 5.5 KB); glossary section 16.0 KB; abbreviations 1.1 KB | measured |

---

## 1. Study-content data model

### 1.1 Chunking: chunk per subsection = per LO

Because subsections are exactly 1:1 with LO ids (§0, verified 51/51), the chunk unit is the **subsection** (`### N.M.K`). This is the only granularity at which all three of these hold simultaneously: examinability flag, K-level, sample-question linkage (merged.json keys on `AI-x.y.z`).

Hierarchy:

```
chapter (N)            metadata: title, minutes, keywords, LO statement list
 └─ section (N.M)      verbatim intro paragraphs
     └─ subsection (N.M.K)  = one LO or HO  ← the study unit / progress unit
```

Chapter- and section-level prose is kept (section intros are short — 1–2 paragraphs) but is **not** a progress unit; it renders as the lead-in of the first page of its section.

### 1.2 Verbatim policy: 100% verbatim, structure via metadata

Decision: the deep-study body is the **exact markdown slice** between a subsection's `###` heading line and the next heading, with the heading line itself removed (heading text moves to metadata). No paraphrase, no rewording, no re-ordering.

Justification:

1. The syllabus is the examinable source of truth (line 213: exams are based on these LOs; 0.9: level of detail is deliberate). Paraphrase risks changing examinable meaning.
2. Verbatim slices make fidelity **mechanically verifiable** (§8) — the check is a string comparison, not a judgment call.
3. All structure the UI needs (K-level, LO statement, minutes, question links, hands-on flag) lives in metadata, so the prose never needs to be touched.

The only permitted text transformation (whitelisted in the verifier): image src paths rewritten from `figures/syllabus_p30_R199.png` to `assets/figures/syllabus_p30_R199.png`.

Light structuring is additive, never invasive: the renderer displays the LO statement as a banner above the body, a K-level chip, a hands-on ribbon, and "related sample questions" links — all from metadata.

### 1.3 Rendering: store markdown, render with a tiny runtime renderer (decision)

**Choice: store the verbatim markdown subset; render at runtime with a ~100-line vanilla renderer.** Not pre-converted HTML.

Justification:

- Storing verbatim markdown keeps the data files literally checkable against the syllabus file (§8). Pre-converted HTML would force the verifier to normalize HTML back to text, the most fragile part of the pipeline.
- The construct inventory is closed and small (§0); a deterministic renderer is low-risk, and a golden-file test (§8.5) pins its output.
- No build step is *required* for correctness — the data files are valid even if the renderer is swapped.

**Renderer contract — exactly these constructs (complete inventory found in chapters 1–7):**

| Construct | Source form | Rendered as |
|---|---|---|
| Paragraph | text block | `<p>` |
| Bullet list, up to 3 nesting levels | `- item`, indented `  -`, `    -` | nested `<ul><li>` |
| Ordered list, may contain nested bullets | `1.` … with `   -` children (lines 1035–1038, 1066–1084) | `<ol>` with nested `<ul>` |
| Table | pipe rows, separator row `|---|` | `<table><thead><tbody>`; cells may contain inline formatting and the literal token `<br>` (line 493) which passes through as a line break |
| Bold | `**text**` | `<strong>` |
| Italic | `*text*` (whole-line = figure caption, e.g. line 635) | `<em>` (CSS styles lone-`<em>` paragraphs as captions) |
| Image | `![alt](src)` (3 occurrences) | `<img>` with full alt text preserved |
| Escaped asterisk | `\*` in formulas (lines 745–757) | literal `*` |
| Unicode, `•` glyphs, `[EU AI Act]` bracket citations | plain text | escaped passthrough |

Explicitly NOT supported (because absent from the source): code fences, headings inside bodies (all headings are metadata), links, blockquotes, inline HTML other than the `<br>` whitelist token.

Escaping order in the renderer: HTML-escape everything first (`& < >`), re-insert the whitelisted `<br>` token, then apply inline rules (`\*` unescape, bold, italic, image).

### 1.4 Schema

One global namespace, populated by per-chapter files (§6):

```js
window.CTAI_DATA = {}; // declared in data/preamble.js (or inline in <head>)

// data/chapter-3.js
window.CTAI_DATA.chapters = window.CTAI_DATA.chapters || {};
window.CTAI_DATA.chapters[3] = {
  n: 3,
  title: "Machine Learning",
  minutes: 375,                    // from chapter heading (line 502)
  keywords: {                      // from preamble (lines 504-510)
    general: ["K-multisection neuron coverage", "ML functional performance criteria", "..."],
    aiSpecific: ["Association", "classification", "clustering", "..."]
  },
  sections: [
    {
      id: "3.1",
      title: "Introduction to Machine Learning",
      intro: [                       // verbatim paragraphs between '## 3.1' and first '###'
        "This section introduces the main categories of ML algorithms: …",
        "Understanding this workflow is essential for testers, …"
      ],
      subsections: [
        {
          id: "3.1.2",
          title: "Machine Learning Workflow",
          lo: "AI-3.1.2",           // null for HO units
          ho: null,                 // e.g. "HO-3.1.3" for hands-on units
          kLevel: "K2",             // K1..K4 from LO bullet; H1/H2 for HO units
          loStatement: "Summarize the workflow used to create an ML system", // from line 517
          examinable: true,         // false for HO-* (syllabus line 213)
          handsOn: false,
          minutes: 40,              // DERIVED estimate, see below
          minutesIsEstimate: true,  // always true (syllabus has no sub-chapter timing, line 251)
          body: "The activities in the ML workflow, shown in Figure 1, are:\n\n**Understand the Objectives**\n\n…", // VERBATIM slice
          figures: [                // extracted from body image markdown (alt kept in full)
            { n: 1, caption: "ML Workflow", src: "assets/figures/syllabus_p30_R199.png",
              alt: "Figure 1: ML Workflow — dashed container …" }
          ],
          questions: [              // joined from merged.json rows where row.lo === this lo
            { q: "Q10", pts: 1, k: "K2", answer: "b" }
          ],
          srcLines: [565, 636]      // syllabus line range, for provenance UI + verifier
        }
        // …
      ]
    }
  ],
  cheatsheet: { /* §3 */ }
};
```

Field rules:

- `minutes`: syllabus gives only chapter budgets (§0). Derive `round_to_5(chapter_minutes × subsection_word_count / chapter_prose_word_count)`, minimum 5. Always render with an "est." marker. Chapter sums are exact by construction if we adjust the largest unit to absorb rounding.
- `questions`: empty array for all 8 HO units (not examinable, line 213). Populated from `merged.json → chapters[n].rows` (`q`, `answer`, `k`, `pts`).
- `figures` is derived from the body (single source); the body keeps the `![…](…)` markdown too — the verifier tolerates the whitelisted path rewrite in both.
- `srcLines` powers a "view source context" affordance and the verifier's slice check.

### 1.5 Worked example — subsection 5.1.2 "Testing for Bias" converted

Syllabus source: lines 1017–1040 (`### 5.1.2 Testing for Bias` … up to `### 5.1.3`). Everything below the `###` line, verbatim, becomes `body`. Real output of the conversion:

```js
{
  id: "5.1.2",
  title: "Testing for Bias",
  lo: "AI-5.1.2",
  ho: null,
  kLevel: "K2",
  loStatement: "Explain how to test for bias",       // from line 991
  examinable: true,
  handsOn: false,
  minutes: 25,
  minutesIsEstimate: true,
  body: "Bias in an MLS refers to non-random, unfair differences in treatment based on sensitive attributes like gender, age, or race, which is often unlawful and renders the system discriminatory.\n\nTesting for bias in an MLS involves understanding its potential sources, which primarily include:\n\n- Defects in the training data, such as unrepresentativeness, historical skews, or deliberate poisoning (data bias).\n- Defects within the algorithm, model, or development framework that introduce systemic unfairness, such as an algorithm using a decision threshold for credit scores in a loan approval system (algorithmic bias).\n\nTest approaches for detecting bias include the following:\n\n- Reviews of the overall ML workflow, and especially the data preparation, to identify their potential for introducing bias.\n- Reviews of dataset documentation to identify and mitigate potential sources of unfairness by examining how the data was collected, annotated, and what populations are represented.\n- Static analysis of both data preparation programs and the model implementation code to identify anti-patterns or the mishandling of sensitive attributes.\n- EDA of training data by using visualization and clustering methods to reveal imbalanced data, skewed distributions, or anomalous groupings across different sensitive attributes.\n- Dynamic testing to help detect bias in an ML model by feeding a known unbiased and representative dataset through the system and analyzing its predictions for statistically significant differences in outcomes across various sensitive groups. This identifies bias in model outputs, regardless of whether the bias was introduced during data training or during model development.\n- Label correctness testing (see 5.1.6) to identify mislabeling that causes incorrect associations to be learned between attributes and outcomes for specific sensitive attributes.\n- Disparate impact analysis:\n  1. Identify sensitive attributes for the model.\n  2. Generate counterfactuals for the sensitive attributes. (e.g., example scenarios where gender is changed from male to female in a loan application).\n  3. Generate model output by presenting it with the counterfactuals.\n  4. Analyze the results of multiple tests to achieve a statistically significant result, which determines if changing a sensitive attribute causes the model results to change, signaling the presence of bias.\n\n  Note: Disparate impact analysis can also be applied to combinations of sensitive attributes, allowing hidden bias associated with attribute combinations to be identified. However, take care to confirm that counterfactual examples are not unrealistic, as the model may then respond to them rather than to any underlying bias.",
  figures: [],
  questions: [ { q: "Q25", pts: 1, k: "K2", answer: "a" } ],
  srcLines: [1017, 1041]
}
```

Notes this example demonstrates: nested ordered list inside a bullet (renderer contract row 3), inline cross-references kept as plain text `(see 5.1.6)`, the trailing indented `Note:` paragraph stays inside the bullet item exactly as in the source, and the question join comes from merged.json (`rows` where `lo === "AI-5.1.2"`).

Optional (post-v1) renderer affordance: hyperlink `(see N.M.K)` / `(see N.M)` patterns to the matching unit — regex on rendered text only, source data untouched.

---

## 2. Cheatsheet model

One cheatsheet per chapter 1–7, aimed at revision (post-study), ~1 printed page equivalent. Stored inside the same chapter file under `chapters[n].cheatsheet`.

### 2.1 Block template (strict)

Every cheatsheet is an ordered array of typed blocks. **Mandatory** blocks: `meta`, `keyTerms`, `mustKnow`, `traps`, `examPointers`. **Conditional** blocks: `table` (chapters with a risk/mitigation or acceptance-criteria table: 2, 5, 6, 7), `formula` (ch3 only), `steps` (any chapter with a numbered procedure, e.g. 5.4 representativeness steps).

```ts
Cheatsheet := { chapter: Number, blocks: Block[] }

Block :=
  | { type: "meta", minutes, questionCount, points }                 // auto from chapter data
  | { type: "keyTerms", items: [{ term, def, src }] }                // chapter keywords (K1 rule, line 203)
  | { type: "mustKnow", title, items: [{ text, src }] }              // dense recall bullets
  | { type: "formula", items: [{ name, formula, note, src }] }
  | { type: "table", title, columns: [..], rows: [[..]], src }
  | { type: "traps", items: [{ confusion, text, src }] }             // common confusions / exam traps
  | { type: "examPointers", items: [{ lo, loText, kLevel, questions: [{q, pts}] }] } // auto-joined

src := "<subsection-id>" (e.g. "2.1.1") or "<id> L<start>-L<end>"    // machine-checkable, see §8.3
```

Sizing rule: a cheatsheet's rendered word count must be ≤ 25% of its chapter's prose word count (ch2 ≈ 1,700 prose words → cheatsheet ≤ ~430 words). This is enforced by the verifier as a hard cap.

### 2.2 No-new-technical-claims rule (formal)

Cheatsheets are synthesized, so they carry a traceability discipline mirroring the study guide's `*[derived]*` convention:

1. **Every bullet must carry `src`** resolving to a subsection id or syllabus line range that exists and lies inside the chapter.
2. **Allowed transformations only**: deletion (shortening), re-ordering, re-enumerating items the source already enumerates, merging two sentences from the cited range, substituting a term by its glossary synonym (only synonyms listed in section 9, e.g. `recall ≡ sensitivity`, line 1524).
3. **Forbidden**: new examples, new numeric values, new causal/comparative claims, dropping qualifiers that change claim strength ("may" → "will"), reusing an example in a context the source doesn't state it in.
4. Definitions in `keyTerms` are copied verbatim from the glossary (section 9) or from the defining sentence in the chapter, never rewritten.
5. Anything that must be editorial (block titles, the `confusion` label of a trap) is display chrome, not a technical claim.

### 2.3 Fully worked example — Chapter 2 cheatsheet (from lines 434–500)

Chapter 2 inputs: 45 min, sections 2.1/2.2, keywords at line 438 (AI-specific: None, line 442), definitions at 463–469 and 473, safety challenges at 475–479, acceptance-criteria rationale at 483, table at 491–500, questions Q7/Q8/Q9 (merged.json ch2 rows). This is the quality bar for the other six:

```js
chapters[2].cheatsheet = {
  chapter: 2,
  blocks: [
    { type: "meta", minutes: 45, questionCount: 3, points: 3 },

    { type: "keyTerms", items: [
      // def text verbatim from glossary section 9 where available; else from the cited line
      { term: "AI functional correctness",
        def: "functional correctness adjusted for the expected error rate of AI-based systems; ISO/IEC 25059 evaluates it by considering both correct and incorrect outputs and by defining acceptable thresholds for incorrect results",
        src: "2.1.1 L463" },
      { term: "Functional adaptability",
        def: "new sub-characteristic of functional suitability: the ability of the AI-based system to autonomously adapt to changes in its operational environment after it is deployed",
        src: "2.1.1 L464" },
      { term: "User controllability",
        def: "new sub-characteristic of interaction capability: a property such that a human or another external agent can intervene in its functioning in a timely manner",
        src: "2.1.1 L465" },
      { term: "Transparency",
        def: "new sub-characteristic of interaction capability and of satisfaction: the degree to which appropriate information about the AI-based system is communicated to stakeholders",
        src: "2.1.1 L466" },
      { term: "AI robustness",
        def: "new sub-characteristic of reliability: the ability to maintain its level of AI functional correctness regardless of circumstances (biased, adversarial, or invalid data inputs, external interference, adverse environmental conditions, operator misuse)",
        src: "2.1.1 L467" },
      { term: "Intervenability",
        def: "new sub-characteristic of security: the degree to which an operator can intervene in an AI-based system's functioning in a timely manner to prevent harm or hazard",
        src: "2.1.1 L468" },
      { term: "Societal and ethical risk mitigation",
        def: "new sub-characteristic of 'Freedom from risk' (quality in use): considers accountability, fairness and non-discrimination, privacy, safety and security, human control of technology, environmental sustainability, labor practices, and more",
        src: "2.1.1 L469" },
      { term: "Safety",
        def: "safety-related systems have the potential to cause injury or harm to people, property or the environment",
        src: "2.1.2 L473" }
    ]},

    { type: "mustKnow", title: "Framework & safety essentials", items: [
      { text: "ISO/IEC 25059 extends the ISO/IEC 25010 quality model for AI; it evaluates AI-based systems from two perspectives: product quality and quality in use.",
        src: "2.1.1 L461" },
      { text: "All seven characteristics above are new or modified vs ISO/IEC 25010; only Transparency appears in both perspectives (product quality AND quality in use).",
        src: "2.1.1 L463-L469" },
      { text: "Five extra challenges when AI is used in safety-related systems: vague Specifications (goals implicit in training data, weak requirements traceability), Non-determinism, Self-learning (behavior drifts from what was tested; mitigations include managing learning/data and safety guards such as a content moderation component), limited Explainability/Transparency (XAI techniques such as LIME exist but are not widely available and may compromise performance), Evolving regulations (EU AI Act classifies AI used as safety components as high-risk).",
        src: "2.1.2 L475-L479" },
      { text: "For AI-based systems, acceptance criteria often need to be statistical, probabilistic, or threshold-based rather than binary — a key testing challenge.",
        src: "2.2 L483" },
      { text: "Quality characteristics directly influence how test objectives are defined, how acceptance criteria are formulated, and how test results are interpreted.",
        src: "2.1.1 L461" }
    ]},

    { type: "table", title: "Example acceptance criteria (ISO/IEC 25059 + safety)",
      columns: ["Characteristic", "Examples (abbreviated)"],
      rows: [
        ["AI functional correctness", "Accuracy of 95% for an image recognition system; Recall of 90% for a defect prediction system"],
        ["Functional adaptability", "Max 20 seconds to adapt when crossing a specified altitude threshold; recommend ≥40% documentaries after three full documentaries"],
        ["User controllability", "Supervisor takes control of an autonomous drone within 0.5 s of a distress signal; manual override when sensor performance degrades >30%, full deactivation at >50%"],
        ["Transparency", "Third-party ML model and training-data provenance documented per company standard; API endpoint returns deployed model version + documentation link"],
        ["AI robustness", "Response time <1 s during a 30 s outage of the vulnerabilities database; edge device drops to lower-fidelity reduced-power mode above 85°C instead of crashing"],
        ["Intervenability", "Production line shutdown within 0.5 s of initiation; 30-second confirmation window to veto AI-proposed 'critical' actions"],
        ["Societal and ethical risk mitigation", "Sentencing system does not discriminate between racial groups on the specified fairness metric; chatbot passes red teaming assessment at ≥95%"],
        ["Safety", "Non-AI components compliant with ISO 26262-6 at ASIL C; 100% of input-output relationships mapped by an explainability tool at ≥99.9% average accuracy; out-of-limit control signals regulated within 0.15 s"]
      ],
      src: "2.2.1 L491-L500" },

    { type: "traps", items: [
      { confusion: "User controllability vs Intervenability",
        text: "Both are about timely intervention. User controllability is a sub-characteristic of interaction capability and the intervener is 'a human or another external agent'; intervenability is a sub-characteristic of security, the intervener is an operator, and the purpose is preventing harm or hazard.",
        src: "2.1.1 L465-L468" },
      { confusion: "AI functional correctness ≠ perfect accuracy",
        text: "Probabilistic ML cannot guarantee perfect accuracy; a certain error rate is expected, so correctness is evaluated with acceptable thresholds for incorrect results — do not pick exam answers claiming an AI system can be 'fully correct'.",
        src: "2.1.1 L463" },
      { confusion: "Safety is not one of the seven ISO/IEC 25059 AI characteristics",
        text: "The acceptance-criteria table covers the 25059 characteristics AND safety (from 2.1.2) as a separate row; exam options that list 'safety' among the 25059 sub-characteristics are wrong.",
        src: "2.2.1 L489-L500" }
    ]},

    { type: "examPointers", items: [   // auto-generated from merged.json
      { lo: "AI-2.1.1", kLevel: "K2", loText: "Classify behaviors of AI-based systems according to the quality characteristics defined in ISO/IEC 25059",
        questions: [ { q: "Q7", pts: 1 } ] },
      { lo: "AI-2.1.2", kLevel: "K2", loText: "Explain the special considerations that arise when AI is used in safety-related systems",
        questions: [ { q: "Q8", pts: 1 } ] },
      { lo: "AI-2.2.1", kLevel: "K2", loText: "Give examples of acceptance criteria for AI-based systems",
        questions: [ { q: "Q9", pts: 1 } ] }
    ]}
  ]
}
```

(Note how every synthesized sentence is a compression of the cited line range — e.g. the traps are pure re-arrangements of lines 465–468 and 463; the numeric examples all come from the table at 491–500. This is the bar.)

---

## 3. Glossary page

### 3.1 Source structure

Section 9 (lines 1428–1549): one pipe table, columns `Term Name | Definition`, 118 rows, alphabetical. Definition cells occasionally carry trailing metadata that must be parsed out, not left in the display text:

- Source citations: `(After ISO/IEC TR 29119-11)`, `(ISO/IEC TR 29119-11)`, `(ISO/IEC 2382)`, `(ISO/IEC TS 12791)`, `(after ISO/IEC TR 24027)` — e.g. lines 1432, 1443, 1447, 1496.
- Synonyms: `Synonym: sensitivity`, `Synonym: classification model`, `Synonym: weak AI (…)`, `Synonym: multi-layer perceptron`, `Synonym: artificial neural network (…)` — lines 1452, 1469, 1510, 1512, 1524.

Section 8 (lines 1392–1427): 31 abbreviation rows, e.g. `MLS | machine learning system(s)`.

### 3.2 Extraction format

```js
// data/glossary.js
window.CTAI_DATA.glossary = {
  terms: [
    { term: "recall",
      def: "An ML functional performance metric used to evaluate a classifier, which measures the proportion of actual positives that were predicted correctly.",
      synonyms: ["sensitivity"],
      refs: ["ISO/IEC TR 29119-11"],   // parsed from "(After …)" / "(ISO/IEC …)"
      abbr: [],                          // cross-joined from section 8 (none for recall)
      appearsIn: ["3.3.1", "2.2.1"] },   // auto: subsections whose body mentions the term
    { term: "large language model", def: "…", synonyms: [], refs: [], abbr: ["LLM"], appearsIn: ["1.1.3", "4.2"] },
    // … 118 entries
  ],
  abbreviations: { AI: "artificial intelligence", MLS: "machine learning system(s)", /* … 31 */ }
};
```

Parsing rules (mechanical, one-off script):

1. Row → `(term, defRaw)`. Strip trailing `(After X)` / `(X)` where X matches `ISO[…]` → `refs`. Strip `Synonym: Y` (anywhere in the cell) → `synonyms` (a synonym may itself end with a citation — strip it too, e.g. line 1510 `weak AI (ISO/IEC TR 29119-11)`).
2. Abbreviation join: exact case-insensitive match of abbreviation expansion to a term (e.g. `LLM` → `large language model`); unmatched expansions stay only in `abbreviations`.
3. `appearsIn`: regex word-boundary match of term/synonym/abbreviation over each subsection body; powers "terms in this chapter" and reverse links from study pages.

UI: single searchable page — text filter over `term + def + synonyms + abbr`, A–Z jump index, and a `mustKnow` badge for terms that appear in any chapter's `keywords` blocks (these are K1-required, line 203).

---

## 4. File / data layout

```
site/
  data/
    chapter-1.js … chapter-7.js   // window.CTAI_DATA.chapters[n] = { …study tree…, cheatsheet }
    glossary.js                   // window.CTAI_DATA.glossary  (~20 KB with refs/synonyms parsed)
    coverage.js                   // window.CTAI_DATA.coverage  (§5, ~8 KB, auto-generated)
  assets/figures/syllabus_p30_R199.png, syllabus_p35_R229.png, syllabus_p36_R237.png
  js/md.js                        // the tiny renderer (§1.3)
  js/study.js, js/progress.js, …  // D2's territory
  tools/build_chapters.py         // one-off generator: syllabus md + merged.json → data/*.js
  tools/verify_content.py         // §8, run before every release
```

Decision: **one file per chapter** (plus glossary + coverage), not a single chapters.js, and not per-subsection files.

Rationale, grounded in the measured sizes (§0):

- Total chapter content is 131.5 KB of markdown → ~145–160 KB as JSON-escaped JS (largest single file, ch3, ≈ 33 KB incl. cheatsheet). A single 160 KB `chapters.js` would actually be fine for load time, but per-chapter files keep diffs reviewable (the cheatsheets are hand-curated and will be revised chapter by chapter), let `tools/build_chapters.py` regenerate one chapter without touching others, and make a lazy-load path available later without re-splitting.
- **Loading strategy: eager.** `study.html` includes 9 static `<script>` tags (7 chapters + glossary + coverage) via a shared `data/include.html` snippet or just listed in the page. Parsing ~180 KB of JS + JSON-escaped strings is well under 100 ms on any machine new enough to matter, and `file://` has no network latency. Simplicity beats micro-optimization here.
- Hard constraint worth recording for all agents: **do not use `fetch()`/XHR for data** — `fetch` of local files is blocked on `file://` in Chromium. Classic `<script>` tags are the only universally reliable data channel; this is why data-as-global-JS (already the project convention) is correct, and why a lazy loader, if ever added, must use `document.createElement('script')` injection, not fetch.
- String encoding in generated files: emit via `JSON.stringify` per field (the Python generator writes `body: <json-string>`), so no manual template-literal escaping; verified safe because chapters 1–7 contain no backticks (§0).
- `cheatsheet` lives in the same chapter file (adds ~3–6 KB each): one file to load per chapter for both study and revision modes; the two modes never load independently.

---

## 5. LO coverage map

Purpose: UI shows "study progress by LO", per-chapter progress rings, and links each LO to its sample questions. Auto-generated by `tools/build_chapters.py` from the chapter files + merged.json — **never hand-edited**.

```js
// data/coverage.js
window.CTAI_DATA.coverage = {
  source: "merged.json",            // provenance stamp: file + question count
  totals: { examinableLos: 43, handsOnLos: 8, questions: 46, points: 49 },
  chapters: [
    { n: 2, title: "Quality Characteristics for AI-Based Systems", minutes: 45,
      stats: { los: 3, questions: 3, points: 3 },
      sections: [
        { id: "2.1", title: "Quality Characteristics for AI-Based Systems",
          los: [
            { id: "AI-2.1.1", subsection: "2.1.1", k: "K2", examinable: true,
              title: "AI-Specific Quality Characteristics",
              loText: "Classify behaviors of AI-based systems according to the quality characteristics defined in ISO/IEC 25059",
              minutes: 15,                       // same derived estimate as the study unit
              questions: [ { q: "Q7", pts: 1, k: "K2" } ],
              points: 1 }
            // …
          ] }
      ] }
    // … chapters 1–7
  ]
};
```

Shape rules:

- One entry per subsection (= per LO), all 51 units present, `examinable: false` for the 8 HO units so progress percentages can be computed over the 43 examinable LOs (matching syllabus line 213) with HOs shown as a separate "exercises done" counter.
- `questions[]` joined from `merged.json.chapters[n].rows` on `row.lo === lo.id`; `points` is the sum. 46 questions distributed per chapter: 9/3/10/7/6/9/2 (points 9/3/11/8/7/10/2, total 49).
- Progress state (written by the UI, not this file): `localStorage["ctai-progress-v1"] = { "AI-2.1.1": { studied: true, ts: 169… }, … }` keyed by LO id — ids are stable and unique, and double as anchors (`#lo-AI-2.1.1`) linking the coverage view, the study page, and the question drill view.

---

## 6. Generation pipeline (design only)

`tools/build_chapters.py` (one-off, re-runnable):

1. Parse the syllabus: chapter spans by `# N … – X minutes` (lines 277…1334); inside each, read the keywords blocks, the LO statement bullets (`- (AI|HO)-(\d+\.\d+\.\d+) \((K\d|H\d)\) text`), then walk `##`/`###` headings; slice bodies verbatim; extract figures; rewrite figure paths.
2. Derive `minutes` per subsection (§1.4 rule).
3. Join questions from merged.json.
4. Emit `data/chapter-N.js` (study tree; cheatsheet blocks are injected from a hand-maintained `tools/cheatsheets/N.js` source-of-truth merged at emit time, so regeneration never clobbers curation).
5. Emit `data/coverage.js` and `data/glossary.js`.
6. Run `tools/verify_content.py` (§7) and fail the build on any error.

---

## 7. Verification: proving study prose is a faithful subset

`tools/verify_content.py` — exit non-zero on any failure; run in CI/locally before release.

1. **Verbatim containment (the core check).** For each of the 51 subsections: read `srcLines [a,b]` from data, read the syllabus file, assert
   `normalize(source_lines[a+1 : b]) == normalize(body)`
   where `normalize` = collapse trailing whitespace per line, join with `\n`, and apply the single whitelisted substitution `figures/ → assets/figures/` to the source side. Because bodies are exact slices (not fuzzy matches), this is equality, not containment — stronger and simpler. (If a future editor paraphrases a body, this check fails with a diff.)
2. **Completeness.** Assert: 7 chapters; 51 subsections; the multiset of LO ids in data equals the multiset parsed from the syllabus LO bullets; 43 `examinable: true`; every `merged.json` LO appears exactly once in `coverage`; question counts and points per chapter match merged.json (46 / 49 total).
3. **Cheatsheet traceability.** For every cheatsheet item with `src`: parse `L<start>-L<end>` / subsection id, assert the range exists and lies inside the chapter's span. Soft check (warn): ≥ 85% of the item's words of length > 3 (minus a stopword list) occur in the cited source range — catches paraphrase drift without banning legitimate compression. Hard check: cheatsheet word count ≤ 25% of chapter prose (§2.1). Numeric values in items must appear in the cited range (regex on digit sequences) — this enforces the no-new-numbers rule mechanically.
4. **Glossary integrity.** 118 terms, 31 abbreviations; no empty defs; no leftover `Synonym:` or `(ISO` fragments inside `def` (regex); every `appearsIn` subsection id exists.
5. **Renderer golden files.** Run the JS renderer (via `node js/md.js --selftest` or a Python reference implementation kept in lockstep) over all 51 bodies + section intros; compare against `tools/golden/*.html` snapshots; fail on diff so rendering changes are deliberate. Also assert no body contains constructs outside the §1.3 inventory (no `` ` ``, no `](http`, no `<` other than `<br>`).

Limitations to state honestly: check 3's word-overlap is heuristic — the no-new-claims rule ultimately needs one human review pass per cheatsheet; the verifier's job is to make that pass fast (every bullet already carries a clickable `src`).

---

## 8. Summary of decisions

| Question | Decision |
|---|---|
| Chunking | Per subsection `N.M.K` = per LO/HO (1:1 verified, 51 units); section intros kept on the section |
| Verbatim vs structured | 100% verbatim slices; all structure in metadata; single whitelisted edit = figure path |
| Markdown vs pre-converted HTML | Tiny markdown subset stored verbatim, rendered by a ~100-line runtime renderer; construct inventory closed and listed (§1.3) |
| Cheatsheets | 8 block types, 5 mandatory; `src` on every item; no-new-claims rule formalized (§2.2); ≤ 25% word cap; worked ch2 example included |
| Glossary | Section 9 table → 118 terms with `synonyms`/`refs`/`abbr`/`appearsIn` parsed out; +31 abbreviations; client-side search |
| Files | Per-chapter `data/chapter-N.js` + `glossary.js` + `coverage.js`, eagerly loaded (~180 KB total); no fetch (file:// constraint); JSON.stringify encoding |
| Coverage | Auto-generated `coverage.js`: chapter → section → LO with questions/points/minutes; progress in localStorage keyed by LO id |
| Verification | Equality-of-slice containment vs syllabus, completeness counts vs LO bullets & merged.json, cheatsheet `src` range + numeric-traceability + word-cap checks, glossary integrity, renderer golden files |
