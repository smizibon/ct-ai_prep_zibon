window.CTAI_DATA = window.CTAI_DATA || {};
window.CTAI_DATA.chapters = window.CTAI_DATA.chapters || {};
window.CTAI_DATA.chapters[7] = {
 "n": 7,
 "title": "Machine Learning Development Testing",
 "minutes": 30,
 "keywords": {
  "general": [
   "ML development testing",
   "ML functional performance",
   "shadow testing"
  ],
  "aiSpecific": []
 },
 "sections": [
  {
   "id": "7.1",
   "title": "Machine Learning Development Testing",
   "intro": [
    "This chapter focuses specifically on addressing risks introduced by ML development tools, configuration choices, and deployment mechanisms, rather than the ML model itself. It covers test approaches and test types, such as API testing, ML functional performance testing, A/B testing, back-to-back testing, and reviews, to verify AI robustness and efficiency."
   ],
   "subsections": [
    {
     "id": "7.1.1",
     "title": "Machine Learning Development Risks and Mitigations",
     "lo": "AI-7.1.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Give examples of test approaches used for risk mitigation of ML development",
     "examinable": true,
     "handsOn": false,
     "body": "The following table lists examples of ML development risks and corresponding testing that could be used for risk mitigation:\n\n| Potential Risk | Possible Risk Mitigation |\n|---|---|\n| Incorrect or unintended use of library or framework APIs (e.g., TensorFlow, PyTorch) | API testing – see 7.1.2 |\n| Sub-optimal framework selection | Framework suitability review |\n| Problems within the algorithm, model, or development framework that introduce systemic unfairness | Testing for bias – see 5.1.2 |\n| Defective framework installation or build | Smoke testing |\n| Defective implementation of the evaluation by the framework | Reviews of framework evaluation code; Cross-check framework evaluation results (e.g., against manual benchmarks) |\n| Poor performance efficiency (e.g., framework is slow to respond) | Performance testing |\n| Poor usability of the framework | Usability testing |\n| Defect in a library used by the framework (e.g., defect in PyTorch); Defective algorithm implementation | ML functional performance testing – see 6.1.3; Back-to-back testing – see 6.1.10 |\n| Security vulnerabilities in the framework | Security testing |\n| Poor user documentation for the framework | Framework documentation review |\n| Sub-optimal algorithm selection | Algorithm suitability review; A/B testing – see 6.1.9 |\n| Sub-optimal hyperparameter selection (e.g., network structure, learning rate) | ML functional performance testing – see 6.1.3; A/B testing – see 6.1.9 |\n| Defective allocation of data to training, validation, and testing datasets | Data allocation review |\n| Poor selection of evaluation approach (e.g., k-fold cross-validation) | ML functional performance testing – see 6.1.3 |\n| Incorrect interpretation of test results due to the stochastic nature of the learning process | ML functional performance testing – see 6.1.3 |\n| Deployment defect (e.g., from generating a modified version for a target platform) | Smoke testing; ML functional performance testing – see 6.1.3; A/B testing – see 6.1.9 |\n| Deployed model is incompatible with the operational environment | Smoke testing; MLS deployment testing – see 7.1.2 |\n| Deployed model is no improvement over the current model | Shadow testing – see 7.1.2 |",
     "figures": [],
     "questions": [
      {
       "q": "Q39",
       "pts": 1,
       "k": "K2",
       "answer": "b, d"
      }
     ],
     "srcLines": [
      1355,
      1380
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    },
    {
     "id": "7.1.2",
     "title": "Machine Learning System Deployment Testing",
     "lo": "AI-7.1.2",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain the various forms of ML system deployment testing",
     "examinable": true,
     "handsOn": false,
     "body": "Deploying MLS involves several key test activities focused on verifying the AI-based system functions correctly and reliably in its target environment (e.g., cloud, edge device, mobile). Each of the following test types addresses specific risks during deployment:\n\n- **Installability testing** - verifies that the MLS can be successfully installed, configured, and subsequently uninstalled across all supported environments. This includes testing system dependencies (e.g., GPU drivers), compatibility with frameworks, and successfully executing installation scripts.\n- **Rollback testing** - verifies the system's capability to successfully revert to a previously stable and operational state following a degraded or failed deployment. This may only cover the model or cover the complete system (e.g., including the data pipeline). Note that rollback testing must be performed before deployment to confirm rollback readiness.\n- **Canary testing** – validates new deployments by releasing an updated model to a small subset of production traffic (e.g., 5% of users). Real-time metrics, such as latency, accuracy, and error rates, are monitored to detect regressions before a full rollout.\n- **Shadow testing** - runs a new model in parallel with the current production model in real-time, routing the same requests to both systems without affecting live responses. It allows comparing new and old models using live data in a controlled, low-risk environment and can uncover defects, such as performance regressions and data drift, before full deployment.\n- **Model conversion testing** - verifies that an ML model retains acceptable predictive accuracy, consistent behavior, and operational efficiency (e.g., inference speed, memory usage) after being converted from its original training format to a deployment format suitable for the target production environment.\n- **Cross-device testing** - verifies that the MLS performs correctly across its intended range of deployment targets, from mobile devices and edge devices to cloud servers.\n- **API testing** - verifies that the MLS exposes well-defined, standards-compliant interfaces. It validates correct handling of inputs and outputs, error messages, and integration workflows with external systems, such as data feeds, clients, and the pipeline.",
     "figures": [],
     "questions": [
      {
       "q": "Q40",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      1380,
      1392
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    }
   ]
  }
 ],
 "cheatsheet": {
  "chapter": 7,
  "blocks": [
   {
    "type": "meta",
    "minutes": 30,
    "questionCount": 2,
    "points": 2
   },
   {
    "type": "keyTerms",
    "items": [
     {
      "term": "Installability testing",
      "def": "Verifies the MLS can be successfully installed, configured, and uninstalled across all supported environments (dependencies, framework compatibility, installation scripts).",
      "src": "7.1.2 L1384"
     },
     {
      "term": "Rollback testing",
      "def": "Verifies capability to revert to a previously stable state after a degraded or failed deployment; must be performed before deployment to confirm rollback readiness.",
      "src": "7.1.2 L1385"
     },
     {
      "term": "Canary testing",
      "def": "Releases an updated model to a small subset of production traffic (e.g., 5% of users), monitoring real-time metrics to detect regressions before full rollout.",
      "src": "7.1.2 L1386"
     },
     {
      "term": "Shadow testing",
      "def": "Runs a new model in parallel with the current production model in real-time, same requests to both, without affecting live responses; uncovers performance regressions and data drift pre-deployment.",
      "src": "7.1.2 L1387"
     },
     {
      "term": "Model conversion testing",
      "def": "Verifies the model retains acceptable predictive accuracy, consistent behavior, and operational efficiency after conversion from training format to deployment format.",
      "src": "7.1.2 L1388"
     },
     {
      "term": "Cross-device testing / API testing",
      "def": "Cross-device: correct performance across deployment targets (mobile, edge, cloud). API testing: standards-compliant interfaces, correct input/output handling, error messages.",
      "src": "7.1.2 L1389-L1390"
     }
    ]
   },
   {
    "type": "mustKnow",
    "title": "Scope & key rules",
    "items": [
     {
      "text": "This chapter addresses risks from ML development tools, configuration choices, and deployment mechanisms — not the ML model itself. Approaches include API testing, ML functional performance testing, A/B testing, back-to-back testing, and reviews.",
      "src": "7.1 L1353"
     },
     {
      "text": "Rollback testing must be performed before deployment to confirm rollback readiness; it may cover only the model or the complete system (e.g., including the data pipeline).",
      "src": "7.1.2 L1385"
     }
    ]
   },
   {
    "type": "table",
    "title": "ML development risks → mitigations",
    "columns": [
     "Potential risk",
     "Mitigation"
    ],
    "rows": [
     [
      "Incorrect/unintended use of framework APIs (TensorFlow, PyTorch)",
      "API testing"
     ],
     [
      "Sub-optimal framework / algorithm selection",
      "Suitability review; A/B testing"
     ],
     [
      "Defective framework installation or build",
      "Smoke testing"
     ],
     [
      "Library defect; defective algorithm implementation",
      "ML functional performance testing; Back-to-back testing"
     ],
     [
      "Sub-optimal hyperparameters (network structure, learning rate)",
      "ML functional performance testing; A/B testing"
     ],
     [
      "Defective data allocation to train/val/test sets",
      "Data allocation review"
     ],
     [
      "Deployment defect; model incompatible with environment",
      "Smoke testing; MLS deployment testing"
     ],
     [
      "Deployed model no improvement over current",
      "Shadow testing"
     ]
    ],
    "src": "7.1.1 L1359-L1378"
   },
   {
    "type": "traps",
    "items": [
     {
      "confusion": "Canary vs Shadow testing",
      "text": "Canary releases the new model to a small subset of real production traffic (it serves live users); shadow runs new and current models in parallel on the same requests without affecting live responses.",
      "src": "7.1.2 L1386-L1387"
     }
    ]
   },
   {
    "type": "examPointers",
    "items": [
     {
      "lo": "AI-7.1.1",
      "kLevel": "K2",
      "loText": "Give examples of test approaches used for risk mitigation of ML development",
      "questions": [
       {
        "q": "Q39",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-7.1.2",
      "kLevel": "K2",
      "loText": "Explain the various forms of ML system deployment testing",
      "questions": [
       {
        "q": "Q40",
        "pts": 1
       }
      ]
     }
    ]
   }
  ]
 }
};
