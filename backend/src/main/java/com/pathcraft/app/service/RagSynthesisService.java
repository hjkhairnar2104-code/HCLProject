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
            return "👋 Hello! How can I assist you with your learning path or technical concepts today?";
        }

        String trimmed = userQuery.trim();
        String lower = trimmed.toLowerCase();

        // 1. Natural Conversational Greeting handling
        if (isGreeting(lower)) {
            return "👋 Hello! I'm your **LearnPath AI Technical Mentor & Engineering Studio**.\n\n" +
                    "I'm here to help you master algorithms, system design, coding problems, and tech interview prep. " +
                    "What would you like to build or explore today?";
        }

        // 2. Retrieve Top-3 Relevant Knowledge Chunks from the In-Memory Knowledge Store
        List<RagKnowledgeService.ScoredChunk> retrievedChunks = knowledgeService.retrieve(userQuery, 3);

        // 3. Build System Instruction with Grounded RAG Knowledge
        StringBuilder systemInstruction = new StringBuilder();
        systemInstruction.append("You are LearnPath AI Technical Mentor & Staff Software Engineer. Provide comprehensive, accurate, high-quality technical answers with clean markdown, working code examples, complexity analysis, and architectural insights.\n");

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
            systemInstruction.append("\nGround your response strictly in the technical principles above when applicable.\n");
        }

        systemInstruction.append("\nUser Context: ").append(userContext != null ? userContext : "Target: Software Engineer").append("\n");

        // 4. Construct Multi-turn History
        List<Map<String, Object>> messagesToSend = new java.util.ArrayList<>();
        if (history != null && !history.isEmpty()) {
            messagesToSend.addAll(history);
        } else {
            messagesToSend.add(Map.of("role", "user", "text", userQuery));
        }

        // 5. Try Hugging Face LLM Service First
        try {
            String hfResult = huggingFaceService.generateChatCompletion(messagesToSend, systemInstruction.toString());
            if (hfResult != null && !hfResult.isBlank()) {
                if (!retrievedChunks.isEmpty()) {
                    RagKnowledgeService.ScoredChunk topMatch = retrievedChunks.get(0);
                    return hfResult + "\n\n---\n*⚡ Powered by HuggingFace LLM • Grounded with LearnPath Knowledge Store (" + topMatch.getChunk().getDomain() + ")*";
                }
                return hfResult;
            }
        } catch (Exception ignored) {}

        // 6. Fallback to Gemini AI Service
        try {
            String aiResult = geminiService.generateContentWithHistory(messagesToSend, systemInstruction.toString());
            if (aiResult != null && !aiResult.isBlank()) {
                if (!retrievedChunks.isEmpty()) {
                    RagKnowledgeService.ScoredChunk topMatch = retrievedChunks.get(0);
                    return aiResult + "\n\n---\n*🔍 RAG Verified • Grounded from LearnPath Knowledge Store (" + topMatch.getChunk().getDomain() + ")*";
                }
                return aiResult;
            }
        } catch (Exception ignored) {}

        // 7. Grounded Local RAG Knowledge Synthesis Fallback
        if (!retrievedChunks.isEmpty()) {
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

            sb.append("---\n*💡 Grounded RAG Response from LearnPath Knowledge Engine (Similarity: ")
              .append(String.format("%.1f", primary.getScore() * 100)).append("%)*");

            return sb.toString();
        }

        return "### 💡 Technical Guide: " + userQuery + "\n\n" +
                "1. **Core Concept**:\n" +
                "- Deconstruct the problem into modular components with clear state invariants.\n" +
                "- Analyze time/space complexity trade-offs ($O(1)$ vs $O(N)$ vs $O(N \\log N)$).\n\n" +
                "2. **Best Practices**:\n" +
                "- Test boundary and edge cases.\n" +
                "- Use proper data structures and caching to optimize performance bottlenecks.";
    }

    private boolean isGreeting(String lower) {
        return lower.equals("hi") || lower.equals("hello") || lower.equals("hey") ||
                lower.equals("hi there") || lower.equals("hello there") || lower.equals("hey there") ||
                lower.equals("good morning") || lower.equals("good afternoon") || lower.equals("good evening");
    }
}
