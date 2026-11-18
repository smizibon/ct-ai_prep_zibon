window.CTAI_DATA = window.CTAI_DATA || {};
window.CTAI_DATA.chapters = window.CTAI_DATA.chapters || {};
window.CTAI_DATA.chapters[3] = {
 "n": 3,
 "title": "Machine Learning",
 "minutes": 375,
 "keywords": {
  "general": [
   "K-multisection neuron coverage",
   "ML functional performance criteria",
   "ML functional performance metric",
   "ML model",
   "neuron boundary coverage",
   "neuron coverage",
   "perceptron"
  ],
  "aiSpecific": [
   "Association",
   "classification",
   "clustering",
   "data preparation",
   "machine learning",
   "ML algorithm",
   "ML development framework",
   "ML workflow",
   "pretrained model",
   "ML regression",
   "reinforcement learning",
   "supervised learning",
   "unsupervised learning"
  ]
 },
 "sections": [
  {
   "id": "3.1",
   "title": "Introduction to Machine Learning",
   "intro": [
    "This section introduces the main categories of ML algorithms: supervised, unsupervised, and reinforcement learning, distinguishing their respective problem types and typical applications. It outlines the standard workflow for developing ML models, from defining objectives and preparing data to training, evaluating, and deploying models, with attention to iteration and system integration. Practical aspects such as hands-on model creation, the use of pretrained models, fine-tuning, and retrieval-augmented generation are also covered, highlighting approaches to efficiently adapt and enhance AI models for new tasks while managing inherited limitations.",
    "Understanding this workflow is essential for testers, as different test activities apply at different stages, and failures often originate in earlier steps such as data preparation or model selection."
   ],
   "subsections": [
    {
     "id": "3.1.1",
     "title": "Different Forms of Machine Learning",
     "lo": "AI-3.1.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Distinguish between the different forms of ML",
     "examinable": true,
     "handsOn": false,
     "body": "ML algorithms are categorized into supervised learning, unsupervised learning, and reinforcement learning.\n\nIn supervised learning, algorithms train models using labeled data, where each set of inputs has a corresponding output label (e.g., images labeled as \"dog\" or \"cat\"). The model learns to map inputs to outputs by identifying patterns in the training data. Supervised learning is typically divided into:\n\n- **Classification:** This involves assigning inputs to predefined classes, such as classifying emails as spam or not, or image recognition in images.\n- **ML regression:** This involves predicting continuous numerical values, such as estimating a person's age based on lifestyle data or forecasting stock prices.\n\nNote that the term ML regression, when used in the context of ML, differs from its use in other ISTQB® syllabi, where regression describes the problem of software modifications causing change-related defects.\n\nIn unsupervised learning, the algorithm trains models using unlabeled data, inferring patterns or structures without explicit output labels. The model groups similar inputs together based on shared features. Unsupervised learning is typically categorized into:\n\n- **Clustering:** This involves grouping data points based on similarities, such as segmenting customers into different groups for targeted marketing.\n- **Association:** This involves identifying relationships or dependencies among data attributes, such as finding patterns in customer purchasing behavior to recommend products.\n\nIn reinforcement learning, the AI-based system (an \"intelligent agent\") learns by interacting with its environment. The agent receives positive feedback (rewards) or negative feedback (penalties) based on the outcome of its actions, enabling it to learn from experience rather than from a dataset. Challenges in reinforcement learning include setting up the environment, designing the reward function, and selecting the best strategy to meet the desired goal. Applications include robotics, autonomous vehicles, and adaptive systems like chatbots.\n\nEach ML approach addresses different types of problems, with the choice depending on the nature of the available data and the specific task at hand.",
     "figures": [],
     "questions": [
      {
       "q": "Q10",
       "pts": 1,
       "k": "K2",
       "answer": "c"
      },
      {
       "q": "A4",
       "pts": 1,
       "k": "K2",
       "answer": "New question type"
      }
     ],
     "srcLines": [
      545,
      565
     ],
     "minutes": 35,
     "minutesIsEstimate": true
    },
    {
     "id": "3.1.2",
     "title": "Machine Learning Workflow",
     "lo": "AI-3.1.2",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Summarize the workflow used to create an ML system",
     "examinable": true,
     "handsOn": false,
     "body": "The activities in the ML workflow, shown in Figure 1, are:\n\n**Understand the Objectives**\n\nThe purpose of the ML model is understood and agreed to by the stakeholders to verify alignment with business priorities. Acceptance criteria (including ML functional performance metrics – see 3.3) are defined for the developed model.\n\n**Select a Framework**\n\nA suitable ML development framework (see 1.1.7 for details on provided functionality) is selected based on the objectives, acceptance criteria (see 2.2), and business priorities.\n\n**Select & Build the Algorithm**\n\nAn ML algorithm is selected based on various factors, including the objectives, acceptance criteria, and the available data (see 3.2). The algorithm may be manually coded, but it is often retrieved from a software library. The algorithm is then compiled, if required.\n\n**Prepare & Test Data**\n\nData preparation (see 3.2) comprises data acquisition, data preprocessing, and feature engineering. Exploratory data analysis (EDA) may be performed alongside these activities.\n\nThe data used by the algorithm and model are based on the objectives and are utilized by all activities in the 'model generation and test' box shown in Figure 1.\n\nThe data used to train, evaluate, tune, and test the model must be representative of the data that will be used by the model operationally.\n\nTesting of the data and any automated data preparation steps is performed (see Chapter 5).\n\n**Train the Model**\n\nThe selected ML algorithm uses training data to train the model.\n\nParameters defining the model structure (e.g., the number of layers of a neural network or the depth of a decision tree) are passed to the algorithm. These parameters are known as model hyperparameters.\n\nParameters that control the training (e.g., the number of iterations to use when training a neural network) are also passed to the algorithm. These parameters are known as algorithm hyperparameters.\n\n**Evaluate the Model**\n\nThe model is evaluated against the agreed ML functional performance metrics (see 3.3), using the validation dataset, and the results are used to improve the model in the 'tune the model' activity. In practice, several models are typically created and trained using different algorithms (e.g., random forests, SVM, and neural networks) and various training datasets, and the best combination is chosen based on the evaluation results.\n\n**Tune the Model**\n\nThe results from the evaluation are used to adjust the model hyperparameters and the algorithm hyperparameters. The model is then retrained with these adjusted settings to improve its ML functional performance.\n\nThe three activities of training, evaluation, and tuning comprise 'model generation', as shown on Figure 1.\n\n**Test the Model**\n\nOnce an acceptable model has been generated by the 'model generation' activities, it is tested using an independent test dataset to verify that the agreed ML functional performance criteria are met. The test results are also compared with those from the evaluation. If the performance of the model with independent test data is significantly lower than during evaluation, it may be necessary to return to the 'model generation' activities, or even to the 'prepare & test data' activity to train a new model.\n\nIn addition to ML functional performance tests, non-functional tests, such as for the time to provide a prediction, may also be performed. Typically, testing in this activity is performed by data engineers or scientists; however, testers with sufficient knowledge of the domain and access to the relevant resources can also perform this testing.\n\n**Deploy the Model**\n\nOnce 'model generation & test' is complete, the tuned model is typically re-engineered for deployment along with its data pipeline. This is generally achieved through the ML development framework. Target platforms might include embedded systems and the cloud, where the model can be accessed via a web API. The re-engineered deployed model is tested to verify it still meets its acceptance criteria.\n\n**Use the Model**\n\nOnce deployed, the model is typically integrated into a larger operational AI-based system. Models may perform scheduled batch predictions at set time intervals or run in real-time upon request.\n\n**Monitor & Tune the Model**\n\nWhile the model is being used, its situation may evolve, and the model may drift away from its intended performance (see 6.1.7). To verify that any drift is identified and managed, the operational model is regularly evaluated against its acceptance criteria.\n\nIt may be deemed necessary to create a new model by retraining with new data, retraining with new hyperparameters, or both. The latest model may then be compared to the existing model using a form of A/B testing (see 6.1.9).\n\nThe ML workflow shown in Figure 1 is a logical sequence; however, in practice, the workflow is applied iteratively, with steps repeated.\n\nThe steps shown in Figure 1 do not include the integration of the ML model with the non-ML parts of the overall system. Typically, ML models cannot be deployed in isolation and must be integrated with non-ML components (e.g., in vision applications, a data pipeline is used to clean and modify data before submitting it to the ML model). When the model is part of a large system, it must be integrated into this system before deployment. In this case, integration, system, and acceptance test levels may be performed.\n\n![Figure 1: ML Workflow — dashed container \"Model Development\" (Understand the Objectives, Select a Framework, Select & Build the Algorithm, Prepare & Test Data) flowing into dashed container \"Model Generation & Test\" with its inner \"Model Generation\" cycle of Train the Model → Evaluate the Model → Tune the Model (iterating), followed by Test the Model, then Deploy the Model and Monitor & Use the Model, with monitoring feeding back into Prepare & Test Data (image extracted from syllabus PDF page 30)](assets/fig/syllabus_p30_R199.png)\n\n*Figure 1: ML Workflow*",
     "figures": [
      {
       "caption": "Figure 1: ML Workflow",
       "src": "assets/fig/syllabus_p30_R199.png",
       "alt": "Figure 1: ML Workflow — dashed container \"Model Development\" (Understand the Objectives, Select a Framework, Select & Build the Algorithm, Prepare & Test Data) flowing into dashed container \"Model Generation & Test\" with its inner \"Model Generation\" cycle of Train the Model → Evaluate the Model → Tune the Model (iterating), followed by Test the Model, then Deploy the Model and Monitor & Use the Model, with monitoring feeding back into Prepare & Test Data (image extracted from syllabus PDF page 30)"
      }
     ],
     "questions": [
      {
       "q": "Q11",
       "pts": 1,
       "k": "K2",
       "answer": "d"
      },
      {
       "q": "A5",
       "pts": 1,
       "k": "K2",
       "answer": "New question type"
      }
     ],
     "srcLines": [
      565,
      637
     ],
     "minutes": 95,
     "minutesIsEstimate": true
    },
    {
     "id": "3.1.3",
     "title": "Hands-on Exercise: Create a Machine Learning Model",
     "lo": null,
     "ho": "HO-3.1.3",
     "kLevel": "H2",
     "loStatement": "Create an ML model",
     "examinable": false,
     "handsOn": true,
     "body": "Select, train, and test a classification model using supervised learning.\n\nExplain the difference between evaluating/tuning and testing by comparing the accuracy achieved with validation and test datasets.",
     "figures": [],
     "questions": [],
     "srcLines": [
      637,
      643
     ],
     "minutes": 5,
     "minutesIsEstimate": true
    },
    {
     "id": "3.1.4",
     "title": "Pretrained Models, Fine-Tuning, and Retrieval-Augmented Generation",
     "lo": "AI-3.1.4",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Summarize the use of pretrained models, fine-tuning, and retrieval-augmented generation",
     "examinable": true,
     "handsOn": false,
     "body": "Training a new AI model from scratch is both costly and time-consuming. To address this, a common solution is fine-tuning, which involves taking a pretrained neural network and adapting it to perform a new, different task. One of the key benefits is that it requires much less training data (and training effort) compared to building a model from scratch.\n\nThe pretrained model is fine-tuned by performing additional training with data specific to the new task. The tuning can be applied to the entire neural network, only to specific layers (typically near the output end of the neural network), or to additional layers. After training, the model's ML functional performance is evaluated, and based on these results, further fine-tuning may be performed until the model meets the necessary acceptance criteria.\n\nFine-tuning success depends on the similarity between the original and new tasks. Small differences can lead to highly effective fine-tuning. For example, adapting a cat breed image classifier to identify dog breeds is likely to work well. However, adapting it for spoken accents is less effective due to the larger difference. Similarly, fine-tuning an LLM for ISTQB-defined boundary value analysis requires a small change for the LLM and is readily achievable with good training data.\n\nAn alternative to fine-tuning is Retrieval-Augmented Generation (RAG), which involves providing data sources to the LLM that are specific to the required task. These data sources are transformed into a searchable format that allows them to be compared to the subject of the prompt. Once relevant documents are identified, these are incorporated into an enhanced prompt, which is passed to the LLM. As more pertinent information is now provided to the LLM, its corresponding response is likely to be more precise. With RAG, no change is made to the pretrained model.\n\nA pretrained model can use RAG, fine-tuning, or both together to enhance performance.\n\nTypically, any biases or vulnerabilities in the pretrained model will carry over to the new model, so testing is necessary to confirm that it performs reliably and fairly in the new task.",
     "figures": [],
     "questions": [
      {
       "q": "Q12",
       "pts": 1,
       "k": "K2",
       "answer": "d"
      }
     ],
     "srcLines": [
      643,
      657
     ],
     "minutes": 35,
     "minutesIsEstimate": true
    }
   ]
  },
  {
   "id": "3.2",
   "title": "Data for Machine Learning",
   "intro": [
    "Data preparation is recognized as one of the most crucial and resource-intensive activities in the ML workflow. If operational data differs significantly from training data, ML functional performance and safety assumptions may no longer hold. Data preparation typically consumes a significantly larger proportion of the overall effort compared to other stages, such as model selection and building. Data preparation is intrinsically linked to the data pipeline, which processes raw data and transforms it into a usable format for both training and prediction by ML models."
   ],
   "subsections": [
    {
     "id": "3.2.1",
     "title": "Activities in Data Preparation",
     "lo": "AI-3.2.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain the activities related to data preparation",
     "examinable": true,
     "handsOn": false,
     "body": "Data preparation supports the achievement of the quality and suitability of data for model training. It involves several key activities:\n\n- **Data acquisition:**\n  - Identifying relevant data types (e.g., numerical, categorical, images, text).\n  - Gathering data from diverse sources, such as databases, APIs, or real-time sensors.\n  - Labeling data for supervised learning tasks, verifying accuracy and consistency.\n\n  The acquired data can take various forms (e.g., numerical, categorical, image, tabular, text, time series, sensor, geospatial, video, and audio).\n- **Data preprocessing:**\n  - Cleaning data, including:\n    - removing defects, duplicates, and outliers to verify data accuracy and consistency;\n    - imputing missing values using techniques like mean, median, or mode to maintain data completeness;\n    - anonymizing or removing personal information to protect privacy and comply with regulations.\n  - Transforming data formats, scaling, and normalizing to achieve consistency.\n  - Augmenting data to increase sample size, incorporating adversarial examples to enhance robustness against adversarial attacks, and generating synthetic data.\n  - Sampling subsets to reduce training times and computational costs.\n- **Feature engineering:**\n  - Selecting relevant features based on their contribution to ML model performance.\n  - Extracting a subset of informative and non-redundant features from existing features to reduce training times and computational costs.\n\nIn parallel to these data preparation activities, exploratory data analysis (EDA) is also typically carried out to provide insights into the data. This includes:\n\n- discovering trends, patterns, and anomalies in the data;\n- visualizing data using plots and charts for better understanding.\n\nPreparing training data is typically an iterative process, often performed manually, and individual data preparation activities may be reordered or omitted based on specific project requirements. The operational data should match the characteristics of the training data (e.g., data distributions and feature ranges) so that the model performs as expected in production. However, the preparation steps themselves may be adjusted for production efficiency and scalability.",
     "figures": [],
     "questions": [
      {
       "q": "Q13",
       "pts": 1,
       "k": "K2",
       "answer": "c"
      }
     ],
     "srcLines": [
      661,
      690
     ],
     "minutes": 30,
     "minutesIsEstimate": true
    },
    {
     "id": "3.2.2",
     "title": "Hands-on Exercise: Data Preparation in Support of the Creation of a Machine Learning Model",
     "lo": null,
     "ho": "HO-3.2.2",
     "kLevel": "H2",
     "loStatement": "Perform data preparation to support the creation of an ML model",
     "examinable": false,
     "handsOn": true,
     "body": "For a given set of data, perform the applicable data preparation steps as outlined in Section 3.2.1 to produce a dataset that will be used to create a classification model using supervised learning.\n\nThis activity serves as the first step in creating an ML model that will be utilized in future exercises.\n\nTo perform this activity, students will be provided with appropriate (and language-specific) materials, including:\n\n- libraries;\n- ML development framework;\n- tools.",
     "figures": [],
     "questions": [],
     "srcLines": [
      690,
      702
     ],
     "minutes": 10,
     "minutesIsEstimate": true
    },
    {
     "id": "3.2.3",
     "title": "Training, Validation, and Test Datasets",
     "lo": "AI-3.2.3",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Contrast the use of training, validation, and test datasets in the development of an ML model",
     "examinable": true,
     "handsOn": false,
     "body": "Logically, three sets of equivalent data (e.g., randomly selected from a single representative dataset) are required to develop an ML model:\n\n- A training dataset is used to train the model.\n- A validation dataset is used for evaluating and subsequently tuning the model.\n- A test dataset, also known as the holdout dataset, is used to test the tuned model.\n\nIf an abundance of suitable data is available, the amount of data used in the ML workflow for training, evaluation, and testing typically depends on the following factors:\n\n- The expected complexity of the model.\n- The algorithm used to train the model.\n- The availability of resources, such as RAM, disk space, computing power, network bandwidth, and the available time.\n- The desired confidence in the resultant model.\n\nWhen data is limited, a three-way split (train, validation, and test) can result in insufficient data for effective model training, thereby increasing the risk of underfitting. To address this, a common strategy is to set aside a small, final hold-out test set if feasible. The remaining data (the combined training and validation pool) is then used for techniques like k-fold cross-validation (where k is a user-specified integer, commonly 5 or 10).\n\nIn k-fold cross-validation, this data is divided into k 'folds.' For each fold, the model is trained on k-1 folds and validated on the held-out fold. This process is repeated k times, with each fold serving as the validation set once. This allows for robust hyperparameter tuning and ML functional performance estimation. Data is typically randomly assigned to folds, often using stratified sampling to make each fold representative, especially with imbalanced data or small datasets.\n\nThe performance metrics (e.g., accuracy, F1-score – see 3.3.1) from each fold's validation are then averaged to provide a more reliable estimate of the model's generalization ability. After identifying the optimal hyperparameters through cross-validation, a final model is typically trained on the entire training and validation pool (all data except the hold-out test set) using these hyperparameters. This final model is then evaluated once on the hold-out test set for a final, unbiased performance assessment. If a hold-out test set is not feasible due to extreme data scarcity, the average cross-validation performance is optimistically biased and cannot serve as an unbiased estimate.\n\nOther resampling methods for limited data include leave-one-out cross-validation (a special case of k-fold where k equals the number of samples) and bootstrap techniques.",
     "figures": [],
     "questions": [
      {
       "q": "Q14",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      702,
      725
     ],
     "minutes": 45,
     "minutesIsEstimate": true
    }
   ]
  },
  {
   "id": "3.3",
   "title": "ML Functional Performance Metrics for Classification",
   "intro": [
    "In classification tasks (see 3.1.1), a confusion matrix can be used to evaluate a model's predictions, categorizing them as true positives, true negatives, false positives, or false negatives. Key metrics, such as accuracy, precision, recall, and F1-score, are derived from this. These metrics measure classification quality, highlighting the ML model's strengths and weaknesses. This section explores the calculation and interpretation of these metrics to assess ML functional performance."
   ],
   "subsections": [
    {
     "id": "3.3.1",
     "title": "Calculation of Machine Learning Functional Performance Metrics",
     "lo": "AI-3.3.1",
     "ho": null,
     "kLevel": "K3",
     "loStatement": "Calculate common ML functional performance metrics from a given set of confusion matrix data",
     "examinable": true,
     "handsOn": false,
     "body": "In a classification problem, a model will rarely predict the results correctly all the time, partly due to the probabilistic nature of ML models and data noise. For any such problem, a confusion matrix can be created with the following possibilities:\n\n| | **Actual** | |\n|---|---|---|\n| **Predicted** | Positive | Negative |\n| Positive | True Positive (TP) | False Positive (FP) |\n| Negative | False Negative (FN) | True Negative (TN) |\n\n*Figure 2: Confusion Matrix*\n\nNote that the confusion matrix shown in Figure 2 may be presented differently (e.g., predicted and actual swapped), but it will always yield values for the four possible situations of true positive (TP), true negative (TN), false positive (FP), and false negative (FN).\n\nBased on the confusion matrix, the following metrics are defined:\n\n- **Accuracy = (TP + TN) / (TP + TN + FP + FN) \\* 100%**\n\n  Accuracy measures the percentage of all correct classifications.\n\n- **Precision = TP / (TP + FP) \\* 100%**\n\n  Precision measures the proportion of positives that were correctly predicted. It is a measure of how sure one can be about positive predictions.\n\n- **Recall = TP / (TP + FN) \\* 100%**\n\n  Recall (also known as sensitivity) measures the proportion of actual positives that are correctly predicted. It is a measure of how confident one can be that no positives will be missed.\n\n- **F1-score = 2 \\* (Precision \\* Recall) / (Precision + Recall)**\n\n  F1-score is calculated as the harmonic mean of precision and recall, with values ranging from 0 to 100. A score close to 100 means the model achieves both high precision and high recall, indicating that classification errors (false positives and false negatives) have minimal impact. Conversely, a low F1-score indicates the model struggles to accurately identify positives, either missing true cases or generating many false alarms.",
     "figures": [],
     "questions": [
      {
       "q": "Q15",
       "pts": 2,
       "k": "K3",
       "answer": "c"
      }
     ],
     "srcLines": [
      729,
      761
     ],
     "minutes": 30,
     "minutesIsEstimate": true
    },
    {
     "id": "3.3.2",
     "title": "Hands-on Exercise: Evaluate a Machine Learning Model using Selected ML Functional Performance Metrics",
     "lo": null,
     "ho": "HO-3.3.2",
     "kLevel": "H2",
     "loStatement": "Evaluate an ML model using selected ML functional performance metrics",
     "examinable": false,
     "handsOn": true,
     "body": "Using the classification model trained in the previous exercise, calculate and display the values for accuracy, precision, recall, and F1-score. Where applicable, use the library functions provided by your ML development framework to perform the calculations.",
     "figures": [],
     "questions": [],
     "srcLines": [
      761,
      765
     ],
     "minutes": 5,
     "minutesIsEstimate": true
    },
    {
     "id": "3.3.3",
     "title": "Hands-on Exercise: Show the Impact of Different Machine Learning Models and Dataset Combinations",
     "lo": null,
     "ho": "HO-3.3.3",
     "kLevel": "H2",
     "loStatement": "Show the impact of different ML models and dataset combinations on the training and behavior of the models",
     "examinable": false,
     "handsOn": true,
     "body": "Following the previous exercise, use different ML models and dataset combinations to observe their effect on the training of the ML model, as well as the final behavior of the model. Observe the training times and the ML functional performance metrics.",
     "figures": [],
     "questions": [],
     "srcLines": [
      765,
      769
     ],
     "minutes": 5,
     "minutesIsEstimate": true
    }
   ]
  },
  {
   "id": "3.4",
   "title": "Neural Networks",
   "intro": [
    "Artificial neural networks were initially designed to mimic the functioning of the human brain, which can be thought of as a network of interconnected biological neurons.",
    "The single-layer perceptron is one of the earliest examples of implementing an artificial neural network, comprising just one layer. It can be used for supervised learning of binary classifiers for linearly separable problems, which determine whether an input belongs to a specific class or not. For example, a perceptron can distinguish between emails that are spam and those that are not spam, by learning to separate the features of the two categories with a straight line in the input space.",
    "Most current neural networks are considered to be deep neural networks because they comprise several layers. Fully connected networks can be considered as multi-layer perceptrons (see Figure 3).",
    "![Figure 3: Structure of a deep neural network — a layered network with an input layer of input neurons on the left, multiple hidden layers in the middle, and an output layer on the right, neighbouring layers fully connected (image extracted from syllabus PDF page 35)](figures/syllabus_p35_R229.png)",
    "*Figure 3: Structure of a deep neural network*"
   ],
   "subsections": [
    {
     "id": "3.4.1",
     "title": "Structure and Working of a Deep Neural Network",
     "lo": "AI-3.4.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain the structure and working of a deep neural network",
     "examinable": true,
     "handsOn": false,
     "body": "A deep neural network is typically described as comprising three main types of layers. The input layer receives inputs, for example, pixel values from a camera. The output layer provides results to the outside world. This might, for example, be a value indicating the likelihood that the input image is of a cat. Between the input and output layers are hidden layers composed of artificial neurons, also known as nodes. In many common architectures, such as fully connected networks, the neurons in one layer are connected to each of the neurons in the next layer, and there may be different numbers of neurons in each successive layer.\n\nThe neurons perform computations and pass information across the network from the input neurons to the output neurons, gradually transforming the input data into increasingly abstract representations until reaching the output.\n\nThe computation performed by each neuron (after those in the input layer) generates what is known as the activation value. This value is calculated by first computing a weighted sum of the activation values from all connected neurons in the previous layer, where each such connection has its own independent weight, and adding the neuron's individual bias. This sum is then passed through a non-linear formula called the activation function. Note that this bias is unrelated to the bias considered in 5.1.2. Using different activation functions yields different activation values.\n\n![Figure 4: Computation performed by each neuron — incoming connections from previous-layer neurons (each labelled \"weight\") into a neuron with its \"bias\", producing the \"activation value\" via the activation function (image extracted from syllabus PDF page 36)](assets/fig/syllabus_p36_R237.png)\n\n*Figure 4: Computation performed by each neuron*\n\nThe weights connecting neurons and each neuron's bias value are typically initialized to small random values (biases sometimes to zero) at the start of training. The training data is passed through the network, with each neuron running the activation function, to generate an output ultimately. The generated output is then compared with the known correct result. The resulting error (or loss), which quantifies this difference, is then fed back through the network to adjust the values of the weights and biases, thereby minimizing this difference. As more training data is fed through the network (each pass through the training dataset is called an epoch), the weights and bias values are gradually adjusted as the network learns. After some time, ideally, the output produced is considered good enough to end training.",
     "figures": [
      {
       "caption": "Figure 4: Computation performed by each neuron",
       "src": "assets/fig/syllabus_p36_R237.png",
       "alt": "Figure 4: Computation performed by each neuron — incoming connections from previous-layer neurons (each labelled \"weight\") into a neuron with its \"bias\", producing the \"activation value\" via the activation function (image extracted from syllabus PDF page 36)"
      }
     ],
     "questions": [
      {
       "q": "Q16",
       "pts": 1,
       "k": "K2",
       "answer": "a"
      }
     ],
     "srcLines": [
      781,
      795
     ],
     "minutes": 45,
     "minutesIsEstimate": true
    },
    {
     "id": "3.4.2",
     "title": "Hands-on Exercise: Experience the Implementation of a Perceptron",
     "lo": null,
     "ho": "HO-3.4.2",
     "kLevel": "H1",
     "loStatement": "Experience the implementation of a perceptron",
     "examinable": false,
     "handsOn": true,
     "body": "Students will be led through an exercise demonstrating a Perceptron learning a simple function, such as an AND function.\n\nThe exercise should cover how a Perceptron learns by modifying its weights and bias values across multiple epochs until the error is minimized to zero. Various mechanisms (e.g., spreadsheet, simulation) may be used for this activity.",
     "figures": [],
     "questions": [],
     "srcLines": [
      795,
      801
     ],
     "minutes": 5,
     "minutesIsEstimate": true
    },
    {
     "id": "3.4.3",
     "title": "Coverage Measures for Neural Networks",
     "lo": "AI-3.4.3",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Describe the different coverage measures for neural networks",
     "examinable": true,
     "handsOn": false,
     "body": "Neural network structural coverage metrics have emerged to assess how thoroughly test inputs exercise a model's internal mechanisms. As neural networks do not follow explicitly coded paths, but their behavior is dictated by learned weights, bias values, and activations, this creates a need for specialized coverage measures to evaluate the extent to which different parts of the network have been activated under test conditions.\n\nTypical approaches include [COV_REF]:\n\n- **Neuron Coverage:** Measures the proportion of neurons in the network where their output exceeds a specified threshold during testing.\n- **k-Multisection Neuron Coverage (kMNC):** The possible output range of each neuron is divided into k sections. kMNC is the proportion of these sections activated during testing.\n- **Neuron Boundary Coverage (NBC):** Measures the proportion of neurons in the network where their output either exceeds the maximum achieved in training, or is less than the minimum achieved in training during testing.\n\nThese coverage metrics can be helpful in AI testing, primarily by revealing areas of the model that remain untested, which may potentially hide defects or unlearned behaviors. For example, if certain neurons or layers never activate during testing, the model's performance in related decision boundaries might be questionable. Such insights help testers design additional test inputs or test conditions to exercise underexplored parts of the network. At present, commercial tools supporting these specific coverage measures are limited.\n\nHowever, structural coverage alone does not guarantee that a neural network will generalize well or handle real-world variations. Neural networks can learn spurious correlations, leading to correct activations for incorrect reasons. Consequently, testers should also use other test techniques, like adversarial testing and metamorphic testing, as described in chapters 5, 6 and 7.",
     "figures": [],
     "questions": [
      {
       "q": "A6",
       "pts": 1,
       "k": "K2",
       "answer": "c"
      }
     ],
     "srcLines": [
      801,
      815
     ],
     "minutes": 30,
     "minutesIsEstimate": true
    }
   ]
  }
 ],
 "cheatsheet": {
  "chapter": 3,
  "blocks": [
   {
    "type": "meta",
    "minutes": 375,
    "questionCount": 10,
    "points": 11
   },
   {
    "type": "keyTerms",
    "items": [
     {
      "term": "supervised learning",
      "def": "Algorithms train models using labeled data (each input set has a corresponding output label); divided into classification (assign inputs to predefined classes) and ML regression (predict continuous numerical values). Note: ML regression differs from 'regression' in other ISTQB syllabi (change-related defects).",
      "src": "3.1.1 L549-L554"
     },
     {
      "term": "unsupervised learning",
      "def": "Trains models on unlabeled data, inferring patterns or structures; categorized into clustering (grouping by similarities, e.g., customer segments) and association (identifying relationships/dependencies among attributes, e.g., purchasing patterns for recommendations).",
      "src": "3.1.1 L556-L559"
     },
     {
      "term": "reinforcement learning",
      "def": "An intelligent agent learns by interacting with its environment, receiving rewards or penalties based on action outcomes — learning from experience rather than a dataset. Challenges: setting up the environment, designing the reward function, selecting the best strategy.",
      "src": "3.1.1 L561"
     },
     {
      "term": "exploratory data analysis (EDA)",
      "def": "Carried out alongside data preparation to discover trends, patterns, and anomalies and to visualize data using plots and charts.",
      "src": "3.2.1 L683-L686"
     },
     {
      "term": "training / validation / test datasets",
      "def": "Training: used to train the model. Validation: used for evaluating and subsequently tuning the model. Test (holdout): used to test the tuned model — independent of training and validation.",
      "src": "3.2.3 L704-L708"
     },
     {
      "term": "k-fold cross-validation",
      "def": "For limited data: divide the combined training+validation pool into k folds (commonly 5 or 10, typically random, often stratified); train on k-1 folds, validate on the held-out fold, repeat k times; average the fold metrics, then train the final model on the whole pool and evaluate once on the hold-out test set.",
      "src": "3.2.3 L717-L721"
     },
     {
      "term": "pretrained model / fine-tuning",
      "def": "Fine-tuning adapts a pretrained neural network to a new task with much less training data/effort than building from scratch; tuning may apply to the entire network, specific layers (typically near the output end), or additional layers. Success depends on similarity between original and new tasks.",
      "src": "3.1.4 L645-L649"
     },
     {
      "term": "retrieval-augmented generation (RAG)",
      "def": "Provides task-specific data sources to the LLM: transformed into a searchable format, relevant documents are incorporated into an enhanced prompt — more precise responses with NO change to the pretrained model.",
      "src": "3.1.4 L651"
     },
     {
      "term": "activation value / epoch",
      "def": "Activation value: the output of an activation function of a neuron (computed from a weighted sum of previous-layer activations plus the neuron's bias). Epoch: an iteration of ML training on the whole training dataset.",
      "src": "3.4.1 L783 + glossary"
     },
     {
      "term": "hyperparameters (model vs algorithm)",
      "def": "Model hyperparameters define the model structure (e.g., number of neural-network layers, decision-tree depth); algorithm hyperparameters control the training (e.g., number of training iterations).",
      "src": "3.1.2 L595-L597"
     }
    ]
   },
   {
    "type": "mustKnow",
    "title": "Workflow, data, neural networks",
    "items": [
     {
      "text": "ML workflow activities (Figure 1 order): Understand the Objectives (agree purpose + acceptance criteria incl. ML functional performance metrics) → Select a Framework → Select & Build the Algorithm → Prepare & Test Data (acquisition, preprocessing, feature engineering + EDA; data must be representative of operational data) → Train → Evaluate (on validation dataset; several models/algorithms typically compared) → Tune (adjust model + algorithm hyperparameters, retrain) — Train/Evaluate/Tune = 'model generation' cycle → Test the Model (independent test dataset; significantly lower performance than evaluation → return to model generation or data prep) → Deploy (re-engineered with data pipeline; re-tested) → Use (batch or real-time) → Monitor & Tune. Failures often originate in earlier steps such as data preparation or model selection.",
      "src": "3.1.2 L567-L631 + 3.1 L543"
     },
     {
      "text": "Pretrained/RAG: fine-tuning needs task similarity (cat→dog breeds works; images→accents doesn't); a pretrained model can use RAG, fine-tuning, or both; biases or vulnerabilities in the pretrained model carry over to the new model — testing needed for the new task.",
      "src": "3.1.4 L649-L655"
     },
     {
      "text": "Data preparation = data acquisition (identify types, gather from databases/APIs/sensors, label for supervised) + preprocessing (clean: remove defects/duplicates/outliers, impute missing values mean/median/mode, anonymize; transform/scale/normalize; augment incl. adversarial examples and synthetic data; sample subsets) + feature engineering (select relevant, extract informative non-redundant features), with EDA in parallel. Iterative, often manual, reorderable. Operational data should match training-data characteristics (distributions, feature ranges).",
      "src": "3.2.1 L665-L688"
     },
     {
      "text": "Dataset splits: amounts depend on model complexity, algorithm, resources (RAM/disk/compute/time), desired confidence. Limited data → hold-out test set + k-fold cross-validation on the rest (average metrics = generalization estimate; final model trained on full pool, evaluated once on hold-out); leave-one-out (k = number of samples) and bootstrap are other resampling options; without any hold-out, cross-validation averages are optimistically biased.",
      "src": "3.2.3 L710-L723"
     },
     {
      "text": "Deep neural network: input layer (receives inputs) → hidden layers (neurons/nodes) → output layer (results to outside world); fully connected = each neuron connects to all neurons in the next layer. Each neuron computes a weighted sum of previous-layer activations plus its own bias, passed through a non-linear activation function (this bias is unrelated to 5.1.2's fairness bias). Weights/biases initialized to small random values (biases sometimes zero); error/loss fed back to adjust them; each pass through the training dataset = an epoch; training ends when output is good enough.",
      "src": "3.4.1 L779-L787"
     },
     {
      "text": "Neural network coverage: Neuron Coverage (proportion of neurons whose output exceeds a threshold during testing); k-Multisection Neuron Coverage kMNC (each neuron's output range divided into k sections; proportion of sections activated); Neuron Boundary Coverage NBC (proportion of neurons whose output exceeds the training maximum or falls below the training minimum). Value: reveals untested areas; limits: structural coverage alone doesn't guarantee generalization (spurious correlations → correct activations for wrong reasons) — combine with adversarial and metamorphic testing.",
      "src": "3.4.3 L805-L813"
     }
    ]
   },
   {
    "type": "formula",
    "items": [
     {
      "name": "Accuracy",
      "formula": "Accuracy = (TP + TN) / (TP + TN + FP + FN) * 100%",
      "note": "Percentage of all correct classifications.",
      "src": "3.3.1 L745-L747"
     },
     {
      "name": "Precision",
      "formula": "Precision = TP / (TP + FP) * 100%",
      "note": "Proportion of positives that were correctly predicted — how sure one can be about positive predictions.",
      "src": "3.3.1 L749-L751"
     },
     {
      "name": "Recall (sensitivity)",
      "formula": "Recall = TP / (TP + FN) * 100%",
      "note": "Proportion of actual positives correctly predicted — confidence that no positives will be missed.",
      "src": "3.3.1 L753-L755"
     },
     {
      "name": "F1-score",
      "formula": "F1-score = 2 * (Precision * Recall) / (Precision + Recall)",
      "note": "Harmonic mean of precision and recall, 0–100; close to 100 = both high (FP and FN minimal impact).",
      "src": "3.3.1 L757-L759"
     }
    ]
   },
   {
    "type": "table",
    "title": "Confusion matrix (Figure 2 layout)",
    "columns": [
     "Predicted \\ Actual",
     "Positive",
     "Negative"
    ],
    "rows": [
     [
      "Positive",
      "True Positive (TP)",
      "False Positive (FP)"
     ],
     [
      "Negative",
      "False Negative (FN)",
      "True Negative (TN)"
     ]
    ],
    "src": "3.3.1 L733-L739"
   },
   {
    "type": "traps",
    "items": [
     {
      "confusion": "Precision vs recall denominators",
      "text": "Precision divides by predicted positives (TP+FP) — 'how sure about positive predictions'; recall divides by actual positives (TP+FN) — 'no positives missed'. Both use TP as numerator; swapping denominators is the classic exam error.",
      "src": "3.3.1 L749-L755"
     },
     {
      "confusion": "Validation vs test dataset roles",
      "text": "Validation drives evaluation AND tuning (may be reused in iterations); test is the independent holdout used once on the tuned model to confirm criteria. Significantly lower test performance than evaluation signals overfitting-style trouble → return to model generation.",
      "src": "3.2.3 L707-L708 + 3.1.2 L611"
     },
     {
      "confusion": "Fine-tuning vs RAG",
      "text": "Fine-tuning changes the pretrained model via additional task-specific training (needs similarity between tasks); RAG leaves the model unchanged and injects relevant retrieved documents into an enhanced prompt.",
      "src": "3.1.4 L645-L653"
     },
     {
      "confusion": "Supervised vs reinforcement learning",
      "text": "Supervised learns from labeled datasets (input→label mapping); reinforcement learns from environment interaction via rewards/penalties — 'from experience rather than from a dataset'. Unsupervised finds structure in unlabeled data (clustering/association).",
      "src": "3.1.1 L549-L561"
     },
     {
      "confusion": "Neuron Coverage vs kMNC vs NBC",
      "text": "NC: neuron outputs above a threshold; kMNC: k sections per neuron's output range, proportion activated; NBC: outputs beyond the training-time maximum/minimum. NBC detects inputs outside training experience; kMNC grades activation granularity.",
      "src": "3.4.3 L807-L809"
     },
     {
      "confusion": "Model vs algorithm hyperparameters",
      "text": "Model = structure (layers, tree depth); algorithm = training controls (iteration count). Tuning (3.1.2) adjusts both.",
      "src": "3.1.2 L595-L597"
     }
    ]
   },
   {
    "type": "examPointers",
    "items": [
     {
      "lo": "AI-3.1.1",
      "kLevel": "K2",
      "loText": "Distinguish between the different forms of ML",
      "questions": [
       {
        "q": "Q10",
        "pts": 1
       },
       {
        "q": "A4",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-3.1.2",
      "kLevel": "K2",
      "loText": "Summarize the workflow used to create an ML system",
      "questions": [
       {
        "q": "Q11",
        "pts": 1
       },
       {
        "q": "A5",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-3.1.4",
      "kLevel": "K2",
      "loText": "Summarize the use of pretrained models, fine-tuning, and retrieval-augmented generation",
      "questions": [
       {
        "q": "Q12",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-3.2.1",
      "kLevel": "K2",
      "loText": "Explain the activities related to data preparation",
      "questions": [
       {
        "q": "Q13",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-3.2.3",
      "kLevel": "K2",
      "loText": "Contrast the use of training, validation, and test datasets in the development of an ML model",
      "questions": [
       {
        "q": "Q14",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-3.3.1",
      "kLevel": "K3",
      "loText": "Calculate common ML functional performance metrics from a given set of confusion matrix data",
      "questions": [
       {
        "q": "Q15",
        "pts": 2
       }
      ]
     },
     {
      "lo": "AI-3.4.1",
      "kLevel": "K2",
      "loText": "Explain the structure and working of a deep neural network",
      "questions": [
       {
        "q": "Q16",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-3.4.3",
      "kLevel": "K2",
      "loText": "Describe the different coverage measures for neural networks",
      "questions": [
       {
        "q": "A6",
        "pts": 1
       }
      ]
     }
    ]
   }
  ]
 }
};
