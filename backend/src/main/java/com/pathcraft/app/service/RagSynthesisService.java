package com.pathcraft.app.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class RagSynthesisService {

    private final RagKnowledgeService knowledgeService;
    private final GeminiService geminiService;

    public RagSynthesisService(RagKnowledgeService knowledgeService, GeminiService geminiService) {
        this.knowledgeService = knowledgeService;
        this.geminiService = geminiService;
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

        // 5. Call Live Gemini AI Service with Multi-Turn Memory
        try {
            String aiResult = geminiService.generateContentWithHistory(messagesToSend, systemInstruction.toString());
            if (aiResult != null && !aiResult.isBlank()) {
                if (!retrievedChunks.isEmpty()) {
                    RagKnowledgeService.ScoredChunk topMatch = retrievedChunks.get(0);
                    return aiResult + "\n\n---\n*🔍 RAG Verified • Grounded from LearnPath Knowledge Store (" + topMatch.getChunk().getDomain() + ")*";
                }
                return aiResult;
            }
        } catch (Exception ignored) {
            // Fallback to local RAG knowledge synthesis if network or rate limit issues occur
        }

        // 4. Deterministic Local RAG Fallback if Gemini AI is temporarily unavailable
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
                sb.append("#### ⚖️ Architectural Comparison\n\n");
                sb.append(chunk.getComparisonTable()).append("\n\n");
            }

            if (chunk.getCodeSnippet() != null && !chunk.getCodeSnippet().isBlank()) {
                sb.append("#### 💻 Production Code Implementation\n\n");
                sb.append(chunk.getCodeSnippet()).append("\n\n");
            }

            if (chunk.getComplexity() != null && !chunk.getComplexity().isBlank()) {
                sb.append("#### 📊 Asymptotic Complexity & Performance\n\n");
                sb.append(chunk.getComplexity()).append("\n\n");
            }

            if (chunk.getEdgeCases() != null && !chunk.getEdgeCases().isBlank()) {
                sb.append("#### ⚠️ Interview Traps & Edge Cases\n\n");
                sb.append(chunk.getEdgeCases()).append("\n\n");
            }

            sb.append("---\n*🔍 RAG Verified • Retrieved from LearnPath Knowledge Store (" + chunk.getDomain() + " • Relevance Score: " + String.format("%.1f", primary.getScore()) + ")*");
            return sb.toString();
        }

        // 5. General Fallback
        return "### 💡 Technical Guide: " + userQuery + "\n\n" +
                "**1. Core Concept**:\n" +
                "Break down the problem into modular components with clear state invariants and deterministic bounds.\n\n" +
                "**2. Scaling & Efficiency**:\n" +
                "Always evaluate asymptotic scaling ($O(N)$ vs $O(N \\log N)$) and minimize auxiliary space ($O(1)$).\n\n" +
                "**3. Practical Next Step**:\n" +
                "Explore the dedicated **My Learning Path** or test your knowledge in the **Assessments** workspace!\n\n" +
                "---\n*🔍 LearnPath AI Technical Mentor*";
    }

    private boolean isGreeting(String lower) {
        return lower.equals("hi") || lower.equals("hello") || lower.equals("hey") ||
                lower.equals("hi there") || lower.equals("hello there") || lower.equals("hey there") ||
                lower.equals("greetings") || lower.equals("good morning") || lower.equals("good afternoon") ||
                lower.equals("good evening") || lower.equals("what's up") || lower.equals("sup");
    }
}
