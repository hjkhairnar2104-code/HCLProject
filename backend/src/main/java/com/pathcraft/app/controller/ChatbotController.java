package com.pathcraft.app.controller;

import com.pathcraft.app.service.RagKnowledgeService;
import com.pathcraft.app.service.RagSynthesisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping({"/api/chatbot", "/api/chat"})
public class ChatbotController {

    private final RagSynthesisService ragSynthesisService;
    private final RagKnowledgeService ragKnowledgeService;

    public ChatbotController(RagSynthesisService ragSynthesisService, RagKnowledgeService ragKnowledgeService) {
        this.ragSynthesisService = ragSynthesisService;
        this.ragKnowledgeService = ragKnowledgeService;
    }

    @PostMapping({"/ask", "/chat", ""})
    public ResponseEntity<Map<String, Object>> askChatbot(@RequestBody Map<String, Object> req) {
        String userMessage = "";
        if (req.containsKey("message")) userMessage = String.valueOf(req.get("message"));
        else if (req.containsKey("userMessage")) userMessage = String.valueOf(req.get("userMessage"));
        else if (req.containsKey("query")) userMessage = String.valueOf(req.get("query"));
        else if (req.containsKey("prompt")) userMessage = String.valueOf(req.get("prompt"));

        String userContext = req.containsKey("userContext") ? String.valueOf(req.get("userContext")) : "Target: Software & AI Engineer";

        List<Map<String, Object>> historyList = null;
        if (req.containsKey("history") && req.get("history") instanceof List) {
            historyList = (List<Map<String, Object>>) req.get("history");
        }

        if (userMessage == null || userMessage.trim().isBlank()) {
            return ResponseEntity.ok(Map.of(
                    "response", "👋 Hello! How can I assist you with your learning path or technical concepts today?",
                    "reply", "👋 Hello! How can I assist you with your learning path or technical concepts today?"
            ));
        }

        userMessage = userMessage.trim();
        String lower = userMessage.toLowerCase();

        // 1. Quick conversational greeting checks (instant response)
        if (isGreeting(lower)) {
            String greetingResponse = getGreetingResponse(lower);
            Map<String, Object> out = new HashMap<>();
            out.put("response", greetingResponse);
            out.put("reply", greetingResponse);
            return ResponseEntity.ok(out);
        }

        // 2. Full RAG (Retrieval-Augmented Generation) Pipeline with Multi-Turn History
        String synthesizedAnswer = ragSynthesisService.synthesize(userMessage, userContext, historyList);
        Map<String, Object> out = new HashMap<>();
        out.put("response", synthesizedAnswer);
        out.put("reply", synthesizedAnswer);
        return ResponseEntity.ok(out);
    }

    @GetMapping("/rag/search")
    public ResponseEntity<List<RagKnowledgeService.ScoredChunk>> ragSearch(@RequestParam("q") String query,
                                                                          @RequestParam(value = "topK", defaultValue = "3") int topK) {
        return ResponseEntity.ok(ragKnowledgeService.retrieve(query, topK));
    }

    private boolean isGreeting(String lower) {
        return lower.equals("hi") || lower.equals("hello") || lower.equals("hey") ||
                lower.equals("hi there") || lower.equals("hello there") || lower.equals("hey there") ||
                lower.equals("good morning") || lower.equals("good afternoon") || lower.equals("good evening") ||
                lower.equals("who are you") || lower.equals("what can you do") || lower.equals("how are you");
    }

