window.CTAI_DATA = window.CTAI_DATA || {};
window.CTAI_DATA.chapters = window.CTAI_DATA.chapters || {};
window.CTAI_DATA.chapters[6] = {
 "n": 6,
 "title": "Model Testing for Machine Learning Systems",
 "minutes": 225,
 "keywords": {
  "general": [
   "A/B testing",
   "adversarial testing",
   "back-to-back testing",
   "concept drift",
   "data drift",
   "drift testing",
   "metamorphic testing",
   "ML functional performance",
   "ML model testing",
   "review"
  ],
  "aiSpecific": [
   "Overfitting",
   "underfitting"
  ]
 },
 "sections": [
  {
   "id": "6.1",
   "title": "Model Testing for Machine Learning Systems",
   "intro": [
    "ML model testing involves addressing specific risks. These include functional risks such as bias, overfitting, and adversarial vulnerabilities, as well as non-functional risks such as lack of AI robustness and performance efficiency, and deployment risks."
   ],
   "subsections": [
    {
     "id": "6.1.1",
     "title": "Machine Learning Model Risks and Mitigations",
     "lo": "AI-6.1.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Give examples of test approaches used for risk mitigation of ML models",
     "examinable": true,
     "handsOn": false,
     "body": "The following table lists examples of ML model risks and corresponding testing that could be used for risk mitigation:\n\n| Potential Risk | Possible Risk Mitigation |\n|---|---|\n| Biased or unfair ML model | Testing for bias – see 5.1.2 |\n| Unethical model | Ethical system testing |\n| Adversarial examples | Adversarial testing – see 6.1.4 |\n| Overfitted model | Testing for overfitting – see 6.1.8 |\n| Underfitted model | Testing for underfitting – see 6.1.8 |\n| Unacceptable data drift; Unacceptable concept drift | Drift testing – see 6.1.7 |\n| Model causes side-effects | Side-effects testing |\n| Model exhibits reward hacking | Reward hacking testing |\n| Model API defect | API testing – see 7.1.2 |\n| Failure to achieve required ML model performance measures (e.g., lack of accuracy, recall) | ML functional performance testing – see 6.1.3 |\n| Functional incorrectness; Non-functional defects | Metamorphic testing – see 6.1.5 |\n| Test oracle problem | Metamorphic testing – see 6.1.5; Back-to-back testing – see 6.1.10; A/B testing – see 6.1.9 |\n| Poor system requirements | Requirements review; Red teaming – see 4.2.2; Exploratory testing |\n| Lack of model AI robustness due to unexpected inputs | Adversarial testing – see 6.1.4; Fuzz testing |\n| Inadequate ML model performance efficiency | Performance testing |\n| Poor model documentation (e.g., function, accuracy, interface) | Model documentation review – see 6.1.2 |\n| Model updates introduce defects | Back-to-back testing – see 6.1.10 |\n| Model updates decrease ML model functional performance | A/B testing – see 6.1.9 |\n| Deployment of updated model causes immediate failure | Smoke testing |\n| Deployment of updated model causes regression | Regression testing |\n| Security vulnerabilities; Safety vulnerabilities; Privacy violations; Harmful or undesirable outputs (e.g., racist views, dangerous guidance) | Red teaming – see 4.2.2 |",
     "figures": [],
     "questions": [
      {
       "q": "Q30",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      1162,
      1190
     ],
     "minutes": 20,
     "minutesIsEstimate": true
    },
    {
     "id": "6.1.2",
     "title": "Machine Learning Model Documentation and Review",
     "lo": "AI-6.1.2",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain the purpose and focus of reviewing ML model documentation",
     "examinable": true,
     "handsOn": false,
     "body": "Comprehensive documentation for ML models is not just a formality; it is a critical resource. Unlike systems where source code can be inspected directly, MLS present unique challenges due to the limited understandability of machine-generated code, the inherent black-box nature of models, and their dependency on data. Models are also frequently updated, so documentation becomes the main tool for developers, testers, and regulators to understand, evaluate, and trust AI-based systems. Transparency plays a central role in enabling this understanding, allowing stakeholders to trace model behavior, decision logic, and data lineage throughout the AI lifecycle.\n\nStandardized documentation improves communication, supports informed decision-making, and verifies the quality and maintainability of ML models. It is increasingly important for regulatory compliance, as evidenced by frameworks such as the EU AI Act, which emphasizes transparency obligations that require clear documentation of model decisions, limitations, and interpretability measures. For high-risk systems, passing a documentation audit is often a prerequisite for deployment, while for all systems, a thorough review helps verify quality.\n\nSeveral documentation frameworks exist, including Model Cards, which provide concise overviews of a model's intended uses, evaluation results, and ethical considerations [MODEL_DOC], and Datasheets for Datasets, which offer standardized formats for describing datasets, including their motivation, composition, collection process, and uses [DATA_DOC].\n\nThe following list outlines the typical contents expected for comprehensive ML model documentation, structured so that it can be used as a practical checklist by both developers and testers to help achieve completeness, clarity, and testability:\n\n- **General:** Identifiers, description, developer, version, date, contact, license, hardware needs\n- **Design:** Assumptions, technical decisions, ML algorithm\n- **Usage:** Intended purpose, primary/secondary uses, users, self-learning approach, bias, ethics, safety, transparency, thresholds, platform, data drift, concept drift\n- **Datasets:** Features, source, collection, availability, preprocessing, use, content, labels, size, privacy, security, bias/fairness, restrictions\n- **Testing:** Test dataset details, independence of testing, test results, test activities (e.g., functional, adversarial)\n- **Functional:** Measures, validation dataset, thresholds, actual performance.\n- **Non-Functional:** Scalability, reliability, availability, performance efficiency (e.g., latency, resource utilization), maintainability, AI robustness.\n- **Operational:** Deployment plan, deployment environment, computational resources, monitoring metrics/alerts, retraining strategy, model update/rollback plan, deprecation plan, security (adversarial risks), explainability methods\n\nReviewing documentation against such checklists is a core test activity, aiming to:\n\n- Identify missing information, inaccuracies, and inconsistencies.\n- Improve clarity and readability.\n- Enhance maintainability by identifying where documentation needs improvement.\n- Provide sufficient information for test and deployment activities.\n- Verify that all relevant regulatory requirements have been met.",
     "figures": [],
     "questions": [
      {
       "q": "Q31",
       "pts": 1,
       "k": "K2",
       "answer": "a"
      }
     ],
     "srcLines": [
      1190,
      1217
     ],
     "minutes": 25,
     "minutesIsEstimate": true
    },
    {
     "id": "6.1.3",
     "title": "ML Functional Performance Testing of Probabilistic Machine Learning Systems",
     "lo": "AI-6.1.3",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain how ML functional performance testing is carried out for probabilistic machine learning systems",
     "examinable": true,
     "handsOn": false,
     "body": "ML functional performance testing evaluates how well an ML model performs its intended functions by measuring metrics such as accuracy, recall, precision, and F1-score (see 3.3) and comparing the results against defined acceptance criteria.\n\nThis testing for probabilistic MLS moves beyond a single passed/failed status to statistically measure a model's performance against its acceptance criteria [STATS]. This approach is necessary to address the non-determinism inherent in MLS by evaluating behavior across a large, representative dataset (see 4.1.2).\n\nA precondition for this testing is having acceptance criteria defined in statistical terms. Instead of a simple target, a requirement might specify a performance metric, a margin of error (MoE), and a confidence level (CL). Such a requirement can be used to determine the minimum number of tests required. As the number of tests increases, there are two options:\n\n- Fix the CL and the MoE will decrease. This means the test result becomes more precise.\n- Fix the MoE and the CL will increase. This means the test result becomes more certain.\n\nFor example, a criterion might be \"98% accuracy with a MoE of ±4% at a 95% CL\". To confirm that the measured accuracy has a maximum MoE of ±4% at the 95% CL, a sample size of 601 test cases is required. This is calculated using the sample size formula for estimating a population proportion. This sample size is based on the conservative assumption that the true accuracy could be anywhere between 0% and 100%, which produces the largest possible uncertainty but still guarantees the ±4% MoE under all conditions. To meet the target accuracy of 98%, at least 589 of the 601 test cases must pass. If, after running all 601 test cases, the observed accuracy is 98%, then the measured MoE at the 95% CL will be narrower than ±4% (approximately ±1.1%), because variance is lower at high accuracy levels. The MoE is computed using the margin of error formula for a sample proportion. This means that when testing, it is not always necessary to run all 601 test cases. Sequential testing provides a formal statistical framework for this early stopping. Instead of always running the full fixed sample, these approaches analyze results as they accumulate and stop early when sufficient evidence supports the accuracy target (or rejects it). If the observed accuracy remains consistently high (e.g., no less than 98%), then the statistical uncertainty decreases as more tests are run. In that situation, the required MoE of ±4% at the 95% CL is reached after about 170 test cases, allowing testing to conclude earlier.\n\nNOTE: The formulae and numerical calculations in this example (for sample size, margin of error, and confidence intervals) are provided for illustration and understanding only; candidates will not be required to derive or compute these values using statistical formulae in the exam.\n\nFor safety-critical systems, a stricter reliability requirement might be used, such as \"99% reliability with 95% confidence,\" which would require 299 test cases, all of which must pass to meet the criteria.\n\nTo validate these criteria, testing requires a large test dataset that is completely independent of the training and validation datasets. This test dataset must be a representative sample of the operational input domain (see 5.1.4) to verify that the evaluation reflects real-world conditions. The test cases are then executed using the ML model within an ML development framework capable of statistical analysis. Finally, the aggregated results are interpreted and reported with statistical confidence, not as a simple passed/failed ratio. A final test report would state, for example, \"The model achieved an accuracy of 94% ±4% at the 95% CL.\" This allows stakeholders to understand the range of expected operational performance and make an informed decision on whether the model's ML functional performance is acceptable for deployment.",
     "figures": [],
     "questions": [
      {
       "q": "Q32",
       "pts": 1,
       "k": "K2",
       "answer": "a"
      }
     ],
     "srcLines": [
      1217,
      1236
     ],
     "minutes": 35,
     "minutesIsEstimate": true
    },
    {
     "id": "6.1.4",
     "title": "Adversarial Testing of Machine Learning Systems",
     "lo": "AI-6.1.4",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Summarize adversarial testing of machine learning systems",
     "examinable": true,
     "handsOn": false,
     "body": "Adversarial testing involves deliberately providing the model with perturbations to the input data that are often imperceptible to humans. These inputs are designed to cause the model to make incorrect predictions, and, if successful, are called adversarial examples. Thus, the test inputs for adversarial testing, and thus potential adversarial examples, often consist of slightly modified versions of legitimate inputs that cause the model to misclassify them.\n\nIdentification of vulnerabilities through adversarial testing allows developers to incorporate safeguards and make the model more robust against adversarial examples. These may be accidental adversarial examples it encounters, or they may be adversarial attacks that involve the malicious use of adversarial examples. Generating effective test inputs for adversarial testing is technically complex, and staying up-to-date with evolving attack techniques is an ongoing challenge.\n\nAdversarial testing can be performed using black-box testing, focusing on the model's input and output behavior without requiring knowledge of its internal workings. This can be achieved by creating an equivalent model for which the internals are known, from which adversarial test inputs can be created through knowledge of its internal workings. Then, based on the assumption that equivalent models share classification boundaries (i.e. transferability), the adversarial tests can be applied to the original model. In contrast, a brute force approach using a vast number of tests can be used in the hope that some random tests will coincide with an adversarial example.\n\nAdversarial testing can also be performed using white-box testing. Understanding an ML model's internals (architecture, parameters, training process) typically makes it easier to craft adversarial examples.\n\nAdversarial testing can be done manually by crafting specific adversarial examples or through automated algorithms that generate large numbers of variations to find effective adversarial inputs.",
     "figures": [],
     "questions": [
      {
       "q": "Q33",
       "pts": 1,
       "k": "K2",
       "answer": "c"
      }
     ],
     "srcLines": [
      1236,
      1248
     ],
     "minutes": 20,
     "minutesIsEstimate": true
    },
    {
     "id": "6.1.5",
     "title": "Metamorphic Testing",
     "lo": "AI-6.1.5",
     "ho": null,
     "kLevel": "K3",
     "loStatement": "Use metamorphic testing to derive test cases for a given scenario",
     "examinable": true,
     "handsOn": false,
     "body": "Metamorphic testing (MT) is a test technique in which new (follow-up) test cases are derived from a previously passed source test case. One or more follow-up test cases are generated by changing (metamorphizing) the source test case using a metamorphic relation (MR). The MR is based on a property of a required function of the test object, and it describes how a change in a test case's inputs is reflected in the same test case's expected results.\n\nMT can be used for most test objects and can be applied to both functional and non-functional testing. Testers verify test objectives such as consistency (outputs align across related inputs), monotonicity (outputs change directionally with input), and invariance (outputs remain stable under perturbations). It is particularly useful where the generation of expected results is problematic because an affordable test oracle is unavailable. This is the case with some MLS that use big data, or with systems where testers are unclear about how the ML model derives its predictions, which is often the case. In the area of AI and ML, metamorphic testing has been used for testing image recognition, search engines, route optimization, and voice recognition.\n\nMT is typically selected over traditional oracle-based testing when:\n\n- no reliable expected outputs exist due to model opacity or data scale;\n- the system is a black box; or\n- relational properties (not absolute values) suffice for confidence.\n\nMT is often based on a source test case that passed, and it can also be useful when it is not possible to generate an expected result. For instance, where the program implements a function that is too complex for a human tester to replicate and to use as a test oracle, such as with some complex MLS. In this situation, MT can be used to generate test cases which, when run, will create a set of outputs where the relationships between the outputs (rather than their actual values) are checked for validity. With this form of MT, if the relationships between test outputs hold true, it provides improved confidence in the program. For example, a risk-assessment MLS that predicts an age at death, where increasing the number of cigarettes smoked should decrease the prediction (monotonicity).\n\nTesters derive MRs from domain knowledge, requirements, or domain properties (e.g., laws of physics). MRs can be validated by expert review, running them on reference models and checking coverage of edge cases.\n\nIncorrect MRs (e.g., overlooking complex interactions between variables) or incomplete sets of MRs can lead to false confidence. MT detects relational flaws but not all absolute errors, so it should be used in combination with other test techniques.",
     "figures": [],
     "questions": [
      {
       "q": "Q34",
       "pts": 2,
       "k": "K3",
       "answer": "b"
      }
     ],
     "srcLines": [
      1248,
      1266
     ],
     "minutes": 30,
     "minutesIsEstimate": true
    },
    {
     "id": "6.1.6",
     "title": "Hands-on Exercise: Apply Metamorphic Testing",
     "lo": null,
     "ho": "HO-6.1.6",
     "kLevel": "H2",
     "loStatement": "Apply metamorphic testing",
     "examinable": false,
     "handsOn": true,
     "body": "In this exercise, students will gain practical experience of the following:\n\n- Deriving several MRs for a given MLS. These MRs should include some in which the expected results of the source and follow-up test cases are the same, and some in which they are different.\n- Generating source test cases for the MLS. These do not have to be guaranteed to pass, but students should be reminded of the limitations of MT when source test cases that passed are unavailable.\n- Using the derived MRs and generated source test cases to derive follow-up test cases.\n- Running the follow-up test cases.",
     "figures": [],
     "questions": [],
     "srcLines": [
      1266,
      1275
     ],
     "minutes": 5,
     "minutesIsEstimate": true
    },
    {
     "id": "6.1.7",
     "title": "Drift Testing",
     "lo": "AI-6.1.7",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain how drift testing is used on operational machine learning systems",
     "examinable": true,
     "handsOn": false,
     "body": "Drift testing can be used to identify two forms of drift in operational MLS:\n\n- **Data drift** - occurs when the statistical properties of the operational input data change over time. For instance, input data is now significantly different from the data the model is trained on, due to factors like shifts in user behavior or seasonality. For example, a spam filter encounters new types of phishing attacks that did not exist during its training.\n- **Concept drift** - occurs when the relationship between the input data and the correct output changes over time. This means the model's originally learned patterns or rules no longer reflect the current reality. For instance, due to new financial regulations, a transaction type previously considered 'low-risk' might now be classified as 'high-risk'. The meaning of the data has changed, causing the model's learned decision boundaries to become outdated, leading to a decline in its predictive accuracy.\n\nDynamic drift testing relies on the availability of feedback from the users, which provides the current ground truth. This current ground truth is compared with the model's output, and the difference between the two is determined and compared against a threshold value. User feedback can be direct or indirect. For a film recommendation system, an example of direct feedback is when the user rates a recommendation. An example of indirect feedback for the same system would be extracted from the data on the films the user has watched.\n\nStatic drift testing is not dependent on the current ground truth but instead compares the statistical properties of the input and predicted output data distributions using a test such as Kolmogorov-Smirnov [STATS]. A significant difference in either of these distributions is an indicator that drift has occurred.",
     "figures": [],
     "questions": [
      {
       "q": "Q35",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      1275,
      1286
     ],
     "minutes": 20,
     "minutesIsEstimate": true
    },
    {
     "id": "6.1.8",
     "title": "Testing for Overfitting and Underfitting",
     "lo": "AI-6.1.8",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain how overfitting and underfitting are detected by testing",
     "examinable": true,
     "handsOn": false,
     "body": "Overfitting and underfitting are two of the three possible outcomes encountered in ML models, with the third being a \"right-fitting\" model. Testing for overfitting and underfitting should occur during training, evaluation, and tuning.\n\nOverfitting occurs when a model learns the training data too well, to the extent that it captures noise in the data rather than the underlying pattern. This results in poor generalization of new, unseen data.\n\nTo test for overfitting, the model's ML functional performance is evaluated on a separate test dataset that was not used during training. This test dataset should include some less common examples unlikely to have been used during training. The model might be overfitting if it performs significantly worse on the test dataset than on the validation dataset.\n\nUnderfitting occurs when a model is too simple to capture the underlying structure of the data or when the training data does not contain features that reflect an important relationship between inputs and outputs, resulting in poor ML functional performance on both the training and validation datasets.\n\nDuring testing, underfitting can be detected by evaluating the model's ML functional performance metrics such as accuracy, precision, recall, or F1 score. If these metrics are consistently low on both the training and validation sets, it suggests that the model is underfitting.\n\nVisual inspection of the model's learning curves can also help detect underfitting. If the training and validation errors remain high and relatively close together, without significant improvement as training progresses, it indicates underfitting.\n\nIn summary, detecting overfitting and underfitting during testing involves evaluating the model's ML functional performance on validation data, analyzing ML functional performance metrics, and examining learning curves.",
     "figures": [],
     "questions": [
      {
       "q": "Q36",
       "pts": 1,
       "k": "K2",
       "answer": "c"
      }
     ],
     "srcLines": [
      1286,
      1302
     ],
     "minutes": 20,
     "minutesIsEstimate": true
    },
    {
     "id": "6.1.9",
     "title": "A/B Testing",
     "lo": "AI-6.1.9",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain how A/B testing is used in the context of machine learning systems",
     "examinable": true,
     "handsOn": false,
     "body": "A/B testing is an approach where the response of two variants of the program (A and B) to the same inputs are compared with the purpose of determining which of the two variants is better. It is a statistical testing approach that typically requires comparing test results from multiple test runs to determine differences between the programs.\n\nA simple example of this approach is where two promotional offers are emailed to a marketing list divided into two sets. Half of the list gets offer A, and half gets offer B; the success of each offer helps decide which to use in the future. Many e-commerce and web-based companies use A/B testing in production, diverting different consumers to different functionality, to help identify consumers' preferences.\n\nA/B testing is one approach to addressing the test oracle problem, typically using the existing system as a partial test oracle. A/B testing does not generate test cases and provides no guidance on how the tests should be designed, although operational inputs are often incorporated into the tests.\n\nA/B testing can be used to test updates to an AI-based system, provided there are agreed-upon acceptance criteria, such as ML functional performance metrics, as described in 3.3. Whenever the system is updated, A/B testing is used to determine that the updated variant performs as well as, or better than, the previous variant.\n\nSuch a test approach can be used for a simple classifier but can also be used for testing far more complex systems. For example, an update to improve the effectiveness of a smart city transport routing system can be tested using A/B testing. For instance, by comparing average commute times for two variants of the system on consecutive weeks.\n\nA/B testing can also be used to test self-learning systems. When the system makes a change, automated tests are run, and the resulting system characteristics are compared with those before the change. If the system is improved, the change is accepted; otherwise, the system reverts to its previous state.\n\nThe most popular statistical techniques for A/B testing are the t-test, z-test, chi-squared test, and Mann-Whitney U test [STATS].",
     "figures": [],
     "questions": [
      {
       "q": "Q37",
       "pts": 1,
       "k": "K2",
       "answer": "c"
      }
     ],
     "srcLines": [
      1302,
      1318
     ],
     "minutes": 25,
     "minutesIsEstimate": true
    },
    {
     "id": "6.1.10",
     "title": "Back-to-Back Testing",
     "lo": "AI-6.1.10",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain how back-to-back testing is used in the context of machine learning systems",
     "examinable": true,
     "handsOn": false,
     "body": "Back-to-back testing offers a practical solution to the test oracle problem.\n\nBack-to-back testing involves using an alternative version of the system as a reference point (a pseudo-oracle) and comparing its outputs with those of the system being tested when presented with the same inputs. This pseudo-oracle could be an existing system, or one developed specifically for testing, but this comes at a cost.\n\nIdeally, the pseudo-oracle and the system under test should not share common software components. Otherwise, both systems might contain the same defect, causing their outputs to match even when both are wrong. This can be particularly problematic given the widespread use of reusable, open-source AI components in MLS development. For this reason, the pseudo-oracle is often developed by a different and ideally independent team, perhaps using different ML development frameworks, algorithms, or model settings. Sometimes, conventional software can serve as a pseudo-oracle if it solves the same problem.\n\nWhen performing functional back-to-back testing, the pseudo-oracle only needs to match functional behavior. It does not need to meet the same non-functional requirements as the system being tested, potentially making it less expensive to build.\n\nThis test approach requires only generating test inputs, not expected results, since the pseudo-oracle provides the comparison point. These inputs can come from existing test cases, such as regression test suites, or can be automatically generated from training data, allowing for a large number of tests to be run if automated test execution is supported.\n\nBack-to-back testing provides significant value when migrating an MLS to a new environment, such as moving from development to production, and when comparing test results across environments. Additionally, this test approach can reveal subtle defects in model behavior that might not be apparent through other test approaches, especially when comparing responses across a wide range of edge cases or unusual inputs.\n\nOne significant difference between A/B testing (see 6.1.9) and back-to-back testing is the use of A/B testing to compare two variants of the same MLS using ML functional performance metrics and statistical techniques, versus the use of back-to-back testing to detect defects.",
     "figures": [],
     "questions": [
      {
       "q": "Q38",
       "pts": 1,
       "k": "K2",
       "answer": "d"
      }
     ],
     "srcLines": [
      1318,
      1334
     ],
     "minutes": 25,
     "minutesIsEstimate": true
    }
   ]
  }
 ],
 "cheatsheet": {
  "chapter": 6,
  "blocks": [
   {
    "type": "meta",
    "minutes": 225,
    "questionCount": 9,
    "points": 10
   },
   {
    "type": "keyTerms",
    "items": [
     {
      "term": "adversarial example / attack",
      "def": "Example: slightly modified versions of legitimate inputs (perturbations often imperceptible to humans) that cause the model to misclassify. Attack: the deliberate use of adversarial examples to cause an ML model to fail.",
      "src": "6.1.4 L1238 + glossary"
     },
     {
      "term": "metamorphic testing (MT) / relation (MR)",
      "def": "MT: new (follow-up) test cases are derived from a previously passed source test case by changing it using a metamorphic relation. MR: based on a property of a required function, describes how a change in a test case's inputs is reflected in its expected results.",
      "src": "6.1.5 L1250"
     },
     {
      "term": "data drift",
      "def": "A change in the distribution of input data over time, which can negatively impact the functional performance of an operational ML model (e.g., spam filter meets new phishing attack types).",
      "src": "glossary + 6.1.7 L1279"
     },
     {
      "term": "concept drift",
      "def": "A change in the perceived functional performance of an ML model over time caused by changes in user expectations, behavior and the operational environment — the relationship between input and correct output changes (e.g., new regulations reclassify a transaction from low- to high-risk).",
      "src": "glossary + 6.1.7 L1280"
     },
     {
      "term": "overfitting",
      "def": "The generation of an ML model that corresponds too closely to the training dataset, resulting in a model that finds it difficult to generalize to new data. Detected: performs significantly worse on the separate test dataset than on validation.",
      "src": "glossary + 6.1.8 L1290-L1292"
     },
     {
      "term": "underfitting",
      "def": "The generation of an ML model that does not reflect the underlying trend of the training dataset, resulting in a model that makes inaccurate predictions. Detected: metrics consistently low on BOTH training and validation sets; learning-curve errors remain high and close together.",
      "src": "glossary + 6.1.8 L1294-L1298"
     },
     {
      "term": "A/B testing",
      "def": "An approach where the response of two variants of the program (A and B) to the same inputs are compared to determine which variant is better; a statistical approach typically requiring multiple test runs.",
      "src": "6.1.9 L1304"
     },
     {
      "term": "back-to-back testing",
      "def": "Uses an alternative version of the system as a reference point (a pseudo-oracle) and compares its outputs with the system being tested on the same inputs; only test inputs are needed, not expected results.",
      "src": "6.1.10 L1326-L1330"
     }
    ]
   },
   {
    "type": "mustKnow",
    "title": "Documentation, statistics, adversarial, metamorphic, drift, fitting",
    "items": [
     {
      "text": "Model documentation matters because machine-generated code has limited understandability and models are black-box, data-dependent, frequently updated — documentation is the main tool for developers, testers, regulators (EU AI Act transparency obligations; documentation audit often a deployment prerequisite for high-risk systems). Frameworks: Model Cards (intended uses, evaluation results, ethical considerations), Datasheets for Datasets (motivation, composition, collection, uses). Documentation checklists cover General / Design / Usage / Datasets / Testing / Functional / Non-Functional / Operational; review aims: find missing info, inaccuracies, inconsistencies; improve clarity and maintainability; inform test & deployment; verify regulatory compliance.",
      "src": "6.1.2 L1192-L1215"
     },
     {
      "text": "Statistical ML functional performance testing: precondition = statistical acceptance criteria, e.g. \"98% accuracy with MoE ±4% at 95% CL\" (601 test cases; ≥589 pass; sequential testing can stop early ~170 cases if accuracy stays ≥98%; safety-critical example: 99% reliability at 95% confidence → 299 cases all passing). Fix CL → MoE shrinks with more tests; fix MoE → CL grows. Requires a large test dataset completely independent of training/validation and representative of the operational input domain; results reported as e.g. \"accuracy of 94% ±4% at the 95% CL\", not a passed/failed ratio. (Formulae not examinable — illustration only.)",
      "src": "6.1.3 L1223-L1234"
     },
     {
      "text": "Adversarial testing: craft perturbed inputs to force misclassification (adversarial examples); enables safeguards. Black-box route: build an equivalent model with known internals, craft inputs there, rely on transferability (equivalent models share classification boundaries) — or brute force random tests. White-box: knowing internals (architecture, parameters, training process) makes crafting easier. Manual crafting or automated generation of large numbers of variations.",
      "src": "6.1.4 L1238-L1246"
     },
     {
      "text": "Metamorphic testing: verify objectives like consistency, monotonicity, invariance — relationships between outputs instead of absolute values; chosen when no reliable expected outputs exist, system is a black box, or relational properties suffice. MRs come from domain knowledge, requirements, or domain properties (e.g., laws of physics); validate by expert review, reference models, edge-case coverage. Limits: wrong/incomplete MRs → false confidence; MT detects relational flaws, not all absolute errors — combine with other techniques. Example: age-at-death prediction should decrease as cigarettes smoked increase (monotonicity).",
      "src": "6.1.5 L1250-L1264"
     },
     {
      "text": "Drift testing: dynamic = needs user feedback as current ground truth (direct: user rates a recommendation; indirect: data on films actually watched), compare ground truth vs model output against a threshold; static = no ground truth needed, compares statistical properties of input and predicted-output distributions (e.g., Kolmogorov-Smirnov) — significant difference signals drift.",
      "src": "6.1.7 L1282-L1284"
     },
     {
      "text": "Overfitting vs underfitting detection (during training, evaluation, tuning): overfitting = good training/validation performance but significantly worse on separate test data including less common examples; underfitting = poor metrics on BOTH training and validation; learning curves: high, close-together, non-improving errors indicate underfitting. Summary: evaluate on validation data, analyze performance metrics, examine learning curves.",
      "src": "6.1.8 L1288-L1300"
     },
     {
      "text": "A/B testing for MLS: compare two variants on the same inputs to decide which is better (existing system as partial oracle; generates no test cases; operational inputs often incorporated); used for updates with agreed acceptance criteria (updated variant must perform ≥ previous), self-learning systems (accept change or revert). Popular statistical techniques: t-test, z-test, chi-squared, Mann-Whitney U.",
      "src": "6.1.9 L1304-L1317"
     },
     {
      "text": "Back-to-back testing: pseudo-oracle ideally shares no common software components with the SUT (same defect in both → matching wrong outputs; risky with reusable open-source AI components), ideally built by an independent team with different frameworks/algorithms/settings; conventional software can serve if it solves the same problem; pseudo-oracle needs to match only functional behavior (cheaper). Value: environment migration (dev→prod), comparing results across environments, subtle defects on edge cases. A/B compares variants of the SAME system using performance metrics; back-to-back detects defects.",
      "src": "6.1.10 L1326-L1332"
     }
    ]
   },
   {
    "type": "table",
    "title": "ML model risks → mitigations (abbreviated)",
    "columns": [
     "Potential risk",
     "Mitigation"
    ],
    "rows": [
     [
      "Biased or unfair ML model",
      "Testing for bias (5.1.2)"
     ],
     [
      "Adversarial examples",
      "Adversarial testing (6.1.4)"
     ],
     [
      "Overfitted / underfitted model",
      "Testing for over/underfitting (6.1.8)"
     ],
     [
      "Unacceptable data drift or concept drift",
      "Drift testing (6.1.7)"
     ],
     [
      "Failure to achieve required performance measures (accuracy, recall)",
      "ML functional performance testing (6.1.3)"
     ],
     [
      "Functional incorrectness; non-functional defects",
      "Metamorphic testing (6.1.5)"
     ],
     [
      "Test oracle problem",
      "Metamorphic testing; Back-to-back testing; A/B testing"
     ],
     [
      "Poor system requirements",
      "Requirements review; Red teaming; Exploratory testing"
     ],
     [
      "Lack of AI robustness to unexpected inputs",
      "Adversarial testing; Fuzz testing"
     ],
     [
      "Poor model documentation",
      "Model documentation review (6.1.2)"
     ],
     [
      "Model updates introduce defects / decrease performance",
      "Back-to-back testing / A/B testing"
     ],
     [
      "Updated model deployment causes immediate failure / regression",
      "Smoke testing / Regression testing"
     ],
     [
      "Security, safety, privacy violations; harmful outputs",
      "Red teaming (4.2.2)"
     ]
    ],
    "src": "6.1.1 L1166-L1188"
   },
   {
    "type": "traps",
    "items": [
     {
      "confusion": "A/B vs back-to-back vs metamorphic",
      "text": "A/B: two variants of the SAME system, statistical performance comparison, decides which is better. Back-to-back: alternative system version as pseudo-oracle, same inputs, detects defects; needs no expected results. Metamorphic: follow-up cases from a source case via an MR; checks relationships between outputs. All three address the test oracle problem.",
      "src": "6.1.5 L1250 + 6.1.9 L1304-L1308 + 6.1.10 L1326-L1332"
     },
     {
      "confusion": "Data drift vs concept drift",
      "text": "Data drift = input distribution changes (user behavior shifts, seasonality, new phishing patterns). Concept drift = the input→output relationship changes (meaning of data changes; decision boundaries outdated, e.g., regulation reclassifies transactions).",
      "src": "6.1.7 L1279-L1280"
     },
     {
      "confusion": "Dynamic vs static drift testing",
      "text": "Dynamic needs user feedback as current ground truth (direct ratings or indirect behavior), compared to model output against a threshold. Static needs no ground truth — compares statistical properties of input and predicted-output distributions (Kolmogorov-Smirnov).",
      "src": "6.1.7 L1282-L1284"
     },
     {
      "confusion": "Overfitting vs underfitting signatures",
      "text": "Overfit: training/validation good, test set significantly worse. Underfit: poor on BOTH training and validation; learning curves high and close together without improvement. Third outcome: right-fitting.",
      "src": "6.1.8 L1290-L1298"
     },
     {
      "confusion": "Fixing CL vs fixing MoE",
      "text": "As test count grows: fix the confidence level → margin of error decreases (more precise); fix the MoE → confidence level increases (more certain).",
      "src": "6.1.3 L1225-L1226"
     },
     {
      "confusion": "Transferability in adversarial testing",
      "text": "Black-box adversarial testing crafts inputs on an equivalent model with known internals and applies them to the original model on the assumption that equivalent models share classification boundaries — that assumption is transferability.",
      "src": "6.1.4 L1242"
     }
    ]
   },
   {
    "type": "examPointers",
    "items": [
     {
      "lo": "AI-6.1.1",
      "kLevel": "K2",
      "loText": "Give examples of test approaches used for risk mitigation of ML models",
      "questions": [
       {
        "q": "Q30",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-6.1.2",
      "kLevel": "K2",
      "loText": "Explain the purpose and focus of reviewing ML model documentation",
      "questions": [
       {
        "q": "Q31",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-6.1.3",
      "kLevel": "K2",
      "loText": "Explain how ML functional performance testing is carried out for probabilistic machine learning systems",
      "questions": [
       {
        "q": "Q32",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-6.1.4",
      "kLevel": "K2",
      "loText": "Summarize adversarial testing of machine learning systems",
      "questions": [
       {
        "q": "Q33",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-6.1.5",
      "kLevel": "K3",
      "loText": "Use metamorphic testing to derive test cases for a given scenario",
      "questions": [
       {
        "q": "Q34",
        "pts": 2
       }
      ]
     },
     {
      "lo": "AI-6.1.7",
      "kLevel": "K2",
      "loText": "Explain how drift testing is used on operational machine learning systems",
      "questions": [
       {
        "q": "Q35",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-6.1.8",
      "kLevel": "K2",
      "loText": "Explain how overfitting and underfitting are detected by testing",
      "questions": [
       {
        "q": "Q36",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-6.1.9",
      "kLevel": "K2",
      "loText": "Explain how A/B testing is used in the context of machine learning systems",
      "questions": [
       {
        "q": "Q37",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-6.1.10",
      "kLevel": "K2",
      "loText": "Explain how back-to-back testing is used in the context of machine learning systems",
      "questions": [
       {
        "q": "Q38",
        "pts": 1
       }
      ]
     }
    ]
   }
  ]
 }
};
