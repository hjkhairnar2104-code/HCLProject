package com.pathcraft.app.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RagKnowledgeService {

    public static class KnowledgeChunk {
        private final String id;
        private final String title;
        private final String domain;
        private final List<String> keywords;
        private final String summary;
        private final String intuition;
        private final String comparisonTable;
        private final String codeSnippet;
        private final String complexity;
        private final String edgeCases;

        public KnowledgeChunk(String id, String title, String domain, List<String> keywords,
                              String summary, String intuition, String comparisonTable,
                              String codeSnippet, String complexity, String edgeCases) {
            this.id = id;
            this.title = title;
            this.domain = domain;
            this.keywords = keywords;
            this.summary = summary;
            this.intuition = intuition;
            this.comparisonTable = comparisonTable;
            this.codeSnippet = codeSnippet;
            this.complexity = complexity;
            this.edgeCases = edgeCases;
        }

        public String getId() { return id; }
        public String getTitle() { return title; }
        public String getDomain() { return domain; }
        public List<String> getKeywords() { return keywords; }
        public String getSummary() { return summary; }
        public String getIntuition() { return intuition; }
        public String getComparisonTable() { return comparisonTable; }
        public String getCodeSnippet() { return codeSnippet; }
        public String getComplexity() { return complexity; }
        public String getEdgeCases() { return edgeCases; }
    }

    public static class ScoredChunk {
        private final KnowledgeChunk chunk;
        private final double score;

        public ScoredChunk(KnowledgeChunk chunk, double score) {
            this.chunk = chunk;
            this.score = score;
        }

        public KnowledgeChunk getChunk() { return chunk; }
        public double getScore() { return score; }
    }

    private final List<KnowledgeChunk> corpus = new ArrayList<>();

    public RagKnowledgeService() {
        initializeKnowledgeBase();
    }

    public List<ScoredChunk> retrieve(String query, int topK) {
        if (query == null || query.isBlank()) return Collections.emptyList();

        String cleanQuery = query.toLowerCase().trim();
        String[] queryTokens = cleanQuery
                .replaceAll("[^a-zA-Z0-9\\s]", " ")
                .split("\\s+");
        Set<String> tokenSet = new HashSet<>(Arrays.asList(queryTokens));

        List<ScoredChunk> scored = new ArrayList<>();

        for (KnowledgeChunk chunk : corpus) {
            // Guard: LearnPath Platform overview chunk should ONLY match explicit platform questions
            if ("learnpath_platform_features".equals(chunk.getId())) {
                boolean isExplicitPlatformQuestion = cleanQuery.contains("learnpath") ||
                        cleanQuery.contains("what features") ||
                        cleanQuery.contains("platform feature") ||
                        cleanQuery.contains("what can this app do") ||
                        cleanQuery.contains("website feature") ||
                        cleanQuery.contains("platform overview");
                if (!isExplicitPlatformQuestion) {
                    continue;
                }
            }

            double score = 0.0;
            String lowerTitle = chunk.getTitle().toLowerCase();
            String lowerDomain = chunk.getDomain().toLowerCase();

            // 1. Exact Title match boost
            if (lowerTitle.contains(cleanQuery) || cleanQuery.contains(lowerTitle)) {
                score += 15.0;
            }

            // 2. Keyword overlap scoring
            for (String kw : chunk.getKeywords()) {
                String lkw = kw.toLowerCase();
                if (cleanQuery.contains(lkw)) {
                    score += 6.0;
                }
                for (String t : tokenSet) {
                    if (t.length() > 2 && lkw.equals(t)) {
                        score += 3.0;
                    }
                }
            }

            // 3. Token match in title and summary
            for (String t : tokenSet) {
                if (t.length() > 2) {
                    if (lowerTitle.contains(t)) score += 3.0;
                    if (lowerDomain.contains(t)) score += 1.0;
                }
            }

            if (score >= 4.0) {
                scored.add(new ScoredChunk(chunk, score));
            }
        }

        scored.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return scored.stream().limit(topK).collect(Collectors.toList());
    }

    private void initializeKnowledgeBase() {
        // =====================================================================
        // 1. LANGCHAIN & AI AGENTS: COMPLETE ENGINEERING ROADMAP
        // =====================================================================
        corpus.add(new KnowledgeChunk(
                "langchain_ai_agent_roadmap",
                "LangChain & AI Agent Engineering: 4-Week Production Roadmap",
                "Generative AI & LLM Engineering",
                Arrays.asList("langchain", "roadmap", "ai agent", "lcel", "vectorstore", "retrieval", "prompt template", "tools", "langgraph", "rag", "agents", "how to learn langchain"),
                "A complete 4-week step-by-step roadmap to master LangChain, LCEL (LangChain Expression Language), Vector Databases, RAG pipelines, and autonomous AI Agents with LangGraph.",
                "**Comprehensive 4-Week LangChain Mastery Roadmap**:\n\n" +
                "### 📅 Week 1: Core Fundamentals & LCEL Architecture\n" +
                "- **PromptTemplates & Chat Models**: `ChatPromptTemplate`, `FewShotChatMessagePromptTemplate`, System vs Human vs AI messages.\n" +
                "- **Structured Output Parsing**: Using Pydantic parsers (`PydanticOutputParser`, `JsonOutputParser`, `StrOutputParser`) to enforce JSON guarantees.\n" +
                "- **LCEL (LangChain Expression Language)**: The pipe `|` operator composition: `chain = prompt | model | parser`.\n" +
                "- 🛠️ **Hands-on Project**: *Multi-format Code Reviewer & Explanation Bot*.\n\n" +
                "### 📅 Week 2: Document Processing, Embeddings & Vector Stores (RAG)\n" +
                "- **Document Loaders**: PDF, Markdown, CSV, Notion, WebBaseLoader.\n" +
                "- **Text Splitters**: `RecursiveCharacterTextSplitter` (chunk_size=1000, chunk_overlap=200), token-aware chunking.\n" +
                "- **Vector Databases**: Embedding models (OpenAI `text-embedding-3-small`, HuggingFace `all-MiniLM-L6-v2`) with FAISS, Chroma, Pinecone, Qdrant.\n" +
                "- **Advanced Retrievers**: Multi-Query Retriever, ParentDocumentRetriever, Contextual Compression with Cross-Encoders.\n" +
                "- 🛠️ **Hands-on Project**: *Enterprise PDF Documentation Chat with Source Citations*.\n\n" +
                "### 📅 Week 3: Memory, Tools & ReAct Agents\n" +
                "- **Conversation Memory**: `ConversationBufferWindowMemory`, `ConversationSummaryMemory`, SQLite message history.\n" +
                "- **Custom Tool Creation**: Using `@tool` decorator, Pydantic `args_schema`, integrating Tavily Search, SQL Database, Calculator.\n" +
                "- **Agent Executors**: `create_tool_calling_agent`, `create_react_agent` (Reason + Act cycle with step observation).\n" +
                "- 🛠️ **Hands-on Project**: *Autonomous SQL Database Query & Data Visualization Agent*.\n\n" +
                "### 📅 Week 4: LangGraph Multi-Agent Workflows & Production Observability\n" +
                "- **LangGraph State Machines**: Nodes, Edges, Conditional branching, Human-in-the-Loop approval workflows.\n" +
                "- **Evaluation & Tracing**: Integrating LangSmith for latency, token tracing, and RAG evaluation with Ragas framework.\n" +
                "- 🛠️ **Capstone Project**: *Multi-Agent Software Architecture Synthesizer (Researcher + Coder + Reviewer)*.",
                "| Week | Core Focus Area | Key LangChain Modules & Tools | Milestone Project |\n" +
                "| :--- | :--- | :--- | :--- |\n" +
                "| **Week 1** | Prompts, Models & LCEL | `ChatPromptTemplate`, `StrOutputParser`, LCEL `|` | Code Review Bot |\n" +
                "| **Week 2** | Vector Stores & RAG | `RecursiveCharacterTextSplitter`, `FAISS`, Embeddings | PDF Documentation QA |\n" +
                "| **Week 3** | Tools & ReAct Agents | `@tool`, `create_tool_calling_agent`, Memory | SQL Analyst Agent |\n" +
                "| **Week 4** | LangGraph & Multi-Agent | `StateGraph`, LangSmith, Ragas Evaluation | Multi-Agent Dev Studio |",
                "```python\n# Complete Production LangChain LCEL + RAG Pipeline\nfrom langchain_core.prompts import ChatPromptTemplate\nfrom langchain_core.output_parsers import StrOutputParser\nfrom langchain_community.vectorstores import FAISS\nfrom langchain_huggingface import HuggingFaceEmbeddings\nfrom langchain_core.runnables import RunnablePassthrough\n\n# 1. Vector Store Setup\nembeddings = HuggingFaceEmbeddings(model_name=\"all-MiniLM-L6-v2\")\nvectorstore = FAISS.from_texts([\"LangChain is an open-source framework for building LLM applications.\"], embeddings)\nretriever = vectorstore.as_retriever(search_kwargs={\"k\": 2})\n\n# 2. Prompt Template\nprompt = ChatPromptTemplate.from_template(\"\"\"\nAnswer based strictly on the context below:\nContext: {context}\nQuestion: {question}\n\"\"\")\n\n# 3. LCEL Chain with Model\n# chain = {\"context\": retriever, \"question\": RunnablePassthrough()} | prompt | model | StrOutputParser()\n```",
                "**Production Best Practices**:\n- Use **LangGraph** instead of deprecated `AgentExecutor` for stateful multi-step reasoning.\n- Enforce strict typing with Pydantic v2 schemas.\n- Always wrap LLM API calls with exponential backoff retries and token-budget rate limiters.",
                "**Next Steps**:\n- You can practice related GenAI modules inside **My Learning Path &rarr; Generative AI Engineer Track**!"
        ));

        // =====================================================================
        // 2. FULL STACK & JAVASCRIPT VS REACT
        // =====================================================================
        corpus.add(new KnowledgeChunk(
                "fullstack_js_vs_react",
                "JavaScript vs React.js: Core Differences & Architecture",
                "Full Stack Web Development",
                Arrays.asList("javascript", "react", "difference", "vs", "dom", "virtual dom", "vanilla", "framework", "library", "jsx", "components"),
                "JavaScript is the core programming language of the web, while React is a declarative component-based UI library built on top of JavaScript.",
                "**The Fundamental Intuition**:\n" +
                "- **Vanilla JavaScript**: Imperative. You manually locate DOM nodes (`document.getElementById`), mutate them directly, and track UI state changes manually. On large apps, this leads to spaghetti code and poor rendering performance.\n" +
                "- **React**: Declarative & Component-Based. You define what the UI *should* look like given a specific state `UI = f(State)`. When state updates, React constructs a lightweight in-memory **Virtual DOM**, calculates the exact minimum diff (Reconciliation algorithm), and batches real DOM updates efficiently.",
                "| Feature | Vanilla JavaScript | React.js |\n" +
                "| :--- | :--- | :--- |\n" +
                "| **Nature** | Core Programming Language (ECMAScript) | JavaScript Front-end UI Library (by Meta) |\n" +
                "| **DOM Manipulation** | Direct Real DOM Mutation (Slower for heavy trees) | Virtual DOM with Batched Reconciliation Diffing |\n" +
                "| **Paradigm** | Imperative (`document.createElement`) | Declarative Components (`<UserProfile />`) |\n" +
                "| **State Management** | Manual global variables / closures | `useState`, `useReducer`, Context API, Redux |\n" +
                "| **Syntax** | Pure JS + HTML/CSS files | JSX (JavaScript XML syntax extension) |\n" +
                "| **Reusability** | Functions / Manual script modules | Isolated, composable reusable Components |",
                "```javascript\n// 1. Vanilla JavaScript Approach (Imperative)\nconst btn = document.createElement('button');\nlet count = 0;\nbtn.innerText = `Count: ${count}`;\nbtn.addEventListener('click', () => {\n  count++;\n  btn.innerText = `Count: ${count}`;\n});\ndocument.body.appendChild(btn);\n\n// 2. React Approach (Declarative)\nimport React, { useState } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(prev => prev + 1)} className=\"btn-primary\">\n      Count: {count}\n    </button>\n  );\n}\n```",
                "**Performance & Complexity**:\n- Real DOM mutations cause expensive browser layout reflows ($O(N)$ tree recalculations).\n- React's Fiber Reconciler operates in $O(N)$ heuristic diffing time, scheduling updates across priority lanes.",
                "**Interview Traps & Gotchas**:\n1. *React is a library, not a full framework* (unlike Angular/Vue, React relies on external routers like React Router and state managers).\n2. *Direct state mutation*: Never write `state.count = 5` in React; always use setter functions to trigger re-renders."
        ));

        // =====================================================================
        // 3. DSA: TRIE (PREFIX TREE)
        // =====================================================================
        corpus.add(new KnowledgeChunk(
                "dsa_trie_prefix_tree",
                "Trie (Prefix Tree) Data Structure & Autocomplete",
                "Data Structures & Algorithms",
                Arrays.asList("trie", "prefix tree", "autocomplete", "dictionary", "search prefix", "insert", "search", "startswith"),
                "A Trie is a tree data structure used for storing dynamic sets of strings, enabling O(L) prefix search and dictionary lookups.",
                "**The Fundamental Intuition**:\n" +
                "Instead of comparing full strings against an array of $N$ words ($O(N \\cdot L)$), a Trie breaks each string into character edges. Words with common prefixes share the same branch (e.g. `\"cat\"` and `\"car\"` share `c -> a`).",
                "| Operation | Hash Table / HashMap | Trie (Prefix Tree) | Balanced BST |\n" +
                "| :--- | :--- | :--- | :--- |\n" +
                "| **Exact Search** | $O(L)$ Average | $O(L)$ Strict Guarantee | $O(L \\log N)$ |\n" +
                "| **Prefix Search (`startsWith`)** | $O(N \\cdot L)$ (Must scan all keys) | $O(L)$ Optimal | $O(L \\log N)$ |\n" +
                "| **Alphabetical Ordering** | Not preserved | Automatically ordered | Inorder traversal |\n" +
                "| **Space Overhead** | Hash table overhead | Pointer arrays ($26$ per node) | Tree pointers |",
                "```java\nclass TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    boolean isEndOfWord = false;\n}\n\npublic class Trie {\n    private final TrieNode root = new TrieNode();\n\n    // Insert: O(L) Time, O(L) Space\n    public void insert(String word) {\n        TrieNode curr = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) {\n                curr.children[idx] = new TrieNode();\n            }\n            curr = curr.children[idx];\n        }\n        curr.isEndOfWord = true;\n    }\n\n    // Search: O(L) Time, O(1) Space\n    public boolean search(String word) {\n        TrieNode node = findNode(word);\n        return node != null && node.isEndOfWord;\n    }\n\n    // Prefix Check: O(L) Time, O(1) Space\n    public boolean startsWith(String prefix) {\n        return findNode(prefix) != null;\n    }\n\n    private TrieNode findNode(String str) {\n        TrieNode curr = root;\n        for (char c : str.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) return null;\n            curr = curr.children[idx];\n        }\n        return curr;\n    }\n}\n```",
                "**Complexity Analysis**:\n- **Time**: Insertion and Search take strictly $O(L)$ where $L$ is the word length (independent of dictionary size $N$).\n- **Space**: $O(\\Sigma \\cdot L \\cdot N)$ where $\\Sigma = 26$.",
                "**Interview Traps & Advanced Applications**:\n- **Bitwise / Binary Trie**: Used for finding *Maximum XOR of Two Numbers* in $O(32 \\cdot N) = O(N)$ time.\n- **Wildcard Search**: DFS backtracking for `.` matching (LeetCode 211)."
        ));

        // =====================================================================
        // 4. DSA: DYNAMIC PROGRAMMING (0/1 KNAPSACK & 1D OPTIMIZATION)
        // =====================================================================
        corpus.add(new KnowledgeChunk(
                "dsa_dp_knapsack",
                "0/1 Knapsack Problem & 1D Space Optimization",
                "Data Structures & Algorithms",
                Arrays.asList("knapsack", "dp", "dynamic programming", "0/1 knapsack", "space optimization", "subset sum", "memoization"),
                "0/1 Knapsack maximizes total value within weight capacity W where each item can be chosen at most once.",
                "**The Fundamental Intuition**:\n" +
                "At each item $i$, we make a binary choice: either **include** the item (earning `val[i]` and consuming `wt[i]`) or **exclude** it. We transition from subproblems: `dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]])`.",
                "| Implementation | Time Complexity | Space Complexity | Notes |\n" +
                "| :--- | :--- | :--- | :--- |\n" +
                "| **Recursive (Naive)** | $O(2^N)$ | $O(N)$ Stack | Exponential branching |\n" +
                "| **2D Table DP** | $O(N \\cdot W)$ | $O(N \\cdot W)$ | Easy to trace backtrack path |\n" +
                "| **1D Array DP** | $O(N \\cdot W)$ | $O(W)$ Optimal | Traversed in reverse order |",
                "```java\n// Space-Optimized 1D DP Solution\npublic class KnapsackSolver {\n    public int solveKnapsack(int[] wt, int[] val, int W) {\n        int[] dp = new int[W + 1];\n        \n        for (int i = 0; i < wt.length; i++) {\n            // CRITICAL: Reverse loop ensures each item is used at most ONCE (0/1)\n            for (int w = W; w >= wt[i]; w--) {\n                dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);\n            }\n        }\n        return dp[W];\n    }\n}\n```",
                "**Complexity Analysis**:\n- **Time**: $O(N \\cdot W)$ pseudo-polynomial.\n- **Space**: $O(W)$ using 1D space optimization.",
                "**Interview Traps**:\n- If you iterate $w$ in forward direction (`0 -> W`), it solves the **Unbounded Knapsack** (infinite item reuse) instead of 0/1 Knapsack!"
        ));

        // =====================================================================
        // 5. SYSTEM DESIGN: KAFKA & DISTRIBUTED EVENT STREAMING
        // =====================================================================
        corpus.add(new KnowledgeChunk(
                "sysdesign_kafka",
                "Apache Kafka: Partitions, Consumer Groups & Offsets",
                "System Design & Distributed Systems",
                Arrays.asList("kafka", "event streaming", "partition", "consumer group", "offset", "broker", "lag", "pubsub", "distributed queue"),
                "Apache Kafka is a distributed, partitioned, replicated append-only commit log providing massive throughput and fault tolerance.",
                "**The Fundamental Intuition**:\n" +
                "- **Partition as Unit of Parallelism**: Topics are divided into partitions. Ordering is guaranteed strictly *within a single partition*, not across the entire topic.\n" +
                "- **Consumer Groups**: Multiple consumers in a group divide partitions evenly. If consumers > partitions, idle consumers remain on standby.",
                "| Component | Role | Scalability Invariant |\n" +
                "| :--- | :--- | :--- |\n" +
                "| **Partition** | Ordered, immutable log | Determines max concurrency of consumer group |\n" +
                "| **Consumer Offset** | Pointer to last read message | Persisted in internal topic `__consumer_offsets` |\n" +
                "| **ISR (In-Sync Replicas)** | Follower brokers catching up to leader | `min.insync.replicas` guarantees zero message loss |\n" +
                "| **Producer `acks=all`** | Strongest durability guarantee | Leader waits for all ISRs before acknowledging |",
                "```java\n// Kafka Producer Configuration with Zero Data Loss Invariants\nProperties props = new Properties();\nprops.put(\"bootstrap.servers\", \"kafka1:9092,kafka2:9092\");\nprops.put(\"key.serializer\", \"org.apache.kafka.common.serialization.StringSerializer\");\nprops.put(\"value.serializer\", \"org.apache.kafka.common.serialization.StringSerializer\");\nprops.put(\"acks\", \"all\"); // Wait for all in-sync replicas\nprops.put(\"enable.idempotence\", \"true\"); // Prevent duplicate deliveries\nprops.put(\"retries\", Integer.MAX_VALUE);\n```",
                "**Throughput & Latency**:\n- Sequential disk writes + OS PageCache + Zero-Copy DMA (`sendfile`) deliver millions of msgs/sec.",
                "**Interview Traps**:\n- Consumer Lag spikes when message processing time exceeds ingestion rate. Scale by increasing partition count and consumer instances."
        ));

        // =====================================================================
        // 6. GENAI: RAG & CROSS-ENCODER RERANKING
        // =====================================================================
        corpus.add(new KnowledgeChunk(
                "genai_rag_architecture",
                "Enterprise RAG Pipeline: Hybrid Search & Cross-Encoder Reranking",
                "Generative AI & LLM Engineering",
                Arrays.asList("rag", "retrieval", "cross-encoder", "reranking", "vector", "embedding", "bm25", "hybrid search", "hallucination"),
                "RAG retrieves relevant private context chunks from a vector index and injects them into the prompt to eliminate LLM hallucinations.",
                "**The Fundamental Intuition**:\n" +
                "- **Bi-Encoder (Vector Search)**: Fast $O(\\log N)$ lookup by comparing pre-computed embeddings via cosine similarity, but lacks nuanced query-document cross-attention.\n" +
                "- **Cross-Encoder Reranker**: Computes deep self-attention across `(Query, Document)` pairs simultaneously to score true semantic relevance, filtering top-3 passages.",
                "| Stage | Mechanism | Latency | Accuracy / Granularity |\n" +
                "| :--- | :--- | :--- |\n" +
                "| **1. Hybrid Retrieval** | BM25 (Keywords) + Dense Vector (HNSW) via RRF | ~10-20 ms | High Recall (Top 50 Candidates) |\n" +
                "| **2. Cross-Encoder** | Joint Self-Attention (`ms-marco-MiniLM`) | ~40-60 ms | High Precision (Top 3-5 Chunks) |\n" +
                "| **3. LLM Synthesis** | Grounded Generation with Source Citations | ~500 ms | 0% Hallucination Guarantee |",
                "```python\n# Production Cross-Encoder Reranking Pipeline\nfrom sentence_transformers import CrossEncoder\n\nreranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')\n\ndef rerank_chunks(query, retrieved_passages, top_k=3):\n    # Form (query, document) pairs for joint cross-attention\n    pairs = [[query, doc['text']] for doc in retrieved_passages]\n    scores = reranker.predict(pairs)\n    \n    for idx, score in enumerate(scores):\n        retrieved_passages[idx]['rerank_score'] = float(score)\n        \n    retrieved_passages.sort(key=lambda x: x['rerank_score'], reverse=True)\n    return retrieved_passages[:top_k]\n```",
                "**Mathematical Formulation**:\n- Reciprocal Rank Fusion: $RRF(d) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}$ where $k=60$.",
                "**Interview Traps**:\n- *Lost in the middle phenomenon*: LLMs pay more attention to the beginning and end of injected context. Place highest-scoring chunks at the extremes."
        ));

        // =====================================================================
        // 7. JAVA 21: VIRTUAL THREADS VS CARRIER THREADS
        // =====================================================================
        corpus.add(new KnowledgeChunk(
                "java21_virtual_threads",
                "Java 21 Project Loom: Virtual Threads vs Carrier Threads",
                "Java & Backend Engineering",
                Arrays.asList("java", "virtual threads", "carrier threads", "project loom", "concurrency", "platform threads", "fibers"),
                "Virtual threads are lightweight JVM-managed threads designed to scale high-throughput I/O bound concurrent applications.",
                "**The Fundamental Intuition**:\n" +
                "- **Platform Threads**: OS threads with ~1MB allocated stack memory. Creating 10,000 platform threads consumes ~10GB RAM and causes heavy context switching.\n" +
                "- **Virtual Threads**: JVM constructs tiny heap objects (~few hundred bytes). When a Virtual Thread hits blocking I/O (e.g. database query, socket read), the JVM **unmounts** it from the underlying OS Carrier Thread, allowing the Carrier Thread to execute other work!",
                "| Dimension | Platform Thread (OS Thread) | Virtual Thread (Java 21 Project Loom) |\n" +
                "| :--- | :--- | :--- |\n" +
                "| **Management** | Managed by Host Operating System Kernel | Managed by JVM Runtime in User-space |\n" +
                "| **Memory Cost** | ~1 MB Reserved Stack Memory | ~几百 bytes to a few KB on Heap |\n" +
                "| **Creation Limit** | Few thousands before `OutOfMemoryError` | Millions concurrently active |\n" +
                "| **Blocking I/O** | Blocks OS thread completely | Unmounts virtual thread, frees carrier thread |\n" +
                "| **Pooling Policy** | Must use Thread Pool (`Executors.newFixedThreadPool`) | Never pool! Create on-demand per request |",
                "```java\n// Java 21 Structured Concurrency with Virtual Threads\ntry (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n    IntStream.range(0, 100_000).forEach(i -> {\n        executor.submit(() -> {\n            // Blocking HTTP/DB call unmounts without consuming OS thread\n            Thread.sleep(1000);\n            return \"Result \" + i;\n        });\n    });\n} // Auto-closes and waits for all 100k tasks to finish\n```",
                "**Performance Impact**:\n- Increases server throughput by 10x-50x for I/O-bound microservices without writing complex reactive (`Mono`/`Flux`) code.",
                "**Interview Traps (Thread Pinning)**:\n- Pinning occurs when virtual thread executes inside a `synchronized` block or native method, preventing unmounting. Replace `synchronized` with `ReentrantLock`."
        ));

        // =====================================================================
        // 8. LEARNPATH AI: PLATFORM ARCHITECTURE & TOOLS OVERVIEW
        // =====================================================================
        corpus.add(new KnowledgeChunk(
                "learnpath_platform_features",
                "LearnPath AI Platform Features & Engineering Suite",
                "LearnPath Platform",
                Arrays.asList("learnpath", "what can this app do", "platform features", "what features does learnpath offer"),
                "LearnPath AI is an all-in-one AI-powered engineering career companion featuring interactive algorithm visualization, ATS resume builder, resume gap analysis, real-time job matching, and AI tutoring.",
                "**Core Platform Modules & Capabilities**:\n" +
                "1. 💻 **Algorithm Visualizer (Interactive Canvas)**: Step-by-step interactive animations for 12 core algorithms with custom inputs and speed controls.\n" +
                "2. 📄 **Resume Gap AI & 30-Day Job Roadmap**: Ingests resumes, scores ATS strength, and generates tailored 30-day interview prep roadmaps.\n" +
                "3. 📝 **Step-by-Step ATS Resume Builder**: 7-step builder with live A4 preview and 100% free unwatermarked PDF export.\n" +
                "4. 💼 **Find Jobs & Live Skill Match (Adzuna Integration)**: Real employer listings with real-time skill overlap scoring.\n" +
                "5. 🎯 **Adaptive My Learning Path**: Milestone curriculum with progress tracking across 14 engineering domains.\n" +
                "6. 🎙️ **Live Voice AI Mock Interview**: Real-time voice simulation with Speech-to-Text.\n" +
                "7. ⚔️ **Practice Hub & DSA Sheet**: 450+ curated problem tracker with LeetCode/GFG sync.\n" +
                "8. 📊 **5-Level Assessment Quiz Engine**: Adaptive difficulty quizzes with real-time scoring.\n" +
                "9. 🤖 **AI Technical Tutor (RAG-Powered)**: Multi-turn engineering mentor with grounded retrieval.",
                "| Platform Feature | Primary Purpose | Tech Stack / Mechanism |\n" +
                "| :--- | :--- | :--- |\n" +
                "| **Algorithm Visualizer** | Visual mental models of complex DSA | HTML5 Canvas / React Animation State |\n" +
                "| **Resume Gap AI** | Identify missing skills & 30-day sprint | Client PDF.js NLP + Tailored 4-Week Scheduler |\n" +
                "| **ATS Resume Builder** | Build recruiter-ready PDF resumes | 7-Step Stepper + A4 Isolated Print Engine |\n" +
                "| **Live Jobs Engine** | Match real employer openings | Official Adzuna REST API + Skill Overlap Engine |\n" +
                "| **Live Voice Interview** | Spoken interview simulation | Web Speech API STT/TTS + Gemini Evaluation |\n" +
                "| **Practice Hub (450+)** | DSA Mastery with LeetCode/GFG stats | Topic-based Problem Bank with Solved Tracking |\n" +
                "| **AI Technical Tutor** | Grounded code & architectural mentor | In-Memory RAG Vector Store + HuggingFace/Gemini |",
                "```bash\n# Key Navigation Routes in LearnPath AI\n/overview           -> Dashboard & Progress Metrics\n/learning-path      -> Personalized Milestone Curriculum\n/algo-visualizer    -> 12 Interactive Algorithm Animations\n/resume-gap         -> PDF Resume Audit, 5 Curated Jobs & 30-Day Roadmap\n/resume-builder     -> 7-Step ATS Resume Builder & Free PDF Export\n/jobs               -> Adzuna Real-time Job Search & Skill Match\n/voice-interview    -> Live Speech Mock Interview Simulation\n/practice           -> 450+ Topic DSA Sheet & LeetCode/GFG Sync\n/quiz               -> 5-Level Adaptive Skill Assessment\n```",
                "**Quick Navigation**:\n- Use the sidebar navigation menu on the left to switch between any of these tools instantly!"
        ));
    }
}
