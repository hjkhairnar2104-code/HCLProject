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

        // 2. Retrieve Relevant Knowledge Chunks from In-Memory Knowledge Store
        List<RagKnowledgeService.ScoredChunk> retrievedChunks = knowledgeService.retrieve(userQuery, 3);

        // 3. Build System Instruction for LLM
        StringBuilder systemInstruction = new StringBuilder();
        systemInstruction.append("You are LearnPath AI Technical Mentor & Staff Software Engineer. Provide comprehensive, accurate, high-quality technical answers with clean markdown, working code examples, complexity analysis, and architectural insights. Answer ANY user question thoroughly.\n");

        if (!retrievedChunks.isEmpty()) {
            systemInstruction.append("\nGROUND TRUTH RETRIEVED KNOWLEDGE CHUNKS:\n");
            for (RagKnowledgeService.ScoredChunk sc : retrievedChunks) {
                RagKnowledgeService.KnowledgeChunk c = sc.getChunk();
                systemInstruction.append("--- [DOC: ").append(c.getTitle()).append(" (").append(c.getDomain()).append(")] ---\n");
                systemInstruction.append(c.getSummary()).append("\n");
                systemInstruction.append(c.getIntuition()).append("\n");
                if (c.getComparisonTable() != null && !c.getComparisonTable().isBlank()) {
                    systemInstruction.append(c.getComparisonTable()).append("\n");
                }
                if (c.getCodeSnippet() != null && !c.getCodeSnippet().isBlank()) {
                    systemInstruction.append(c.getCodeSnippet()).append("\n");
                }
            }
            systemInstruction.append("\nGround your response in the principles above when applicable.\n");
        }

        systemInstruction.append("\nUser Context: ").append(userContext != null ? userContext : "Target: Software Engineer").append("\n");

        // 4. Construct Multi-turn History
        List<Map<String, Object>> messagesToSend = new java.util.ArrayList<>();
        if (history != null && !history.isEmpty()) {
            messagesToSend.addAll(history);
        } else {
            messagesToSend.add(Map.of("role", "user", "text", userQuery));
        }

        // 5. Try Hugging Face LLM First
        try {
            String hfResult = huggingFaceService.generateChatCompletion(messagesToSend, systemInstruction.toString());
            if (hfResult != null && !hfResult.isBlank()) {
                return hfResult;
            }
        } catch (Exception ignored) {}

        // 6. Try Gemini AI LLM Second
        try {
            String aiResult = geminiService.generateContentWithHistory(messagesToSend, systemInstruction.toString());
            if (aiResult != null && !aiResult.isBlank()) {
                return aiResult;
            }
        } catch (Exception ignored) {}

        // 7. Check if there is an exact matching RAG chunk
        if (!retrievedChunks.isEmpty() && retrievedChunks.get(0).getScore() >= 10.0) {
            RagKnowledgeService.ScoredChunk primary = retrievedChunks.get(0);
            RagKnowledgeService.KnowledgeChunk chunk = primary.getChunk();

            StringBuilder sb = new StringBuilder();
            sb.append("### 🧠 ").append(chunk.getTitle()).append("\n\n");
            sb.append("**Executive Summary**:\n").append(chunk.getSummary()).append("\n\n");

            if (chunk.getIntuition() != null && !chunk.getIntuition().isBlank()) {
                sb.append(chunk.getIntuition()).append("\n\n");
            }

            if (chunk.getComparisonTable() != null && !chunk.getComparisonTable().isBlank()) {
                sb.append("#### 📊 Comparative Breakdown\n").append(chunk.getComparisonTable()).append("\n\n");
            }

            if (chunk.getCodeSnippet() != null && !chunk.getCodeSnippet().isBlank()) {
                sb.append("#### 💻 Production Code Reference\n").append(chunk.getCodeSnippet()).append("\n\n");
            }

            sb.append("---\n*💡 Grounded RAG Response from LearnPath Knowledge Engine*");
            return sb.toString();
        }

        // 8. Dynamic Intelligent Synthesizer for ANY open-ended technical query
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

        // General Technical Answer
        return "### 💡 Technical Guide & Deep-Dive: " + query + "\n\n" +
                "**1. Architectural Overview & Core Concepts**:\n" +
                "- **Primary Purpose**: Designed to provide high-throughput, modular, and scalable software solutions.\n" +
                "- **Key Primitives**: Decoupled components, single responsibility principle, and deterministic state transitions.\n\n" +
                "**2. Best Practices & Implementation Rules**:\n" +
                "- **Error Handling**: Gracefully handle network timeouts, null boundaries, and edge cases.\n" +
                "- **Complexity Analysis**: Optimize for minimal time ($O(1)$ / $O(N)$) and space overhead.\n" +
                "- **Observability**: Add structured logs and trace identifiers for all critical operations.\n\n" +
                "**3. Practical Next Steps**:\n" +
                "Feel free to ask for specific code snippets in **Java, Python, TypeScript, C++, or Go**, or explore interactive modules in **Projects & Practice**!";
    }

    private boolean isGreeting(String lower) {
        return lower.equals("hi") || lower.equals("hello") || lower.equals("hey") ||
                lower.equals("hi there") || lower.equals("hello there") || lower.equals("hey there") ||
                lower.equals("good morning") || lower.equals("good afternoon") || lower.equals("good evening");
    }
}
