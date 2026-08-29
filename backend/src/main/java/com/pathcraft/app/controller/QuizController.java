package com.pathcraft.app.controller;

import com.pathcraft.app.model.CustomAssessmentQuestion;
import com.pathcraft.app.model.QuizAttempt;
import com.pathcraft.app.repository.CustomAssessmentQuestionRepository;
import com.pathcraft.app.repository.QuizAttemptRepository;
import com.pathcraft.app.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final GeminiService geminiService;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CustomAssessmentQuestionRepository customQuestionRepo;

    public QuizController(
            GeminiService geminiService,
            QuizAttemptRepository quizAttemptRepository,
            CustomAssessmentQuestionRepository customQuestionRepo
    ) {
        this.geminiService = geminiService;
        this.quizAttemptRepository = quizAttemptRepository;
        this.customQuestionRepo = customQuestionRepo;
    }

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateQuiz(@RequestBody Map<String, Object> request) {
        String topic = (String) request.getOrDefault("topic", "Data Structures & Algorithms");
        String difficulty = (String) request.getOrDefault("difficulty", "Medium");
        Integer level = request.containsKey("level") ? Integer.parseInt(request.get("level").toString()) : 1;

        String domainKey = normalizeDomainKey(topic);
        String levelName = getLevelName(level);
        int passScore = getPassScore(level);

        List<Map<String, Object>> questions = new ArrayList<>();

        // 1. Check if owner/admin added custom questions for this domain & level
        List<CustomAssessmentQuestion> customQuestions = customQuestionRepo.findByDomainAndLevel(domainKey, level);
        if (customQuestions != null && !customQuestions.isEmpty()) {
            for (CustomAssessmentQuestion cq : customQuestions) {
                questions.add(createQ(
                        cq.getId().hashCode(),
                        cq.getQuestion(),
                        cq.getOptions(),
                        cq.getCorrectIndex(),
                        cq.getExplanation()
                ));
            }
        }

        // 2. Populate level-specific questions from curated domain bank
        List<Map<String, Object>> domainPool = getDomainSpecificQuestionBank(domainKey, level);
        for (Map<String, Object> q : domainPool) {
            if (questions.size() >= 5) break;
            questions.add(q);
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("topic", topic);
        resp.put("domainKey", domainKey);
        resp.put("difficulty", difficulty);
        resp.put("level", level);
        resp.put("levelName", levelName);
        resp.put("passThreshold", passScore);
        resp.put("quizId", UUID.randomUUID().toString());
        resp.put("totalQuestions", questions.size());
        resp.put("questions", questions);
        return ResponseEntity.ok(resp);
    }

    /**
     * TOPIC-SPECIFIC AI QUIZ GENERATION (Context: Domain + Module + Topic + Subtopic + UserLevel)
     * Strictly isolated by domain/module/topic/subtopic — 0 cross-topic pollution
     */
    @PostMapping({"/generate-topic-quiz", "/topic-quiz"})
    public ResponseEntity<Map<String, Object>> generateTopicQuiz(@RequestBody Map<String, Object> request) {
        String domain = (String) request.getOrDefault("domain", "DSA & Algorithms");
        String module = (String) request.getOrDefault("module", "Foundations");
        String topic = (String) request.getOrDefault("topic", "Sliding Window");
        String subtopic = (String) request.getOrDefault("subtopic", "Variable Window");
        String difficulty = (String) request.getOrDefault("difficulty", "Intermediate");

        List<Map<String, Object>> rawQuestions = buildDynamicTopicPool(domain, module, topic, subtopic, difficulty);
        
        // Randomly shuffle question pool and pick 3 to 5 questions
        Collections.shuffle(rawQuestions);
        int pickCount = Math.min(rawQuestions.size(), 4);
        List<Map<String, Object>> selected = new ArrayList<>();

        for (int i = 0; i < pickCount; i++) {
            Map<String, Object> q = rawQuestions.get(i);
            selected.add(shuffleOptionsAndReindex(q));
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("domain", domain);
        resp.put("module", module);
        resp.put("topic", topic);
        resp.put("subtopic", subtopic);
        resp.put("difficulty", difficulty);
        resp.put("totalQuestions", selected.size());
        resp.put("questions", selected);
        return ResponseEntity.ok(resp);
    }

    private Map<String, Object> shuffleOptionsAndReindex(Map<String, Object> original) {
        List<String> opts = new ArrayList<>((List<String>) original.get("options"));
        int correctIdx = ((Number) original.get("correctIndex")).intValue();
        String correctAnswer = opts.get(correctIdx);

        Collections.shuffle(opts);
        int newCorrectIdx = opts.indexOf(correctAnswer);

        Map<String, Object> shuffled = new HashMap<>(original);
        shuffled.put("options", opts);
        shuffled.put("correctIndex", newCorrectIdx);
        return shuffled;
    }

    private List<Map<String, Object>> buildDynamicTopicPool(String domain, String module, String topic, String subtopic, String difficulty) {
        List<Map<String, Object>> pool = new ArrayList<>();
        String ctx = (domain + " " + module + " " + topic + " " + subtopic).toLowerCase();

        // 1. Generative AI & Prompt Engineering / CoT
        if (ctx.contains("chain-of-thought") || ctx.contains("cot") || ctx.contains("few-shot") || ctx.contains("prompt")) {
            pool.add(createQ(1001, "Why does Chain-of-Thought (CoT) prompting significantly improve multi-step reasoning in Large Language Models?",
                    List.of("It allows the transformer auto-regressive decoding layers to allocate compute across intermediate reasoning tokens before outputting the final answer",
                            "It alters the pre-trained weights of the transformer during inference",
                            "It eliminates the need for context window token limits",
                            "It compiles the prompt into Python bytecode"), 0,
                    "Transformers execute a fixed amount of computation per generated token. Outputting intermediate steps provides the attention mechanism with computational workspace."));

            pool.add(createQ(1002, "In Zero-Shot CoT (Kojima et al., 2022), what trigger phrase reliably encourages step-by-step reasoning?",
                    List.of("\"Let's think step by step:\"",
                            "\"Answer directly in one word:\"",
                            "\"Execute this Python script:\"",
                            "\"Summarize in bullet points:\""), 0,
                    "Appending 'Let's think step by step' activates the model's auto-regressive decomposition trajectories without requiring manual few-shot exemplars."));

            pool.add(createQ(1003, "What is the primary risk of relying solely on standard Few-Shot Chain-of-Thought without verification?",
                    List.of("Error propagation where an early calculation mistake in step 1 invalidates all subsequent steps (post-hoc unfaithfulness)",
                            "The model refuses to generate any tokens",
                            "The vector database deletes embeddings",
                            "Token count decreases to zero"), 0,
                    "Early intermediate errors cascade forward. Techniques like Self-Consistency (majority voting) mitigate single-path hallucination."));

            pool.add(createQ(1004, "How does Self-Consistency (Wang et al., 2022) enhance Chain-of-Thought reasoning?",
                    List.of("By sampling multiple diverse reasoning paths at temperature > 0 and selecting the most frequent consensus answer",
                            "By training a discriminator neural network",
                            "By reducing prompt length to 10 tokens",
                            "By running gradient descent on the prompt"), 0,
                    "Self-Consistency marginalizes out the reasoning paths by sampling multiple CoT trajectories and taking the majority vote on the final answer."));
        }
        // 2. RAG & Vector Databases
        else if (ctx.contains("rag") || ctx.contains("retrieval") || ctx.contains("vector") || ctx.contains("embedding") || ctx.contains("chunk")) {
            pool.add(createQ(1101, "What is the purpose of semantic chunk overlap (e.g. 50 tokens) in a production RAG ingestion pipeline?",
                    List.of("To prevent critical entity relationships and sentences from being split across chunk boundaries",
                            "To compress the size of the vector database",
                            "To encrypt embeddings at rest",
                            "To bypass API rate limits"), 0,
                    "Overlap preserves conversational and factual context that spans across arbitrary token boundary splits."));

            pool.add(createQ(1102, "Why is a Cross-Encoder Reranker preferred over pure Cosine Similarity for top-k retrieval in high-precision RAG?",
                    List.of("Cross-Encoders perform full self-attention across both the query and document simultaneously, capturing deep token interactions",
                            "Cross-Encoders run 100x faster than vector indexes",
                            "Cosine similarity cannot handle floating point numbers",
                            "Cross-Encoders eliminate the need for an LLM"), 0,
                    "Bi-encoders embed query and document independently; Cross-encoders compute joint cross-attention to accurately filter false-positive nearest neighbors."));

            pool.add(createQ(1103, "What index structure is most widely used in production vector databases (e.g. Pinecone, Qdrant) for sub-linear approximate nearest neighbor search?",
                    List.of("Hierarchical Navigable Small World (HNSW) graphs",
                            "B+ Tree index with clustered primary keys",
                            "Inverted inverted bitmap index",
                            "Red-Black Binary Search Tree"), 0,
                    "HNSW constructs multi-layer proximity graphs enabling logarithmic O(log N) vector searches with high recall."));
        }
        // 3. Deep Learning & LSTM
        else if (ctx.contains("lstm") || ctx.contains("rnn") || ctx.contains("gate")) {
            pool.add(createQ(1201, "What mathematical equation defines the Forget Gate (f_t) in an LSTM cell?",
                    List.of("f_t = sigmoid(W_f * [h_{t-1}, x_t] + b_f)",
                            "f_t = tanh(W_f * x_t) * h_{t-1}",
                            "f_t = softmax(Q * K^T / sqrt(d))",
                            "f_t = ReLU(W_f * x_t + b)"), 0,
                    "The forget gate uses the sigmoid activation function to output scalars between 0 and 1 for each cell state dimension."));

            pool.add(createQ(1202, "Why does the constant error carousel (Cell State C_t) prevent vanishing gradients during BPTT?",
                    List.of("The gradient update flows additively: dC_t/dC_{t-1} = f_t, avoiding repeated matrix multiplications by weights",
                            "It uses dynamic dropout on backpropagation",
                            "It reduces the batch size to 1",
                            "It replaces floating point math with integer addition"), 0,
                    "Additive updates create a linear gradient highway across hundreds of sequential time steps."));
        }
        // 4. DevOps & Cloud
        else if (ctx.contains("devops") || ctx.contains("docker") || ctx.contains("kubernetes") || ctx.contains("linux")) {
            pool.add(createQ(1301, "What is the primary architectural purpose of multi-stage Docker builds?",
                    List.of("To separate the build environment (compilers, dev packages) from the minimal production runtime image, drastically reducing image attack surface and size",
                            "To run multiple containers on a single port",
                            "To bypass Kubernetes cluster RBAC policies",
                            "To compile Python into native machine code"), 0,
                    "Multi-stage builds copy only compiled artifacts into a lightweight runtime image, eliminating unnecessary build dependencies."));

            pool.add(createQ(1302, "What is the difference between a Kubernetes Liveness Probe and a Readiness Probe?",
                    List.of("Liveness restarts deadlocked containers; Readiness controls whether traffic from Services is routed to the Pod",
                            "Readiness deletes the worker node; Liveness scales the Deployment",
                            "Liveness is only for TCP ports; Readiness is for HTTP",
                            "There is no functional difference"), 0,
                    "Liveness probe failure triggers container restart; Readiness probe failure temporarily isolates the Pod from receiving incoming traffic."));

            pool.add(createQ(1303, "What security vulnerability is prevented by configuring containers with 'securityContext: runAsNonRoot: true'?",
                    List.of("Container breakout vulnerabilities that could compromise the host operating system kernel with root (UID 0) privileges",
                            "DDoS network flood attacks",
                            "Cross-site scripting in web views",
                            "Database SQL injection vulnerabilities"), 0,
                    "Non-root execution limits an attacker's reach even if they exploit a vulnerability to break out of the container boundary."));
        }
        // 5. Full Stack & React
        else if (ctx.contains("react") || ctx.contains("useeffect") || ctx.contains("websocket") || ctx.contains("frontend") || ctx.contains("fullstack")) {
            pool.add(createQ(1401, "Why must cleanup functions be returned from React useEffect hooks when opening WebSockets or EventListeners?",
                    List.of("To prevent memory leaks and duplicate socket listeners when components re-render or unmount",
                            "To force immediate garbage collection in the browser",
                            "To convert WebSocket data into Redux actions",
                            "To reload the web browser tab"), 0,
                    "Unclosed listeners persist in memory and receive duplicate messages on subsequent component mounts."));

            pool.add(createQ(1402, "In the browser JavaScript event loop, what is the execution priority between Microtasks (Promises) and Macrotasks (setTimeout)?",
                    List.of("The entire Microtask queue is drained immediately after the current call stack completes, before processing the next Macrotask",
                            "Macrotasks have strict priority over Microtasks",
                            "They execute simultaneously in background Web Workers",
                            "Priority is randomly assigned by the V8 engine"), 0,
                    "Promise resolutions (microtasks) execute immediately before browser paint and before the next timer or I/O callback (macrotask)."));
        }
        // 6. Python & Backend
        else if (ctx.contains("python") || ctx.contains("asyncio") || ctx.contains("generator")) {
            pool.add(createQ(1501, "How does Python's asyncio event loop handle high concurrency without creating multiple OS threads?",
                    List.of("By using non-blocking I/O multiplexing (epoll/kqueue) and cooperative coroutine suspension via 'await'",
                            "By compiling Python into native multi-threaded C code",
                            "By spawning a new process for every single async function call",
                            "By bypassing the Python Global Interpreter Lock (GIL) for CPU operations"), 0,
                    "Asyncio runs on a single thread, switching tasks when a coroutine yields control during asynchronous I/O waits."));

            pool.add(createQ(1502, "What is the memory advantage of using Python generator functions with 'yield' over returning a list?",
                    List.of("Generators compute items lazily on demand with O(1) memory overhead rather than allocating memory for all elements upfront",
                            "Generators execute 100x faster than standard loops",
                            "Generators automatically persist data to disk",
                            "Generators prevent variable mutations in closures"), 0,
                    "Generators maintain state and compute the next value only when requested, enabling streaming processing of massive datasets."));
        }
        // 7. General & DSA Fallback
        else {
            pool.add(createQ(1601, String.format("What is the primary architectural invariant governing %s?", subtopic),
                    List.of(String.format("Maintaining deterministic state, verified preconditions, and bounded execution bounds in %s", subtopic),
                            "Permitting unconstrained state mutations across threads",
                            "Disabling error handling to prioritize execution speed",
                            "Allocating unbounded memory buffers in production"), 0,
                    String.format("Strict invariant maintenance guarantees correctness, safety, and optimal scalability in %s.", subtopic)));

            pool.add(createQ(1602, String.format("Which production edge case must be handled defensively when implementing %s?", subtopic),
                    List.of("Boundary conditions, null inputs, timeouts, and network partition recovery",
                            "Operating system terminal font color changes",
                            "Compiler cache warming delays",
                            "Variable name length limitations"), 0,
                    "Defensive programming requires explicit handling of boundary conditions, rate limits, and network anomalies."));

            pool.add(createQ(1603, String.format("What is the key performance tradeoff when scaling %s in high-throughput environments?", subtopic),
                    List.of("Balancing latency and memory footprint against computational throughput and consistency guarantees",
                            "Trading code readability for larger binary size",
                            "Removing all unit tests to save CPU cycles",
                            "Converting all relational schemas into flat text files"), 0,
                    "Distributed engineering requires balancing consistency, latency, and memory footprint tradeoffs."));
        }

        return pool;
    }

    private String normalizeDomainKey(String topic) {
        String lower = topic.toLowerCase();
        if (lower.contains("pytorch") || lower.contains("deep learning") || lower.contains("dl") || lower.contains("machine learning") || lower.contains("ml") || lower.contains("aiml") || lower.contains("genai")) return "aiml";
        if (lower.contains("java") || lower.contains("spring")) return "java";
        if (lower.contains("devops") || lower.contains("docker") || lower.contains("kubernetes") || lower.contains("cloud") || lower.contains("sre")) return "devops";
        if (lower.contains("system design") || lower.contains("distributed")) return "sysdesign";
        if (lower.contains("sql") || lower.contains("database") || lower.contains("db")) return "db";
        return "dsa";
    }

    private String getLevelName(int level) {
        switch (level) {
            case 1: return "Level 1 — Foundations";
            case 2: return "Level 2 — Core Application";
            case 3: return "Level 3 — Advanced Reasoning";
            case 4: return "Level 4 — Interview Scenarios";
            case 5: return "Level 5 — Expert Mastery";
            default: return "Level " + level;
        }
    }

    private int getPassScore(int level) {
        switch (level) {
            case 1:
            case 2: return 75;
            case 3:
            case 4: return 80;
            case 5: return 85;
            default: return 75;
        }
    }

    private List<Map<String, Object>> getDomainSpecificQuestionBank(String domain, int level) {
        List<Map<String, Object>> pool = new ArrayList<>();

        if (domain.equals("aiml")) {
            if (level == 1) {
                pool.add(createQ(611, "What is a Tensor in PyTorch?", List.of("A multi-dimensional array similar to NumPy ndarray with GPU acceleration support", "A type of database index", "A loss function", "A compiler optimization"), 0, "Tensors are fundamental data structures in PyTorch enabling autograd and CUDA execution."));
                pool.add(createQ(612, "What is the primary function of an activation function like ReLU?", List.of("Introduce non-linearity so deep neural networks can learn complex decision boundaries", "Normalize weights to zero", "Speed up CPU disk I/O", "Replace the loss function"), 0, "Without non-linear activations, stacking linear layers collapses into a single linear regression."));
                pool.add(createQ(613, "What does learning rate control during Gradient Descent?", List.of("The step size taken in the direction of the negative gradient towards minimal loss", "The number of hidden layers", "The batch size on disk", "The vocabulary size"), 0, "Learning rate dictates how aggressively model parameters update each step."));
                pool.add(createQ(614, "In supervised learning, what is the difference between classification and regression?", List.of("Classification predicts discrete labels, while regression predicts continuous numerical values", "They are identical", "Classification requires no labels", "Regression only works on images"), 0, "Classification categorizes into discrete classes, regression fits continuous outputs."));
                pool.add(createQ(615, "What is overfitting in machine learning models?", List.of("When a model memorizes training data noise and fails to generalize to unseen test data", "When loss is too high on training set", "When the model is too small", "When training runs too fast"), 0, "Overfitting occurs when model capacity is too high relative to training sample variety."));
            } else if (level == 2) {
                pool.add(createQ(621, "In PyTorch, what is the key difference between tensor.detach() and tensor.clone()?", List.of("detach() shares memory without autograd; clone() copies memory and keeps gradients", "They are identical", "clone() detaches autograd", "detach() runs on GPU only"), 0, "detach() creates a view without computational graph history; clone() performs deep copy while preserving autograd."));
                pool.add(createQ(622, "In Transformer self-attention, why are dot products scaled by 1/sqrt(d_k)?", List.of("To prevent dot products from growing excessively large and causing vanishing softmax gradients", "To reduce matrix dimension", "To enforce matrix symmetry", "To enable batch normalization"), 0, "Large magnitude values push softmax into flat regions with tiny gradients."));
                pool.add(createQ(623, "What does LoRA (Low-Rank Adaptation) freeze and train during LLM fine-tuning?", List.of("Freezes base model weights and trains rank decomposition matrices A and B", "Freezes only tokenizer", "Trains only embedding layer", "Fine-tunes every layer fully"), 0, "LoRA injects trainable rank decomposition matrices while keeping base weights frozen."));
                pool.add(createQ(624, "In Vector Search, what is the primary advantage of HNSW index?", List.of("Provides logarithmic search complexity with high recall for approximate nearest neighbor", "Requires zero RAM", "Guarantees exact linear search", "Replaces embeddings with TF-IDF"), 0, "HNSW multi-layer graphs deliver ultra-fast logarithmic search."));
                pool.add(createQ(625, "Why is Cross-Entropy Loss preferred over MSE for multi-class classification?", List.of("It penalizes confident incorrect predictions exponentially and avoids gradient saturation with Softmax", "It is easier to compute on CPU", "MSE cannot handle numbers > 1", "Cross-entropy requires no labels"), 0, "Softmax + Cross-Entropy gradient simplifies to (p - y), avoiding flat plateaus."));
            } else {
                pool.add(createQ(631, "In RAG pipelines, how does Cross-Encoder Reranking improve retrieval accuracy over bi-encoder vector similarity?", List.of("It processes query and candidate chunk jointly through full cross-attention layers", "It computes hash collisions", "It converts text to SQL", "It removes embedding dimensions"), 0, "Cross-encoders evaluate deep inter-token attention between query and passage at the cost of higher latency."));
                pool.add(createQ(632, "What is FlashAttention and how does it reduce Transformer memory overhead?", List.of("Tiles attention computation in fast GPU SRAM to avoid read/write bottleneck to high-bandwidth HBM", "Disables attention heads", "Quantizes weights to 1-bit", "Removes softmax entirely"), 0, "FlashAttention optimizes GPU IO memory hierarchy with fused tiling kernels."));
                pool.add(createQ(633, "What problem does RoPE (Rotary Position Embeddings) solve in modern LLMs like LLaMA?", List.of("Encodes relative positional distance directly into query-key dot products via complex rotational matrices", "Fixes max sequence length to 512", "Replaces attention with CNNs", "Removes positional embeddings"), 0, "RoPE enables natural relative distance decay and extrapolates to longer context windows."));
                pool.add(createQ(634, "What is the difference between DPO (Direct Preference Optimization) and RLHF with PPO?", List.of("DPO derives closed-form loss directly on preference pairs without training a separate reward model or PPO loop", "DPO requires 10x more GPUs", "RLHF has no reward model", "DPO only works on vision models"), 0, "DPO mathematically reparameterizes the reward function directly in terms of policy probabilities."));
                pool.add(createQ(635, "In speculative decoding for LLM inference, how is generation accelerated?", List.of("A smaller draft model generates K candidate tokens which are verified in parallel by the target LLM in one forward pass", "It runs on 8-bit quantized CPUs", "It skips half the Transformer layers", "It caches all possible token permutations"), 0, "Parallel verification of drafted tokens yields 2-3x speedup with zero loss in mathematical precision."));
            }
        } else if (domain.equals("java")) {
            if (level == 1) {
                pool.add(createQ(711, "What is the difference between JDK, JRE, and JVM in Java?", List.of("JDK contains tools + JRE; JRE contains JVM + libraries; JVM executes compiled bytecode", "They are identical", "JVM is only for Windows", "JDK is a database"), 0, "JDK compiles source code into bytecode (.class), JRE provides runtime libraries, JVM executes bytecode."));
                pool.add(createQ(712, "What is the difference between equals() and == for Objects in Java?", List.of("== checks memory reference equality; equals() compares logical state content", "== is for strings only", "equals() cannot be overridden", "They always return the same result"), 0, "== compares reference memory addresses unless overridden like equals() in String/Object."));
                pool.add(createQ(713, "Why is String immutable in Java?", List.of("For security, thread-safety, String pool caching, and consistent hashCode calculations", "Because JVM cannot reallocate memory", "To prevent subclassing", "Because char arrays are immutable"), 0, "Immutability ensures Strings are safe for multithreading, classloading, and HashMap keys."));
                pool.add(createQ(714, "What is the difference between ArrayList and LinkedList in Java?", List.of("ArrayList is backed by dynamic array with O(1) random access; LinkedList is doubly-linked with O(N) lookup", "LinkedList has faster random access", "ArrayList cannot hold objects", "They have identical internal structures"), 0, "ArrayList provides fast index lookup, LinkedList allows fast head/tail insertion."));
                pool.add(createQ(715, "What is the purpose of the final keyword in Java?", List.of("Prevents variable reassignment, method overriding, or class inheritance", "Deletes the variable from memory", "Makes methods asynchronous", "Enforces static execution"), 0, "final constants cannot be changed, final methods cannot be overridden, final classes cannot be extended."));
            } else if (level == 2) {
                pool.add(createQ(721, "In Java 21, how do Virtual Threads achieve high concurrency with blocking I/O?", List.of("Carrier OS threads unmount virtual threads during blocking calls and execute other tasks", "They create 1 kernel thread per virtual thread", "They disable garbage collection", "They run on the GPU"), 0, "Project Loom virtual threads unmount from carrier threads when blocking, allowing millions of concurrent tasks."));
                pool.add(createQ(722, "What is the N+1 Query Problem in Spring Data JPA / Hibernate, and how is it resolved?", List.of("Executing 1 parent query and N child queries; resolved using JOIN FETCH or @EntityGraph", "A syntax error in JPQL", "Running N+1 transactions", "A database connection leak"), 0, "JOIN FETCH instructs Hibernate to retrieve parent and associations in a single SQL query."));
                pool.add(createQ(723, "How does ConcurrentHashMap achieve high write throughput in Java 8+?", List.of("Locks individual bucket nodes using synchronized/CAS rather than entire segment arrays", "Uses a single global ReentrantLock", "Disables hashing collisions", "Writes everything to disk"), 0, "Java 8 ConcurrentHashMap uses synchronized on bucket head nodes + CAS operations."));
                pool.add(createQ(724, "What is the difference between @Component, @Service, and @Repository in Spring?", List.of("@Repository adds automatic persistence exception translation; @Service and @Component are semantic stereotypes", "They have different bean lifecycles", "@Service cannot have dependencies", "@Component is deprecated"), 0, "@Repository enables Spring DataAccessException translation post-processors."));
                pool.add(createQ(725, "In Apache Kafka, what happens when a consumer group has more consumers than topic partitions?", List.of("Excess consumers remain idle with zero partitions assigned", "Partitions are duplicated", "Kafka throws an exception", "Messages are split across consumers"), 0, "A single partition can only be consumed by at most one consumer per consumer group."));
            } else {
                pool.add(createQ(731, "In Spring Framework, how does @Transactional handle exceptions by default?", List.of("Rolls back on unchecked RuntimeExceptions and Errors, but commits on checked Exceptions unless specified", "Rolls back on all exceptions", "Never rolls back", "Throws NullPointerException"), 0, "rollbackFor = Exception.class must be configured to roll back on checked exceptions."));
                pool.add(createQ(732, "How does the ZGC (Z Garbage Collector) achieve sub-millisecond pause times in modern Java?", List.of("Performs concurrent marking and relocation using colored pointers and load barriers", "Stops the entire JVM for 10 seconds", "Disables heap allocations", "Runs on GPU threads"), 0, "ZGC does almost all GC phases concurrently without stopping application threads."));
                pool.add(createQ(733, "In Kafka consumer design, how do you prevent consumer group rebalance storms during long processing tasks?", List.of("Process messages asynchronously in thread pools and decouple heartbeat from record processing with max.poll.interval.ms", "Set timeout to 0", "Disable partitions", "Restart broker"), 0, "Increasing max.poll.interval.ms and using worker queues avoids session timeouts."));
                pool.add(createQ(734, "What is the difference between optimistic and pessimistic locking in Spring JPA?", List.of("Optimistic uses @Version column checking on commit; pessimistic locks database rows with SELECT FOR UPDATE", "Optimistic is always slower", "Pessimistic does not lock rows", "They are identical"), 0, "Optimistic locking avoids database lock contention under low write conflict scenarios."));
                pool.add(createQ(735, "What is the purpose of Spring WebFlux Reactive streams vs standard Spring MVC?", List.of("Non-blocking asynchronous I/O using Netty event loops handling high concurrent connections with minimal threads", "Faster CPU matrix math", "Replaces PostgreSQL with files", "Removes REST APIs"), 0, "Reactive backpressure and event loops handle high I/O concurrency with fixed thread pools."));
            }
        } else if (domain.equals("db")) {
            if (level == 1) {
                pool.add(createQ(111, "What is the difference between PRIMARY KEY and UNIQUE constraint in SQL?", List.of("A table can have only one PRIMARY KEY which disallows NULLs; multiple UNIQUE constraints can exist and allow NULLs", "They are identical", "UNIQUE cannot be indexed", "PRIMARY KEY allows duplicate rows"), 0, "Primary keys uniquely identify rows and cannot be NULL; UNIQUE allows unique values with possible NULLs."));
                pool.add(createQ(112, "Which SQL command is used to remove all records from a table without logging individual row deletions?", List.of("TRUNCATE TABLE", "DELETE FROM", "DROP TABLE", "REMOVE TABLE"), 0, "TRUNCATE is a DDL operation that deallocates data pages quickly."));
                pool.add(createQ(113, "What does the WHERE clause do compared to HAVING clause in SQL?", List.of("WHERE filters rows before aggregation; HAVING filters groups after GROUP BY aggregation", "WHERE is only for numbers", "HAVING cannot use aggregate functions", "They are interchangeable"), 0, "WHERE filters individual table rows; HAVING filters grouped summary results."));
                pool.add(createQ(114, "Which JOIN returns all records from both tables matching when possible?", List.of("FULL OUTER JOIN", "INNER JOIN", "CROSS JOIN", "LEFT JOIN"), 0, "FULL OUTER JOIN includes unmatched rows from both left and right sides."));
                pool.add(createQ(115, "What does ACID stand for in database transactions?", List.of("Atomicity, Consistency, Isolation, Durability", "Asynchronous, Concurrent, Indexed, Distributed", "Auto, Cache, Insert, Delete", "Authentication, Checksum, Integrity, Data"), 0, "ACID guarantees transactional correctness and crash recovery."));
            } else if (level == 2) {
                pool.add(createQ(121, "What is the difference between RANK() and DENSE_RANK() in SQL window functions?", List.of("DENSE_RANK produces consecutive numbers without gaps for ties", "RANK is faster", "DENSE_RANK requires PARTITION BY", "They are identical"), 0, "DENSE_RANK produces contiguous integers (e.g. 1, 2, 2, 3) without skipping rank values."));
                pool.add(createQ(122, "Which JOIN returns all rows from the left table regardless of a match in the right table?", List.of("LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "CROSS JOIN"), 0, "LEFT JOIN retains every record from the left table with NULLs where right rows do not match."));
                pool.add(createQ(123, "Which isolation level in PostgreSQL/MySQL prevents Phantom Reads?", List.of("SERIALIZABLE", "REPEATABLE READ", "READ COMMITTED", "READ UNCOMMITTED"), 0, "SERIALIZABLE uses strict predicate locking or Serializable Snapshot Isolation (SSI)."));
                pool.add(createQ(124, "In a B+ Tree index, why are range queries significantly faster than in a regular B-Tree?", List.of("All leaf nodes form a doubly linked list allowing sequential block scans", "B+ Trees have no root node", "B+ Trees avoid hashing", "B+ Trees fit entirely in L1 cache"), 0, "Leaf node linked pointers allow sequential iteration without traversing back up the tree."));
                pool.add(createQ(125, "What happens during a PostgreSQL MVCC Vacuum operation?", List.of("Reclaims dead tuple space created by UPDATE/DELETE operations", "Rebuilds all indexes from scratch", "Drops foreign keys", "Locks entire table exclusively"), 0, "Vacuum cleans dead row versions so pages can be reused by new inserts."));
            } else {
                pool.add(createQ(131, "What is a Covering Index (Index-Only Scan) in PostgreSQL/MySQL?", List.of("An index containing all columns requested in the query, eliminating the need to read table heap pages", "An index on all table columns", "A primary key index", "An encrypted index"), 0, "Index-only scans satisfy queries directly from RAM index pages without visiting heap tuples."));
                pool.add(createQ(132, "How does Write-Ahead Logging (WAL) ensure durability in relational databases?", List.of("Changes are recorded sequentially to append-only disk logs before dirty buffer pages are flushed to table files", "Writes directly to RAM only", "Disables caching", "Logs queries to stdout"), 0, "WAL guarantees transactions can be replayed and reconstructed after power loss."));
                pool.add(createQ(133, "What causes index bloat and table bloat in high-update PostgreSQL databases?", List.of("MVCC writes new row versions on every UPDATE without in-place modification, leaving dead tuples until vacuumed", "Index keys growing too long", "Too many SELECT queries", "Corrupted foreign keys"), 0, "PostgreSQL MVCC does out-of-place updates creating dead tuples that require vacuum maintenance."));
                pool.add(createQ(134, "In distributed databases, what is the difference between sharding and replication?", List.of("Sharding partitions distinct dataset subsets across nodes; replication copies the full dataset across nodes for redundancy", "Sharding is only for Redis", "Replication divides data", "They are identical"), 0, "Sharding scales write capacity and storage horizontally; replication provides read scale and fault tolerance."));
                pool.add(createQ(135, "What is the difference between Clustered and Non-Clustered Indexes in MySQL InnoDB?", List.of("The Clustered index dictates physical row order on disk (Primary Key); Non-clustered indexes store secondary keys pointing to primary keys", "Clustered indexes are slower", "Non-clustered indexes store table rows", "InnoDB has no clustered indexes"), 0, "InnoDB tables are organized as clustered B+ trees on the primary key."));
            }
        } else if (domain.equals("sysdesign")) {
            if (level == 1) {
                pool.add(createQ(311, "What is the difference between Vertical Scaling (Scale Up) and Horizontal Scaling (Scale Out)?", List.of("Vertical adds more CPU/RAM to a single server; Horizontal adds more server instances to distribute load", "Horizontal means buying a larger server", "Vertical has no limits", "They are identical"), 0, "Horizontal scaling distributes traffic across multiple commodity machines."));
                pool.add(createQ(312, "What is the primary role of a Reverse Proxy like NGINX?", List.of("Intercepts client requests, routes them to backend servers, and handles SSL termination and load balancing", "Stores database records", "Compiles frontend React code", "Encrypts client hard drives"), 0, "Reverse proxies route traffic, terminate SSL, and cache static assets."));
                pool.add(createQ(313, "What is a Content Delivery Network (CDN)?", List.of("A globally distributed network of edge cache servers serving static assets close to end users", "A relational database", "A DNS registrar", "A code repository"), 0, "CDNs cache static media and data at geographical edge nodes, cutting latency."));
                pool.add(createQ(314, "What is the difference between synchronous and asynchronous communication in microservices?", List.of("Synchronous blocks waiting for response (REST/gRPC); Asynchronous publishes messages without blocking (Kafka/RabbitMQ)", "Synchronous is always faster", "Asynchronous does not use network", "They have identical latency"), 0, "Asynchronous messaging decouples producers and consumers for resilient scaling."));
                pool.add(createQ(315, "What is database connection pooling and why is it essential?", List.of("Maintains a cache of open database connections to avoid the expensive TCP/TLS handshake on every request", "Creates 1 database per user", "Disables database locks", "Encrypts query strings"), 0, "Connection pools reuse established DB connections under high concurrency."));
            } else if (level == 2) {
                pool.add(createQ(321, "What does the CAP theorem state regarding distributed systems during network partitions (P)?", List.of("A distributed system must choose between Consistency (C) or Availability (A)", "A system can guarantee all three simultaneously", "Partition tolerance can be eliminated", "Latency equals consistency"), 0, "When network splits occur, you must choose between stale available responses or strict consistent errors."));
                pool.add(createQ(322, "How does Consistent Hashing minimize data movement when a node is added or removed?", List.of("Only keys mapped to the specific ring segment between adjacent nodes are relocated", "Rehashes all N keys uniformly", "Replicates every key to all nodes", "Eliminates hash collisions completely"), 0, "On average, only K/N keys need remapping when node count changes."));
                pool.add(createQ(323, "Which caching strategy writes to cache and database concurrently before returning to the client?", List.of("Write-Through", "Write-Back (Write-Behind)", "Cache-Aside", "Read-Through"), 0, "Write-Through updates cache and persistent store synchronously."));
                pool.add(createQ(324, "What is the primary benefit of the Token Bucket algorithm over Fixed Window counters for rate limiting?", List.of("Smooths out traffic bursts by allowing burst up to bucket capacity", "Never drops any requests", "Requires zero memory", "Runs entirely on the client"), 0, "Token bucket handles sudden bursts smoothly while maintaining a constant average refill rate."));
                pool.add(createQ(325, "In event-driven microservices, what problem does the Transactional Outbox Pattern solve?", List.of("Guarantees atomic database update and message broker publish without distributed 2PC locks", "Encrypts messages in Kafka", "Eliminates duplicate HTTP calls", "Replaces relational DB with Redis"), 0, "Stores events in an outbox table within the same local DB transaction, polled by an event relay."));
            } else {
                pool.add(createQ(331, "What is the difference between Strong Consistency, Eventual Consistency, and Read-Your-Own-Writes Consistency?", List.of("Strong guarantees instant global state; Eventual converges over time; Read-Your-Own-Writes guarantees a user sees their recent updates", "They are identical", "Eventual consistency never updates", "Strong consistency has no latency penalty"), 0, "Consistency models trade off synchronization latency against data freshness guarantees."));
                pool.add(createQ(332, "How does the Raft consensus algorithm handle leader election when split votes occur?", List.of("Uses randomized election timeouts per node so one candidate times out and requests votes first", "Selects the node with lowest IP", "Restarts the cluster", "Requires manual intervention"), 0, "Randomized timeouts break split vote ties naturally."));
                pool.add(createQ(333, "In distributed caching, what is the Thundering Herd (Cache Stampede) problem, and how is it resolved?", List.of("Massive concurrent requests hit the database when a popular cache key expires; resolved with mutex locking or probabilistic early expiration", "Hardware CPU failure", "Network cable disconnection", "Database memory leak"), 0, "Mutual exclusion locks on cache miss allow only one thread to populate cache while others wait."));
                pool.add(createQ(334, "What is the difference between Gossip Protocol and Centralized Coordinator (like ZooKeeper/etcd)?", List.of("Gossip is decentralized peer-to-peer eventual state dissemination; etcd uses centralized quorum consensus", "Gossip is strictly synchronous", "etcd has no leader", "Gossip requires shared memory"), 0, "Gossip protocols scale to thousands of nodes with probabilistic discovery (e.g. Cassandra/DynamoDB)."));
                pool.add(createQ(335, "How does the Circuit Breaker pattern (Resilience4j) protect distributed microservices under failure?", List.of("Transitions to OPEN state upon reaching failure threshold to fail fast and prevent thread pool exhaustion", "Restarts the cloud region", "Drops client SSL certs", "Reroutes all traffic to disk"), 0, "Circuit breakers prevent cascading outages by short-circuiting calls to degraded downstream services."));
            }
        } else if (domain.equals("devops")) {
            if (level == 1) {
                pool.add(createQ(411, "What is the difference between a Container (Docker) and a Virtual Machine (VM)?", List.of("Containers share the host OS kernel and are lightweight; VMs run full guest OS on a hypervisor", "Containers require a dedicated hypervisor", "VMs start in milliseconds", "They are identical"), 0, "Containers isolate processes using Linux namespaces and cgroups, sharing the host kernel."));
                pool.add(createQ(412, "What is the purpose of a Dockerfile?", List.of("A text blueprint containing sequential instructions to build an automated container image", "A log file", "A shell terminal", "A network router config"), 0, "Dockerfiles define OS base layers, dependencies, and entrypoints for container builds."));
                pool.add(createQ(413, "What is CI/CD in modern software engineering?", List.of("Continuous Integration (automated test & build) and Continuous Deployment (automated release to staging/prod)", "Code Indexing and Compression", "Cloud Infrastructure on Disk", "Client Interface Component"), 0, "CI/CD automates linting, testing, image building, and production deployment."));
                pool.add(createQ(414, "In Kubernetes, what is a Pod?", List.of("The smallest deployable compute unit consisting of one or more tightly-coupled containers sharing network/storage", "A physical server", "A database table", "A Docker registry"), 0, "Pods encapsulate container instances, storage resources, and unique IP addresses."));
                pool.add(createQ(415, "What is the primary role of DNS (Domain Name System)?", List.of("Translates human-readable domain names into numerical IP addresses", "Encrypts web passwords", "Compiles source code", "Executes SQL queries"), 0, "DNS resolves domain names to IP addresses for network routing."));
            } else if (level == 2) {
                pool.add(createQ(421, "What is the purpose of Kubernetes Pod Readiness Probes versus Liveness Probes?", List.of("Readiness determines if traffic should be routed to the Pod; Liveness restarts crashed containers", "They are completely identical", "Readiness probe terminates the node", "Liveness probe creates a load balancer"), 0, "Readiness controls service endpoint routing; liveness restarts unhealthy container processes."));
                pool.add(createQ(422, "In Docker, what is the best practice for keeping production image sizes minimal?", List.of("Multi-stage builds to discard build toolchains from the final runtime container", "Installing all compilers", "Using Ubuntu base images", "Disabling layer caching"), 0, "Multi-stage builds copy only compiled binaries into lean distroless/alpine runtime images."));
                pool.add(createQ(423, "What makes Terraform an 'Idempotent' Infrastructure-as-Code tool?", List.of("Applying the same configuration multiple times produces the exact same state without unintended side effects", "Runs only on AWS", "Does not store state files", "Executes scripts sequentially"), 0, "Terraform compares desired state against real infrastructure state and applies only necessary diffs."));
                pool.add(createQ(424, "What is the purpose of an AWS IAM Role compared to IAM User credentials?", List.of("Provides temporary, auto-rotated security credentials without hardcoded access keys", "Used only for billing", "Has unlimited root access", "Cannot be attached to EC2"), 0, "Roles issue temporary STS credentials, eliminating hardcoded long-lived secrets."));
                pool.add(createQ(425, "In Prometheus observability, what is a Histogram metric used for?", List.of("Sampling observations into configurable buckets for percentile latency calculation", "Counting total HTTP requests", "Tracking instant CPU usage", "Storing log messages"), 0, "Histograms count events into buckets to calculate percentiles (p95, p99) accurately."));
            } else {
                pool.add(createQ(431, "What is the difference between Blue-Green Deployment and Canary Deployment in Kubernetes?", List.of("Blue-Green switches 100% traffic between two identical environments; Canary routes a small % of traffic (e.g. 5%) to the new version first", "Canary is only for databases", "Blue-Green does not support rollbacks", "They are identical"), 0, "Canary releases allow verifying real-user metrics with minimal blast radius."));
                pool.add(createQ(432, "How does Kubernetes Horizontal Pod Autoscaler (HPA) make scaling decisions?", List.of("Queries metrics-server periodically and computes desired replicas based on target CPU/memory or custom Prometheus metrics", "Restarts nodes at midnight", "Scales only on manual commands", "Monitors disk read bytes only"), 0, "HPA calculates desired replicas using the ratio of current metric value to target metric value."));
                pool.add(createQ(433, "What is the purpose of a Kubernetes Ingress Controller?", List.of("Manages external HTTP/HTTPS routing, SSL termination, and path-based routing into cluster Services", "Creates worker nodes", "Stores secrets on disk", "Backs up PostgreSQL"), 0, "Ingress provides L7 routing rules mapping hostnames and URL paths to backend ClusterIP services."));
                pool.add(createQ(434, "In GitOps (ArgoCD / Flux), what is the single source of truth for cluster state?", List.of("A Git repository containing declarative Kubernetes manifests", "The Kubernetes etcd database", "Docker hub images", "Developer local machine"), 0, "GitOps continuously reconciles live cluster state to match the declarative manifests in Git."));
                pool.add(createQ(435, "What is the difference between an Overlay Network and host-level networking in K8s?", List.of("Overlay encapsulates packets across node boundaries allowing pods on different hosts to communicate via virtual subnets", "Overlay requires public IPs for all pods", "Host networking is more isolated", "Overlay disables TCP"), 0, "CNI plugins like Calico implement encapsulation or BGP routing for pod-to-pod communication."));
            }
        } else {
            // DSA
            if (level == 1) {
                pool.add(createQ(511, "What is the time complexity to access an element by index in an Array?", List.of("O(1) constant time", "O(N) linear time", "O(log N)", "O(N^2)"), 0, "Arrays have contiguous memory layout allowing instant address calculation: base + (index * size)."));
                pool.add(createQ(512, "What is the time complexity of searching in a sorted array of N elements using Binary Search?", List.of("O(log N)", "O(1)", "O(N)", "O(N log N)"), 0, "Binary search halves search space on each comparison, running in logarithmic time."));
                pool.add(createQ(513, "Which data structure follows the LIFO (Last In First Out) principle?", List.of("Stack", "Queue", "LinkedList", "Binary Tree"), 0, "Stacks push and pop elements from the top in LIFO order."));
                pool.add(createQ(514, "Which data structure follows the FIFO (First In First Out) principle?", List.of("Queue", "Stack", "HashMap", "Max Heap"), 0, "Queues enqueue at the rear and dequeue from the front in FIFO order."));
                pool.add(createQ(515, "What is the worst-case time complexity of Quick Sort?", List.of("O(N^2)", "O(N log N)", "O(N)", "O(log N)"), 0, "When the chosen pivot is always the smallest or largest element on already sorted data."));
            } else if (level == 2) {
                pool.add(createQ(521, "What is the amortized time complexity of inserting into a Dynamic Array (ArrayList / std::vector)?", List.of("O(1) amortized", "O(N) always", "O(log N)", "O(N^2)"), 0, "Geometric doubling of capacity ensures O(1) amortized time per insertion."));
                pool.add(createQ(522, "Which algorithm detects negative weight cycles in a directed graph?", List.of("Bellman-Ford Algorithm", "Dijkstra's Algorithm", "Kruskal's Algorithm", "Prim's Algorithm"), 0, "Bellman-Ford relaxes all edges V-1 times; an additional relaxation indicates a negative cycle."));
                pool.add(createQ(523, "What is the time complexity to build a Binary Heap from an unordered array of N elements?", List.of("O(N)", "O(N log N)", "O(log N)", "O(N^2)"), 0, "Bottom-up heapify runs in strict O(N) linear time due to decaying geometric series of tree heights."));
                pool.add(createQ(524, "Which data structure is optimal for Range Minimum Queries (RMQ) with point updates in O(log N)?", List.of("Segment Tree / Fenwick Tree", "LinkedList", "Binary Search Tree", "Stack"), 0, "Segment Trees answer range queries and update elements in O(log N) time."));
                pool.add(createQ(525, "What is the space complexity of Kahn's Algorithm for Topological Sort on a graph G(V, E)?", List.of("O(V + E)", "O(1)", "O(V^2)", "O(E log V)"), 0, "Requires an in-degree array of size V and adjacency representation of size V+E."));
            } else {
                pool.add(createQ(531, "What is the time complexity of finding Strongly Connected Components using Tarjan's or Kosaraju's Algorithm?", List.of("O(V + E)", "O(V * E)", "O(V^2)", "O(E log V)"), 0, "Tarjan's algorithm uses DFS traversal with low-link values in linear O(V + E) time."));
                pool.add(createQ(532, "In String matching, what does the KMP (Knuth-Morris-Pratt) algorithm preprocess to achieve O(N + M) time?", List.of("The Longest Proper Prefix which is also Suffix (LPS) array", "Suffix Tree", "Trie nodes", "Hash table"), 0, "The LPS array avoids re-checking matched characters upon pattern mismatch."));
                pool.add(createQ(533, "What is the time complexity of Dijkstra's Algorithm implemented with a Min-Heap / PriorityQueue?", List.of("O((V + E) log V)", "O(V^2)", "O(E * V)", "O(V log E)"), 0, "Extract-min takes log V for each vertex and edge relaxation pushes up to E edges into heap."));
                pool.add(createQ(534, "What is the state transition for the 0/1 Knapsack problem with item weights W and values V?", List.of("dp[i][w] = max(dp[i-1][w], V[i-1] + dp[i-1][w - W[i-1]])", "dp[i] = dp[i-1] + W[i]", "dp[w] = dp[w] * 2", "dp[i][w] = min(dp[i-1][w], V[i])"), 0, "Either exclude item i or include it and take remainder capacity w - W[i-1]."));
                pool.add(createQ(535, "What is the time complexity to search, insert, and delete a word of length L in a Trie?", List.of("O(L)", "O(N * L)", "O(log N)", "O(1)"), 0, "Trie operations depend strictly on the length of the string L, independent of total words stored."));
            }
        }

        return pool;
    }

    private Map<String, Object> createQ(int id, String q, List<String> opts, int correct, String exp) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", id);
        m.put("question", q);
        m.put("options", opts);
        m.put("correctIndex", correct);
        m.put("explanation", exp);
        return m;
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(@RequestBody Map<String, Object> request) {
        String userEmail = (String) request.getOrDefault("userEmail", "learner@example.com");
        String topic = (String) request.getOrDefault("topic", "Data Structures & Algorithms");
        Integer totalQuestions = (Integer) request.getOrDefault("totalQuestions", 5);
        Integer correctAnswers = (Integer) request.getOrDefault("correctAnswers", 4);
        Integer level = request.containsKey("level") ? Integer.parseInt(request.get("level").toString()) : 1;

        double scorePercentage = ((double) correctAnswers / totalQuestions) * 100.0;
        int passThreshold = getPassScore(level);
        boolean passed = scorePercentage >= passThreshold;

        String assignedLevel;
        if (scorePercentage >= 85.0) assignedLevel = "LEVEL 5 — EXPERT";
        else if (scorePercentage >= 75.0) assignedLevel = "LEVEL " + Math.min(5, level + 1) + " UNLOCKED";
        else assignedLevel = "LEVEL " + level + " IN_PROGRESS";

        QuizAttempt attempt = new QuizAttempt(
                UUID.randomUUID().toString(),
                userEmail,
                topic,
                scorePercentage,
                totalQuestions,
                correctAnswers,
                assignedLevel,
                LocalDateTime.now()
        );
        quizAttemptRepository.save(attempt);

        Map<String, Object> resp = new HashMap<>();
        resp.put("scorePercentage", scorePercentage);
        resp.put("passed", passed);
        resp.put("assignedLevel", assignedLevel);
        resp.put("message", passed ? "Assessment Passed! Next level unlocked." : "Assessment not passed. Review topics and retry.");
        return ResponseEntity.ok(resp);
    }
}
