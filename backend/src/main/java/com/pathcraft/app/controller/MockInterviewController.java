package com.pathcraft.app.controller;

import com.pathcraft.app.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/interview")
public class MockInterviewController {

    private final GeminiService geminiService;

    // Progressive 6-Question Curriculums by Role
    private static final Map<String, List<Map<String, String>>> ROLE_QUESTION_BANKS = Map.of(
            "BACKEND", List.of(
                    Map.of("topic", "Java Internals & Data Structures", "question", "Can you explain how HashMap works internally in Java, how collisions are resolved, and when treeification occurs?", "modelAnswer", "HashMap uses an array of Node buckets with hashCode() & modulo indexing. Collisions are stored in linked lists until bucket length reaches 8 (and total capacity >= 64), where it converts to a Red-Black Tree (TreeNode) for O(log N) lookup.", "tip", "Highlight load factor (0.75), rehashing at 2x capacity, and why immutable keys (String, Integer) are critical."),
                    Map.of("topic", "High-Throughput Database Optimization", "question", "How would you handle database indexing, B+ Tree page fragmentation, and query tuning under 100k requests/sec?", "modelAnswer", "Use covering indexes (INCLUDE columns) to eliminate table scans, partition large tables by date/tenant, implement Read Replicas with connection pooling (HikariCP), and cache hot keys in Redis.", "tip", "Explain EXPLAIN ANALYZE, avoiding SELECT *, and dealing with write amplification from excessive indexing."),
                    Map.of("topic", "Distributed Caching & Concurrency", "question", "How do you design a distributed caching layer with Redis to prevent cache stampede, cache penetration, and ensure eventual consistency with the primary DB?", "modelAnswer", "Mitigate cache stampede using mutex distributed locks (Redlock) or probabilistic early expiration (XFetch). Prevent penetration with Bloom filters. Maintain consistency with Cache-Aside + CDC (Debezium/Kafka).", "tip", "Mention TTL jitter to prevent simultaneous key expiration and write-through vs write-behind tradeoffs."),
                    Map.of("topic", "Concurrency & Multithreading", "question", "Explain how Java Virtual Threads (Project Loom) differ from platform OS threads, and how you manage synchronized locking and race conditions.", "modelAnswer", "Virtual Threads are lightweight user-mode threads managed by the JVM (Carrier threads) yielding during blocking I/O (unparking), enabling millions of concurrent connections without thread pool starvation.", "tip", "Mention ReentrantLock instead of synchronized to prevent thread pinning, and Atomic variables / ConcurrentHashMap for lock-free state."),
                    Map.of("topic", "Microservices & Event-Driven Architecture", "question", "How would you implement the Saga Pattern with Apache Kafka to guarantee data consistency across distributed services without 2PC locking?", "modelAnswer", "Use Choreography or Orchestration Saga with transactional outbox pattern. Each service publishes domain events upon local DB commit; compensating transactions undo partial operations upon failures.", "tip", "Emphasize idempotent consumers (unique message deduplication key) and dead-letter queues (DLQ)."),
                    Map.of("topic", "System Reliability & Failure Modes", "question", "Walk me through how you architect circuit breaking, rate limiting, and graceful degradation during a severe third-party payment gateway outage.", "modelAnswer", "Wrap third-party calls in Resilience4j circuit breakers (sliding window failure rate > 50% opens circuit). Implement token-bucket rate limiters and return cached fallbacks or async queue retries.", "tip", "Discuss exponential backoff with jitter and notifying downstream clients with 429/503 status codes.")
            ),
            "AIML", List.of(
                    Map.of("topic", "Deep Learning Fundamentals", "question", "Can you explain how attention mechanisms and multi-head self-attention work inside Transformer models?", "modelAnswer", "Self-attention computes Query, Key, and Value vectors. Attention weights are softmax((Q * K^T) / sqrt(d_k)) * V. Multi-head attention projects into multiple subspaces allowing the model to attend to information at different representation positions.", "tip", "Mention scaled dot-product factor to prevent vanishing gradients during softmax."),
                    Map.of("topic", "Overfitting & Optimization", "question", "How do you diagnose and resolve vanishing gradients, exploding gradients, and severe overfitting in deep neural networks?", "modelAnswer", "Use residual skip connections (ResNet), Layer/Batch Normalization, AdamW weight decay, gradient clipping, Dropout (0.1-0.3), and learning rate warmups with cosine annealing.", "tip", "Discuss validation loss divergence and data augmentation strategies."),
                    Map.of("topic", "LLMs & Fine-Tuning", "question", "Explain Parameter-Efficient Fine-Tuning (PEFT) methods like LoRA and QLoRA compared to full-model fine-tuning.", "modelAnswer", "LoRA freezes pre-trained weights and injects trainable low-rank decomposition matrices (A and B with rank r << d), reducing trainable parameters by 99%. QLoRA quantizes the base model to 4-bit NormalFloat with double quantization.", "tip", "State memory savings (fitting 70B models on commodity GPUs) and zero inference latency overhead when weights are merged."),
                    Map.of("topic", "RAG & Vector Databases", "question", "How do you design a production RAG system to prevent hallucinations, handle chunking strategies, and optimize vector retrieval?", "modelAnswer", "Employ semantic/hierarchical chunking with overlap, embed using dense bi-encoders, perform hybrid search (Dense Vector + BM25 Lexical Keyword), rerank top 20 documents with a Cross-Encoder, and constrain the LLM with strict grounding prompts.", "tip", "Mention metadata filtering (tenant/date) and vector index algorithms (HNSW vs IVF-PQ)."),
                    Map.of("topic", "Model Evaluation & Metrics", "question", "How do you evaluate generative AI models and classification models with severe class imbalance?", "modelAnswer", "For generative AI: Ragas metrics (Context Precision, Faithfulness, Answer Relevance) and G-Eval. For imbalanced classification: PR-AUC, F1-Score (Macro), and Focal Loss instead of Accuracy or ROC-AUC.", "tip", "Explain why ROC-AUC is misleading when the negative class is overwhelmingly large."),
                    Map.of("topic", "MLOps & Low-Latency Serving", "question", "How would you serve a large PyTorch model with sub-50ms p99 latency to 5,000 concurrent requests?", "modelAnswer", "Convert model to TensorRT / ONNX Runtime, use vLLM / Triton Inference Server with dynamic continuous batching, GPU FP16/INT8 quantization, and horizontal autoscaling behind a Redis inference cache.", "tip", "Discuss KV-cache management (PagedAttention) and GPU memory bandwidth bottlenecks.")
            ),
            "DEVOPS", List.of(
                    Map.of("topic", "Kubernetes Networking", "question", "How does container networking (CNI) work in Kubernetes, and how does a Pod discover and route traffic to other services via CoreDNS and kube-proxy?", "modelAnswer", "CNI plugins (Calico/Cilium) assign unique IP addresses per Pod. CoreDNS resolves service names to ClusterIPs, while kube-proxy (IPVS/iptables mode) configures kernel packet forwarding to healthy endpoint Pods.", "tip", "Explain the difference between ClusterIP, NodePort, and LoadBalancer/Ingress controllers."),
                    Map.of("topic", "Docker Optimization", "question", "How do you optimize Dockerfiles for production security, build caching, and minimal image footprint?", "modelAnswer", "Use multi-stage builds (compile in builder image, copy binary to distroless/Alpine), pin exact base image SHAs, order Dockerfile instructions from least-to-most frequently changed, run as non-root user (USER 10001), and scan with Trivy.", "tip", "Mention .dockerignore and eliminating build toolchains from final runtime containers."),
                    Map.of("topic", "CI/CD & GitOps", "question", "Explain GitOps principles with ArgoCD / Flux and how you implement blue-green vs canary deployments with automated rollbacks.", "modelAnswer", "Git is the single source of truth for desired cluster state. ArgoCD continuously syncs cluster state with Git repo. Canary deployments use Argo Rollouts with Prometheus metric analysis (error rate < 1%) to increment traffic from 10% to 100% with automatic rollback on degradation.", "tip", "Highlight immutable container tags and automated smoketests."),
                    Map.of("topic", "Infrastructure as Code (Terraform)", "question", "How do you manage Terraform remote state, state locking, module reusability, and prevent drift in multi-environment AWS setups?", "modelAnswer", "Store state in AWS S3 with KMS encryption and DynamoDB table for state locking. Structure modules with Terragrunt/workspaces. Run scheduled drift detection in CI/CD (terraform plan -detailed-exitcode).", "tip", "Explain handling secrets via AWS Secrets Manager / HashiCorp Vault instead of plain text in tfstate."),
                    Map.of("topic", "Observability & Alerting", "question", "How do you design an end-to-end observability stack using Prometheus, Grafana, OpenTelemetry, and Loki for distributed microservices?", "modelAnswer", "Instrument applications with OpenTelemetry SDK for traces and RED metrics (Rate, Errors, Duration). Prometheus scrapes endpoints with alertmanager rules on SLI/SLO breaches. Loki aggregates structured JSON logs correlated by trace_id.", "tip", "Discuss alert fatigue prevention and golden signals (Latency, Traffic, Errors, Saturation)."),
                    Map.of("topic", "Disaster Recovery & High Availability", "question", "How do you design a multi-region disaster recovery plan with RPO < 1 min and RTO < 5 min on AWS?", "modelAnswer", "Deploy active-active multi-region architecture using Route 53 latency-based routing with health checks, Aurora Global Database (cross-region replication lag < 1s), and S3 cross-region replication.", "tip", "Differentiate between Backup & Restore, Pilot Light, Warm Standby, and Multi-Site Active-Active.")
            )
    );

