window.CTAI_DATA = window.CTAI_DATA || {};
window.CTAI_DATA.chapters = window.CTAI_DATA.chapters || {};
window.CTAI_DATA.chapters[4] = {
 "n": 4,
 "title": "Testing AI-Based Systems",
 "minutes": 195,
 "keywords": {
  "general": [
   "Attack",
   "exploratory testing",
   "risk-based testing",
   "test oracle"
  ],
  "aiSpecific": [
   "Adaptive AI-based system",
   "AI-based system",
   "generative AI",
   "large language model",
   "locked AI-based system"
  ]
 },
 "sections": [
  {
   "id": "4.1",
   "title": "Introduction to Testing AI-Based Systems",
   "intro": [
    "Testing AI-based systems presents unique challenges compared to testing conventional software. Firstly, AI-based systems can be broadly categorized as locked or adaptive. Locked AI-based systems, with fixed behavior post-deployment, are easier to test due to their mostly deterministic nature, while adaptive systems, which evolve and learn, introduce complexity as their behavior can change unpredictably. Additionally, the probabilistic nature of many AI models often necessitates statistical testing, as deterministic methods may be insufficient for evaluating outputs influenced by data and probabilities. This requires assessment of performance distributions and confidence levels across diverse scenarios.",
    "A central challenge in testing, known as the 'test oracle problem', arises when determining whether the output produced by the system under test is correct for a given input. In traditional software, well-defined specifications make it relatively straightforward to specify expected results and verify correctness. However, with AI-based systems, especially those tackling complex or subjective tasks, clearly defining expected results can be difficult or even impossible. This uncertainty is compounded for tasks that exceed human capabilities, involve fuzziness, or lack objective 'ground truth', making it hard to implement automated test oracles and sometimes requiring expert judgment or statistical reasoning.",
    "Vague or incomplete system requirements further exacerbate the test oracle problem in AI testing. Solutions may include using statistical evaluations, consulting domain experts, or defining a 'ground truth' against which to assess outputs. These approaches aim to establish reliable expectations and effectively evaluate AI-based systems."
   ],
   "subsections": [
    {
     "id": "4.1.1",
     "title": "Locked and Adaptive AI-Based Systems",
     "lo": "AI-4.1.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Compare the testability of locked and adaptive AI-based systems",
     "examinable": true,
     "handsOn": false,
     "body": "Many AI-based systems in use today are locked AI-based systems, which do not change their behavior once they are deployed. An example of a locked AI-based system is a deployed ML model based on a DNN, where the DNN's weights and biases are fixed after development and can only be modified if the DNN is retrained. Safety-related self-driving car technology often relies on locked AI-based systems for specific tasks, such as lane detection or traffic sign recognition.\n\nIn contrast, an adaptive AI-based system, such as a reinforcement learning system, can adapt its behavior once it is deployed. The changes might be based on a reward function or to adapt to a new operational environment, but the specific details of such changes cannot be predicted in advance. For example, an e-commerce platform could use adaptive AI to recommend products to users based on their past behavior and evolving preferences.\n\nMany GenAI systems, such as LLM-based chatbots, are deployed as locked models at runtime but are updated periodically, placing them between fully locked and fully adaptive systems.\n\nIn practice, AI-based systems span a continuum from fully deterministic, locked-down systems that produce the same output for a given input, to deliberately non-deterministic, self-learning systems that adapt and evolve their behavior.\n\nLocked AI-based systems are far easier to test than adaptive AI-based systems, as they are largely deterministic and thus the expected results do not change. An updated, locked AI-based system is typically considered a new system, and a fresh round of testing is required. Note, however, that while locked AI-based systems are generally considered deterministic, in practice, large neural networks can exhibit non-deterministic behavior due to factors such as floating-point precision limits and variations in hardware execution, particularly when using parallel computation or GPUs.\n\nAn adaptive AI-based system can be rigorously tested before deployment (e.g., by simulating changes in environmental conditions, testing the learning mechanism itself, or testing its ability to adapt appropriately in controlled scenarios). However, this testing is more complex than for a locked AI-based system, as an adaptive system may change its behavior during the testing or as a result of the testing.\n\nAs new behaviors for an adaptive AI-based system cannot always be predicted, such unpredictable behaviors cannot be tested in advance, nor can test cases be prepared for them. An automated test suite, focused on the system's core functionality, can be built and executed whenever the system undergoes significant changes to verify that adaptations are safe.\n\nTesting can also be used to check that the system's performance has not degraded beyond a certain threshold. This testing may be in response to significant system changes or as a part of ongoing monitoring.",
     "figures": [],
     "questions": [
      {
       "q": "Q17",
       "pts": 1,
       "k": "K2",
       "answer": "a"
      }
     ],
     "srcLines": [
      852,
      870
     ],
     "minutes": 35,
     "minutesIsEstimate": true
    },
    {
     "id": "4.1.2",
     "title": "Rationale for a Statistical Approach to Testing AI-Based Systems",
     "lo": "AI-4.1.2",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain why a statistical approach is often needed when testing AI-based systems",
     "examinable": true,
     "handsOn": false,
     "body": "Testing AI-based systems presents unique challenges due to their data-driven and probabilistic nature. The reasons a statistical approach to testing is needed for testing AI-based systems include:\n\n- **Non-Determinism** - AI-based systems are fundamentally probabilistic and therefore often exhibit non-deterministic behavior, meaning the same inputs may not always yield the same output. This can be due to stochastic elements in their architecture or to their implementation of probabilistic mappings learned from training data. Consequently, a single test, such as an instance where a model incorrectly classifies a cat as a dog, cannot accurately reflect the model's overall AI functional correctness. To confirm that test results reliably overcome this uncertainty, the test suite must be sufficiently large to provide statistically significant results.\n- **Distributional Performance Evaluation** - AI models are trained on specific data distributions that do not exactly match their operational environment. To assess how a model will perform under real-world conditions, a statistically significant sample of scenarios from relevant operational data distributions must be tested. This confirms that the testing captures the operational variability in data and subsequent model behaviors.\n- **Handling Uncertainty and Bias** - AI-based systems are susceptible to data biases and can produce confident but incorrect predictions. Statistical testing allows practitioners to quantify and analyze model accuracy, fairness, and AI robustness through performance metrics such as confidence intervals, hypothesis testing, and error analysis.\n- **Regulatory and Safety Context** - In regulated industries (e.g., healthcare, transport), demonstrating that an AI-based system meets safety or fairness thresholds with high confidence is often required. Statistical methods support claims about a model's reliability across a broad range of scenarios, rather than just for specific examples.\n\nA statistical approach to the testing of probabilistic MLS is provided in 6.1.3.",
     "figures": [],
     "questions": [
      {
       "q": "Q18",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      870,
      881
     ],
     "minutes": 20,
     "minutesIsEstimate": true
    },
    {
     "id": "4.1.3",
     "title": "Test Oracles for AI-Based Systems",
     "lo": "AI-4.1.3",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain the challenges and solutions relating to test oracles for AI-based systems",
     "examinable": true,
     "handsOn": false,
     "body": "Testing AI-based systems can be challenging, particularly when determining expected results (the test oracle problem). These difficulties arise from various factors inherent to AI:\n\n- **Probabilistic & Non-deterministic Nature:** AI outputs can vary even with identical inputs. While many systems (e.g., in supervised learning) have a single correct target value, the model's outputs are probabilistic and defining a strict passed/failed oracle often requires setting thresholds or tolerance ranges.\n- **Exploratory Development & Incomplete Specifications:** AI development is frequently exploratory. System requirements may evolve, be incomplete, or simply missing, lacking the detailed specifications needed to generate precise expected results.\n- **Complexity of Tasks:** AI-based systems often tackle tasks that are too complex for straightforward human verification, making manual checks of expected outputs impractical.\n- **Subjectivity of Behavior:** The correctness of an AI-based system's behavior can be subjective. For instance, user expectations for virtual assistants can vary widely, complicating the establishment of universally agreed-upon expected results.\n- **Self-Learning Systems:** These AI-based systems continuously update their internal models based on new data encountered post-deployment. This causes the AI-based system's 'correct' behavior to change over time so that system responses remain effective and appropriate even as the definition of 'correct' evolves over time. As a result, an initial set of expected results can quickly become invalid.\n\nThe test oracle problem with AI-based systems can be addressed in various ways:\n\n- **Defining Output Boundaries:** Testers can use agreed acceptable ranges, distributions, specified limits, and tolerances, such as an autonomous car stopping within a maximum distance.\n- **Defining Environmental Boundaries:** Testers must specify values for test environment conditions (e.g., lighting levels, temperature, network latency) to ensure outputs are predictable and repeatable.\n- **Expert Consultation:** Domain experts can help define expected results, though their opinions might differ or be fallible.\n- **Specialized Testing:** A/B testing, back-to-back testing, and metamorphic testing, among others, can assess AI-based systems by comparing behaviors or verifying properties, often without requiring explicit expected outputs for every case.\n- **Proxy Oracles:** Use secondary systems or models (including other AI systems) to assess or validate outputs when direct expected results are unavailable, such as training a proxy model on labeled data to predict for unlabeled tests.",
     "figures": [],
     "questions": [
      {
       "q": "Q19",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      881,
      899
     ],
     "minutes": 25,
     "minutesIsEstimate": true
    }
   ]
  },
  {
   "id": "4.2",
   "title": "Testing Generative AI and Large Language Models",
   "intro": [
    "This section outlines practical methods for validating GenAI systems, covering black-box evaluation, red teaming, and hands-on techniques. It highlights challenges from diverse inputs, tunable parameters, and context windows, and addresses both functional and non-functional quality measures using benchmarks and targeted exercises. See CT-GenAI syllabus [CT-GenAI] for more details on using GenAI systems for testing."
   ],
   "subsections": [
    {
     "id": "4.2.1",
     "title": "Testing Generative AI",
     "lo": "AI-4.2.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain how generative AI can be tested",
     "examinable": true,
     "handsOn": false,
     "body": "Testing GenAI involves evaluating the correctness, coherence, and creativity of its outputs, including the originality and novelty of results generated, and verifying that specified requirements, both functional and non-functional, are met. Since GenAI systems can produce text, images, video, and audio, test strategies must be adapted to assess quality characteristics of such content.\n\nA common approach is black-box testing, where testers feed various inputs (prompts, images, partial data) into the system and assess the test results (see red teaming, 4.2.2). Factors such as clarity, originality, and adherence to domain-specific rules are considered. This approach, whether manual or automated, is particularly useful for end-user applications, such as chatbots or design tools, where user satisfaction depends on the usefulness and plausibility of the generated content.\n\nA significant challenge in testing a GenAI model is the 'input explosion problem', in which inputs can be highly diverse and complex to control. For instance, there are optional system prompts and a user prompt, which can include enormous amounts of disparate data, and GenAI can also be accessed via an API. There are also multiple parameters to consider, such as temperature and maximum tokens, which will also affect the output. Additionally, the context window, which retains previous parts of a conversation, also affects the generated output.\n\nIn many situations, assessing the output may involve manual review; however, determining whether a test has passed or failed depends on qualitative evaluation criteria defined in the requirements. Alternatively, a second GenAI system can often be used to automatically determine the test result. For instance, the correctness of an image generated by a GenAI system can be checked by an image recognition system. Such approaches should be used carefully, as they may reproduce similar biases or errors.\n\nNon-functional testing can be as necessary as functional testing for GenAI systems. This includes evaluating resource utilization during both inference and training to verify efficient operation and cost-effectiveness. Measures include CPU and GPU usage, memory consumption, network bandwidth, and response times.\n\nBenchmark suites provide standardized evaluation frameworks for assessing the capabilities of GenAI. These curated datasets and associated tasks enable consistent comparison across different models, measuring various aspects, from language understanding to reasoning and coding abilities. By measuring GenAI against these benchmarks, areas for improvement can be identified in a systematic, reproducible manner.",
     "figures": [],
     "questions": [
      {
       "q": "Q20",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      903,
      917
     ],
     "minutes": 25,
     "minutesIsEstimate": true
    },
    {
     "id": "4.2.2",
     "title": "Red Teaming",
     "lo": "AI-4.2.2",
     "ho": null,
     "kLevel": "K3",
     "loStatement": "Implement red teaming for GenAI systems",
     "examinable": true,
     "handsOn": false,
     "body": "Red Teaming (RT) is a systematic, often black-box form of fault attack that probes an AI-based system to identify harmful capabilities, particularly in its outputs. Drawing inspiration from historical practices like military wargaming and NASA's tiger teams, AI RT involves 'attacking' an AI-based system, with the goal of deliberately causing the system to produce harmful or undesirable results, such as privacy violations, the expression of racist views or providing guidance on performing chemical, biological, radiological, or nuclear (CBRN) attacks. Once such capabilities are identified, they are used to update and strengthen the system, making it less prone to such outputs in the future. While RT can be applied to any AI-based system, it is especially critical for GenAI due to the vast range of possible inputs and outputs, which create an extensive 'attack space'. RT typically covers the complete end-to-end AI-based system, but can be applied to only the AI model.\n\nMany organizations focus RT on security and safety vulnerabilities; however, it can also be used to detect harmful capabilities in other areas, such as reliability, privacy, fairness, bias and the generation of misinformation. RT is increasingly becoming a regulatory expectation for some types of AI-based systems, as seen in frameworks such as the EU AI Act [EU AI Act]. As an adaptive, dynamic evaluation approach in which prompts can immediately be updated in response to outputs, RT complements static approaches like benchmarking by testing systems under extreme and unexpected conditions.\n\nWhen RT is used for security evaluations, the system is tested to identify vulnerabilities to external attacks, including both non-AI and AI-specific security factors, such as indirect prompt injection attacks and the hiding of malicious content in documents used by RAG. While security RT tends to focus on malicious inputs, for safety and other evaluations, the aim is often to identify how the system might create harmful outputs under ordinary use, such as generating unsafe medical advice, without any adversarial intent from the user.\n\nRT is most effective when conducted before a system is deployed, but after initial internal quality assessments are complete. The core activity is often interactive prompting, where red teamers engage in multi-turn dialogues (e.g., 15-20 turns) to elicit defective or policy-violating behaviors. The approach typically involves:\n\n1. Assembling a diverse team of testers to cover a wide range of perspectives and attack vectors.\n2. Providing access to the AI-based system in a safe test environment.\n3. Prompting the system to identify vulnerabilities, through open-ended exploration or using checklists.\n4. Analyzing the identified failures to understand threats.\n5. Creating datasets from these threats to support mitigations and system improvements.\n\nTo achieve comprehensive coverage by RT, organizations employ several strategies beyond small expert teams. These include manual approaches like crowd-sourced prompt generation, and automated approaches, such as where an LLM is used to generate numerous attack prompts, and the outputs are then checked by another LLM. Hybrid approaches combine the creativity of human testers with the scalability of automation.\n\nRT, which is proactive and pre-deployment focused, complements Blue Teaming, which involves ongoing, real-time defensive monitoring and filtering of inputs to an operational AI-based system to protect it against attacks. Insights from RT can be used to enhance the monitoring and filters used in Blue Teaming.",
     "figures": [],
     "questions": [
      {
       "q": "Q21",
       "pts": 2,
       "k": "K3",
       "answer": "d"
      }
     ],
     "srcLines": [
      917,
      937
     ],
     "minutes": 40,
     "minutesIsEstimate": true
    },
    {
     "id": "4.2.3",
     "title": "Hands-on Exercise: Exploratory Testing of a Large Language Model",
     "lo": null,
     "ho": "HO-4.2.3",
     "kLevel": "H2",
     "loStatement": "Apply exploratory testing to an LLM performing boundary value analysis",
     "examinable": false,
     "handsOn": true,
     "body": "Students will perform exploratory testing of an LLM. Students will be provided with an exploratory testing session sheet focused on testing the LLM's ability to generate test cases using 2-value and 3-value boundary value analysis. As part of the session debrief, they will verify the correctness and completeness of the output.",
     "figures": [],
     "questions": [],
     "srcLines": [
      937,
      941
     ],
     "minutes": 5,
     "minutesIsEstimate": true
    }
   ]
  },
  {
   "id": "4.3",
   "title": "Test Levels and Machine Learning Systems",
   "intro": [
    "MLS require specialized test levels to address unique ML risks. These are input data testing and ML model testing. Additionally, conventional test levels are still relevant, including component, component integration, system, and acceptance testing."
   ],
   "subsections": [
    {
     "id": "4.3.1",
     "title": "Test Levels for Machine Learning Systems",
     "lo": "AI-4.3.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Summarize the test levels used to develop machine learning systems",
     "examinable": true,
     "handsOn": false,
     "body": "The non-AI components of an MLS can be tested using conventional test levels. In addition, ML models and MLS require further testing to address the specific risks associated with ML.\n\nTwo specialized test levels are used to address ML-specific risks:\n\n- **Input data testing (see Chapter 5):** Concerned with the training data used for training an ML model and the production data used by an MLS to generate a prediction in the operational environment.\n- **ML Model testing (see Chapter 6):** Concerned with the testing of the ML models, which are the ultimate output of the ML workflow (see 3.1.2).\n\nThe risks associated with ML cannot all be addressed using these two ML-specific test levels. The following test levels are also typically required, depending on the perceived risks:\n\n- **Component Testing:** Applicable to any non-AI components, such as user interface, data pipeline and communication components.\n- **Component Integration Testing:** Includes testing that the inputs from the data pipeline are received as expected by the model and that any predictions generated by the model are exchanged with the relevant system components (e.g., the user interface) and used correctly. Where AI is provided as a service (see 1.1.6), API testing of the provided service is performed as part of component integration testing.\n- **System Testing:** Includes confirmation testing that the ML functional performance from the initial model testing is not adversely affected when the model is embedded within a complete system. This testing is especially important when the ML model has been deliberately changed (e.g., by compressing a DNN to reduce its size). Non-functional testing is also covered, for example, testing the performance efficiency of the time required to deliver a prediction from a complete AI-based system.\n- **System Integration Testing:** Focuses on verifying the interfaces and data exchanges between the AI-based system and external systems or services, using an environment representative of operational conditions.\n- **Acceptance Testing:** Where AI is used as a service, acceptance testing may be needed to determine the suitability of the service for the intended system and whether, for example, ML functional performance criteria have been achieved.",
     "figures": [],
     "questions": [
      {
       "q": "Q22",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      945,
      962
     ],
     "minutes": 25,
     "minutesIsEstimate": true
    },
    {
     "id": "4.3.2",
     "title": "Risk-Based Testing of Machine Learning Systems",
     "lo": "AI-4.3.2",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain how risk-based testing is applied to machine learning systems",
     "examinable": true,
     "handsOn": false,
     "body": "Risk-based testing should be applied to all systems, regardless of whether they contain AI components or not. Most regulatory frameworks, whether published or in development, require a risk-based approach to the development and management of AI-based systems. As AI-based systems pose unique risks, testing them differs from that of non-AI-based systems.\n\nThere is no standard way to categorize ML risks; however, ML-specific risks are associated with both the development of the MLS (project risks) and with the MLS itself (product risks). One way of categorizing these risks is to use the ML workflow and divide it into three main areas:\n\n- **Development** - concerned with the ML algorithm, the development of the model, and the ML development framework. Example project risks include sub-optimal algorithm selection, poor selection of evaluation approach, and framework security vulnerabilities. See Chapter 7 for more details.\n- **Input data** - concerned with providing training data to support ML and the provision of production data used by the model in its operational environment. Examples of product risks include biased training data, data-pipeline defects, and unrepresentative training data. See Chapter 5 for more details.\n- **Model** - concerned with the generated ML model. Example product risks include failure to achieve required ML functional performance measures, an overfitted model, and susceptibility to adversarial examples. See Chapter 6 for more details.\n\nAnother way of categorizing risks associated with AI is according to the quality characteristics defined in ISO/IEC 25059.\n\nSeveral forms of testing are available that address these risks and are specifically designed for the testing of MLS. For instance, data pipeline testing, adversarial testing, and review of algorithm/model suitability. This syllabus covers several of these in chapters 5, 6, and 7.",
     "figures": [],
     "questions": [
      {
       "q": "Q23",
       "pts": 1,
       "k": "K2",
       "answer": "a"
      }
     ],
     "srcLines": [
      962,
      976
     ],
     "minutes": 20,
     "minutesIsEstimate": true
    }
   ]
  }
 ],
 "cheatsheet": {
  "chapter": 4,
  "blocks": [
   {
    "type": "meta",
    "minutes": 195,
    "questionCount": 7,
    "points": 8
   },
   {
    "type": "keyTerms",
    "items": [
     {
      "term": "locked AI-based system",
      "def": "A deterministic AI-based system with a fixed unchanging model which does not change its behavior once it is deployed. E.g., a deployed DNN-based model whose weights and biases are fixed after development (self-driving car lane detection / traffic sign recognition).",
      "src": "glossary + 4.1.1 L854"
     },
     {
      "term": "adaptive AI-based system",
      "def": "An AI-based system that adjusts its behavior in response to changes in its operational environment. E.g., reinforcement learning adapting via a reward function; e-commerce recommendations based on evolving preferences.",
      "src": "glossary + 4.1.1 L856"
     },
     {
      "term": "test oracle problem",
      "def": "The challenge of determining whether a test has passed or failed for a given set of test inputs and state.",
      "src": "glossary"
     },
     {
      "term": "ground truth",
      "def": "The information provided by direct observation and measurement that is known to be real or true.",
      "src": "glossary"
     },
     {
      "term": "Red Teaming (RT)",
      "def": "A systematic, often black-box form of fault attack that probes an AI-based system to identify harmful capabilities, particularly in its outputs — deliberately causing harmful or undesirable results (privacy violations, racist views, CBRN guidance), then using the findings to strengthen the system.",
      "src": "4.2.2 L919"
     },
     {
      "term": "Blue Teaming",
      "def": "Ongoing, real-time defensive monitoring and filtering of inputs to an operational AI-based system to protect it against attacks; complements proactive, pre-deployment Red Teaming.",
      "src": "4.2.2 L935"
     },
     {
      "term": "input explosion problem",
      "def": "The challenge of testing a GenAI model whose inputs are highly diverse and hard to control: optional system prompts plus user prompts with enormous disparate data, API access, parameters (temperature, maximum tokens), and the context window — all affecting the output.",
      "src": "4.2.1 L909"
     }
    ]
   },
   {
    "type": "mustKnow",
    "title": "Locked vs adaptive, statistics, oracles, GenAI, test levels",
    "items": [
     {
      "text": "Locked systems are far easier to test (largely deterministic, expected results don't change); an updated locked system is a NEW system needing fresh testing. Adaptive systems may change behavior during or because of testing; unpredictable behaviors can't be tested in advance — use automated suites re-run after significant changes plus threshold-based performance checks. Many GenAI/LLM systems sit between: locked at runtime, updated periodically. Even locked systems can show non-determinism (floating-point precision, hardware/parallel-GPU variation).",
      "src": "4.1.1 L858-L868"
     },
     {
      "text": "Why statistical testing — four reasons: Non-Determinism (single tests can't reflect overall correctness — suite must be large enough for statistical significance); Distributional Performance Evaluation (test a statistically significant sample from operational data distributions); Handling Uncertainty and Bias (quantify accuracy/fairness/robustness via confidence intervals, hypothesis testing, error analysis); Regulatory and Safety Context (demonstrate thresholds met with high confidence).",
      "src": "4.1.2 L874-L877"
     },
     {
      "text": "Test oracle problem causes: probabilistic/non-deterministic outputs (need thresholds/tolerance ranges); exploratory development with incomplete/missing specifications; task complexity beyond straightforward human verification; subjectivity of behavior (e.g., virtual assistant expectations vary); self-learning systems ('correct' evolves, initial expected results become invalid).",
      "src": "4.1.3 L885-L889"
     },
     {
      "text": "Oracle solutions: define output boundaries (acceptable ranges, distributions, limits, tolerances — e.g., car stops within max distance); define environmental boundaries (lighting, temperature, network latency for repeatability); expert consultation (opinions may differ or be fallible); specialized testing (A/B, back-to-back, metamorphic — compare behaviors/verify properties without explicit expected outputs); proxy oracles (secondary systems/models, e.g., image recognition checking generated images — beware reproducing similar biases/errors).",
      "src": "4.1.3 L893-L897"
     },
     {
      "text": "GenAI testing: black-box evaluation of correctness, coherence, creativity (clarity, originality, domain-rule adherence); manual review or a second GenAI system as judge (use carefully — may reproduce similar biases/errors); non-functional testing matters (CPU/GPU usage, memory, network bandwidth, response times for inference and training); benchmark suites give standardized, reproducible comparison across models.",
      "src": "4.2.1 L905-L915"
     },
     {
      "text": "Red teaming scope: especially critical for GenAI's vast attack space; covers security AND safety/privacy/fairness/bias/misinformation; security RT targets malicious inputs (indirect prompt injection, malicious content hidden in RAG documents) while safety RT finds harmful outputs under ordinary use (unsafe medical advice); regulatory expectation (EU AI Act); best run pre-deployment after initial quality assessments; core activity is interactive multi-turn prompting (e.g., 15-20 turns); coverage strategies: crowd-sourced prompts, automated LLM-generated attack prompts checked by another LLM, hybrid.",
      "src": "4.2.2 L919-L935"
     },
     {
      "text": "ML test levels: two ML-specific — input data testing (Ch 5: training + production data) and ML model testing (Ch 6: the models) — plus conventional levels: component (non-AI parts: UI, data pipeline, communication), component integration (data pipeline feeds model correctly; predictions exchanged/used correctly; API testing when AI-as-a-service), system (confirmation that ML functional performance survives embedding; e.g., after DNN compression;), system integration (external interfaces, representative conditions), acceptance (service suitability, ML functional performance criteria).",
      "src": "4.3.1 L943-L960"
     },
     {
      "text": "Risk-based ML testing: ML risks = project risks (development: algorithm, model development, framework — e.g., sub-optimal algorithm selection) + product risks (input data: biased/unrepresentative training data, pipeline defects; model: missed performance measures, overfitting, adversarial susceptibility). Risk areas map to the ML workflow: Development (Ch 7), Input data (Ch 5), Model (Ch 6); alternatively categorize by ISO/IEC 25059 quality characteristics.",
      "src": "4.3.2 L964-L972"
     }
    ]
   },
   {
    "type": "steps",
    "title": "Red teaming approach (4.2.2)",
    "items": [
     {
      "text": "Assemble a diverse team of testers to cover a wide range of perspectives and attack vectors.",
      "src": "4.2.2 L927"
     },
     {
      "text": "Provide access to the AI-based system in a safe test environment.",
      "src": "4.2.2 L928"
     },
     {
      "text": "Prompt the system to identify vulnerabilities, through open-ended exploration or using checklists.",
      "src": "4.2.2 L929"
     },
     {
      "text": "Analyze the identified failures to understand threats.",
      "src": "4.2.2 L930"
     },
     {
      "text": "Create datasets from these threats to support mitigations and system improvements.",
      "src": "4.2.2 L931"
     }
    ]
   },
   {
    "type": "traps",
    "items": [
     {
      "confusion": "Locked vs adaptive testability",
      "text": "Locked = fixed behavior post-deployment, mostly deterministic, expected results stable (but updates = new system + fresh testing; non-determinism possible from floating-point/GPU parallelism). Adaptive = evolves (reward function, new environments), may change during/because of testing — harder; unpredictable behaviors cannot be pre-tested.",
      "src": "4.1.1 L854-L866"
     },
     {
      "confusion": "Red teaming vs benchmarking vs blue teaming",
      "text": "RT = adaptive, dynamic, pre-deployment attacks (prompts updated in response to outputs), complements static benchmarking by testing extreme/unexpected conditions; Blue Teaming = ongoing real-time defensive monitoring/filtering of an operational system.",
      "src": "4.2.2 L921-L935"
     },
     {
      "confusion": "Security RT vs safety RT",
      "text": "Security RT focuses on malicious inputs (indirect prompt injection, malicious content in RAG documents); safety RT targets harmful outputs under ordinary use without adversarial intent (e.g., unsafe medical advice).",
      "src": "4.2.2 L923"
     },
     {
      "confusion": "Component integration vs system integration for MLS",
      "text": "Component integration = internal exchanges (data pipeline → model → UI, API testing for AI-as-a-service); system integration = interfaces and data exchanges with EXTERNAL systems/services under representative operational conditions.",
      "src": "4.3.1 L957-L959"
     },
     {
      "confusion": "Project risks vs product risks in ML",
      "text": "Project risks concern MLS development (sub-optimal algorithm selection, poor evaluation approach choice, framework security vulnerabilities); product risks concern the system itself (biased/unrepresentative training data, data-pipeline defects, overfitted model, adversarial susceptibility).",
      "src": "4.3.2 L968-L970"
     }
    ]
   },
   {
    "type": "examPointers",
    "items": [
     {
      "lo": "AI-4.1.1",
      "kLevel": "K2",
      "loText": "Compare the testability of locked and adaptive AI-based systems",
      "questions": [
       {
        "q": "Q17",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-4.1.2",
      "kLevel": "K2",
      "loText": "Explain why a statistical approach is often needed when testing AI-based systems",
      "questions": [
       {
        "q": "Q18",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-4.1.3",
      "kLevel": "K2",
      "loText": "Explain the challenges and solutions relating to test oracles for AI-based systems",
      "questions": [
       {
        "q": "Q19",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-4.2.1",
      "kLevel": "K2",
      "loText": "Explain how generative AI can be tested",
      "questions": [
       {
        "q": "Q20",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-4.2.2",
      "kLevel": "K3",
      "loText": "Implement red teaming for GenAI systems",
      "questions": [
       {
        "q": "Q21",
        "pts": 2
       }
      ]
     },
     {
      "lo": "AI-4.3.1",
      "kLevel": "K2",
      "loText": "Summarize the test levels used to develop machine learning systems",
      "questions": [
       {
        "q": "Q22",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-4.3.2",
      "kLevel": "K2",
      "loText": "Explain how risk-based testing is applied to machine learning systems",
      "questions": [
       {
        "q": "Q23",
        "pts": 1
       }
      ]
     }
    ]
   }
  ]
 }
};