    private String getGreetingResponse(String lower) {
        if (lower.contains("who are you") || lower.contains("what can you do")) {
            return "👋 I'm your **LearnPath AI Tutor & Engineering Mentor**!\n\n" +
                    "I can provide deep architectural guides, working code snippets, complexity proofs, and interview solutions across:\n" +
                    "- ⚔️ **Data Structures & Algorithms**: Tries, Segment Trees, Graphs, DP, Trees, Monotonic Stacks, Heaps\n" +
                    "- 🏗️ **System Design & Distributed Systems**: Caching, Redis, Kafka, Microservices, Sharding, B-Trees\n" +
                    "- 🤖 **Generative AI & LLMs**: RAG pipelines, Cross-Encoders, Prompt Engineering, Transformers, Embeddings\n" +
                    "- 🚢 **DevOps & Cloud**: Docker multi-stage builds, Kubernetes pods, CI/CD, Terraform, Prometheus\n" +
                    "- 💻 **Full Stack Engineering**: Java 21 Virtual Threads, Spring Boot, React, Node.js, SQL, MongoDB\n\n" +
                    "Ask me anything or paste code you want to debug or optimize!";
        }

        return "👋 Hello! I'm your **LearnPath AI Technical Mentor**.\n\n" +
                "How can I help you level up today? You can ask me to:\n" +
                "1. 💡 **Explain any data structure or algorithm** (e.g. *\"Explain Trie with Java code\"*, *\"How does Dijkstra work?\"*)\n" +
                "2. 🏗️ **Design scalable distributed systems** (e.g. *\"How does Kafka partition replication work?\"*)\n" +
                "3. 🤖 **Deconstruct GenAI architectures** (e.g. *\"Explain RAG Cross-Encoder reranking\"*)\n" +
                "4. 💻 **Provide clean code templates** in Java, Python, JavaScript, or C++\n\n" +
                "What topic would you like to explore?";
    }

