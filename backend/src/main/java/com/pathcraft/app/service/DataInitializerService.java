package com.pathcraft.app.service;

import com.pathcraft.app.model.CourseResource;
import com.pathcraft.app.model.SkillNode;
import com.pathcraft.app.repository.CourseResourceRepository;
import com.pathcraft.app.repository.SkillNodeRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataInitializerService {

    private final SkillNodeRepository skillNodeRepository;
    private final CourseResourceRepository courseResourceRepository;

    @PostConstruct
    public void initData() {
        if (skillNodeRepository.count() > 0) {
            return;
        }

        // ==================== 1. SKILL NODES (DSA, ML, FULLSTACK, DEVOPS) ====================
        SkillNode dsaFoundations = SkillNode.builder()
                .id("dsa_foundations")
                .name("Data Structures & Algorithms Foundations")
                .category("DSA_SHEET")
                .description("Arrays, Strings, Two Pointers, Sliding Window, Linked Lists, Stack & Queues")
                .level(1)
                .prerequisites(List.of())
                .build();

        SkillNode dsaAdvanced = SkillNode.builder()
                .id("dsa_advanced")
                .name("Advanced Algorithms (Trees, Graphs, DP & Greedy)")
                .category("DSA_SHEET")
                .description("Binary Trees, BST, Graphs (BFS/DFS, Dijkstra), Dynamic Programming & Tries")
                .level(2)
                .prerequisites(List.of("dsa_foundations"))
                .build();

        SkillNode pyBasics = SkillNode.builder()
                .id("py_basics")
                .name("Python Programming Basics")
                .category("DATA_SCIENCE")
                .description("Control structures, OOP, function definitions, modules in Python 3")
                .level(1)
                .prerequisites(List.of())
                .build();

        SkillNode mathStats = SkillNode.builder()
                .id("math_stats")
                .name("Mathematics & Probability for ML")
                .category("DATA_SCIENCE")
                .description("Linear algebra, matrix operations, calculus, statistics and hypothesis testing")
                .level(1)
                .prerequisites(List.of())
                .build();

        SkillNode dataAnalysis = SkillNode.builder()
                .id("data_analysis")
                .name("Data Manipulation & Analysis (Pandas & NumPy)")
                .category("DATA_SCIENCE")
                .description("Data cleaning, feature engineering, data frames, plotting with Matplotlib/Seaborn")
                .level(2)
                .prerequisites(List.of("py_basics", "math_stats"))
                .build();

        SkillNode mlFund = SkillNode.builder()
                .id("ml_fund")
                .name("Supervised & Unsupervised Machine Learning")
                .category("AI_ML")
                .description("Regression, classification, clustering, evaluation metrics, SciKit-Learn algorithms")
                .level(2)
                .prerequisites(List.of("data_analysis", "math_stats"))
                .build();

        SkillNode deepLearn = SkillNode.builder()
                .id("deep_learn")
                .name("Deep Learning & Neural Networks (PyTorch/TensorFlow)")
                .category("AI_ML")
                .description("Multi-layer perceptrons, backpropagation, CNNs, Transformers, Optimization")
                .level(3)
                .prerequisites(List.of("ml_fund"))
                .build();

        SkillNode nlpLlm = SkillNode.builder()
                .id("nlp_llm")
                .name("Natural Language Processing & LLM Engineering")
                .category("AI_ML")
                .description("Tokenization, RAG architectures, Vector DBs, LangChain/LlamaIndex, Fine-tuning")
                .level(4)
                .prerequisites(List.of("deep_learn"))
                .build();

        SkillNode dsCapstone = SkillNode.builder()
                .id("ds_capstone")
                .name("Production ML & MLOps Capstone Project")
                .category("AI_ML")
                .description("Deploying ML models with FastAPI, Docker, model monitoring, MLflow & CI/CD")
                .level(4)
                .prerequisites(List.of("nlp_llm"))
                .build();

        SkillNode webFoundations = SkillNode.builder()
                .id("web_foundations")
                .name("HTML5, CSS3 & JavaScript Essentials")
                .category("WEB_DEV")
                .description("DOM manipulation, ES6+ JavaScript async/await, responsive layout flexbox/grid")
                .level(1)
                .prerequisites(List.of())
                .build();

        SkillNode reactJs = SkillNode.builder()
                .id("react_js")
                .name("Frontend Engineering with React & Tailwind")
                .category("WEB_DEV")
                .description("Component state, hooks, context API, router, REST consumption & Tailwind CSS")
                .level(2)
                .prerequisites(List.of("web_foundations"))
                .build();

        SkillNode springBootBackend = SkillNode.builder()
                .id("spring_boot")
                .name("Backend Architecture with Java & Spring Boot")
                .category("WEB_DEV")
                .description("REST API design, Spring Data JPA, H2/PostgreSQL, security, dependency injection")
                .level(2)
                .prerequisites(List.of("web_foundations"))
                .build();

        SkillNode fullstackCapstone = SkillNode.builder()
                .id("fullstack_capstone")
                .name("Enterprise Full-Stack SaaS Capstone")
                .category("WEB_DEV")
                .description("End-to-end scalable web app deployment with authentication, CI/CD and cloud hosting")
                .level(4)
                .prerequisites(List.of("spring_boot", "react_js"))
                .build();

        skillNodeRepository.saveAll(Arrays.asList(
                dsaFoundations, dsaAdvanced, pyBasics, mathStats, dataAnalysis, mlFund, deepLearn, nlpLlm, dsCapstone,
                webFoundations, reactJs, springBootBackend, fullstackCapstone
        ));

        // ==================== 2. FAMOUS REAL-WORLD COURSES & DSA SHEETS ====================
        List<CourseResource> catalog = List.of(
                // Striver's A2Z DSA Sheet
                CourseResource.builder()
                        .id("res_striver_a2z")
                        .title("Striver's A2Z DSA Course & Sheet (takeUforward)")
                        .provider("Striver (takeUforward)")
                        .url("https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/")
                        .type("DSA_SHEET")
                        .format("HANDS_ON")
                        .difficulty("BEGINNER_TO_ADVANCED")
                        .durationHours(60.0)
                        .rating(4.98)
                        .skillNodeId("dsa_foundations")
                        .description("The most popular 455+ DSA problem sheet with video solutions, code templates, and topic-wise breakdown.")
                        .costType("FREE")
                        .build(),

                CourseResource.builder()
                        .id("res_striver_sde")
                        .title("Striver's SDE Sheet (Top 180 Coding Interview Questions)")
                        .provider("Striver (takeUforward)")
                        .url("https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/")
                        .type("DSA_SHEET")
                        .format("HANDS_ON")
                        .difficulty("ADVANCED")
                        .durationHours(40.0)
                        .rating(4.96)
                        .skillNodeId("dsa_advanced")
                        .description("Handpicked 180 questions asked in MAANG/FAANG interviews with C++, Java, and Python code.")
                        .costType("FREE")
                        .build(),

                // NeetCode 150
                CourseResource.builder()
                        .id("res_neetcode_150")
                        .title("NeetCode 150 Practice Roadmap")
                        .provider("NeetCode.io")
                        .url("https://neetcode.io/practice")
                        .type("DSA_SHEET")
                        .format("INTERACTIVE")
                        .difficulty("INTERMEDIATE")
                        .durationHours(35.0)
                        .rating(4.95)
                        .skillNodeId("dsa_foundations")
                        .description("Curated list of 150 essential LeetCode problems categorized by pattern with interactive visualizer.")
                        .costType("FREE")
                        .build(),

                // Love Babbar 450
                CourseResource.builder()
                        .id("res_love_babbar")
                        .title("Love Babbar 450 DSA Cracker Sheet")
                        .provider("CodeHelp / Love Babbar")
                        .url("https://beastcoding.in/love-babbar-dsa-sheet")
                        .type("DSA_SHEET")
                        .format("HANDS_ON")
                        .difficulty("INTERMEDIATE")
                        .durationHours(50.0)
                        .rating(4.9)
                        .skillNodeId("dsa_advanced")
                        .description("450 coding questions across Arrays, Matrices, Strings, Search/Sort, Trees, Graphs & Dynamic Programming.")
                        .costType("FREE")
                        .build(),

                // Andrew Ng Machine Learning
                CourseResource.builder()
                        .id("res_ml_andrew_ng")
                        .title("Machine Learning Specialization by Andrew Ng")
                        .provider("DeepLearning.AI / Coursera")
                        .url("https://www.coursera.org/specializations/machine-learning-introduction")
                        .type("COURSE")
                        .format("MIXED")
                        .difficulty("INTERMEDIATE")
                        .durationHours(30.0)
                        .rating(4.95)
                        .skillNodeId("ml_fund")
                        .description("The #1 global machine learning course covering supervised learning, neural networks, and decision trees.")
                        .costType("FREE")
                        .build(),

                // DeepLearning.AI Deep Learning
                CourseResource.builder()
                        .id("res_dl_specialization")
                        .title("Deep Learning Specialization (5-Course Series)")
                        .provider("DeepLearning.AI / Coursera")
                        .url("https://www.coursera.org/specializations/deep-learning")
                        .type("COURSE")
                        .format("HANDS_ON")
                        .difficulty("ADVANCED")
                        .durationHours(45.0)
                        .rating(4.92)
                        .skillNodeId("deep_learn")
                        .description("Build CNNs, RNNs, LSTMs, Transformers, and optimization algorithms in PyTorch & TensorFlow.")
                        .costType("FREE")
                        .build(),

                // Fast.ai Practical DL for Coders
                CourseResource.builder()
                        .id("res_fast_ai")
                        .title("Practical Deep Learning for Coders")
                        .provider("Fast.ai")
                        .url("https://course.fast.ai/")
                        .type("COURSE")
                        .format("HANDS_ON")
                        .difficulty("ADVANCED")
                        .durationHours(25.0)
                        .rating(4.9)
                        .skillNodeId("deep_learn")
                        .description("Top-down deep learning with PyTorch, computer vision, tabular data, and NLP.")
                        .costType("FREE")
                        .build(),

                // FreeCodeCamp Web Dev
                CourseResource.builder()
                        .id("res_fcc_web")
                        .title("FreeCodeCamp JavaScript Algorithms & Data Structures")
                        .provider("FreeCodeCamp")
                        .url("https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/")
                        .type("COURSE")
                        .format("INTERACTIVE")
                        .difficulty("BEGINNER")
                        .durationHours(20.0)
                        .rating(4.85)
                        .skillNodeId("web_foundations")
                        .description("Interactive coding environment for JavaScript ES6+, DOM manipulation, and algorithms.")
                        .costType("FREE")
                        .build(),

                // MIT OCW Algorithms
                CourseResource.builder()
                        .id("res_mit_ocw")
                        .title("MIT 6.006 Introduction to Algorithms")
                        .provider("MIT OpenCourseWare")
                        .url("https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/")
                        .type("COURSE")
                        .format("VIDEO")
                        .difficulty("ADVANCED")
                        .durationHours(30.0)
                        .rating(4.95)
                        .skillNodeId("dsa_advanced")
                        .description("MIT's legendary algorithms course covering sorting, trees, graphs, and dynamic programming.")
                        .costType("FREE")
                        .build()
        );

        courseResourceRepository.saveAll(catalog);
    }
}