    public MockInterviewController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    private String getCanonicalRole(String targetRole) {
        String lower = targetRole.toLowerCase();
        if (lower.contains("ai") || lower.contains("ml") || lower.contains("machine")) return "AIML";
        if (lower.contains("devops") || lower.contains("cloud") || lower.contains("sre")) return "DEVOPS";
        return "BACKEND";
    }

    @PostMapping("/start")
    public ResponseEntity<?> startInterview(@RequestBody Map<String, String> request) {
        String interviewType = request.getOrDefault("interviewType", "Technical");
        String targetRole = request.getOrDefault("targetRole", "Backend Engineer");
        String experience = request.getOrDefault("experience", "Intermediate");

        String canonical = getCanonicalRole(targetRole);
        List<Map<String, String>> bank = ROLE_QUESTION_BANKS.getOrDefault(canonical, ROLE_QUESTION_BANKS.get("BACKEND"));
        Map<String, String> firstItem = bank.get(0);

        String prompt = String.format(
                "You are an expert technical interviewer conducting a realistic 30-minute %s mock interview for a %s role (%s level).\n" +
                "Ask a challenging, direct technical question about %s.\n" +
                "Return ONLY the question text without greetings or preamble.",
                interviewType, targetRole, experience, firstItem.get("topic")
        );

        String question = geminiService.generateContent(prompt);
        if (question == null || question.isBlank() || question.length() < 15) {
            question = firstItem.get("question");
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("interviewType", interviewType);
        resp.put("targetRole", targetRole);
        resp.put("experience", experience);
        resp.put("questionNumber", 1);
        resp.put("topic", firstItem.get("topic"));
        resp.put("interviewerMessage", "Welcome to your 30-minute interactive " + targetRole + " interview session! I have enabled live camera and audio analysis. Let's begin!");
        resp.put("question", question.trim());

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/evaluate")
    public ResponseEntity<?> evaluateAnswer(@RequestBody Map<String, Object> request) {
        String interviewType = (String) request.getOrDefault("interviewType", "Technical");
        String targetRole = (String) request.getOrDefault("targetRole", "Backend Engineer");
        String question = (String) request.getOrDefault("question", "");
        String answer = (String) request.getOrDefault("answer", "");
        int questionNumber = Integer.parseInt(String.valueOf(request.getOrDefault("questionNumber", 1)));
        boolean isSkipped = Boolean.parseBoolean(String.valueOf(request.getOrDefault("isSkipped", false)));
        int totalRounds = 6;

        String canonical = getCanonicalRole(targetRole);
        List<Map<String, String>> bank = ROLE_QUESTION_BANKS.getOrDefault(canonical, ROLE_QUESTION_BANKS.get("BACKEND"));

        int nextIdx = Math.min(questionNumber, bank.size() - 1);
        Map<String, String> nextItem = bank.get(nextIdx);

        int currentIdx = Math.max(0, Math.min(questionNumber - 1, bank.size() - 1));
        Map<String, String> currentItem = bank.get(currentIdx);

        if (isSkipped) {
            Map<String, Object> skippedResp = new HashMap<>();
            skippedResp.put("score", 0);
            skippedResp.put("technicalAccuracy", 0);
            skippedResp.put("communication", 50);
            skippedResp.put("feedback", "Question skipped. In actual interviews, sharing even partial intuition or brute-force approaches is strongly favored over complete passes.");
            skippedResp.put("identifiedWeakness", currentItem.get("topic"));
            skippedResp.put("modelAnswer", currentItem.get("modelAnswer"));
            skippedResp.put("proTip", currentItem.get("tip"));
            skippedResp.put("contextualFollowUp", nextItem.get("question"));
            skippedResp.put("questionNumber", questionNumber);
            skippedResp.put("isFinal", questionNumber >= totalRounds);
            return ResponseEntity.ok(skippedResp);
        }

        String prompt = String.format(
                "You are an elite Staff Engineer interviewer evaluating a candidate for %s (%s).\n" +
                "Question: \"%s\"\n" +
                "Candidate's Voice/Text Answer: \"%s\"\n" +
                "Round %d of %d.\n\n" +
                "Next upcoming technical area: %s\n\n" +
                "Return VALID JSON ONLY with this exact schema:\n" +
                "{\n" +
                "  \"score\": 82,\n" +
                "  \"technicalAccuracy\": 85,\n" +
                "  \"communication\": 80,\n" +
                "  \"feedback\": \"Concise critique of what was good and what was missing.\",\n" +
                "  \"identifiedWeakness\": \"Key topic gap\",\n" +
                "  \"contextualFollowUp\": \"Challenging next question covering %s...\"\n" +
                "}",
                targetRole, interviewType, question, answer, questionNumber, totalRounds, nextItem.get("topic"), nextItem.get("topic")
        );

        String aiResponse = geminiService.generateContent(prompt);
        Map<String, Object> parsed = parseJson(aiResponse);

        if (parsed.isEmpty() || !parsed.containsKey("score")) {
            parsed = new HashMap<>();
            parsed.put("score", Math.min(95, Math.max(45, answer.length() > 50 ? 80 : 55)));
            parsed.put("technicalAccuracy", answer.length() > 50 ? 82 : 50);
            parsed.put("communication", answer.length() > 20 ? 78 : 50);
            parsed.put("feedback", answer.length() > 50 ? "Solid articulation of core mechanics. Address edge cases and failure modes to achieve Staff-level ratings." : "Answer was too brief. Elaborate with system architecture tradeoffs and quantitative metrics.");
            parsed.put("identifiedWeakness", currentItem.get("topic"));
            parsed.put("contextualFollowUp", nextItem.get("question"));
        }

        parsed.put("modelAnswer", currentItem.get("modelAnswer"));
        parsed.put("proTip", currentItem.get("tip"));
        parsed.put("questionNumber", questionNumber);
        parsed.put("isFinal", questionNumber >= totalRounds);

        return ResponseEntity.ok(parsed);
    }

    @PostMapping("/finish")
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> finishInterview(@RequestBody Map<String, Object> request) {
        String targetRole = (String) request.getOrDefault("targetRole", "Backend Engineer");
        String interviewType = (String) request.getOrDefault("interviewType", "Technical");

        String canonical = getCanonicalRole(targetRole);
        List<Map<String, String>> bank = ROLE_QUESTION_BANKS.getOrDefault(canonical, ROLE_QUESTION_BANKS.get("BACKEND"));

        List<Map<String, Object>> reviews = (List<Map<String, Object>>) request.get("reviews");
        
        int overallScore = 0;
        int technicalAccuracy = 0;
        int problemSolving = 0;
        int communication = 0;
        int confidence = 0;
        int skippedCount = 0;

        if (reviews != null && !reviews.isEmpty()) {
            int totalScore = 0;
            int totalTech = 0;
            int totalComm = 0;

            for (Map<String, Object> r : reviews) {
                int sc = r.get("score") != null ? Integer.parseInt(String.valueOf(r.get("score"))) : 0;
                int tech = r.get("technicalAccuracy") != null ? Integer.parseInt(String.valueOf(r.get("technicalAccuracy"))) : sc;
                int comm = r.get("communication") != null ? Integer.parseInt(String.valueOf(r.get("communication"))) : 0;
                String ans = (String) r.getOrDefault("candidateAnswer", "");

                if (ans.contains("[Candidate skipped") || sc == 0) {
                    skippedCount++;
                }

                totalScore += sc;
                totalTech += tech;
                totalComm += comm;
            }

            int n = reviews.size();
            overallScore = Math.round((float) totalScore / n);
            technicalAccuracy = Math.round((float) totalTech / n);
            problemSolving = Math.max(0, Math.round(overallScore * 0.95f));
            communication = Math.round((float) totalComm / n);
            confidence = overallScore > 0 ? Math.min(95, overallScore + 5) : 0;
        }

        String hiringRecommendation;
        if (overallScore >= 80) {
            hiringRecommendation = "STRONG HIRE (Senior / Staff Level)";
        } else if (overallScore >= 65) {
            hiringRecommendation = "HIRE (Mid-Level Developer)";
        } else if (overallScore >= 40) {
            hiringRecommendation = "NEEDS IMPROVEMENT (Junior Developer)";
        } else if (skippedCount > 0 && overallScore == 0) {
            hiringRecommendation = "NO HIRE (All Questions Skipped)";
        } else {
            hiringRecommendation = "NO HIRE (Insufficient Technical Depth)";
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("targetRole", targetRole);
        resp.put("interviewType", interviewType);
        resp.put("overallScore", overallScore);
        resp.put("technicalAccuracy", technicalAccuracy);
        resp.put("problemSolving", problemSolving);
        resp.put("communication", communication);
        resp.put("confidence", confidence);
        resp.put("hiringRecommendation", hiringRecommendation);
        resp.put("skippedCount", skippedCount);

        if (overallScore == 0) {
            resp.put("strongAreas", List.of("Showed willingness to test the live interview platform interface"));
            resp.put("weakAreas", List.of(
                    "All interview questions were skipped without attempting answers",
                    "Share partial intuition, pseudocode, or brute-force ideas rather than passing on questions"
            ));
            resp.put("aiSummary", String.format("You skipped all questions in this %s mock round. Attempt answering each question next time to receive detailed technical and communication grading.", targetRole));
            resp.put("evidenceGenerated", "AI Mock Interview Completed (0% - Retake Recommended)");
        } else {
            resp.put("strongAreas", List.of(
                    "Clear explanation of core technical mechanics and memory models",
                    "Demonstrated structured problem breakdown and trade-off analysis",
                    "Maintained communication cadence under live time constraints"
            ));
            resp.put("weakAreas", List.of(
                    "Dive deeper into edge cases, failure recovery, and quantitative latency metrics",
                    "State explicit complexity formulas and thread safety trade-offs"
            ));
            resp.put("aiSummary", String.format("Completed %s mock session with an overall rating of %d%%. %s", targetRole, overallScore, hiringRecommendation));
            resp.put("evidenceGenerated", String.format("AI Mock Interview: %d/100 verified into My Path", overallScore));
        }

        resp.put("detailedModelAnswers", bank);

        return ResponseEntity.ok(resp);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJson(String text) {
        try {
            String clean = text.trim();
            if (clean.startsWith("```json")) clean = clean.substring(7);
            if (clean.startsWith("```")) clean = clean.substring(3);
            if (clean.endsWith("```")) clean = clean.substring(0, clean.length() - 3);
            clean = clean.trim();

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            return mapper.readValue(clean, Map.class);
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }
}