    private String generateIntelligentKnowledgeResponse(String msg, String lower) {
        // =========================================================================
        // 1. TRIE / PREFIX TREE
        // =========================================================================
        if (lower.contains("trie") || lower.contains("prefix tree") || lower.contains("autocomplete")) {
            return "### 🌲 Trie (Prefix Tree) Data Structure Deep Dive\n\n" +
                    "**1. What is a Trie?**\n" +
                    "A **Trie** (pronounced *\"try\"*, from re**trie**val) is a tree-like data structure used to store and search a dynamic set of strings where keys are usually sequences of characters. It is optimal for **prefix-based operations**, dictionary lookups, spell checkers, IP routing tables, and search engine autocomplete.\n\n" +
                    "**2. Core Node Structure & Invariants**:\n" +
                    "- Each node contains an array or map of child links (typically `size = 26` for lowercase English letters).\n" +
                    "- A boolean flag `isEndOfWord` marks if a path ending at this node forms a complete word.\n\n" +
                    "```java\n// Complete Java Trie Implementation\nclass TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    boolean isEndOfWord = false;\n}\n\npublic class Trie {\n    private final TrieNode root;\n\n    public Trie() {\n        root = new TrieNode();\n    }\n\n    // Insert a word into the Trie: O(L) time\n    public void insert(String word) {\n        TrieNode curr = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) {\n                curr.children[idx] = new TrieNode();\n            }\n            curr = curr.children[idx];\n        }\n        curr.isEndOfWord = true;\n    }\n\n    // Search if word exists: O(L) time\n    public boolean search(String word) {\n        TrieNode node = findNode(word);\n        return node != null && node.isEndOfWord;\n    }\n\n    // Check if any word starts with prefix: O(L) time\n    public boolean startsWith(String prefix) {\n        return findNode(prefix) != null;\n    }\n\n    private TrieNode findNode(String str) {\n        TrieNode curr = root;\n        for (char c : str.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) return null;\n            curr = curr.children[idx];\n        }\n        return curr;\n    }\n}\n```\n\n" +
                    "**3. Complexity Analysis**:\n" +
                    "- **Insert**: $O(L)$ time, where $L$ is the length of the string.\n" +
                    "- **Search / Prefix**: $O(L)$ time — completely **independent of the total number of words $N$** in the dictionary!\n" +
                    "- **Space Complexity**: $O(\\Sigma \\cdot L \\cdot N)$ in worst-case, where $\\Sigma = 26$ is alphabet size.\n\n" +
                    "**4. Advanced Interview Applications**:\n" +
                    "- **Binary Trie (Bitwise Trie)**: Stores 32-bit integers bit-by-bit to solve *Maximum XOR of Two Numbers in an Array* in $O(32 \\cdot N) = O(N)$ time.\n" +
                    "- **Wildcard Search**: Depth-First Search with backtracking to support `'.'` regex matching (LeetCode 211).";
        }

        // =========================================================================
        // 2. SEGMENT TREE & FENWICK TREE (BIT)
        // =========================================================================
        if (lower.contains("segment tree") || lower.contains("fenwick") || lower.contains("binary indexed tree") || lower.contains("range query")) {
            return "### 🌳 Segment Tree & Binary Indexed Tree (BIT)\n\n" +
                    "**1. Purpose & Motivation**:\n" +
                    "When an array undergoes frequent **Point Updates** and **Range Queries** (Sum, Min, Max, GCD), naive arrays take $O(1)$ update and $O(N)$ query, while prefix sum arrays take $O(1)$ query but $O(N)$ update. Segment Trees and Fenwick Trees achieve strict **$O(\\log N)$ for BOTH operations**.\n\n" +
                    "**2. Fenwick Tree (Binary Indexed Tree) Implementation**:\n" +
                    "Uses two's complement bit manipulation `(i & -i)` to extract the Lowest Set Bit (LSB) representing the length of the interval governed by index `i`.\n\n" +
                    "```java\npublic class FenwickTree {\n    private final int[] tree;\n    private final int n;\n\n    public FenwickTree(int n) {\n        this.n = n;\n        this.tree = new int[n + 1];\n    }\n\n    // Point update: Add delta to index i in O(log N)\n    public void add(int i, int delta) {\n        for (; i <= n; i += (i & -i)) {\n            tree[i] += delta;\n        }\n    }\n\n    // Prefix sum query [1...i] in O(log N)\n    public int query(int i) {\n        int sum = 0;\n        for (; i > 0; i -= (i & -i)) {\n            sum += tree[i];\n        }\n        return sum;\n    }\n\n    // Range sum query [L...R] in O(log N)\n    public int rangeSum(int l, int r) {\n        return query(r) - query(l - 1);\n    }\n}\n```\n\n" +
                    "**3. Segment Tree with Lazy Propagation**:\n" +
                    "- Built over an array of size $4N$.\n" +
                    "- **Lazy Propagation** buffers updates in internal nodes so that whole ranges $[L, R]$ are updated in $O(\\log N)$ without visiting individual leaves until queried.";
        }

        // =========================================================================
        // 3. BINARY TREES, BST & LOWEST COMMON ANCESTOR (LCA)
        // =========================================================================
        if (lower.contains("bst") || lower.contains("binary search tree") || lower.contains("lca") || lower.contains("tree traversal") || lower.contains("binary tree")) {
            return "### 🌲 Binary Trees & Binary Search Tree (BST) Architecture\n\n" +
                    "**1. BST Invariant**:\n" +
                    "For every node $X$, all keys in the left subtree must be $< X.val$, and all keys in the right subtree must be $> X.val$.\n" +
                    "- **Inorder Traversal** (Left $\\rightarrow$ Root $\\rightarrow$ Right) of a BST yields keys in strictly ascending sorted order.\n\n" +
                    "**2. Lowest Common Ancestor (LCA) in Binary Tree**:\n" +
                    "```java\npublic TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    if (root == null || root == p || root == q) return root;\n    TreeNode left = lowestCommonAncestor(root.left, p, q);\n    TreeNode right = lowestCommonAncestor(root.right, p, q);\n    if (left != null && right != null) return root; // p and q are in separate subtrees\n    return left != null ? left : right;\n}\n```\n\n" +
                    "**3. BST Node Deletion (3 Cases)**:\n" +
                    "1. **Leaf Node**: Remove parent pointer ($O(H)$).\n" +
                    "2. **Single Child**: Splice child directly to parent ($O(H)$).\n" +
                    "3. **Two Children**: Find **Inorder Successor** (smallest in right subtree), copy its value to the current node, then delete the successor.";
        }

        // =========================================================================
        // 4. GRAPH ALGORITHMS (DIJKSTRA, TOPOLOGICAL SORT, DSU)
        // =========================================================================
        if (lower.contains("graph") || lower.contains("dijkstra") || lower.contains("topological") || lower.contains("kahn") || lower.contains("union find") || lower.contains("dsu")) {
            return "### 🌐 Graph Algorithms & Shortest Paths\n\n" +
                    "**1. Dijkstra’s Algorithm (Single-Source Shortest Path)**:\n" +
                    "- Works on weighted graphs with **non-negative weights**.\n" +
                    "- Uses a Min-PriorityQueue to greedily process the vertex with minimum tentative distance.\n" +
                    "- **Complexity**: $O((V + E) \\log V)$ time using an adjacency list and binary heap.\n\n" +
                    "```java\npublic int[] dijkstra(int n, List<int[]>[] adj, int src) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));\n    pq.offer(new int[]{src, 0});\n\n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int u = curr[0], d = curr[1];\n        if (d > dist[u]) continue;\n        for (int[] edge : adj[u]) {\n            int v = edge[0], weight = edge[1];\n            if (dist[u] + weight < dist[v]) {\n                dist[v] = dist[u] + weight;\n                pq.offer(new int[]{v, dist[v]});\n            }\n        }\n    }\n    return dist;\n}\n```\n\n" +
                    "**2. Kahn’s Algorithm (Topological Sort & Cycle Detection in DAG)**:\n" +
                    "1. Compute in-degree for all vertices.\n" +
                    "2. Enqueue all vertices with in-degree = 0.\n" +
                    "3. Dequeue node, add to topo order, decrement neighbor in-degrees.\n" +
                    "4. If processed count $< V$, graph contains at least one directed cycle.";
        }

        // =========================================================================
        // 5. DYNAMIC PROGRAMMING (KNAPSACK, LCS, LIS, INTERVAL DP)
        // =========================================================================
        if (lower.contains("dp") || lower.contains("dynamic programming") || lower.contains("knapsack") || lower.contains("lcs") || lower.contains("lis")) {
            return "### ⚡ Dynamic Programming (DP) Core Patterns\n\n" +
                    "**1. The 0/1 Knapsack Pattern & 1D Space Optimization**:\n" +
                    "Given weights `wt[]` and values `val[]`, maximize value within capacity `W` where each item is chosen at most once.\n\n" +
                    "```java\n// Space Optimized 1D DP: O(N * W) time, O(W) space\npublic int knapsack(int[] wt, int[] val, int W) {\n    int[] dp = new int[W + 1];\n    for (int i = 0; i < wt.length; i++) {\n        for (int w = W; w >= wt[i]; w--) { // Reverse order ensures 0/1 choice\n            dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);\n        }\n    }\n    return dp[W];\n}\n```\n\n" +
                    "**2. Longest Common Subsequence (LCS)**:\n" +
                    "- State: $dp[i][j]$ = length of LCS of $s_1[0\\dots i-1]$ and $s_2[0\\dots j-1]$.\n" +
                    "- Transition: If $s_1[i-1] == s_2[j-1]$, $dp[i][j] = 1 + dp[i-1][j-1]$; else $\\max(dp[i-1][j], dp[i][j-1])$.\n\n" +
                    "**3. Longest Increasing Subsequence (LIS)**:\n" +
                    "- Solvable in $O(N \\log N)$ using **Patience Sorting with Binary Search** (`Collections.binarySearch`).";
        }

        // =========================================================================
        // 6. SLIDING WINDOW & TWO POINTERS & ARRAYS
        // =========================================================================
        if (lower.contains("sliding window") || lower.contains("two pointer") || lower.contains("kadane") || lower.contains("array")) {
            return "### ⚔️ Sliding Window, Two Pointers & Subarray Invariants\n\n" +
                    "**1. Variable-Size Sliding Window Template**:\n" +
                    "```java\nint left = 0, maxLen = 0;\nfor (int right = 0; right < nums.length; right++) {\n    // 1. Expand right and add element to window state\n    add(nums[right]);\n    \n    // 2. Shrink from left while window condition is invalid\n    while (isInvalidWindow()) {\n        remove(nums[left++]);\n    }\n    \n    // 3. Update global answer\n    maxLen = Math.max(maxLen, right - left + 1);\n}\n```\n\n" +
                    "**2. Kadane’s Algorithm (Maximum Subarray Sum)**:\n" +
                    "- $O(N)$ time, $O(1)$ auxiliary space.\n" +
                    "- Invariant: `currentMax = Math.max(nums[i], currentMax + nums[i])`, `globalMax = Math.max(globalMax, currentMax)`.";
        }

        // =========================================================================
        // 7. SYSTEM DESIGN & DISTRIBUTED SYSTEMS
        // =========================================================================
        if (lower.contains("system design") || lower.contains("kafka") || lower.contains("redis") || lower.contains("caching") || lower.contains("sharding") || lower.contains("microservices")) {
            return "### 🏗️ High-Scale Distributed System Architecture\n\n" +
                    "**1. Caching Strategies (Redis / Memcached)**:\n" +
                    "- **Cache-Aside**: Application queries cache first; on miss, loads from DB and writes to cache with TTL.\n" +
                    "- **Write-Through**: Application writes to cache, and cache synchronously writes to DB.\n" +
                    "- **Write-Back (Write-Behind)**: Writes to cache immediately and asynchronously flushes to DB in batches.\n\n" +
                    "**2. Distributed Event Streaming (Apache Kafka)**:\n" +
                    "- **Partitions**: Unit of parallelism and strict message ordering.\n" +
                    "- **Consumer Groups**: Each partition is consumed by exactly one consumer within a group.\n" +
                    "- **Replication & ISR**: In-Sync Replicas guarantee zero data loss if leader broker fails.\n\n" +
                    "**3. Database Partitioning & Sharding**:\n" +
                    "- **Consistent Hashing**: Minimizes key redistribution when nodes are added or removed ($O(K/N)$ keys remapped).";
        }

        // =========================================================================
        // 8. GENERATIVE AI, RAG & LLMs
        // =========================================================================
        if (lower.contains("rag") || lower.contains("llm") || lower.contains("transformer") || lower.contains("embedding") || lower.contains("lora") || lower.contains("cross-encoder")) {
            return "### 🤖 Generative AI & Enterprise RAG Pipelines\n\n" +
                    "**1. Production Hybrid RAG Architecture**:\n" +
                    "1. **Chunking**: Recursive character splitting with metadata tags.\n" +
                    "2. **Hybrid Retrieval**: Combine dense semantic embeddings (cosine similarity via Vector DB) + sparse keyword matching (BM25) using Reciprocal Rank Fusion (RRF).\n" +
                    "3. **Cross-Encoder Reranking**: Pass `(query, document)` jointly through a cross-encoder to compute cross-attention relevance scores, filtering top 3–5 context passages.\n" +
                    "4. **LLM Generation**: Prompt with strict grounding constraints to eliminate hallucinations.\n\n" +
                    "**2. Transformer Self-Attention Equation**:\n" +
                    "\\[ \\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V \\]\n" +
                    "- Dividing by $\\sqrt{d_k}$ prevents the dot products from growing excessively large, avoiding vanishing gradients in the softmax function.";
        }

        // =========================================================================
        // 9. JAVA 21 & SPRING BOOT & CONCURRENCY
        // =========================================================================
        if (lower.contains("java") || lower.contains("spring") || lower.contains("virtual thread") || lower.contains("multithreading") || lower.contains("carrier thread")) {
            return "### ☕ Java 21 & Spring Boot Enterprise Concurrency\n\n" +
                    "**1. Virtual Threads (Project Loom) vs Platform Threads**:\n" +
                    "- **Platform Threads**: $1:1$ mapping to OS threads (heavyweight, ~1MB stack memory, capped at thousands).\n" +
                    "- **Virtual Threads**: Lightweight JVM-managed user threads (~few KB stack). Millions can run concurrently.\n" +
                    "- **Carrier Threads**: Virtual threads mount onto underlying OS carrier threads; when doing blocking I/O (e.g. database query, HTTP call), the virtual thread unmounts, freeing the carrier thread for other work.\n\n" +
                    "**2. Spring Boot Architecture**:\n" +
                    "- **IoC / DI**: Spring Container manages bean lifecycles and injects dependencies via constructor injection.\n" +
                    "- **HikariCP**: High-performance connection pooling ensuring zero database connection leaks.";
        }

        // =========================================================================
        // 10. REACT & FRONTEND
        // =========================================================================
        if (lower.contains("react") || lower.contains("useeffect") || lower.contains("usestate") || lower.contains("hook") || lower.contains("javascript") || lower.contains("frontend")) {
            return "### ⚛️ Modern React & State Synchronization\n\n" +
                    "**1. Rules of useEffect & Lifecycles**:\n" +
                    "- `useEffect` runs *after* the browser paints to avoid blocking user interactions.\n" +
                    "- Always return a **cleanup function** when subscribing to WebSockets, intervals, or registering window event listeners.\n" +
                    "- Use `AbortController` inside `useEffect` to cancel in-flight HTTP requests when components unmount.\n\n" +
                    "**2. Performance Optimization**:\n" +
                    "- `useCallback`: Memoizes function instances across re-renders.\n" +
                    "- `useMemo`: Caches expensive computation results until dependencies change.";
        }

        // =========================================================================
        // 11. DEVOPS, DOCKER & KUBERNETES
        // =========================================================================
        if (lower.contains("docker") || lower.contains("kubernetes") || lower.contains("k8s") || lower.contains("terraform") || lower.contains("ci/cd") || lower.contains("devops")) {
            return "### 🚢 Production DevOps, Docker & Kubernetes\n\n" +
                    "**1. Docker Multi-Stage Builds**:\n" +
                    "Separates the heavy compilation SDK from the lightweight runtime image (e.g. `eclipse-temurin:21-jre-alpine`), reducing image sizes by over 70% and eliminating build-time security CVEs.\n\n" +
                    "**2. Kubernetes Core Primitives**:\n" +
                    "- **Pod**: Smallest deployable unit containing one or more containers sharing network namespaces and storage volumes.\n" +
                    "- **Liveness Probe**: Restarts containers if deadlocked or unresponsive.\n" +
                    "- **Readiness Probe**: Controls when the Pod receives inbound traffic from Services and Ingress.\n" +
                    "- **Security Context**: Enforce `runAsNonRoot: true` and `readOnlyRootFilesystem: true` in production specs.";
        }

        // =========================================================================
        // 12. GENERAL DETAILED TECHNICAL BREAKDOWN
        // =========================================================================
        return "### 💡 Technical Guide & Conceptual Walkthrough: " + msg + "\n\n" +
                "**1. Core Architecture & Concept**:\n" +
                "- Break the problem into decoupled, modular components with clear state invariants.\n" +
                "- Identify the underlying algorithmic pattern (e.g., Two Pointers, Graph DFS/BFS, Divide-and-Conquer, Dynamic Programming, or Caching).\n\n" +
                "**2. Implementation Best Practices**:\n" +
                "- Write deterministic unit tests covering boundary cases (empty collections, single items, integer overflows).\n" +
                "- Analyze asymptotic scaling: aim for optimal $O(N)$ or $O(N \\log N)$ time and minimal $O(1)$ or $O(N)$ auxiliary space.\n\n" +
                "**3. Practical Next Step**:\n" +
                "You can practice and test this topic inside **My Learning Path** or test your knowledge in **Assessments**!";
    }
}
