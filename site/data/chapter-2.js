window.CTAI_DATA = window.CTAI_DATA || {};
window.CTAI_DATA.chapters = window.CTAI_DATA.chapters || {};
window.CTAI_DATA.chapters[2] = {
 "n": 2,
 "title": "Quality Characteristics for AI-Based Systems",
 "minutes": 45,
 "keywords": {
  "general": [
   "Functional adaptability",
   "AI functional correctness",
   "intervenability",
   "AI robustness",
   "safety",
   "societal and ethical risk mitigation",
   "transparency",
   "user controllability"
  ],
  "aiSpecific": []
 },
 "sections": [
  {
   "id": "2.1",
   "title": "Quality Characteristics for AI-Based Systems",
   "intro": [
    "This section covers AI-specific quality characteristics outlined in ISO/IEC 25059, which extends traditional software quality models to address unique aspects of AI-based systems. It introduces new and adapted characteristics, including AI functional correctness, functional adaptability, user controllability, transparency, AI robustness, and intervenability, alongside societal and ethical risk mitigation. Major AI safety challenges, such as vague specifications, non-determinism, self-learning, limited explainability, and evolving standards, are also addressed, with an emphasis on their impact on testing and regulation."
   ],
   "subsections": [
    {
     "id": "2.1.1",
     "title": "AI-Specific Quality Characteristics",
     "lo": "AI-2.1.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Classify behaviors of AI-based systems according to the quality characteristics defined in ISO/IEC 25059",
     "examinable": true,
     "handsOn": false,
     "body": "ISO/IEC 25059 extends the quality model from ISO/IEC 25010 to address AI-specific considerations. This extension evaluates AI-based systems from two perspectives: product quality and quality in use. From a testing perspective, these quality characteristics directly influence how test objectives are defined, how acceptance criteria are formulated, and how test results are interpreted for AI-based systems. New and modified characteristics, compared to ISO/IEC 25010, include:\n\n- **AI functional correctness (product quality):** AI-based systems, especially those using probabilistic ML, cannot guarantee perfect accuracy. Since a certain error rate is expected in AI outputs, the concept of functional correctness has been adjusted accordingly. ISO/IEC 25059 evaluates functional correctness by considering both correct and incorrect outputs and by defining acceptable thresholds for incorrect results, reflecting the inherent variability in AI-based system outputs (see 3.3).\n- **Functional adaptability (product quality):** a new sub-characteristic of functional suitability. The ability of the AI-based system to autonomously adapt to changes in its operational environment after it is deployed.\n- **User controllability (product quality):** a new sub-characteristic of interaction capability (note that interaction capability is itself a new term that replaces usability in the 2023 version of ISO/IEC 25010). A property of an AI-based system such that a human or another external agent can intervene in its functioning in a timely manner.\n- **Transparency (product quality and quality in use):** a new sub-characteristic of interaction capability and a new sub-characteristic of satisfaction. It relates to the degree to which appropriate information about the AI-based system is communicated to stakeholders (see 6.1.2).\n- **AI robustness (product quality):** a new sub-characteristic of reliability. It describes the ability of an AI-based system to maintain its level of AI functional correctness regardless of circumstances, such as the presence of biased, adversarial, or invalid data inputs, external interference, adverse environmental conditions, and operator misuse.\n- **Intervenability (product quality):** a new sub-characteristic of security. The degree to which an operator can intervene in an AI-based system's functioning in a timely manner to prevent harm or hazard.\n- **Societal and ethical risk mitigation (quality in use):** a new sub-characteristic of 'Freedom from risk'. Considers many areas to mitigate societal and ethical risk, including accountability, fairness and non-discrimination, professional responsibility, promotion of human values, privacy, safety and security, human control of technology, community involvement and development, human centered design, respect for the rule of law, respect for international norms of behavior, environmental sustainability, and labor practices.",
     "figures": [],
     "questions": [
      {
       "q": "Q7",
       "pts": 1,
       "k": "K2",
       "answer": "c"
      }
     ],
     "srcLines": [
      459,
      471
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    },
    {
     "id": "2.1.2",
     "title": "AI and Safety",
     "lo": "AI-2.1.2",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain the special considerations that arise when AI is used in safety-related systems",
     "examinable": true,
     "handsOn": false,
     "body": "Safety-related systems have the potential to cause injury or harm to people, property or the environment. Developing and testing non-AI safety-related systems can take a lot of effort, but is feasible; however, for AI-based systems, there are several additional challenges:\n\n- **Specifications:** In traditional safety-related systems, requirements are defined for the complete system and refined until the developer can transform them into code. The requirements for many AI-based systems often begin with vague goals and are then implicitly provided via the training data that encodes patterns, rules, and objectives, without fully formalizing every detail upfront. This can mean that the necessary traceability from requirements to implementation is inadequate for AI-based systems.\n- **Non-determinism:** This characteristic of many AI-based systems makes it inherently challenging to guarantee the precise behavior of these systems. Even rigorously tested models can exhibit unexpected behavior due to factors such as random number generation or slight variations in input values.\n- **Self-learning:** Rigorous testing is used to demonstrate the safety integrity of a system before deployment. For self-learning AI-based systems, this is undermined as the system's behavior progressively moves away from the originally tested behavior. Managing how the model learns and the data it uses can sometimes help to avoid the emergence of new problematic behaviors. Alternatively, safety guards can be implemented to help prevent the model from learning or making decisions that could compromise safety (e.g., a content moderation component to filter prompts).\n- **Explainability and Transparency:** For safety-related systems, it is essential to understand how and why the system makes decisions. However, the decision-making processes of AI-based systems are often not transparent. Explainable AI techniques, such as LIME (Local interpretable model-agnostic explanations), can provide insights into the AI-based system's reasoning; however, they are not widely available and may compromise system performance.\n- **Evolving Regulations:** The regulatory landscape for safety-related AI-based systems is constantly evolving. The use of AI is currently not included in mature functional safety international standards, and some of these standards even prohibit its use in such systems. The EU AI Act [EU AI Act] (see 1.1.8) classifies AI systems used as safety components (such as in aviation, medical devices, or automotive) as high-risk and imposes strict requirements on their development and testing.",
     "figures": [],
     "questions": [
      {
       "q": "Q8",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      471,
      481
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    }
   ]
  },
  {
   "id": "2.2",
   "title": "Acceptance Criteria for AI-Based Systems",
   "intro": [
    "This section outlines acceptance criteria related to the quality characteristics specified in the ISO/IEC 25059 standard, as well as safety. For AI-based systems, acceptance criteria often need to be statistical, probabilistic, or threshold-based rather than binary, which introduces additional testing challenges."
   ],
   "subsections": [
    {
     "id": "2.2.1",
     "title": "Acceptance Criteria for AI-Based Systems",
     "lo": "AI-2.2.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Give examples of acceptance criteria for AI-based systems",
     "examinable": true,
     "handsOn": false,
     "body": "When evaluating the quality of an AI-based system, it is essential to consider both functional and non-functional quality characteristics. This helps confirm that the AI-based system functions as intended and satisfies broader quality requirements. The ISO/IEC 25010 and ISO/IEC 25059 standards provide a comprehensive framework for defining software quality. In this section, the focus is on the acceptance criteria associated with the quality characteristics specific to AI (i.e., those defined in ISO/IEC 25059) and safety (see 2.1.2).\n\nThe following table lists example acceptance criteria for safety and each of the quality characteristics defined in the ISO/IEC 25059 standard.\n\n| Characteristic | Example Acceptance Criteria |\n|---|---|\n| AI functional correctness (see 3.3) | • Accuracy of 95% for an image recognition system.<br>• Recall of 90% for a defect prediction system. |\n| Functional adaptability | • A maximum of 20 seconds for the engine management system to adapt when it crosses a specified altitude threshold.<br>• A video streaming service shall adjust its homepage to recommend at least 40% of documentaries after a user watches three full-length documentaries in a single session. |\n| User controllability | • A supervisor can take control of an autonomous drone within 0.5 of a second when it sends a distress signal due to loss of its GPS location.<br>• The farm control system notifies the farmer when the sensor's visual performance degrades by more than 30%, allowing immediate manual override; it fully deactivates if degradation exceeds 50% without user response. |\n| Transparency | • Sufficient information is provided about the third-party ML model and the provenance of its training data to meet the requirements of the relevant company standard.<br>• The system's operational dashboard and API must provide an endpoint that returns the unique version identifier of the currently deployed prediction model and a link to its corresponding documentation. |\n| AI robustness | • The response time for the AI-based security penetration alert system predictions remains below 1 second when access to the central vulnerabilities database is disrupted for 30 seconds.<br>• The edge AI device shall automatically transition to a lower-fidelity, reduced-power inference mode (instead of crashing) when its internal operating temperature exceeds 85°C for a continuous period of 10 seconds. |\n| Intervenability | • If a robot breaches its safety zone, the production line is capable of being shut down within 0.5 seconds after a shutdown is initiated.<br>• To prevent potential blackouts, the power grid management system shall provide a 30-second confirmation window, during which an engineer can veto any AI-proposed action classified as 'critical' before it is automatically executed. |\n| Societal and ethical risk mitigation | • The automated prison sentencing system does not discriminate between racial groups based on the specified fairness metric.<br>• The chatbot must pass an internal \"red teaming\" assessment with a score of 95% or higher, demonstrating its refusal to generate content that promotes violence, self-harm, or hate speech. |\n| Safety | • Non-AI components of the AI-based steering control system are compliant with ISO 26262-6 at ASIL (automotive safety integrity level) C.<br>• 100% of the relationships between inputs and outputs of the ML model in the nuclear power plant control system can be mapped with an average accuracy of no lower than 99.9% by an explainability tool.<br>• Control signals that exceed specified safety limits by more than 10% are analyzed and regulated within 0.15 seconds after being detected by the safety monitoring sub-system. |",
     "figures": [],
     "questions": [
      {
       "q": "Q9",
       "pts": 1,
       "k": "K2",
       "answer": "c"
      }
     ],
     "srcLines": [
      485,
      502
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    }
   ]
  }
 ],
 "cheatsheet": {
  "chapter": 2,
  "blocks": [
   {
    "type": "meta",
    "minutes": 45,
    "questionCount": 3,
    "points": 3
   },
   {
    "type": "keyTerms",
    "items": [
     {
      "term": "AI functional correctness",
      "def": "(product quality) ISO/IEC 25059 evaluates functional correctness by considering both correct and incorrect outputs and by defining acceptable thresholds for incorrect results, reflecting the inherent variability in AI-based system outputs.",
      "src": "2.1.1 L463"
     },
     {
      "term": "Functional adaptability",
      "def": "(product quality; new sub-characteristic of functional suitability) The ability of the AI-based system to autonomously adapt to changes in its operational environment after it is deployed.",
      "src": "2.1.1 L464"
     },
     {
      "term": "User controllability",
      "def": "(product quality; new sub-characteristic of interaction capability) A property of an AI-based system such that a human or another external agent can intervene in its functioning in a timely manner.",
      "src": "2.1.1 L465"
     },
     {
      "term": "Transparency",
      "def": "(product quality AND quality in use; new sub-characteristic of interaction capability and of satisfaction) Relates to the degree to which appropriate information about the AI-based system is communicated to stakeholders.",
      "src": "2.1.1 L466"
     },
     {
      "term": "AI robustness",
      "def": "(product quality; new sub-characteristic of reliability) The ability to maintain its level of AI functional correctness regardless of circumstances (biased, adversarial, or invalid data inputs, external interference, adverse environmental conditions, operator misuse).",
      "src": "2.1.1 L467"
     },
     {
      "term": "Intervenability",
      "def": "(product quality; new sub-characteristic of security) The degree to which an operator can intervene in an AI-based system's functioning in a timely manner to prevent harm or hazard.",
      "src": "2.1.1 L468"
     },
     {
      "term": "Societal and ethical risk mitigation",
      "def": "(quality in use; new sub-characteristic of 'Freedom from risk') Considers accountability, fairness and non-discrimination, professional responsibility, promotion of human values, privacy, safety and security, human control of technology, … environmental sustainability, and labor practices.",
      "src": "2.1.1 L469"
     },
     {
      "term": "Safety (safety-related system)",
      "def": "Safety-related systems have the potential to cause injury or harm to people, property or the environment.",
      "src": "2.1.2 L473"
     }
    ]
   },
   {
    "type": "mustKnow",
    "title": "Framework & safety essentials",
    "items": [
     {
      "text": "ISO/IEC 25059 extends the ISO/IEC 25010 quality model for AI and evaluates AI-based systems from two perspectives: product quality and quality in use.",
      "src": "2.1.1 L461"
     },
     {
      "text": "Of the seven new/modified characteristics, only Transparency appears in both perspectives; Societal and ethical risk mitigation is defined only for quality in use, the other six only for product quality.",
      "src": "2.1.1 L463-L469"
     },
     {
      "text": "Five extra challenges when AI is used in safety-related systems: Specifications (goals vague, implicitly provided via training data, inadequate requirements traceability), Non-determinism, Self-learning (behavior moves away from originally tested behavior; manage how the model learns and the data it uses, or add safety guards such as a content moderation component), Explainability and Transparency (XAI techniques such as LIME exist but are not widely available and may compromise system performance), Evolving Regulations (the EU AI Act classifies AI used as safety components — aviation, medical devices, automotive — as high-risk).",
      "src": "2.1.2 L475-L479"
     },
     {
      "text": "For AI-based systems, acceptance criteria often need to be statistical, probabilistic, or threshold-based rather than binary — an additional testing challenge.",
      "src": "2.2 L483"
     },
     {
      "text": "Quality characteristics directly influence how test objectives are defined, how acceptance criteria are formulated, and how test results are interpreted.",
      "src": "2.1.1 L461"
     }
    ]
   },
   {
    "type": "table",
    "title": "Example acceptance criteria (ISO/IEC 25059 characteristics + safety)",
    "columns": [
     "Characteristic",
     "Example acceptance criteria (abbreviated)"
    ],
    "rows": [
     [
      "AI functional correctness",
      "Accuracy of 95% for image recognition; Recall of 90% for defect prediction"
     ],
     [
      "Functional adaptability",
      "Max 20 s to adapt at an altitude threshold; recommend ≥40% documentaries after three full documentaries"
     ],
     [
      "User controllability",
      "Supervisor takes control of an autonomous drone within 0.5 s of a distress signal; manual override at >30% sensor degradation, full deactivation at >50%"
     ],
     [
      "Transparency",
      "Third-party ML model and training-data provenance per company standard; API returns deployed model version + documentation link"
     ],
     [
      "AI robustness",
      "Response time <1 s during a 30 s vulnerabilities-database outage; lower-fidelity reduced-power mode above 85°C instead of crashing"
     ],
     [
      "Intervenability",
      "Production line shutdown within 0.5 s; 30-second window to veto AI-proposed 'critical' actions"
     ],
     [
      "Societal and ethical risk mitigation",
      "No racial discrimination on the specified fairness metric; chatbot passes red teaming at ≥95%"
     ],
     [
      "Safety",
      "Non-AI components compliant with ISO 26262-6 at ASIL C; input-output relationships mapped at ≥99.9% accuracy; out-of-limit signals regulated within 0.15 s"
     ]
    ],
    "src": "2.2.1 L491-L500"
   },
   {
    "type": "traps",
    "items": [
     {
      "confusion": "User controllability vs Intervenability",
      "text": "Both involve timely intervention. User controllability is a sub-characteristic of interaction capability and the intervener is \"a human or another external agent\"; intervenability is a sub-characteristic of security, the intervener is an operator, and the purpose is to prevent harm or hazard.",
      "src": "2.1.1 L465-L468"
     },
     {
      "confusion": "AI functional correctness ≠ perfect accuracy",
      "text": "Probabilistic ML cannot guarantee perfect accuracy — a certain error rate is expected, so correctness is evaluated with acceptable thresholds for incorrect results. Exam options claiming an AI system can be 'fully correct' contradict this.",
      "src": "2.1.1 L463"
     },
     {
      "confusion": "Safety is not one of the seven ISO/IEC 25059 AI characteristics",
      "text": "The acceptance-criteria table covers the 25059 characteristics AND safety (from 2.1.2) as a separate row; options listing 'safety' among the 25059 sub-characteristics are wrong.",
      "src": "2.2.1 L489-L500"
     }
    ]
   },
   {
    "type": "examPointers",
    "items": [
     {
      "lo": "AI-2.1.1",
      "kLevel": "K2",
      "loText": "Classify behaviors of AI-based systems according to the quality characteristics defined in ISO/IEC 25059",
      "questions": [
       {
        "q": "Q7",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-2.1.2",
      "kLevel": "K2",
      "loText": "Explain the special considerations that arise when AI is used in safety-related systems",
      "questions": [
       {
        "q": "Q8",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-2.2.1",
      "kLevel": "K2",
      "loText": "Give examples of acceptance criteria for AI-based systems",
      "questions": [
       {
        "q": "Q9",
        "pts": 1
       }
      ]
     }
    ]
   }
  ]
 }
};
