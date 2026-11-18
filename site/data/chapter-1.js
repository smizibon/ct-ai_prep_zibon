window.CTAI_DATA = window.CTAI_DATA || {};
window.CTAI_DATA.chapters = window.CTAI_DATA.chapters || {};
window.CTAI_DATA.chapters[1] = {
 "n": 1,
 "title": "Introduction to Artificial Intelligence",
 "minutes": 120,
 "keywords": {
  "general": [],
  "aiSpecific": [
   "AI-based system",
   "artificial intelligence",
   "general AI",
   "machine learning",
   "ML development framework",
   "narrow AI",
   "super AI"
  ]
 },
 "sections": [
  {
   "id": "1.1",
   "title": "Introduction to AI",
   "intro": [
    "This chapter introduces key distinctions between conventional and AI-based systems, focusing on their design approaches, adaptability, and explainability. It describes the spectrum of AI capabilities, ranging from narrow AI to general AI and super AI, and outlines core technologies such as ML, deep learning, and GenAI. The chapter describes common hardware and development environments for AI-based systems, as well as popular ML frameworks. Finally, it considers essential regulatory and technical standards that guide responsible AI development and deployment within various domains."
   ],
   "subsections": [
    {
     "id": "1.1.1",
     "title": "AI-Based and Conventional Systems",
     "lo": "AI-1.1.1",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Differentiate between AI-based systems and conventional systems",
     "examinable": true,
     "handsOn": false,
     "body": "Conventional computer systems are typically programmed using imperative languages, where human developers explicitly define step-by-step instructions, including constructs such as if-then-else statements and loops. This deterministic approach helps make the system's behavior predictable and transparent, making it easier for humans to understand how inputs produce different outputs. In contrast, most AI-based systems, particularly those leveraging ML, do not follow predefined rules. Instead, they analyze patterns in the data to determine how to respond to new inputs. For example, an AI-based image recognition system trained to identify cats does not rely on explicitly coded rules. Instead, it learns from a dataset of cat images, extracting patterns that it later applies to unseen images to classify them accurately.\n\nOne fundamental difference between conventional and AI-based systems is how they approach problem-solving. Many AI-based systems rely on probabilistic reasoning, statistical inference, and pattern recognition to generate results. This allows AI models to handle complex forms of uncertainty and ambiguity more effectively, resulting in outputs that are not always predictable.\n\nA key challenge in AI-based systems is explainability. Many AI models, particularly deep learning architectures, can contain billions of parameters, making their internal workings difficult for humans to interpret. This \"black-box\" nature raises concerns in critical domains such as healthcare, finance, defence, and transportation, where understanding why an AI model made a particular decision is crucial. Achieving transparency (see 2.1.1) and explainability in AI-driven decision-making has become a critical focus in AI regulation.\n\nAnother significant distinction is adaptability. Conventional systems are static and typically require manual updates to incorporate new knowledge or respond to environmental changes. AI-based systems, in contrast, can be self-learning, continuously improving their performance as they encounter new data. This adaptability makes AI particularly powerful in dynamic environments. Adaptability also requires continuous monitoring to maintain ongoing alignment with core requirements.",
     "figures": [],
     "questions": [
      {
       "q": "Q1",
       "pts": 1,
       "k": "K2",
       "answer": "a"
      }
     ],
     "srcLines": [
      304,
      314
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    },
    {
     "id": "1.1.2",
     "title": "Narrow AI, General AI, and Super AI",
     "lo": "AI-1.1.2",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Distinguish between narrow AI, general AI, and super AI",
     "examinable": true,
     "handsOn": false,
     "body": "Narrow AI, also known as weak AI, is designed to perform specific tasks and represents all deployed AI systems in use today. Narrow AI-based systems operate within a limited domain and can be highly efficient at solving specialized problems, such as image recognition, speech processing, and language translation. However, they lack the ability to generalize beyond the functions they have learned. For instance, an AI-based system that excels at recognizing faces cannot perform language translation unless it is explicitly retrained to do so. Frontier AI, a subset of narrow AI, represents the most advanced form of these systems, pushing the boundaries of current capabilities with GenAI models. Frontier AI includes large-scale systems with highly autonomous decision-making capabilities; however, they remain task-specific and have not yet achieved the versatility of general AI.\n\nGeneral AI, also known as strong AI, refers to an AI-based system that possesses the ability to perform most intellectual tasks that a human can. General AI would be able to understand, learn, and apply knowledge across a broad range of tasks without needing to be retrained for each new task. This type of AI would exhibit human-like reasoning and adaptability, capable of solving unfamiliar problems in various domains, much like humans do. Despite significant progress in AI, no AI-based system today possesses general intelligence.\n\nSuper AI (artificial superintelligence) is the form of AI in which an AI-based system continuously improves itself without the need for human intervention or control. For Super AI to be possible, access to the Internet is not strictly required, but such access could significantly expand its capabilities and influence. It would surpass human intelligence and general AI, which many believe would pose an existential risk to humanity. The point at which AI-based systems transition from general AI to super AI, if it were to occur, is commonly known as the technological singularity.",
     "figures": [],
     "questions": [
      {
       "q": "Q2",
       "pts": 1,
       "k": "K2",
       "answer": "c, e"
      },
      {
       "q": "A1",
       "pts": 1,
       "k": "K2",
       "answer": "New question type"
      }
     ],
     "srcLines": [
      314,
      322
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    },
    {
     "id": "1.1.3",
     "title": "Different Types of AI Technologies",
     "lo": "AI-1.1.3",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain the different types of AI technologies",
     "examinable": true,
     "handsOn": false,
     "body": "Artificial Intelligence encompasses a range of technologies, each suited to specific tasks and challenges. One of the core branches of AI is ML, which enables systems to learn from data and build models without explicit programming. While some MLS can adapt and improve continuously with new data throughout their lifetimes, others operate on the knowledge they initially learned and require explicit retraining to update their capabilities. ML includes several approaches:\n\n- Supervised learning utilizes labeled data and algorithms, such as linear regression and decision trees, for tasks like prediction and classification.\n- Unsupervised learning uncovers patterns in unlabeled data through techniques like clustering (using clustering algorithms).\n- Reinforcement learning enables intelligent agents to learn optimal behaviors through trial-and-error interactions with their environment.\n\nKey ML technologies include neural networks, Bayesian models, support vector machines (SVM) and random forests. See Chapter 3 for more on ML.\n\nDeep Learning (DL), a subset of ML methods, uses deep neural networks to solve complex problems. For example:\n\n- Convolutional neural networks (CNN) are highly effective for image recognition and object detection.\n- Recurrent neural networks (RNN) specialize in processing sequential data, such as text or time series.\n- Transformers handle long-range dependencies in sequences, powering models for natural language processing and vision transformers for images.\n\nGenAI builds on these technologies to create new content, including text, images, and audio (see 1.1.4). This is driven by models such as LLM, which combine deep neural networks (DNN) with natural language processing (NLP) to analyze and generate human-like language.\n\nOther specialized AI technologies include:\n\n- NLP for language analysis, including tasks like sentiment analysis and machine translation.\n- Computer vision for analyzing visual data, supporting applications like facial recognition and robotics.\n- Fuzzy logic for reasoning under uncertainty.\n- Search algorithms for solving optimization problems, such as navigation, and strategic decision-making.\n- Rule-based reasoning systems, or expert systems, for structured decision support.\n\nAlthough the full integration of these AI technologies remains limited, new developments such as LLM demonstrate the potential to combine different AI technologies into unified, intelligent systems. Agentic AI extends these technologies through autonomous agents that plan, reason, and act independently to achieve goals in dynamic environments.",
     "figures": [],
     "questions": [
      {
       "q": "Q3",
       "pts": 1,
       "k": "K2",
       "answer": "a"
      }
     ],
     "srcLines": [
      322,
      350
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    },
    {
     "id": "1.1.4",
     "title": "Generative AI",
     "lo": "AI-1.1.4",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain generative AI",
     "examinable": true,
     "handsOn": false,
     "body": "Generative AI (GenAI) refers to AI-based systems specialized in creating new content, such as text, images, video, music, or complex data, while many also support classification and prediction. These systems learn from vast amounts of data to produce outputs that resemble their training data, enabling a wide range of creative and practical applications.\n\nThe main technologies behind GenAI include generative adversarial networks (GANs), diffusion models, and transformers. GANs use two neural networks in competition to create highly realistic synthetic data. Diffusion models generate content by gradually adding and then removing noise from data, resulting in high-quality outputs. Transformer models, which underpin LLM, utilize self-attention mechanisms to generate coherent and contextually relevant text, and are increasingly being adapted for multimodal tasks.\n\nBeyond their technical foundations, GenAI systems raise significant societal and ethical concerns. Misuse is a major concern: these models can be exploited to create deepfakes, spread misinformation, or generate convincing fraudulent content, thereby undermining trust in digital media and public discourse. The ease of producing synthetic content amplifies risks related to privacy, security, and manipulation, but it can bring notable benefits and opens opportunities for innovation in entertainment, marketing, education, and research.\n\nThe impact on employment is also notable, particularly among white-collar professions. As GenAI automates tasks such as writing, design, coding, and even legal or medical documentation, there is increasing debate about potential job displacement. While these technologies can boost productivity and foster new creative opportunities, they may also lead to workforce disruption and necessitate widespread reskilling.\n\nSustainability is another pressing issue. Training and running large GenAI models involve substantial computational resources, resulting in high energy consumption and a significant carbon footprint. This environmental impact has prompted calls for more efficient model designs and greener infrastructure.\n\nMost practical GenAI tools today are based on foundation models, which are then fine-tuned for specific applications. The field is also advancing toward multimodal models capable of processing and generating content across text, images, and audio, enabling richer, more flexible AI-based systems. Regulatory frameworks, such as the EU AI Act [EU AI Act], are emerging to guide the responsible development and use of these technologies.",
     "figures": [],
     "questions": [
      {
       "q": "Q4",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      350,
      364
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    },
    {
     "id": "1.1.5",
     "title": "Hardware for Machine Learning Systems",
     "lo": "AI-1.1.5",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Compare the choices available for hardware to implement machine learning systems",
     "examinable": true,
     "handsOn": false,
     "body": "A variety of hardware is used for MLS. Different types of hardware may be used for training and inference. For example, a speech recognition model may run on a low-end smartphone, although access to the power of cloud computing may be needed to train it.\n\nML typically benefits from hardware that supports the following:\n\n- The ability to work with large data structures.\n- Massively parallel (concurrent) processing, for example, to support matrix multiplication.\n- Low-precision arithmetic (quantization): This approach uses fewer bits for computation (e.g., 4 bits instead of 32 bits), resulting in faster processing, lower power consumption, smaller and more cost-effective chips, and reduced bandwidth requirements.\n\nGeneral-purpose central processing units (CPU) provide support for complex operations with high precision that are not typically required for ML applications, but they typically provide only a few cores. As a result, their architecture is less efficient for training and running ML models compared to graphics processing units (GPU), which have thousands of cores and are designed to perform massively parallel, yet relatively simple, graphics processing. Consequently, GPUs typically outperform CPUs in ML applications, even though CPUs usually run at higher clock speeds. For small-scale ML work, GPUs generally offer the best option.\n\nSome hardware is specifically designed for AI, such as purpose-built Application-Specific Integrated Circuits (ASIC) and System-on-a-Chip devices. These AI-specific solutions feature multiple cores, specialized data management, and the capability to perform in-memory processing. They are best suited for edge computing, while the training of the ML model is performed in the cloud using specialized hardware.\n\nAI-specific hardware architectures continue to be developed. This includes neuromorphic processors, which do not use the traditional von Neumann architecture but rather brain-inspired designs mimicking neuronal structures.",
     "figures": [],
     "questions": [
      {
       "q": "Q5",
       "pts": 1,
       "k": "K2",
       "answer": "a"
      }
     ],
     "srcLines": [
      364,
      380
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    },
    {
     "id": "1.1.6",
     "title": "Development and Hosting of AI Models",
     "lo": "AI-1.1.6",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Compare the options for the development and hosting of AI models",
     "examinable": true,
     "handsOn": false,
     "body": "AI-based systems can be acquired from third-party vendors or developed privately within an organization. AI-based systems typically rely on pretrained models and can be deployed on-premises or in the cloud, with the models themselves hosted either on-premises or in the cloud, where cloud-based options are often accessed as a service (AIaaS). Third-party AI-based systems typically come as pretrained models or AI as a Service (AIaaS), enabling faster deployment and quicker time-to-market. Alternatively, private AI-based systems (on-premises or customized cloud setups) can be better tailored to specific requirements, but their development will likely require specialized skills, either through in-house experts or outsourced teams.\n\nLocal development (coding and training locally) enables direct control and privacy. Small models, such as decision trees or compact neural networks, can be developed on personal computers, while mid-sized models may require dedicated GPUs. For large-scale models, high-performance on-premises server clusters become necessary with their associated energy, cooling, and hardware costs.\n\nCloud development offers significant flexibility. Public clouds, in particular, provide pre-configured environments with pay-as-you-go pricing, which limits initial hardware investment and scales easily. In contrast, private clouds can provide enhanced security and privacy for applications that require it, but this control necessitates a greater upfront infrastructure investment.\n\nMany organizations adopt hybrid approaches, including developing prototypes locally before scaling to cloud infrastructure, maintaining sensitive components on-premises, such as the preparation of private data, and leveraging cloud resources for compute-intensive tasks.\n\nAI models can be hosted in various environments, ranging from local setups to cloud-based platforms. Local hosting involves running smaller models on personal computers or smartphones, offering privacy and eliminating cloud licensing costs, although this provides limited hardware capabilities. For larger AI models, organizations may establish dedicated servers, which require a significant upfront investment but provide enhanced control.\n\nCloud hosting of AI models can be on public or private clouds. Public cloud services provide scalable access to robust, powerful infrastructure, eliminating maintenance concerns and making them ideal for fluctuating workloads. Private clouds offer similar benefits, with enhanced security and customization options, and are either managed in-house or through dedicated providers, albeit at a higher cost.\n\nHybrid approaches combine these methods, allowing organizations to run some operations locally while leveraging cloud elasticity for intensive tasks.\n\nThe optimal development and hosting solutions, which are typically decided upon separately, depend on factors such as model size, complexity, performance requirements, budget constraints, security and data privacy considerations, deployment needs and regulatory requirements. Some organizations adopt multi-tiered strategies to balance efficiency and control.",
     "figures": [],
     "questions": [
      {
       "q": "Q6",
       "pts": 1,
       "k": "K2",
       "answer": "b"
      }
     ],
     "srcLines": [
      380,
      398
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    },
    {
     "id": "1.1.7",
     "title": "Machine Learning Development Frameworks",
     "lo": "AI-1.1.7",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Summarize the functionality provided by ML development frameworks",
     "examinable": true,
     "handsOn": false,
     "body": "ML development frameworks provide a toolkit for building and training ML models. Typical functionality provided by these frameworks includes:\n\n- **Data Handling:** They assist with loading, preprocessing, and managing the data used to train and test the model. This might involve cleaning, formatting, and transforming the data into a suitable format for the chosen model.\n- **Model Building:** These frameworks offer libraries of ML algorithms and tools to design the architecture of the constructed ML model. This includes specifying the type of model (e.g., neural network, decision tree), the number of layers and connections, and the mathematical operations performed within the model.\n- **Training and Optimization:** Frameworks provide algorithms that iteratively adjust the model's internal parameters based on the training data and on the desired result. The goal is to optimize the model's performance in accomplishing the desired task (e.g., classification, ML regression). Some frameworks may support distributed training and enhance or fine-tune pretrained models.\n- **Evaluation:** They offer tools to evaluate how well the trained model performs on unseen data. This might involve measuring accuracy, precision, and recall for classification tasks, or error rates for ML regression tasks (see 3.1.1).\n- **Deployment:** Some frameworks provide capabilities for deploying the trained model for real-world use. This could involve converting the model into a format suitable for integration with web applications, mobile devices, edge devices or embedded systems.\n\nThese frameworks can operate at different levels of abstraction. Some offer a lower-level application programming interface (API), providing developers with more control over model building but requiring more coding expertise. Others offer a higher-level API, simplifying model creation but offering fewer customization options.\n\nDifferent frameworks can focus on different application domains. Some are general purpose and support a wide range of application areas. In contrast, others are more specialized, focusing on specific areas such as image recognition, speech recognition, and language translation.\n\nSelecting the most appropriate framework can depend on several factors, such as:\n\n- the application area;\n- the need for a user-friendly interface for rapid prototyping;\n- configurability for complex models;\n- the expertise of the users;\n- deployment considerations, as some frameworks are better suited for resource-constrained environments;\n- level of (community) support;\n- ecosystem maturity.",
     "figures": [],
     "questions": [
      {
       "q": "A2",
       "pts": 1,
       "k": "K2",
       "answer": "a"
      }
     ],
     "srcLines": [
      398,
      422
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    },
    {
     "id": "1.1.8",
     "title": "Regulations and Standards for AI",
     "lo": "AI-1.1.8",
     "ho": null,
     "kLevel": "K2",
     "loStatement": "Explain how regulations and standards affect the development and testing of AI-based systems",
     "examinable": true,
     "handsOn": false,
     "body": "AI regulations and standards are crucial for the responsible development, deployment, and use of AI. The core aim is to foster trust in AI and help promote realization of AI's benefits while mitigating potential harms. Ideally, compliance with such regulations and standards should guarantee that AI-based systems are safe, fair, transparent, sustainable, accountable, ethical, and used responsibly.\n\nInternationally, the OECD AI Principles [OECD AI] and the UN report on Governing AI for Humanity [UN Gov AI] serve as influential soft law instruments that foster a shared understanding of responsible AI stewardship. They act as a compass for national governments and organizations as they formulate their own AI strategies. These principles emphasize human-centric AI, ethical considerations, and the importance of international cooperation.\n\nThe EU AI Act represents a landmark regulatory step, demonstrating a risk-based approach to regulating AI. By categorizing AI-based systems by risk, from minimal to unacceptable, regulations are tailored accordingly. High-risk systems, particularly those that impact fundamental rights or safety, face stringent requirements that encompass rigorous testing, data governance, and human oversight. The substantial financial penalties for non-compliance, based on a percentage of global turnover, underscore the EU's commitment to enforcement. In contrast, many nations outside the EU are adopting a more permissive approach, favoring lighter-touch regulations to encourage innovation.\n\nTechnical standards, developed by organizations such as ISO and IEEE, are crucial for translating high-level aspirations into practical implementations. They provide concrete technical specifications and best practices, bridging the gap between policy and practice. For example, ISO/IEC TR 29119-11 provides detailed guidance on testing AI-based systems, a critical element in demonstrating regulatory compliance. Meanwhile, the ISO/IEC 42119 series is being developed to cover various aspects of AI-based system testing. Furthermore, sector-specific regulations are emerging in areas such as healthcare and finance, recognizing the unique risks posed by AI in these domains.\n\nTo effectively navigate this evolving landscape of AI governance, continuous dialogue and collaboration are paramount. Governments, industry, academia, and civil society must actively engage to achieve a harmonized and effective approach to AI governance worldwide. Moreover, given the dynamic nature of AI, regulations and standards must be regularly reviewed and updated to remain relevant and effective in guiding responsible AI development, deployment, and use.",
     "figures": [],
     "questions": [
      {
       "q": "A3",
       "pts": 1,
       "k": "K2",
       "answer": "c"
      }
     ],
     "srcLines": [
      422,
      434
     ],
     "minutes": 15,
     "minutesIsEstimate": true
    }
   ]
  }
 ],
 "cheatsheet": {
  "chapter": 1,
  "blocks": [
   {
    "type": "meta",
    "minutes": 120,
    "questionCount": 9,
    "points": 9
   },
   {
    "type": "keyTerms",
    "items": [
     {
      "term": "AI-based system",
      "def": "A system that incorporates one or more AI components.",
      "src": "glossary"
     },
     {
      "term": "artificial intelligence",
      "def": "The capability of an engineered system to acquire, process, create and apply knowledge and skills.",
      "src": "glossary"
     },
     {
      "term": "narrow AI (weak AI)",
      "def": "AI focused on a single well-defined task to address a specific problem. Represents all deployed AI systems in use today; lacks the ability to generalize beyond learned functions.",
      "src": "1.1.2 L316"
     },
     {
      "term": "general AI (strong AI)",
      "def": "A type of AI that can match human cognitive abilities across most intellectual tasks. Would understand, learn, and apply knowledge across a broad range of tasks without retraining; no AI-based system today possesses general intelligence.",
      "src": "1.1.2 L318"
     },
     {
      "term": "super AI",
      "def": "A type of AI that far exceeds human capabilities; an AI-based system that continuously improves itself without human intervention or control. The transition point from general AI to super AI is known as the technological singularity.",
      "src": "1.1.2 L320"
     },
     {
      "term": "frontier AI",
      "def": "A subset of narrow AI representing the most advanced systems (e.g., GenAI models with highly autonomous decision-making); remains task-specific, without general AI's versatility.",
      "src": "1.1.2 L316"
     },
     {
      "term": "machine learning",
      "def": "A core branch of AI which enables systems to learn from data and build models without explicit programming. Approaches: supervised (labeled data), unsupervised (unlabeled data, e.g., clustering), reinforcement (trial-and-error with environment).",
      "src": "1.1.3 L324-L328"
     },
     {
      "term": "generative AI",
      "def": "A type of AI that creates new content by learning patterns from existing data (text, images, video, music, complex data); main technologies: GANs, diffusion models, transformers.",
      "src": "1.1.4 L352-L354"
     },
     {
      "term": "ML development framework",
      "def": "A software platform that provides tools and libraries to build, train, and deploy ML models.",
      "src": "glossary"
     }
    ]
   },
   {
    "type": "mustKnow",
    "title": "Conventional vs AI-based systems & the technology stack",
    "items": [
     {
      "text": "Conventional systems: imperative programming, explicit step-by-step rules, deterministic, predictable, transparent; static — manual updates for new knowledge. AI-based systems: learn patterns from data, probabilistic reasoning/statistical inference/pattern recognition, outputs not always predictable, can be self-learning (adaptability requires continuous monitoring), and often hard to explain (\"black-box\" with billions of parameters).",
      "src": "1.1.1 L306-L312"
     },
     {
      "text": "AI technology stack: ML (supervised / unsupervised / reinforcement; key technologies include neural networks, Bayesian models, SVM, random forests) → Deep Learning, a subset of ML (CNN for images, RNN for sequences, transformers for long-range dependencies) → GenAI builds on these to create new content (LLM = DNN + NLP). Others: NLP, computer vision, fuzzy logic, search algorithms, expert systems; agentic AI extends these via autonomous agents that plan, reason, and act independently.",
      "src": "1.1.3 L324-L348"
     },
     {
      "text": "GenAI societal concerns: misuse (deepfakes, misinformation, fraud), employment impact (white-collar automation, reskilling), sustainability (high energy consumption and carbon footprint of training/running large models); most practical tools build on foundation models fine-tuned for specific applications, with multimodal models advancing.",
      "src": "1.1.4 L356-L362"
     },
     {
      "text": "ML hardware needs: large data structures, massively parallel processing (e.g., matrix multiplication), low-precision arithmetic/quantization (e.g., 4 instead of 32 bits → faster, lower power, smaller chips, less bandwidth). CPUs: few cores, high precision, less efficient for ML; GPUs: thousands of cores, massively parallel simple operations — best for small-scale ML; ASIC/SoC: AI-specific, in-memory processing, best for edge computing (training stays in the cloud); neuromorphic processors use brain-inspired non-von-Neumann designs.",
      "src": "1.1.5 L368-L378"
     },
     {
      "text": "Development & hosting options (decided separately): third-party pretrained models / AIaaS = faster deployment and time-to-market; private development = tailored but needs specialized skills. Local development = control and privacy (small models on PCs, large models need server clusters); public cloud = pre-configured, pay-as-you-go, scalable; private cloud = enhanced security/privacy at higher upfront cost; hybrid = prototype locally, keep sensitive data on-premises, burst compute to cloud.",
      "src": "1.1.6 L382-L396"
     },
     {
      "text": "ML framework functionality: data handling (load/preprocess/manage), model building (algorithm libraries, architecture design), training and optimization (incl. distributed training, fine-tuning pretrained models), evaluation (accuracy/precision/recall for classification, error rates for regression), deployment (conversion for web/mobile/edge/embedded). Abstraction level (low-level API = more control + more coding; high-level = simpler, fewer options) and domain focus (general vs specialized) differ; selection factors include application area, prototyping needs, configurability, user expertise, deployment constraints, support, ecosystem maturity.",
      "src": "1.1.7 L400-L420"
     },
     {
      "text": "Regulations & standards: OECD AI Principles and the UN Governing AI report = soft law; EU AI Act = risk-based regulation (minimal → unacceptable; high-risk systems face rigorous testing, data governance, human oversight; penalties based on percentage of global turnover); technical standards: ISO/IEC TR 29119-11 (testing AI-based systems), ISO/IEC 42119 series in development.",
      "src": "1.1.8 L424-L430"
     }
    ]
   },
   {
    "type": "traps",
    "items": [
     {
      "confusion": "Narrow vs general vs super AI",
      "text": "Narrow = task-specific, ALL deployed AI today (even frontier GenAI); general = human-level across most intellectual tasks, does not exist yet; super = surpasses humans, self-improving without human intervention. Frontier AI is a subset of narrow AI, not a step toward general AI in the syllabus's classification.",
      "src": "1.1.2 L316-L320"
     },
     {
      "confusion": "AI ⊃ ML ⊃ DL, GenAI builds on them",
      "text": "ML is a branch of AI; DL is a subset of ML using deep neural networks; GenAI builds on these technologies (GANs, diffusion models, transformers) to create new content — GenAI is not a separate sibling of ML.",
      "src": "1.1.3 L324-L338"
     },
     {
      "confusion": "GPUs vs CPUs vs ASICs for ML",
      "text": "GPUs outperform CPUs for ML despite lower clock speeds (thousands of parallel cores vs a few); CPUs offer high precision ML rarely needs; ASICs/SoCs are best at the edge with in-memory processing, while training runs in the cloud.",
      "src": "1.1.5 L374-L376"
     },
     {
      "confusion": "GANs vs diffusion models vs transformers",
      "text": "GANs: two neural networks in competition → realistic synthetic data; diffusion models: add then remove noise → high-quality outputs; transformers: self-attention → coherent, contextually relevant text (underpin LLMs), increasingly multimodal.",
      "src": "1.1.4 L354"
     },
     {
      "confusion": "AIaaS speed vs private control",
      "text": "Third-party/AIaaS: faster deployment, quicker time-to-market; private/on-premises: better tailored to specific requirements but requires specialized skills — classic trade-off wording in exam options.",
      "src": "1.1.6 L382"
     }
    ]
   },
   {
    "type": "examPointers",
    "items": [
     {
      "lo": "AI-1.1.1",
      "kLevel": "K2",
      "loText": "Differentiate between AI-based systems and conventional systems",
      "questions": [
       {
        "q": "Q1",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-1.1.2",
      "kLevel": "K2",
      "loText": "Distinguish between narrow AI, general AI, and super AI",
      "questions": [
       {
        "q": "Q2",
        "pts": 1
       },
       {
        "q": "A1",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-1.1.3",
      "kLevel": "K2",
      "loText": "Explain the different types of AI technologies",
      "questions": [
       {
        "q": "Q3",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-1.1.4",
      "kLevel": "K2",
      "loText": "Explain generative AI",
      "questions": [
       {
        "q": "Q4",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-1.1.5",
      "kLevel": "K2",
      "loText": "Compare the choices available for hardware to implement machine learning systems",
      "questions": [
       {
        "q": "Q5",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-1.1.6",
      "kLevel": "K2",
      "loText": "Compare the options for the development and hosting of AI models",
      "questions": [
       {
        "q": "Q6",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-1.1.7",
      "kLevel": "K2",
      "loText": "Summarize the functionality provided by ML development frameworks",
      "questions": [
       {
        "q": "A2",
        "pts": 1
       }
      ]
     },
     {
      "lo": "AI-1.1.8",
      "kLevel": "K2",
      "loText": "Explain how regulations and standards affect the development and testing of AI-based systems",
      "questions": [
       {
        "q": "A3",
        "pts": 1
       }
      ]
     }
    ]
   }
  ]
 }
};
