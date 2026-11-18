window.CTAI_DATA = window.CTAI_DATA || {};
window.CTAI_DATA.chapters = window.CTAI_DATA.chapters || {};
window.CTAI_DATA.chapters[5] = {
 "n": 5,
 "title": "Input Data Testing for Machine Learning Systems",
 "minutes": 180,
 "keywords": {
  "general": [
   "Data pipeline testing",
   "data representativeness testing",
   "dataset constraint testing",
   "input data testing",
   "label correctness testing",
   "review",
   "testing for bias"
  ],
  "aiSpecific": [
   "Disparate impact analysis",
   "multiple annotation"
  ]
 },
 "sections": [
  {
   "id": "5.1",
   "title": "Input Data Testing for Machine Learning Systems",
   "intro": [
    "The objective of input data testing is to confirm that the data used by the MLS for training, testing, and prediction is of sufficient quality (see 3.2). It includes reviews, statistical techniques (e.g., testing data for bias), EDA of the training data, and static and dynamic testing of the data pipeline."
   ],
   "subsections": [
    {
     "id": "5.1.1",
     "title": "Input Data Risks and Mitigations",
     "lo": "AI-5.1.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Give examples of test approaches used for the risk mitigation of input data for a machine learning system",
     "examinable": true,
     "handsOn": false,
     "body": "The following table lists examples of input data risks and corresponding testing that could be used for risk mitigation:\n\n| Potential Risks | Possible Risk Mitigations |\n|---|---|\n| Defects in the training data leading to bias; Problems within the algorithm, model, or ML development framework that introduce systemic unfairness | Testing for bias – see 5.1.2 |\n| Training data acquired from untrustworthy sources; Data is poorly managed | Data provenance testing |\n| Poisoned training data | A/B testing – see 6.1.9; Data provenance testing; EDA – see 3.2.1; Attacks as part of red teaming – see 4.2.2 |\n| Internally inconsistent dataset; Out of range data; Wrong data types | Dataset constraint testing – see 5.1.5 |\n| Sub-optimal feature selection | Feature testing |\n| Imbalanced dataset due to insufficient coverage of all target classes; Skewed dataset through data augmentation; Missing data; Training data focused on a subset of all use cases; Full range of values not covered in the dataset | Data representativeness testing – see 5.1.4 |\n| Poor labelling guidelines; Ambiguous data; Poor annotation leading to inaccurate or inconsistent labels | Label correctness testing – see 5.1.6 |\n| Poor design or integration leading to data pipeline failures; Data quality defects compromising data pipeline outputs; Performance degradation in the operational use of the data pipeline; Security breaches or uncontrolled changes impacting the data pipeline | Data pipeline testing – see 5.1.3 |",
     "figures": [],
     "questions": [
      {
       "q": "Q24",
       "pts": 1,
       "k": "K2",
       "answer": "a"
      }
     ],
     "srcLines": [
      1002,
      1017
     ],
     "minutes": 20,
     "minutesIsEstimate": true
    },
    {
     "id": "5.1.2",
     "title": "Testing for Bias",
     "lo": "AI-5.1.2",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain how to test for bias",
     "examinable": true,
     "handsOn": false,
     "body": "Bias in an MLS refers to non-random, unfair differences in treatment based on sensitive attributes like gender, age, or race, which is often unlawful and renders the system discriminatory.\n\nTesting for bias in an MLS involves understanding its potential sources, which primarily include:\n\n- Defects in the training data, such as unrepresentativeness, historical skews, or deliberate poisoning (data bias).\n- Defects within the algorithm, model, or development framework that introduce systemic unfairness, such as an algorithm using a decision threshold for credit scores in a loan approval system (algorithmic bias).\n\nTest approaches for detecting bias include the following:\n\n- Reviews of the overall ML workflow, and especially the data preparation, to identify their potential for introducing bias.\n- Reviews of dataset documentation to identify and mitigate potential sources of unfairness by examining how the data was collected, annotated, and what populations are represented.\n- Static analysis of both data preparation programs and the model implementation code to identify anti-patterns or the mishandling of sensitive attributes.\n- EDA of training data by using visualization and clustering methods to reveal imbalanced data, skewed distributions, or anomalous groupings across different sensitive attributes.\n- Dynamic testing to help detect bias in an ML model by feeding a known unbiased and representative dataset through the system and analyzing its predictions for statistically significant differences in outcomes across various sensitive groups. This identifies bias in model outputs, regardless of whether the bias was introduced during data training or during model development.\n- Label correctness testing (see 5.1.6) to identify mislabeling that causes incorrect associations to be learned between attributes and outcomes for specific sensitive attributes.\n- Disparate impact analysis:\n  1. Identify sensitive attributes for the model.\n  2. Generate counterfactuals for the sensitive attributes. (e.g., example scenarios where gender is changed from male to female in a loan application).\n  3. Generate model output by presenting it with the counterfactuals.\n  4. Analyze the results of multiple tests to achieve a statistically significant result, which determines if changing a sensitive attribute causes the model results to change, signaling the presence of bias.\n\n  Note: Disparate impact analysis can also be applied to combinations of sensitive attributes, allowing hidden bias associated with attribute combinations to be identified. However, take care to confirm that counterfactual examples are not unrealistic, as the model may then respond to them rather than to any underlying bias.",
     "figures": [],
     "questions": [
      {
       "q": "Q25",
       "pts": 1,
       "k": "K2",
       "answer": "c"
      }
     ],
     "srcLines": [
      1017,
      1042
     ],
     "minutes": 30,
     "minutesIsEstimate": true
    },
    {
     "id": "5.1.3",
     "title": "Data Pipeline Testing",
     "lo": "AI-5.1.3",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Summarize the various forms of data pipeline testing",
     "examinable": true,
     "handsOn": false,
     "body": "Effective data pipeline testing is essential not only for confirming the reliability and performance of data-driven systems but also for maintaining high data quality throughout the entire ML workflow (see 3.1.2).\n\nA layered approach is employed, beginning with data-pipeline design reviews during the design phase. Component testing includes testing of data ingestion components, transformation scripts, and sensor interfaces. This testing uses code reviews, static analysis, and hardware-specific tests to verify reliable data capture. Component tests validate data transformation logic, test the implementation of data validation rules, confirm robust error handling, and test for vulnerabilities that could be exploited to introduce malware or poisoned data.\n\nComponent integration testing verifies the seamless flow of data across internal interfaces and the correct interpretation of data as it moves through the pipeline. It detects defects arising from mismatched interfaces or incorrect assumptions between components.\n\nSystem testing assesses the fully assembled pipeline, beginning with smoke testing to confirm basic pipeline functionality. Functional testing verifies the pipeline's compliance with specified requirements, including data transformations and data routing. Non-functional testing evaluates performance under load, scalability to handle increasing data volumes, and security measures to protect data integrity. Fault injection testing measures pipeline robustness by simulating defective data inputs, assessing the system's ability to maintain data integrity when faced with unexpected or corrupted data. Back-to-back testing (see 6.1.10) compares the operational pipeline against the training pipeline to verify consistent functionality.\n\nSystem integration testing verifies correct interaction between the data pipeline and external systems or services, including data sources, storage platforms, monitoring tools, and downstream consumers such as ML models.\n\nTesting in production is performed on the operational system. Back-to-back testing verifies that performance is consistent or improved compared to previous versions. A/B testing (see 6.1.9) enables comparisons of new pipeline iterations against baselines, validating improvements while confirming no degradation in the live data stream. Tools can be integrated to continuously monitor and observe model behavior, performance, and potential defects in real time.\n\nConfiguration management reviews help verify that the correct pipeline code versions, configurations, and datasets are used across training, testing, and production.\n\nFinally, the test strategies must align with the pipeline's purpose. Training pipelines, often exploratory prototypes, have different priorities than robust operational pipelines. The testing of training pipelines may focus on data integrity, while operational pipeline testing prioritizes reliability, performance, and maintainability.",
     "figures": [],
     "questions": [
      {
       "q": "Q26",
       "pts": 1,
       "k": "K2",
       "answer": "d"
      }
     ],
     "srcLines": [
      1042,
      1060
     ],
     "minutes": 35,
     "minutesIsEstimate": true
    },
    {
     "id": "5.1.4",
     "title": "Testing for Data Representativeness",
     "lo": "AI-5.1.4",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain how to test for data representativeness",
     "examinable": true,
     "handsOn": false,
     "body": "Data representativeness testing determines how closely the characteristics of the datasets used for training, validation, and testing ML models match the real-world data that the ML model will encounter in operation. This testing addresses various forms of misrepresentation, including skewed datasets, missing data, disproportionate feature distributions, inadequate coverage of operational scenarios, and imbalanced class representation (see 5.1.1).\n\nThis testing typically includes the following steps:\n\n1. **Define the target population:**\n   - Understand the intended use cases and operational context of the MLS\n   - Analyze the characteristics of end users and operational environments\n   - Identify the expected operational data distributions and critical edge cases by:\n     - consulting domain experts to understand real-world data patterns\n     - analyzing data from existing systems or similar applications\n     - using benchmark datasets from trusted sources (e.g., NIST, industry databases)\n   - Apply stratified sampling to the representative reference data to create a baseline that covers all relevant subgroups in the target domain\n2. **Analyze data characteristics:**\n   - Apply EDA (see 3.2.1) to:\n     - training/test datasets being evaluated for representativeness\n     - reference dataset that represents the expected operational data\n     - visualize distributions through histograms, scatter plots, and other graphical techniques\n   - Examine feature relationships, and correlations in particular, to identify patterns that should be preserved\n   - Identify potential anomalies, gaps, or unusual concentrations in the data\n3. **Apply statistical assessment techniques:**\n   - Use formal statistical tests such as Chi-squared and Kolmogorov-Smirnov to compare distributions [STATS]\n   - Check for data imbalances, particularly in classification problems\n   - Verify adequate coverage of both typical scenarios and edge/boundary cases\n\nTesting for data representativeness should be performed before model training to prevent building models on unrepresentative data. After deployment, the properties of operational input data should be continuously monitored to detect changes that might indicate data drift from the original training data distributions (see 6.1.7 on drift testing).",
     "figures": [],
     "questions": [
      {
       "q": "Q27",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      1060,
      1088
     ],
     "minutes": 25,
     "minutesIsEstimate": true
    },
    {
     "id": "5.1.5",
     "title": "Dataset Constraint Testing",
     "lo": "AI-5.1.5",
     "ho": null,
     "kLevel": "K3",
     "loStatement": "Apply dataset constraint testing",
     "examinable": true,
     "handsOn": false,
     "body": "Dataset constraint testing verifies whether the data in a dataset adheres to predefined rules or constraints. The goal is to confirm the integrity and consistency of the data used in ML. For instance, a test of the consistency of values in a dataset could be carried out.\n\nConstraints on data are typically found in database schemas. A database schema defines the structure, types, and relationships of the data. Similarly, for ML datasets, a set of constraints can be defined that act as a logical model of the data in the dataset, which should be satisfied if the data are correct. There are several ways of categorizing dataset constraints. A constraint can be applied to a single value for an attribute, which is found in a single instance (a single-value constraint), for example:\n\n- **Missing** – tests for missing values and missing attributes.\n- **Range** – tests that a value is in a given range.\n- **Type** – tests that an attribute value matches the specified type (e.g., that if an attribute is specified as an integer, the provided value is not a string or real number).\n\nAlternatively, a constraint can apply across multiple values, typically considering the values for a single attribute across several instances (a multi-value constraint), for example:\n\n- **Sum** – tests that the sum of all values equals, exceeds, or does not exceed a specified value (e.g., the total value of all points awarded for a Formula 1 race cannot exceed 102, and must exceed 50.5 points).\n- **Count** – tests that the count of all non-null values for attributes or instances equals, exceeds, or does not exceed a specified value.\n- **Duplicate** – tests for identical or near identical attribute values or instances in a dataset and enforces a limit on how many are allowed (often zero).\n- **Useful** – tests that an attribute contains some repeated values, as if every entry is unique (like an ID or timestamp), typically provides no useful patterns to be learned for an ML model.\n- **Outlier** – identifies any values that could be considered as statistical outliers.\n\nA special form of multi-value constraint can compare different values (a comparison constraint), for example:\n\n- **Greater Than** – tests that one value for an attribute is greater than a value for a second attribute (e.g., the count of lines of code for a program exceeds its count of lines of code with defects).\n- **Correlate** – tests that the values for one attribute correlate with the values for a second attribute (e.g., all students with a marks attribute value at least 1.33 standard deviations above the mean also have a value of 'A' for their grade attribute).\n\nTesting data against the defined constraints can be performed manually. Still, the scale of the activity and the typically large size of the dataset would require this to be automated as part of the data pipeline. When implemented as part of the pipeline, the tool that implements dataset constraint testing can provide reports to data scientists (for training data anomalies) or to operations staff (for operational data problems).",
     "figures": [],
     "questions": [
      {
       "q": "Q28",
       "pts": 2,
       "k": "K3",
       "answer": "c"
      }
     ],
     "srcLines": [
      1088,
      1113
     ],
     "minutes": 35,
     "minutesIsEstimate": true
    },
    {
     "id": "5.1.6",
     "title": "Label Correctness Testing",
     "lo": "AI-5.1.6",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain label correctness testing",
     "examinable": true,
     "handsOn": false,
     "body": "Data label correctness is essential in supervised learning. Inaccurate or inconsistent labels directly undermine the performance and generalization of ML models.\n\nCommon approaches to data label correctness testing include:\n\n- **Expert Review:** Domain experts or trained annotators manually review a sample of labelled data. They evaluate label accuracy using their domain knowledge and guidelines.\n- **Multiple Annotation:** Data points are independently labelled by multiple annotators and compared using a form of back-to-back testing (see 6.1.10). Disagreements highlight defects that need investigation and resolution. The inter-annotator agreement (IAA) can be measured using metrics such as Cohen's Kappa or simple percentage agreement [STATS]. Low IAA scores can indicate defects in labelling guidelines, ambiguous data, or poor annotation.\n- **Risk-Based Prioritization for Review and Annotation:** Both expert reviews and multiple annotations can be focused using a risk-based approach to identify samples for review and multiple annotations. Prioritization can be based on the likelihood of mislabeling, such as with ambiguous data points (e.g., it is unclear to which category they belong or are near a boundary between classes), and the data that is most likely to impact the application's success or safety.\n- **Data Distribution Analysis:** When comparable datasets exist, comparing the label distribution of the dataset under test to similar datasets can reveal anomalies and potentially incorrect labels.\n- **Automated Rule-Based Tests:** Automated tests can be implemented based on predefined label rules or constraints for certain tasks. For instance, verifying that bounding boxes (rectangles used to locate objects in images) do not overlap or extend beyond image boundaries.\n- **Model Loss Analysis:** Data points exhibiting high loss during model training – meaning the model's predictions for these points deviate substantially from their true labels – can indicate mislabeling. High loss reflects significant error, indicating the model struggles to learn the assigned label and pointing to a potential defect.\n- **Model Confidence Score Analysis:** Data points with low prediction confidence from a trained model may be mislabeled, ambiguous, or lie outside the model's training data distribution.\n\nUsing a combination of approaches is often most effective. For example, expert reviews are valuable in establishing clear labelling guidelines early on. IAA scores from multiple annotations can then refine the labelling process. Subsequently, model-based approaches can further identify potential label defects as the model continues to develop.",
     "figures": [],
     "questions": [
      {
       "q": "Q29",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      1113,
      1129
     ],
     "minutes": 30,
     "minutesIsEstimate": true
    },
    {
     "id": "5.1.7",
     "title": "Hands-on Exercise: Input Data Testing",
     "lo": null,
     "ho": "HO-5.1.7",
     "kLevel": "H2",
     "loStatement": "Perform input data testing for ML datasets",
     "examinable": false,
     "handsOn": true,
     "body": "For a given dataset (e.g., structured, tabular data), perform input data testing for things like missing data, duplicate data, and outliers.",
     "figures": [],
     "questions": [],
     "srcLines": [
      1129,
      1133
     ],
     "minutes": 5,
     "minutesIsEstimate": true
    }
   ]
  }
 ],
 "cheatsheet": {
  "chapter": 5,
  "blocks": [
   {
    "type": "meta",
    "minutes": 180,
    "questionCount": 6,
    "points": 7
   },
   {
    "type": "keyTerms",
    "items": [
     {
      "term": "input data testing",
      "def": "Confirms that the data used by the MLS for training, testing, and prediction is of sufficient quality — includes reviews, statistical techniques (e.g., testing data for bias), EDA of training data, and static and dynamic testing of the data pipeline.",
      "src": "5.1 L1000"
     },
     {
      "term": "bias (in an MLS)",
      "def": "Non-random, unfair differences in treatment based on sensitive attributes like gender, age, or race, which is often unlawful and renders the system discriminatory.",
      "src": "5.1.2 L1019"
     },
     {
      "term": "data vs algorithmic bias",
      "def": "Data bias: defects in the training data (unrepresentativeness, historical skews, deliberate poisoning). Algorithmic bias: defects within the algorithm, model, or development framework that introduce systemic unfairness (e.g., a decision threshold for credit scores in loan approval).",
      "src": "5.1.2 L1023-L1024"
     },
     {
      "term": "disparate impact analysis",
      "def": "Bias test that generates counterfactuals for sensitive attributes, feeds them to the model, and analyzes whether changing a sensitive attribute changes the results — signaling bias. Also applicable to combinations of sensitive attributes (beware unrealistic counterfactuals).",
      "src": "5.1.2 L1034-L1040"
     },
     {
      "term": "data representativeness testing",
      "def": "Determines how closely the characteristics of the datasets used for training, validation, and testing match the real-world data the model will encounter in operation (addresses skewed datasets, missing data, disproportionate feature distributions, inadequate scenario coverage, imbalanced classes).",
      "src": "5.1.4 L1062"
     },
     {
      "term": "dataset constraint testing",
      "def": "Verifies whether the data in a dataset adheres to predefined rules or constraints (a logical model of the data that should be satisfied if the data are correct); typically automated as part of the data pipeline.",
      "src": "5.1.5 L1090-L1092"
     },
     {
      "term": "multiple annotation / IAA",
      "def": "Data points independently labelled by multiple annotators and compared (a form of back-to-back testing); inter-annotator agreement measured with Cohen's Kappa or simple percentage agreement — low IAA indicates defects in guidelines, ambiguous data, or poor annotation.",
      "src": "5.1.6 L1120"
     }
    ]
   },
   {
    "type": "mustKnow",
    "title": "Bias testing, pipelines, constraints, labels",
    "items": [
     {
      "text": "Bias test approaches: reviews of the ML workflow/data preparation; reviews of dataset documentation (collection, annotation, populations represented); static analysis of data-prep and model code (anti-patterns, mishandled sensitive attributes); EDA with visualization/clustering (imbalanced data, skewed distributions, anomalous groupings); dynamic testing with a known unbiased representative dataset (statistically significant outcome differences across sensitive groups — catches bias regardless of origin); label correctness testing; disparate impact analysis.",
      "src": "5.1.2 L1028-L1038"
     },
     {
      "text": "Data pipeline testing layers: design reviews; component testing (ingestion, transformation scripts, sensor interfaces — code reviews, static analysis, hardware tests; validation rules, error handling, malware/poisoning vulnerabilities); component integration (flow across internal interfaces); system testing (smoke, functional, non-functional load/scalability/security, fault injection with defective data, back-to-back vs training pipeline); system integration (external sources, storage, monitoring, downstream models); testing in production (back-to-back vs previous versions, A/B vs baselines, continuous monitoring); configuration management reviews (correct code versions/configs/datasets across training, testing, production).",
      "src": "5.1.3 L1044-L1058"
     },
     {
      "text": "Representativeness testing runs BEFORE model training; after deployment, continuously monitor operational input data to detect data drift from training distributions (see 6.1.7).",
      "src": "5.1.4 L1086"
     },
     {
      "text": "Dataset constraint types — single-value: Missing, Range, Type. Multi-value: Sum, Count, Duplicate, Useful (an attribute with all-unique values like IDs/timestamps provides no learnable patterns), Outlier. Comparison (across attributes): Greater Than, Correlate.",
      "src": "5.1.5 L1092-L1109"
     },
     {
      "text": "Label correctness approaches: expert review; multiple annotation with IAA (Cohen's Kappa); risk-based prioritization (ambiguous points, boundary cases, safety-critical data); data distribution analysis vs comparable datasets; automated rule-based tests (e.g., bounding boxes within image boundaries); model loss analysis (high loss → possible mislabeling); model confidence score analysis (low confidence → possibly mislabeled/ambiguous/out-of-distribution). Combine approaches for best results.",
      "src": "5.1.6 L1119-L1127"
     }
    ]
   },
   {
    "type": "table",
    "title": "Input data risks → mitigations (abbreviated)",
    "columns": [
     "Potential risk",
     "Mitigation"
    ],
    "rows": [
     [
      "Bias from training data defects; systemic unfairness in algorithm/model/framework",
      "Testing for bias (5.1.2)"
     ],
     [
      "Untrustworthy data sources; poorly managed data",
      "Data provenance testing"
     ],
     [
      "Poisoned training data",
      "A/B testing; Data provenance testing; EDA; red-teaming attacks"
     ],
     [
      "Internally inconsistent dataset; out-of-range data; wrong types",
      "Dataset constraint testing (5.1.5)"
     ],
     [
      "Sub-optimal feature selection",
      "Feature testing"
     ],
     [
      "Imbalanced/skewed/missing data; subset of use cases; range not covered",
      "Data representativeness testing (5.1.4)"
     ],
     [
      "Poor labelling guidelines; ambiguous data; poor annotation",
      "Label correctness testing (5.1.6)"
     ],
     [
      "Pipeline design/integration failures; quality defects; performance degradation; security breaches",
      "Data pipeline testing (5.1.3)"
     ]
    ],
    "src": "5.1.1 L1006-L1015"
   },
   {
    "type": "steps",
    "title": "Data representativeness testing (5.1.4)",
    "items": [
     {
      "text": "Define the target population: understand use cases/operational context; analyze end users and environments; identify expected operational distributions and edge cases (domain experts, data from existing systems, benchmark datasets e.g. NIST); apply stratified sampling to reference data to cover all relevant subgroups.",
      "src": "5.1.4 L1066-L1073"
     },
     {
      "text": "Analyze data characteristics: apply EDA to the datasets under test and the reference dataset (histograms, scatter plots); examine feature relationships and correlations; identify anomalies, gaps, unusual concentrations.",
      "src": "5.1.4 L1074-L1080"
     },
     {
      "text": "Apply statistical assessment techniques: formal tests such as Chi-squared and Kolmogorov-Smirnov to compare distributions; check class imbalances; verify coverage of typical and edge/boundary cases.",
      "src": "5.1.4 L1081-L1084"
     }
    ]
   },
   {
    "type": "steps",
    "title": "Disparate impact analysis (5.1.2)",
    "items": [
     {
      "text": "Identify sensitive attributes for the model.",
      "src": "5.1.2 L1035"
     },
     {
      "text": "Generate counterfactuals for the sensitive attributes (e.g., gender changed from male to female in a loan application).",
      "src": "5.1.2 L1036"
     },
     {
      "text": "Generate model output by presenting it with the counterfactuals.",
      "src": "5.1.2 L1037"
     },
     {
      "text": "Analyze results of multiple tests for statistical significance — a change in results when a sensitive attribute changes signals bias.",
      "src": "5.1.2 L1038"
     }
    ]
   },
   {
    "type": "traps",
    "items": [
     {
      "confusion": "Data bias vs algorithmic bias",
      "text": "Data bias originates in the training data (unrepresentative, historically skewed, poisoned); algorithmic bias originates in the algorithm/model/framework (e.g., an unfair decision threshold) — dynamic testing detects output bias regardless of source.",
      "src": "5.1.2 L1023-L1032"
     },
     {
      "confusion": "The five input-data testing types",
      "text": "Bias (5.1.2, unfair treatment), pipeline (5.1.3, data flow machinery), representativeness (5.1.4, does data match operational reality), constraints (5.1.5, rule/consistency checks), label correctness (5.1.6, supervision quality); anchor risk→test-type on the 5.1.1 table.",
      "src": "5.1.1 L1006-L1015"
     },
     {
      "confusion": "Single-value vs multi-value vs comparison constraints",
      "text": "Single-value checks one attribute value in one instance (Missing/Range/Type); multi-value checks values across instances (Sum/Count/Duplicate/Useful/Outlier); comparison checks one attribute against another (Greater Than/Correlate).",
      "src": "5.1.5 L1092-L1109"
     },
     {
      "confusion": "Chi-squared / Kolmogorov-Smirnov belong to representativeness, not drift testing",
      "text": "They are the named statistical tests for comparing data distributions in representativeness testing (5.1.4); drift detection is discussed in 6.1.7 — don't mix them in exam answers.",
      "src": "5.1.4 L1082"
     }
    ]
   },
   {
    "type": "examPointers",
    "items": [
     {
      "lo": "AI-5.1.1",
      "kLevel": "K2",
      "loText": "Give examples of test approaches used for the risk mitigation of input data for a machine learning system",
      "questions": [
       {
        "q": "Q24",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-5.1.2",
      "kLevel": "K2",
      "loText": "Explain how to test for bias",
      "questions": [
       {
        "q": "Q25",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-5.1.3",
      "kLevel": "K2",
      "loText": "Summarize the various forms of data pipeline testing",
      "questions": [
       {
        "q": "Q26",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-5.1.4",
      "kLevel": "K2",
      "loText": "Explain how to test for data representativeness",
      "questions": [
       {
        "q": "Q27",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-5.1.5",
      "kLevel": "K3",
      "loText": "Apply dataset constraint testing",
      "questions": [
       {
        "q": "Q28",
        "pts": 2
       }
      ]
     },
     {
      "lo": "AI-5.1.6",
      "kLevel": "K2",
      "loText": "Explain label correctness testing",
      "questions": [
       {
        "q": "Q29",
        "pts": 1
       }
      ]
     }
    ]
   }
  ]
 }
};
