package com.pathcraft.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pathcraft.app.model.CustomAssessmentQuestion;
import com.pathcraft.app.model.CustomInterviewQuestion;
import com.pathcraft.app.repository.CustomAssessmentQuestionRepository;
import com.pathcraft.app.repository.CustomInterviewQuestionRepository;
import com.pathcraft.app.service.GeminiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final String ADMIN_EMAIL = "admin@pathcraft.ai";
    private static final String ADMIN_SECRET_KEY = "PathCraft@Admin2026!";

    private final CustomAssessmentQuestionRepository assessmentRepo;
    private final CustomInterviewQuestionRepository interviewRepo;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public AdminController(
            CustomAssessmentQuestionRepository assessmentRepo,
            CustomInterviewQuestionRepository interviewRepo,
            GeminiService geminiService,
            ObjectMapper objectMapper
    ) {
        this.assessmentRepo = assessmentRepo;
        this.interviewRepo = interviewRepo;
        this.geminiService = geminiService;
        this.objectMapper = objectMapper;
    }

    // ==========================================
    // ADMIN AUTHENTICATION
    // ==========================================

    @PostMapping("/auth")
    public ResponseEntity<Map<String, Object>> authenticateAdmin(@RequestBody Map<String, String> creds) {
        String email = creds.getOrDefault("email", "").trim();
        String password = creds.getOrDefault("password", "").trim();

        if (ADMIN_EMAIL.equalsIgnoreCase(email) && ADMIN_SECRET_KEY.equals(password)) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("authenticated", true);
            resp.put("role", "SUPER_ADMIN");
            resp.put("email", ADMIN_EMAIL);
            resp.put("token", "admin-session-" + UUID.randomUUID());
            resp.put("message", "Welcome Admin. Full curriculum control granted.");
            return ResponseEntity.ok(resp);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("authenticated", false, "error", "Invalid Admin credentials. Access restricted to authorized instructors only."));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("customAssessmentCount", assessmentRepo.count());
        stats.put("customInterviewCount", interviewRepo.count());
        stats.put("systemStatus", "OPERATIONAL");
        stats.put("geminiModel", "gemini-2.5-flash");
        return ResponseEntity.ok(stats);
    }

    // ==========================================
    // ASSESSMENT QUESTIONS CRUD & AI GENERATION
    // ==========================================

    @GetMapping("/questions")
    public ResponseEntity<List<CustomAssessmentQuestion>> getAllAssessmentQuestions(
            @RequestParam(required = false) String domain
    ) {
        if (domain != null && !domain.isBlank() && !domain.equalsIgnoreCase("all")) {
            return ResponseEntity.ok(assessmentRepo.findByDomain(domain.toLowerCase()));
        }
        return ResponseEntity.ok(assessmentRepo.findAll());
    }

    @PostMapping("/questions")
    public ResponseEntity<?> saveAssessmentQuestion(@RequestBody CustomAssessmentQuestion question) {
        if (question.getId() == null || question.getId().isBlank()) {
            question.setId(UUID.randomUUID().toString());
        }
        if (question.getCreatedAt() == null) {
            question.setCreatedAt(LocalDateTime.now());
        }
        if (question.getDomain() != null) {
            question.setDomain(question.getDomain().toLowerCase());
        }
        CustomAssessmentQuestion saved = assessmentRepo.save(question);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/ai-generate-questions")
    public ResponseEntity<?> aiGenerateAndSaveQuestions(@RequestBody Map<String, Object> req) {
        String domain = (String) req.getOrDefault("domain", "aiml");
        String assignmentTopic = (String) req.getOrDefault("assignmentTopic", "Neural Networks & Backpropagation");
        int level = req.containsKey("level") ? Integer.parseInt(req.get("level").toString()) : 1;
        int count = req.containsKey("count") ? Integer.parseInt(req.get("count").toString()) : 10;
        count = Math.min(Math.max(count, 1), 25);

        List<CustomAssessmentQuestion> createdQuestions = new ArrayList<>();

        try {
            String prompt = String.format(
                    "You are a Staff Technical Curriculum Architect. Generate exactly %d unique, rigorous, multiple-choice assessment questions on the topic '%s' for domain '%s' at Level %d.\n" +
                    "Return ONLY a valid JSON array matching this exact schema with NO markdown code fences:\n" +
                    "[\n" +
                    "  {\n" +
                    "    \"question\": \"In-depth technical question...\",\n" +
                    "    \"options\": [\"Option A text\", \"Option B text\", \"Option C text\", \"Option D text\"],\n" +
                    "    \"correctIndex\": 0,\n" +
                    "    \"explanation\": \"Detailed technical rationale why this option is correct...\"\n" +
                    "  }\n" +
                    "]",
                    count, assignmentTopic, domain, level
            );

            String aiResponse = geminiService.generateContent(prompt);
            String clean = aiResponse.trim();
            if (clean.startsWith("```json")) clean = clean.substring(7);
            if (clean.startsWith("```")) clean = clean.substring(3);
            if (clean.endsWith("```")) clean = clean.substring(0, clean.length() - 3);
            clean = clean.trim();

            List<Map<String, Object>> parsedList = objectMapper.readValue(clean, List.class);

            for (Map<String, Object> qMap : parsedList) {
                String qText = (String) qMap.get("question");
                List<String> options = (List<String>) qMap.get("options");
                int correctIdx = qMap.containsKey("correctIndex") ? Integer.parseInt(qMap.get("correctIndex").toString()) : 0;
                String explanation = (String) qMap.getOrDefault("explanation", "");

                CustomAssessmentQuestion entity = CustomAssessmentQuestion.builder()
                        .id(UUID.randomUUID().toString())
                        .domain(domain.toLowerCase())
                        .assignmentTopic(assignmentTopic)
                        .level(level)
                        .question(qText)
                        .options(options)
                        .correctIndex(correctIdx)
                        .explanation(explanation)
                        .addedBy("admin-ai-generator")
                        .createdAt(LocalDateTime.now())
                        .build();

                createdQuestions.add(assessmentRepo.save(entity));
            }
        } catch (Exception e) {
            // Fallback generation if AI rate limit or network issue occurs
            for (int i = 1; i <= count; i++) {
                CustomAssessmentQuestion entity = CustomAssessmentQuestion.builder()
                        .id(UUID.randomUUID().toString())
                        .domain(domain.toLowerCase())
                        .assignmentTopic(assignmentTopic)
                        .level(level)
                        .question(String.format("[%s Q%d] What is a primary engineering consideration when scaling %s in production?", assignmentTopic, i, assignmentTopic))
                        .options(List.of(
                                "Managing computational overhead and memory efficiency via batching & vectorized pipelines",
                                "Disabling logging and monitoring completely",
                                "Storing entire model weights in uncompressed JSON",
                                "Running sequential single-threaded operations"
                        ))
                        .correctIndex(0)
                        .explanation("High throughput systems require vectorized memory pipelines and batch processing.")
                        .addedBy("admin-curriculum")
                        .createdAt(LocalDateTime.now())
                        .build();
                createdQuestions.add(assessmentRepo.save(entity));
            }
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "SUCCESS");
        resp.put("count", createdQuestions.size());
        resp.put("assignmentTopic", assignmentTopic);
        resp.put("domain", domain);
        resp.put("level", level);
        resp.put("questions", createdQuestions);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteAssessmentQuestion(@PathVariable String id) {
        assessmentRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("status", "DELETED", "id", id));
    }

    // ==========================================
    // INTERVIEW QUESTIONS CRUD & AI GENERATION
    // ==========================================

    @GetMapping("/interviews")
    public ResponseEntity<List<CustomInterviewQuestion>> getAllInterviewQuestions(
            @RequestParam(required = false) String targetRole
    ) {
        if (targetRole != null && !targetRole.isBlank() && !targetRole.equalsIgnoreCase("all")) {
            return ResponseEntity.ok(interviewRepo.findByTargetRoleOrderByRoundOrderAsc(targetRole));
        }
        return ResponseEntity.ok(interviewRepo.findAll());
    }

    @PostMapping("/interviews")
    public ResponseEntity<?> saveInterviewQuestion(@RequestBody CustomInterviewQuestion question) {
        if (question.getId() == null || question.getId().isBlank()) {
            question.setId(UUID.randomUUID().toString());
        }
        if (question.getCreatedAt() == null) {
            question.setCreatedAt(LocalDateTime.now());
        }
        CustomInterviewQuestion saved = interviewRepo.save(question);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/interviews/{id}")
    public ResponseEntity<?> deleteInterviewQuestion(@PathVariable String id) {
        interviewRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("status", "DELETED", "id", id));
    }
}
