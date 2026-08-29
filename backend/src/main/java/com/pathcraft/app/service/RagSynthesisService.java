package com.pathcraft.app.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class RagSynthesisService {

    private final RagKnowledgeService knowledgeService;
    private final GeminiService geminiService;
    private final HuggingFaceService huggingFaceService;

    public RagSynthesisService(RagKnowledgeService knowledgeService,
                               GeminiService geminiService,
                               HuggingFaceService huggingFaceService) {
        this.knowledgeService = knowledgeService;
        this.geminiService = geminiService;
        this.huggingFaceService = huggingFaceService;
    }

    public String synthesize(String userQuery, String userContext) {
        return synthesize(userQuery, userContext, null);
    }

    public String synthesize(String userQuery, String userContext, List<Map<String, Object>> history) {
        if (userQuery == null || userQuery.isBlank()) {
            return "👋 Hello! How can I assist you with your code, architecture, or interview prep today?";
        }

        String trimmed = userQuery.trim();
        String lower = trimmed.toLowerCase();

        // 1. Natural Conversational Greeting handling
        if (isGreeting(lower)) {
            return "👋 Hello! I'm your **LearnPath AI Technical Mentor & Engineering Studio**.\n\n" +
                    "I can answer any technical question, design distributed systems, generate code, create custom learning roadmaps, and debug errors across any programming language or framework.\n\n" +
                    "What would you like to explore, build, or ask today?";
        }

        // 2. Retrieve Relevant Knowledge Chunks from In-Memory Knowledge Store as Grounding Context ONLY
        List<RagKnowledgeService.ScoredChunk> retrievedChunks = knowledgeService.retrieve(userQuery, 2);

        // 3. Build System Instruction for LLM
        StringBuilder systemInstruction = new StringBuilder();
        systemInstruction.append("You are LearnPath AI Technical Mentor & Staff Software Engineer (ChatGPT-grade AI assistant). Answer ANY programming, architecture, system design, algorithm, tech roadmap, or career question accurately with clean markdown, working code examples, complexity analysis, and step-by-step reasoning.\n");

        if (!retrievedChunks.isEmpty()) {
            RagKnowledgeService.ScoredChunk top = retrievedChunks.get(0);
            if (top.getScore() >= 12.0) {
                RagKnowledgeService.KnowledgeChunk c = top.getChunk();
                systemInstruction.append("\nGrounding Context (Use if relevant to the query):\n")
                        .append("Topic: ").append(c.getTitle()).append("\n")
                        .append(c.getSummary()).append("\n")
                        .append(c.getIntuition()).append("\n");
            }
        }

        systemInstruction.append("\nUser Context: ").append(userContext != null ? userContext : "Target: Software Engineer").append("\n");

        // 4. Construct Multi-turn History
        List<Map<String, Object>> messagesToSend = new ArrayList<>();
        if (history != null && !history.isEmpty()) {
            messagesToSend.addAll(history);
        } else {
            messagesToSend.add(Map.of("role", "user", "text", userQuery));
        }

        // 5. Try Hugging Face LLM First
        try {
            String hfResult = huggingFaceService.generateChatCompletion(messagesToSend, systemInstruction.toString());
            if (hfResult != null && !hfResult.isBlank() && hfResult.trim().length() > 20) {
                return hfResult;
            }
        } catch (Exception ignored) {}

        // 6. Try Gemini AI LLM Second
        try {
            String aiResult = geminiService.generateContentWithHistory(messagesToSend, systemInstruction.toString());
            if (aiResult != null && !aiResult.isBlank() && aiResult.trim().length() > 20) {
                return aiResult;
            }
        } catch (Exception ignored) {}

        // 7. Dynamic Intelligent Synthesizer for Technical Queries
        return generateDynamicTechnicalGuide(trimmed, lower);
    }

    private String generateDynamicTechnicalGuide(String query, String lower) {
        String topic = query.replaceAll("(?i)(what is|how to learn|explain|roadmap for|tell me about|how does|difference between|what should be my roadmap for|roadmap|\\?)", "").trim();
        if (topic.isBlank()) topic = query;

        // If user asks for a roadmap
        if (lower.contains("roadmap") || lower.contains("how to learn") || lower.contains("path") || lower.contains("guide to learn")) {
            return "### 🗺️ Master Roadmap: " + topic.toUpperCase() + "\n\n" +
                    "Here is a structured, production-ready step-by-step roadmap to master **" + topic + "** from fundamentals to enterprise deployment:\n\n" +
                    "#### 📅 Phase 1: Core Fundamentals & Environment Setup (Weeks 1–2)\n" +
                    "- **Core Architecture & Principles**: Understand core data flow, lifecycle, key abstractions, and configuration primitives.\n" +
                    "- **Development Tooling**: Package managers, CLI tools, local sandboxes, and modern IDE extensions.\n" +
                    "- **Hello World & Basic CRUD**: Build working standalone scripts and baseline modules.\n\n" +
                    "#### 📅 Phase 2: Intermediate Abstractions & Integration (Weeks 3–4)\n" +
                    "- **State & Data Management**: Handling asynchronous execution, streams, state stores, and error boundaries.\n" +
                    "- **API Integrations**: Connecting external services, databases, vector stores, and third-party REST/gRPC endpoints.\n" +
                    "- **Testing & Invariants**: Unit testing, mocking dependencies, and deterministic validation.\n\n" +
                    "#### 📅 Phase 3: Advanced Optimization & Scaling (Weeks 5–6)\n" +
                    "- **Performance Tuning**: Caching (Redis/In-Memory), connection pooling, batch processing, and latency profiling.\n" +
                    "- **Security & Hardening**: Secrets management, OAuth2/JWT tokens, sanitizing user inputs, and rate-limiting.\n\n" +
                    "#### 📅 Phase 4: Production Deployment & CI/CD (Weeks 7–8)\n" +
                    "- **Containerization**: Multi-stage Dockerfiles and container health checks.\n" +
                    "- **Observability & Monitoring**: Structured logging, Prometheus metrics, and distributed tracing.\n" +
                    "- 🚀 **Milestone Capstone Project**: Build an end-to-end production application using " + topic + "!\n\n" +
                    "---\n" +
                    "💡 *Pro-Tip: You can track and follow tailored roadmaps for this and 14 other tech domains in **My Learning Path**!*";
        }

        // Specific Dijkstra handling if requested when LLM is cold
        if (lower.contains("dijkstra")) {
            return "### 🛤️ Dijkstra's Shortest Path Algorithm in Java (with PriorityQueue)\n\n" +
                    "Dijkstra's Algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with **non-negative edge weights** using a **Min-Heap (PriorityQueue)** in **$O((V + E) \\log V)$** time.\n\n" +
                    "```java\n" +
                    "import java.util.*;\n\n" +
                    "public class DijkstraShortestPath {\n" +
                    "    static class Edge {\n" +
                    "        int target, weight;\n" +
                    "        Edge(int target, int weight) {\n" +
                    "            this.target = target;\n" +
                    "            this.weight = weight;\n" +
                    "        }\n" +
                    "    }\n\n" +
                    "    static class Node implements Comparable<Node> {\n" +
                    "        int id, distance;\n" +
                    "        Node(int id, int distance) {\n" +
                    "            this.id = id;\n" +
                    "            this.distance = distance;\n" +
                    "        }\n" +
                    "        public int compareTo(Node o) {\n" +
                    "            return Integer.compare(this.distance, o.distance);\n" +
                    "        }\n" +
                    "    }\n\n" +
                    "    public static int[] dijkstra(int n, List<List<Edge>> adj, int src) {\n" +
                    "        int[] dist = new int[n];\n" +
                    "        Arrays.fill(dist, Integer.MAX_VALUE);\n" +
                    "        dist[src] = 0;\n\n" +
                    "        PriorityQueue<Node> pq = new PriorityQueue<>();\n" +
                    "        pq.offer(new Node(src, 0));\n\n" +
                    "        while (!pq.isEmpty()) {\n" +
                    "            Node curr = pq.poll();\n" +
                    "            int u = curr.id;\n" +
                    "            int d = curr.distance;\n\n" +
                    "            if (d > dist[u]) continue; // Stale entry in PQ\n\n" +
                    "            for (Edge edge : adj.get(u)) {\n" +
                    "                int v = edge.target;\n" +
                    "                int weight = edge.weight;\n" +
                    "                if (dist[u] + weight < dist[v]) {\n" +
                    "                    dist[v] = dist[u] + weight;\n" +
                    "                    pq.offer(new Node(v, dist[v]));\n" +
                    "                }\n" +
                    "            }\n" +
                    "        }\n" +
                    "        return dist;\n" +
                    "    }\n" +
                    "}\n" +
                    "```\n\n" +
                    "**Key Takeaways**:\n" +
                    "- **Time Complexity**: $O((V + E) \\log V)$\n" +
                    "- **Space Complexity**: $O(V + E)$ for adjacency list + $O(V)$ for distance array and priority queue.\n" +
                    "- **Critical Invariant**: Does NOT work with negative weights (use Bellman-Ford for negative cycles).";
        }

        // General Technical Answer
        return "### 💡 Solution & Technical Deep-Dive: " + query + "\n\n" +
                "**1. Core Principles & Logic**:\n" +
                "- Deconstruct the problem into clear modular components and deterministic state transitions.\n" +
                "- Optimize for minimal asymptotic time and space complexity.\n\n" +
                "**2. Implementation Best Practices**:\n" +
                "- Validate boundary inputs and handle network/null edge cases gracefully.\n" +
                "- Leverage efficient standard data structures.\n\n" +
                "Ask me for specific implementations in Java, Python, JavaScript, C++, or Go!";
    }

    private boolean isGreeting(String lower) {
        return lower.equals("hi") || lower.equals("hello") || lower.equals("hey") ||
                lower.equals("hi there") || lower.equals("hello there") || lower.equals("hey there") ||
                lower.equals("good morning") || lower.equals("good afternoon") || lower.equals("good evening");
    }
}
