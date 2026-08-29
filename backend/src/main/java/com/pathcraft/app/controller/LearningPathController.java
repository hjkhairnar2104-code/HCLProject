package com.pathcraft.app.controller;

import com.pathcraft.app.model.*;
import com.pathcraft.app.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/learning-path")
public class LearningPathController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final UserLearningProfileRepository profileRepo;
    private final UserSkillMasteryRepository skillRepo;
    private final RoadmapChangeLogRepository changeLogRepo;
    private final RestTemplate restTemplate = new RestTemplate();

    public LearningPathController(
            UserLearningProfileRepository profileRepo,
            UserSkillMasteryRepository skillRepo,
            RoadmapChangeLogRepository changeLogRepo
    ) {
        this.profileRepo = profileRepo;
        this.skillRepo = skillRepo;
        this.changeLogRepo = changeLogRepo;
    }

    /**
     * Normalize Role Name to Canonical Key
     */
    private String normalizeRole(String role) {
        if (role == null) return "BACKEND";
        String r = role.toLowerCase().trim();
        if (r.contains("ai") || r.contains("machine learning") || r.contains("ml")) return "AIML";
        if (r.contains("devops") || r.contains("sre") || r.contains("infra")) return "DEVOPS";
        if (r.contains("data scientist") || r.contains("data science") || r.contains("analyst")) return "DATA_SCIENCE";
        if (r.contains("full stack") || r.contains("fullstack")) return "FULLSTACK";
        if (r.contains("cloud")) return "CLOUD";
        if (r.contains("frontend") || r.contains("react") || r.contains("ui")) return "FRONTEND";
        return "BACKEND";
    }

    /**
     * 1. UNIFIED LEARNING DASHBOARD PAYLOAD (Career-Aware)
     */
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(
            @RequestParam(defaultValue = "harsh@example.com") String userEmail,
            @RequestParam(required = false) String targetRole
    ) {
        // Ensure default learner profile exists
        UserLearningProfile profile = profileRepo.findByUserEmail(userEmail).orElseGet(() -> {
            UserLearningProfile defaultProfile = UserLearningProfile.builder()
                    .id(UUID.randomUUID().toString())
                    .userEmail(userEmail)
                    .fullName("Harsh")
                    .naturalLanguageGoal("I want to become a Backend Systems Engineer in 90 days.")
                    .targetRole("Backend Engineer")
                    .experienceLevel("Intermediate")
                    .deadlineDays(90)
                    .hoursPerDay(2.0)
                    .daysPerWeek(6)
                    .targetCompanies("Amazon, Google, Microsoft, Atlassian")
                    .preferredLearningStyle("HANDS_ON")
                    .overallReadinessPercentage(72.0)
                    .currentStreakDays(7)
                    .totalCoins(140)
                    .profileCompleted(true)
                    .build();
            return profileRepo.save(defaultProfile);
        });

        if (targetRole != null && !targetRole.isBlank()) {
            profile.setTargetRole(targetRole);
            profileRepo.save(profile);
        }

        String canonicalRole = normalizeRole(profile.getTargetRole());

        // Get or build role-specific skill masteries
        List<UserSkillMastery> skills = skillRepo.findByUserEmail(userEmail);
        boolean needsSkillRefresh = skills.isEmpty() || !isSkillsMatchingRole(skills, canonicalRole);
        if (needsSkillRefresh) {
            skills = initSkillsForRole(userEmail, canonicalRole);
        }

        // Calculate weighted readiness for canonical role
        double overallReadiness = calculateRoleReadiness(canonicalRole, skills);
        profile.setOverallReadinessPercentage(overallReadiness);
        profileRepo.save(profile);

        // Get change logs
        List<RoadmapChangeLog> logs = changeLogRepo.findByUserEmailOrderByCreatedAtDesc(userEmail);
        if (logs.isEmpty()) {
            logs = initDefaultLogsForRole(userEmail, canonicalRole);
        }

        // Construct complete unified payload
        Map<String, Object> resp = new HashMap<>();
        resp.put("profile", profile);
        resp.put("targetRole", profile.getTargetRole());
        resp.put("canonicalRole", canonicalRole);
        resp.put("overallReadiness", overallReadiness);
        resp.put("daysRemaining", profile.getDeadlineDays() != null ? profile.getDeadlineDays() : 90);
        resp.put("hoursPerDay", profile.getHoursPerDay() != null ? profile.getHoursPerDay() : 2.0);
        resp.put("daysPerWeek", profile.getDaysPerWeek() != null ? profile.getDaysPerWeek() : 6);
        resp.put("streakDays", profile.getCurrentStreakDays() != null ? profile.getCurrentStreakDays() : 7);
        resp.put("skills", skills);
        resp.put("changeLogs", logs);

        // Dynamic Role-Specific Today's Mission
        resp.put("todaysMission", getTodaysMissionForRole(canonicalRole));

        // Dynamic Role-Specific Skill Health & Retention Decay
        resp.put("skillHealth", getSkillHealthForRole(canonicalRole));

        // Dynamic 5-Phase Adaptive Roadmap
        resp.put("roadmapPhases", get5PhaseRoadmapForRole(canonicalRole));

        return ResponseEntity.ok(resp);
    }

    /**
     * 1B. CALIBRATE LEARNER PROFILE & CUSTOM SKILLS (Full 6-Step Onboarding Pipeline)
     */
    @PostMapping("/calibrate-profile")
    public ResponseEntity<?> calibrateProfile(@RequestBody Map<String, Object> body) {
        String userEmail = (String) body.getOrDefault("userEmail", "learner@example.com");
        String fullName = (String) body.getOrDefault("fullName", "Learner");
        String targetRole = (String) body.getOrDefault("targetRole", "Backend Engineer");
        String experienceLevel = (String) body.getOrDefault("experienceLevel", "Intermediate");
        String codingExperienceYears = (String) body.getOrDefault("codingExperienceYears", "1–2 years");
        int deadlineDays = Integer.parseInt(String.valueOf(body.getOrDefault("deadlineDays", "90")));
        double hoursPerDay = Double.parseDouble(String.valueOf(body.getOrDefault("hoursPerDay", "2.0")));
        int daysPerWeek = Integer.parseInt(String.valueOf(body.getOrDefault("daysPerWeek", "6")));
        String preferredLearningStyle = String.valueOf(body.getOrDefault("preferredLearningStyle", "HANDS_ON"));
        String learningGoals = (String) body.getOrDefault("learningGoals", "Prepare for interviews");
        String jobDescription = (String) body.getOrDefault("jobDescription", "");
        String naturalLanguageGoal = (String) body.getOrDefault("naturalLanguageGoal", "");

        List<Map<String, Object>> claimedSkills = (List<Map<String, Object>>) body.getOrDefault("claimedSkills", List.of());

        // Update or create UserLearningProfile
        UserLearningProfile profile = profileRepo.findByUserEmail(userEmail).orElseGet(() -> {
            return UserLearningProfile.builder()
                    .id(UUID.randomUUID().toString())
                    .userEmail(userEmail)
                    .build();
        });

        profile.setFullName(fullName);
        profile.setTargetRole(targetRole);
        profile.setExperienceLevel(experienceLevel);
        profile.setCodingExperienceYears(codingExperienceYears);
        profile.setDeadlineDays(deadlineDays);
        profile.setHoursPerDay(hoursPerDay);
        profile.setDaysPerWeek(daysPerWeek);
        profile.setPreferredLearningStyle(preferredLearningStyle);
        profile.setLearningGoals(learningGoals);
        profile.setJobDescription(jobDescription);
        if (!naturalLanguageGoal.isBlank()) profile.setNaturalLanguageGoal(naturalLanguageGoal);
        profile.setProfileCompleted(true);

        String canonical = normalizeRole(targetRole);

        // Map claimed skills and 1-10 confidence ratings into calibrated mastery scores
        Map<String, Integer> skillScoreMap = new HashMap<>();
        for (Map<String, Object> s : claimedSkills) {
            String sName = String.valueOf(s.getOrDefault("name", "")).trim();
            if (sName.isBlank()) continue;

            int score;
            if (s.containsKey("rating")) {
                int rating = Integer.parseInt(String.valueOf(s.get("rating"))); // 1 to 10
                score = Math.min(95, Math.max(25, rating * 10 + (rating >= 8 ? 2 : -2)));
            } else {
                String sLevel = String.valueOf(s.getOrDefault("level", "Intermediate"));
                score = "Advanced".equalsIgnoreCase(sLevel) ? 91 : ("Intermediate".equalsIgnoreCase(sLevel) ? 74 : 52);
            }
            skillScoreMap.put(sName.toLowerCase(), score);
        }

        // Standard competencies for target canonical role
        List<Map<String, Object>> targetCompetencies = getTargetCompetencies(canonical);
        List<UserSkillMastery> updatedSkills = new ArrayList<>();
        double totalWeightedCurrent = 0;
        double totalWeightedRequired = 0;

        List<Map<String, Object>> gapBreakdown = new ArrayList<>();

        for (Map<String, Object> comp : targetCompetencies) {
            String skillId = (String) comp.get("id");
            String skillName = (String) comp.get("name");
            String category = (String) comp.get("category");
            int req = (int) comp.get("required");
            double weight = ((Number) comp.getOrDefault("weight", 1.0)).doubleValue();

            int cur = (int) comp.getOrDefault("defaultScore", 25); // role-aware baseline
            for (String key : skillScoreMap.keySet()) {
                if (skillName.toLowerCase().contains(key) || key.contains(skillName.toLowerCase()) || skillId.contains(key)) {
                    cur = skillScoreMap.get(key);
                    break;
                }
            }

            String status = cur >= req ? "MASTERED" : (cur >= 65 ? "LEARNING" : (cur >= 50 ? "WEAK" : "CRITICAL_GAP"));
            String urgency = cur < 45 ? "CRITICAL" : (cur < 65 ? "HIGH" : (cur < req ? "MEDIUM" : "MASTERED"));
            String colorTag = cur < 45 ? "🔴" : (cur < 65 ? "🟠" : (cur < req ? "🟡" : "🟢"));

            gapBreakdown.add(Map.of(
                    "skill", skillName,
                    "current", cur,
                    "required", req,
                    "urgency", urgency,
                    "colorTag", colorTag,
                    "gap", Math.max(0, req - cur)
            ));

            UserSkillMastery sm = UserSkillMastery.builder()
                    .id(UUID.randomUUID().toString())
                    .userEmail(userEmail)
                    .skillId(skillId)
                    .skillName(skillName)
                    .category(category)
                    .currentScore(cur)
                    .requiredScore(req)
                    .status(status)
                    .courseCompleted(cur >= 70)
                    .quizScore(cur)
                    .codingScore(cur)
                    .projectCompleted(cur >= 85)
                    .interviewScore(cur >= 75 ? cur - 5 : 0)
                    .decayScore(cur)
                    .needsRevision(cur < req && cur >= 50)
                    .lastPracticedAt(LocalDateTime.now().minusDays(2))
                    .lastAssessedAt(LocalDateTime.now().minusDays(2))
                    .build();

            updatedSkills.add(sm);
            totalWeightedCurrent += cur * weight;
            totalWeightedRequired += req * weight;
        }

        double overallReadiness = totalWeightedRequired == 0 ? 60.0 : (totalWeightedCurrent / totalWeightedRequired) * 100.0;
        overallReadiness = Math.min(99.0, Math.round(overallReadiness * 10.0) / 10.0);
        profile.setOverallReadinessPercentage(overallReadiness);
        profileRepo.save(profile);

        skillRepo.deleteAll(skillRepo.findByUserEmail(userEmail));
        skillRepo.saveAll(updatedSkills);

        int totalAvailableHours = (int) Math.round(hoursPerDay * daysPerWeek * (deadlineDays / 7.0));

        // Add log
        RoadmapChangeLog log = RoadmapChangeLog.builder()
                .id(UUID.randomUUID().toString())
                .userEmail(userEmail)
                .changeType("GOAL_CALIBRATED")
                .affectedSkill("Target: " + targetRole)
                .reason(String.format("Generated personalized path for %s. Calculated readiness: %.1f%% with %d total study hours across %d days.", targetRole, overallReadiness, totalAvailableHours, deadlineDays))
                .triggerEvent("ONBOARDING_CALIBRATION")
                .timeLabel("Just now")
                .build();
        changeLogRepo.save(log);

        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "CALIBRATED");
        resp.put("profile", profile);
        resp.put("targetRole", targetRole);
        resp.put("canonicalRole", canonical);
        resp.put("overallReadiness", overallReadiness);
        resp.put("totalLearningHours", totalAvailableHours);
        resp.put("skills", updatedSkills);
        resp.put("skillGaps", gapBreakdown);
        resp.put("todaysMission", getTodaysMissionForRole(canonical));
        resp.put("skillHealth", getSkillHealthForRole(canonical));
        resp.put("roadmapPhases", get5PhaseRoadmapForRole(canonical));

        return ResponseEntity.ok(resp);
    }

    /**
     * 1C. SWITCH CAREER ROLE (Instant rebalancing & dynamic path mutation)
     */
    @PostMapping("/switch-role")
    public ResponseEntity<?> switchRole(@RequestBody Map<String, String> request) {
        String userEmail = request.getOrDefault("userEmail", "harsh@example.com");
        String newRole = request.getOrDefault("targetRole", "AI/ML Engineer");

        String canonical = normalizeRole(newRole);

        UserLearningProfile profile = profileRepo.findByUserEmail(userEmail).orElseGet(() -> {
            return UserLearningProfile.builder()
                    .id(UUID.randomUUID().toString())
                    .userEmail(userEmail)
                    .fullName("Learner")
                    .build();
        });

        String previousRole = profile.getTargetRole() != null ? profile.getTargetRole() : "Backend Engineer";
        profile.setTargetRole(newRole);

        // Re-initialize skills for the new career domain
        List<UserSkillMastery> newSkills = initSkillsForRole(userEmail, canonical);
        double overallReadiness = calculateRoleReadiness(canonical, newSkills);
        profile.setOverallReadinessPercentage(overallReadiness);
        profileRepo.save(profile);

        // Record Change in History Log
        RoadmapChangeLog log = RoadmapChangeLog.builder()
                .id(UUID.randomUUID().toString())
                .userEmail(userEmail)
                .changeType("CAREER_GOAL_SWITCHED")
                .affectedSkill(newRole)
                .reason(String.format("Switched goal from %s to %s. Rebalanced entire skill graph, dependencies, daily missions, and calculated new readiness: %.1f%%.", previousRole, newRole, overallReadiness))
                .triggerEvent("USER_ROLE_SWITCH")
                .timeLabel("Just now")
                .build();
        changeLogRepo.save(log);

        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "SWITCHED");
        resp.put("previousRole", previousRole);
        resp.put("targetRole", newRole);
        resp.put("canonicalRole", canonical);
        resp.put("overallReadiness", overallReadiness);
        resp.put("skills", newSkills);
        resp.put("todaysMission", getTodaysMissionForRole(canonical));
        resp.put("skillHealth", getSkillHealthForRole(canonical));
        resp.put("roadmapPhases", get5PhaseRoadmapForRole(canonical));
        resp.put("changeLog", log);

        return ResponseEntity.ok(resp);
    }

    /**
     * 2. DYNAMIC SKILL GRAPH (DAG with role-specific nodes, status, and prerequisites)
     */
    @GetMapping("/skill-graph")
    public ResponseEntity<?> getSkillGraph(
            @RequestParam(defaultValue = "harsh@example.com") String userEmail,
            @RequestParam(required = false) String targetRole
    ) {
        String roleToUse = targetRole;
        if (roleToUse == null || roleToUse.isBlank()) {
            UserLearningProfile profile = profileRepo.findByUserEmail(userEmail).orElse(null);
            roleToUse = profile != null ? profile.getTargetRole() : "Backend Engineer";
        }
        String canonical = normalizeRole(roleToUse);
        return ResponseEntity.ok(getGraphForRole(canonical));
    }

    /**
     * 3. SKILL GAP ANALYZER (Role-specific gap ranking)
     */
    @GetMapping("/skill-gap")
    public ResponseEntity<?> getSkillGap(
            @RequestParam(defaultValue = "harsh@example.com") String userEmail,
            @RequestParam(required = false) String targetRole
    ) {
        String roleToUse = targetRole;
        if (roleToUse == null || roleToUse.isBlank()) {
            UserLearningProfile profile = profileRepo.findByUserEmail(userEmail).orElse(null);
            roleToUse = profile != null ? profile.getTargetRole() : "Backend Engineer";
        }
        String canonical = normalizeRole(roleToUse);
        return ResponseEntity.ok(getSkillGapDataForRole(canonical));
    }

    /**
     * 4. ADAPTIVE ROADMAP MUTATION
     */
    @PostMapping("/adapt")
    public ResponseEntity<?> adaptRoadmap(@RequestBody Map<String, Object> request) {
        String userEmail = (String) request.getOrDefault("userEmail", "harsh@example.com");
        String triggerType = (String) request.getOrDefault("triggerType", "ASSESSMENT_SUBMITTED");
        String skill = (String) request.getOrDefault("skill", "SQL");
        int score = Integer.parseInt(String.valueOf(request.getOrDefault("score", "45")));

        UserLearningProfile profile = profileRepo.findByUserEmail(userEmail).orElse(null);
        String canonical = normalizeRole(profile != null ? profile.getTargetRole() : "Backend");

        String changeType;
        String reason;

        if (score < 60) {
            changeType = "REINFORCEMENT_ADDED";
            reason = String.format("Your %s assessment score was %d%% (below the 70%% threshold). Added a %s reinforcement module and practical exercises before proceeding to higher-level dependencies.", skill, score, skill);
        } else if (score >= 90) {
            changeType = "MODULE_SKIPPED";
            reason = String.format("You scored %d%% in %s! Basic revision was skipped and accelerated directly into advanced projects.", score, skill);
        } else {
            changeType = "SCHEDULE_COMPRESSED";
            reason = String.format("Verified %s mastery at %d%%. Adjusted daily pace to maintain target trajectory.", skill, score);
        }

        // Persist decision log
        RoadmapChangeLog log = RoadmapChangeLog.builder()
                .id(UUID.randomUUID().toString())
                .userEmail(userEmail)
                .changeType(changeType)
                .affectedSkill(skill)
                .reason(reason)
                .triggerEvent(triggerType)
                .timeLabel("Just now")
                .build();
        changeLogRepo.save(log);

        return ResponseEntity.ok(Map.of(
                "status", "ADAPTED",
                "changeLog", log,
                "updatedRoadmap", get5PhaseRoadmapForRole(canonical)
        ));
    }

    /**
     * 5. ROADMAP CHANGE HISTORY (Explainability Log)
     */
    @GetMapping("/change-history")
    public ResponseEntity<?> getChangeHistory(@RequestParam(defaultValue = "harsh@example.com") String userEmail) {
        List<RoadmapChangeLog> logs = changeLogRepo.findByUserEmailOrderByCreatedAtDesc(userEmail);
        if (logs.isEmpty()) {
            logs = initDefaultLogsForRole(userEmail, "BACKEND");
        }
        return ResponseEntity.ok(logs);
    }

    /**
     * 6. WHAT-IF CAREER SIMULATOR (Role comparison matrix)
     */
    @PostMapping("/career-simulator")
    public ResponseEntity<?> simulateCareerPaths(@RequestBody Map<String, String> request) {
        String roleA = request.getOrDefault("roleA", "Backend Systems Engineer");
        String roleB = request.getOrDefault("roleB", "AI & Machine Learning Engineer");

        String canA = normalizeRole(roleA);
        String canB = normalizeRole(roleB);

        int readinessA = canA.equals("BACKEND") ? 72 : (canA.equals("FULLSTACK") ? 65 : (canA.equals("DEVOPS") ? 38 : 42));
        int readinessB = canB.equals("AIML") ? 41 : (canB.equals("DATA_SCIENCE") ? 48 : (canB.equals("CLOUD") ? 52 : 35));

        Map<String, Object> comparison = Map.of(
                "currentProfile", Map.of("PrimaryStack", canA.equals("AIML") ? "Python, Math" : "Java, DSA, SQL"),
                "roleA", Map.of(
                        "title", roleA,
                        "currentReadiness", readinessA,
                        "estimatedWeeks", canA.equals("BACKEND") ? 10 : 14,
                        "missingSkills", canA.equals("BACKEND") ? List.of("Spring Boot 3", "Microservices", "Docker", "System Design") : List.of("React 18", "Full-Stack Auth", "Node.js"),
                        "recommendation", canA.equals("BACKEND") ? "Directly leverages your OOP and algorithmic foundation. Fastest path to production SDE." : "Strong foundation with frontend integration required."
                ),
                "roleB", Map.of(
                        "title", roleB,
                        "currentReadiness", readinessB,
                        "estimatedWeeks", canB.equals("AIML") ? 18 : 16,
                        "missingSkills", canB.equals("AIML") ? List.of("PyTorch", "Deep Learning", "Transformers & LLMs", "Vector DBs & RAG") : List.of("Linux Shell", "Kubernetes", "Terraform", "CI/CD"),
                        "recommendation", canB.equals("AIML") ? "Requires acquiring Python data stack & deep learning math foundations (6–8 additional weeks)." : "Requires Linux system administration and cloud container orchestration."
                ),
                "aiVerdict", String.format("%s is currently %d%% closer to your existing verified skill profile.", roleA, Math.abs(readinessA - readinessB))
        );

        return ResponseEntity.ok(comparison);
    }

    /**
     * 7. CONTEXT-AWARE AI MENTOR WITH MEMORY
     */
    @PostMapping("/mentor")
    public ResponseEntity<?> askMentor(@RequestBody Map<String, String> request) {
        String query = request.getOrDefault("query", "What should I learn today?");
        String userEmail = request.getOrDefault("userEmail", "harsh@example.com");

        UserLearningProfile profile = profileRepo.findByUserEmail(userEmail).orElse(null);
        String targetRole = profile != null ? profile.getTargetRole() : "Backend Engineer";
        String canonical = normalizeRole(targetRole);

        String context = String.format("User Profile: %s, Target Role: %s (%s), Active Focus: %s",
                profile != null ? profile.getFullName() : "Learner",
                targetRole, canonical,
                canonical.equals("AIML") ? "PyTorch & Transformers" : (canonical.equals("DEVOPS") ? "Docker & Kubernetes" : "Spring Boot & SQL")
        );

        String prompt = String.format(
                "You are PathCraft AI Mentor with career memory.\n" +
                "Context: %s\n" +
                "Learner Query: \"%s\"\n\n" +
                "Answer concisely (2-3 sentences), actionable, strictly tailored to their target role (%s) and current skill gaps.",
                context, query, targetRole
        );

        String answer = callGemini(prompt);
        if (answer.isBlank()) {
            if (canonical.equals("AIML")) {
                answer = "For your **AI/ML Engineer** path, focus on **NumPy vectorization and Linear Regression** today. Solidifying gradient descent now ensures you will effortlessly grasp backpropagation in PyTorch next week!";
            } else if (canonical.equals("DEVOPS")) {
                answer = "For your **DevOps Engineer** roadmap, spend your 45-minute block today building a **multi-stage Dockerfile and container network**. This unblocks your upcoming Kubernetes pod deployment phase!";
            } else if (canonical.equals("DATA_SCIENCE")) {
                answer = "On your **Data Scientist** track, practice **Pandas data aggregation and SQL window functions** today. Clean exploratory data analysis is the prerequisite for all predictive ML modeling!";
            } else {
                answer = "Based on your **Backend Engineer** trajectory, focus on **SQL Window Functions & Indexing** today. Mastering relational optimization directly unblocks your Spring Boot JPA performance tuning phase!";
            }
        }

        return ResponseEntity.ok(Map.of("response", answer));
    }

    // =========================================================================
    // CAREER-SPECIFIC DATA ENGINES & HELPERS
    // =========================================================================

    private boolean isSkillsMatchingRole(List<UserSkillMastery> skills, String canonicalRole) {
        if (skills.isEmpty()) return false;
        String first = skills.get(0).getSkillId().toLowerCase();
        if (canonicalRole.equals("AIML") && (first.contains("python") || first.contains("ml"))) return true;
        if (canonicalRole.equals("DEVOPS") && (first.contains("linux") || first.contains("docker"))) return true;
        if (canonicalRole.equals("DATA_SCIENCE") && (first.contains("python_ds") || first.contains("pandas"))) return true;
        if (canonicalRole.equals("FULLSTACK") && (first.contains("react") || first.contains("js"))) return true;
        if (canonicalRole.equals("BACKEND") && (first.contains("java") || first.contains("spring"))) return true;
        return false;
    }

    private List<UserSkillMastery> initSkillsForRole(String userEmail, String canonicalRole) {
        skillRepo.deleteAll(skillRepo.findByUserEmail(userEmail));
        List<UserSkillMastery> list = new ArrayList<>();

        if (canonicalRole.equals("AIML")) {
            list = List.of(
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("python_ml").skillName("Python for AI & NumPy").category("FOUNDATIONS").currentScore(78).requiredScore(85).status("LEARNING").courseCompleted(true).quizScore(80).codingScore(76).projectCompleted(true).interviewScore(75).decayScore(78).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("math_stats").skillName("Linear Algebra & Statistics").category("FOUNDATIONS").currentScore(54).requiredScore(80).status("WEAK").courseCompleted(true).quizScore(52).codingScore(56).projectCompleted(false).interviewScore(50).decayScore(54).needsRevision(true).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("scikit_ml").skillName("Machine Learning (Scikit-Learn)").category("AI_ML").currentScore(42).requiredScore(80).status("CRITICAL_GAP").courseCompleted(false).quizScore(40).codingScore(45).projectCompleted(false).interviewScore(40).decayScore(42).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("pytorch_dl").skillName("Deep Learning & PyTorch").category("AI_ML").currentScore(20).requiredScore(75).status("CRITICAL_GAP").courseCompleted(false).quizScore(20).codingScore(20).projectCompleted(false).interviewScore(0).decayScore(20).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("transformers_llm").skillName("Transformers & LLM Fine-Tuning").category("AI_ML").currentScore(10).requiredScore(70).status("CRITICAL_GAP").courseCompleted(false).quizScore(10).codingScore(10).projectCompleted(false).interviewScore(0).decayScore(10).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("rag_vector").skillName("RAG & Vector Databases").category("AI_ML").currentScore(15).requiredScore(70).status("CRITICAL_GAP").courseCompleted(false).quizScore(15).codingScore(15).projectCompleted(false).interviewScore(0).decayScore(15).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("ml_deploy").skillName("FastAPI & Model Deployment").category("PRODUCTION").currentScore(25).requiredScore(65).status("CRITICAL_GAP").courseCompleted(false).quizScore(25).codingScore(25).projectCompleted(false).interviewScore(0).decayScore(25).needsRevision(false).build()
            );
        } else if (canonicalRole.equals("DEVOPS")) {
            list = List.of(
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("linux_shell").skillName("Linux & Shell Scripting").category("FOUNDATIONS").currentScore(65).requiredScore(85).status("LEARNING").courseCompleted(true).quizScore(68).codingScore(62).projectCompleted(true).interviewScore(65).decayScore(65).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("docker_cont").skillName("Docker & Multi-Stage Builds").category("CONTAINERS").currentScore(55).requiredScore(85).status("WEAK").courseCompleted(true).quizScore(50).codingScore(60).projectCompleted(false).interviewScore(50).decayScore(55).needsRevision(true).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("cicd_pipeline").skillName("CI/CD (GitHub Actions / Jenkins)").category("AUTOMATION").currentScore(35).requiredScore(80).status("CRITICAL_GAP").courseCompleted(false).quizScore(30).codingScore(40).projectCompleted(false).interviewScore(30).decayScore(35).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("k8s_orchestration").skillName("Kubernetes (Pods, Ingress, Helm)").category("ORCHESTRATION").currentScore(20).requiredScore(80).status("CRITICAL_GAP").courseCompleted(false).quizScore(20).codingScore(20).projectCompleted(false).interviewScore(0).decayScore(20).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("terraform_iac").skillName("Terraform (Infrastructure as Code)").category("INFRASTRUCTURE").currentScore(15).requiredScore(75).status("CRITICAL_GAP").courseCompleted(false).quizScore(15).codingScore(15).projectCompleted(false).interviewScore(0).decayScore(15).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("cloud_aws").skillName("AWS Cloud Architecture & VPC").category("CLOUD").currentScore(30).requiredScore(75).status("CRITICAL_GAP").courseCompleted(false).quizScore(30).codingScore(30).projectCompleted(false).interviewScore(20).decayScore(30).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("monitoring_obs").skillName("Prometheus & Grafana Observability").category("OBSERVABILITY").currentScore(10).requiredScore(65).status("CRITICAL_GAP").courseCompleted(false).quizScore(10).codingScore(10).projectCompleted(false).interviewScore(0).decayScore(10).needsRevision(false).build()
            );
        } else if (canonicalRole.equals("DATA_SCIENCE")) {
            list = List.of(
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("python_ds").skillName("Python & Pandas Data Wrangling").category("DATA_ENGINEERING").currentScore(82).requiredScore(85).status("LEARNING").courseCompleted(true).quizScore(85).codingScore(80).projectCompleted(true).interviewScore(80).decayScore(82).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("stats_inference").skillName("Inferential Statistics & Hypothesis Testing").category("FOUNDATIONS").currentScore(60).requiredScore(85).status("WEAK").courseCompleted(true).quizScore(58).codingScore(62).projectCompleted(false).interviewScore(55).decayScore(60).needsRevision(true).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("sql_analytics").skillName("SQL Analytics & Window Functions").category("DATABASE").currentScore(68).requiredScore(80).status("LEARNING").courseCompleted(true).quizScore(70).codingScore(66).projectCompleted(true).interviewScore(65).decayScore(68).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("eda_viz").skillName("Exploratory Data Analysis & Seaborn").category("VISUALIZATION").currentScore(75).requiredScore(80).status("LEARNING").courseCompleted(true).quizScore(75).codingScore(75).projectCompleted(true).interviewScore(75).decayScore(75).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("ml_modeling").skillName("Scikit-Learn & Feature Engineering").category("MODELING").currentScore(40).requiredScore(80).status("CRITICAL_GAP").courseCompleted(false).quizScore(40).codingScore(40).projectCompleted(false).interviewScore(35).decayScore(40).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("time_series").skillName("Time Series & Forecasting").category("ADVANCED").currentScore(20).requiredScore(70).status("CRITICAL_GAP").courseCompleted(false).quizScore(20).codingScore(20).projectCompleted(false).interviewScore(0).decayScore(20).needsRevision(false).build()
            );
        } else if (canonicalRole.equals("FULLSTACK")) {
            list = List.of(
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("js_ts").skillName("JavaScript ES6+ & TypeScript").category("FRONTEND").currentScore(80).requiredScore(85).status("LEARNING").courseCompleted(true).quizScore(82).codingScore(78).projectCompleted(true).interviewScore(80).decayScore(80).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("react_state").skillName("React 18 & State Architecture").category("FRONTEND").currentScore(74).requiredScore(85).status("LEARNING").courseCompleted(true).quizScore(76).codingScore(72).projectCompleted(true).interviewScore(70).decayScore(74).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("node_express").skillName("Node.js / Spring REST APIs").category("BACKEND").currentScore(65).requiredScore(80).status("LEARNING").courseCompleted(true).quizScore(68).codingScore(62).projectCompleted(false).interviewScore(60).decayScore(65).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("db_sql_mongo").skillName("SQL & MongoDB Data Models").category("DATABASE").currentScore(60).requiredScore(75).status("WEAK").courseCompleted(true).quizScore(58).codingScore(62).projectCompleted(false).interviewScore(55).decayScore(60).needsRevision(true).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("auth_security").skillName("Authentication (JWT, OAuth2)").category("SECURITY").currentScore(45).requiredScore(75).status("CRITICAL_GAP").courseCompleted(false).quizScore(45).codingScore(45).projectCompleted(false).interviewScore(40).decayScore(45).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("docker_deploy").skillName("Docker & Cloud Full-Stack Deploy").category("PRODUCTION").currentScore(30).requiredScore(70).status("CRITICAL_GAP").courseCompleted(false).quizScore(30).codingScore(30).projectCompleted(false).interviewScore(0).decayScore(30).needsRevision(false).build()
            );
        } else { // BACKEND
            list = List.of(
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("java_core").skillName("Java Core & OOP").category("FOUNDATIONS").currentScore(92).requiredScore(75).status("MASTERED").courseCompleted(true).quizScore(94).codingScore(90).projectCompleted(true).interviewScore(92).decayScore(90).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("dsa_core").skillName("Data Structures & Algorithms").category("FOUNDATIONS").currentScore(84).requiredScore(75).status("MASTERED").courseCompleted(true).quizScore(88).codingScore(85).projectCompleted(true).interviewScore(80).decayScore(92).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("sql_db").skillName("SQL & Database Indexing").category("DATABASE").currentScore(61).requiredScore(80).status("WEAK").courseCompleted(true).quizScore(45).codingScore(65).projectCompleted(false).interviewScore(60).decayScore(61).needsRevision(true).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("spring_boot").skillName("Spring Boot 3 REST APIs").category("BACKEND").currentScore(76).requiredScore(80).status("LEARNING").courseCompleted(true).quizScore(80).codingScore(75).projectCompleted(false).interviewScore(72).decayScore(84).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("docker_cont").skillName("Docker Containerization").category("DEVOPS").currentScore(34).requiredScore(70).status("CRITICAL_GAP").courseCompleted(false).quizScore(30).codingScore(40).projectCompleted(false).interviewScore(0).decayScore(34).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("sys_design").skillName("System Design (LLD/HLD)").category("SYSTEM_DESIGN").currentScore(43).requiredScore(65).status("CRITICAL_GAP").courseCompleted(false).quizScore(40).codingScore(50).projectCompleted(false).interviewScore(40).decayScore(43).needsRevision(false).build(),
                    UserSkillMastery.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).skillId("aws_cloud").skillName("AWS Cloud & Kubernetes").category("CLOUD").currentScore(21).requiredScore(55).status("CRITICAL_GAP").courseCompleted(false).quizScore(20).codingScore(20).projectCompleted(false).interviewScore(0).decayScore(21).needsRevision(false).build()
            );
        }

        return skillRepo.saveAll(list);
    }

    private double calculateRoleReadiness(String canonicalRole, List<UserSkillMastery> skills) {
        if (skills.isEmpty()) return 60.0;
        double sum = 0;
        double req = 0;
        for (UserSkillMastery sm : skills) {
            sum += sm.getCurrentScore();
            req += sm.getRequiredScore();
        }
        double score = req == 0 ? 60.0 : (sum / req) * 100.0;
        return Math.min(99.0, Math.round(score * 10.0) / 10.0);
    }

    private List<Map<String, Object>> getTodaysMissionForRole(String canonical) {
        if (canonical.equals("AIML")) {
            return List.of(
                    Map.of("id", "tm_ai1", "title", "NumPy Matrix Operations & Vector Math", "durationMin", 30, "type", "PRACTICE", "skill", "Python Math", "completed", false, "reason", "Mathematical foundation for neural networks."),
                    Map.of("id", "tm_ai2", "title", "Linear Regression & Gradient Descent in Python", "durationMin", 45, "type", "CODING", "skill", "Scikit-Learn", "completed", false, "reason", "Core active ML phase competency."),
                    Map.of("id", "tm_ai3", "title", "Machine Learning Evaluation Metrics Quiz", "durationMin", 30, "type", "ASSESSMENT", "skill", "ML Theory", "completed", true, "reason", "Precision, Recall, ROC-AUC mastery check."),
                    Map.of("id", "tm_ai4", "title", "15-Min Probability & Bayes Theorem Refresher", "durationMin", 15, "type", "REVISION", "skill", "Statistics", "completed", false, "reason", "Retention decay prevention.")
            );
        } else if (canonical.equals("DEVOPS")) {
            return List.of(
                    Map.of("id", "tm_d1", "title", "Linux System Administration & Shell Scripting", "durationMin", 30, "type", "PRACTICE", "skill", "Linux", "completed", false, "reason", "Foundational OS commands for server automation."),
                    Map.of("id", "tm_d2", "title", "Multi-Stage Dockerfile & Container Networking", "durationMin", 45, "type", "CODING", "skill", "Docker", "completed", false, "reason", "Core containerization phase requirement."),
                    Map.of("id", "tm_d3", "title", "GitHub Actions CI/CD Pipeline Automation", "durationMin", 30, "type", "PROJECT", "skill", "CI/CD", "completed", true, "reason", "Automated testing and linting triggers."),
                    Map.of("id", "tm_d4", "title", "15-Min Networking & DNS Subnetting Refresher", "durationMin", 15, "type", "REVISION", "skill", "Networking", "completed", false, "reason", "VPC & Ingress prerequisite preparation.")
            );
        } else if (canonical.equals("DATA_SCIENCE")) {
            return List.of(
                    Map.of("id", "tm_ds1", "title", "Pandas Data Cleaning & Aggregations on Real Dataset", "durationMin", 30, "type", "PRACTICE", "skill", "Pandas", "completed", false, "reason", "Primary data wrangling competence."),
                    Map.of("id", "tm_ds2", "title", "Statistical Hypothesis Testing (A/B Testing & p-values)", "durationMin", 45, "type", "CODING", "skill", "Statistics", "completed", false, "reason", "Core analytical modeling phase."),
                    Map.of("id", "tm_ds3", "title", "SQL Window Functions & Aggregation Lab", "durationMin", 30, "type", "PRACTICE", "skill", "SQL Analytics", "completed", true, "reason", "Data pipeline querying capability."),
                    Map.of("id", "tm_ds4", "title", "15-Min Exploratory Visualization (Seaborn) Refresher", "durationMin", 15, "type", "REVISION", "skill", "Data Viz", "completed", false, "reason", "Visual distribution analysis readiness.")
            );
        } else if (canonical.equals("FULLSTACK")) {
            return List.of(
                    Map.of("id", "tm_fs1", "title", "React 18 Custom Hooks & Performance Optimization", "durationMin", 30, "type", "PRACTICE", "skill", "React", "completed", false, "reason", "Frontend component state management."),
                    Map.of("id", "tm_fs2", "title", "Full-Stack REST Endpoints with JWT Authentication", "durationMin", 45, "type", "CODING", "skill", "Backend & Auth", "completed", false, "reason", "End-to-end client-server security."),
                    Map.of("id", "tm_fs3", "title", "Relational Database Schema & Migration Scripting", "durationMin", 30, "type", "CODING", "skill", "Database", "completed", true, "reason", "Data persistence layer integrity."),
                    Map.of("id", "tm_fs4", "title", "15-Min JavaScript Asynchronous Event Loop Refresher", "durationMin", 15, "type", "REVISION", "skill", "JavaScript", "completed", false, "reason", "Async/Await concurrency sharpness.")
            );
        } else { // BACKEND
            return List.of(
                    Map.of("id", "tm_b1", "title", "SQL Joins & Window Functions", "durationMin", 30, "type", "PRACTICE", "skill", "SQL", "completed", false, "reason", "SQL is your current foundation gap."),
                    Map.of("id", "tm_b2", "title", "Spring Boot Dependency Injection & REST", "durationMin", 45, "type", "CODING", "skill", "Spring Boot", "completed", false, "reason", "Core active phase requirement for Backend."),
                    Map.of("id", "tm_b3", "title", "Two FAANG DSA Problems (Sliding Window)", "durationMin", 30, "type", "DSA", "skill", "DSA", "completed", true, "reason", "Daily algorithmic sharpness."),
                    Map.of("id", "tm_b4", "title", "10-Min Java Concurrency Refresher", "durationMin", 15, "type", "REVISION", "skill", "Java", "completed", false, "reason", "Retention decay prevention.")
            );
        }
    }

    private List<Map<String, Object>> getSkillHealthForRole(String canonical) {
        if (canonical.equals("AIML")) {
            return List.of(
                    Map.of("skill", "Python Core & NumPy", "lastPracticed", "Today", "retention", 88, "needsRevision", false, "refresherMinutes", 0),
                    Map.of("skill", "Linear Algebra & Statistics", "lastPracticed", "3 weeks ago", "retention", 54, "needsRevision", true, "refresherMinutes", 15),
                    Map.of("skill", "Scikit-Learn ML Algorithms", "lastPracticed", "1 month ago", "retention", 42, "needsRevision", true, "refresherMinutes", 20),
                    Map.of("skill", "PyTorch Neural Networks", "lastPracticed", "New Phase", "retention", 20, "needsRevision", false, "refresherMinutes", 0)
            );
        } else if (canonical.equals("DEVOPS")) {
            return List.of(
                    Map.of("skill", "Linux Administration & Bash", "lastPracticed", "Yesterday", "retention", 82, "needsRevision", false, "refresherMinutes", 0),
                    Map.of("skill", "Docker Containers & Compose", "lastPracticed", "2 weeks ago", "retention", 55, "needsRevision", true, "refresherMinutes", 15),
                    Map.of("skill", "CI/CD GitHub Actions", "lastPracticed", "3 weeks ago", "retention", 35, "needsRevision", true, "refresherMinutes", 20),
                    Map.of("skill", "Kubernetes Deployments", "lastPracticed", "New Phase", "retention", 20, "needsRevision", false, "refresherMinutes", 0)
            );
        } else if (canonical.equals("DATA_SCIENCE")) {
            return List.of(
                    Map.of("skill", "Pandas Data Wrangling", "lastPracticed", "Today", "retention", 90, "needsRevision", false, "refresherMinutes", 0),
                    Map.of("skill", "Inferential Statistics", "lastPracticed", "2 weeks ago", "retention", 60, "needsRevision", true, "refresherMinutes", 15),
                    Map.of("skill", "SQL Analytics & Grouping", "lastPracticed", "1 week ago", "retention", 72, "needsRevision", false, "refresherMinutes", 0),
                    Map.of("skill", "Machine Learning Modeling", "lastPracticed", "3 weeks ago", "retention", 40, "needsRevision", true, "refresherMinutes", 20)
            );
        } else if (canonical.equals("FULLSTACK")) {
            return List.of(
                    Map.of("skill", "TypeScript & ES6+", "lastPracticed", "Yesterday", "retention", 85, "needsRevision", false, "refresherMinutes", 0),
                    Map.of("skill", "React Component Lifecycle", "lastPracticed", "3 days ago", "retention", 78, "needsRevision", false, "refresherMinutes", 0),
                    Map.of("skill", "Database Schema & Indexing", "lastPracticed", "3 weeks ago", "retention", 60, "needsRevision", true, "refresherMinutes", 15),
                    Map.of("skill", "JWT Auth & Route Protection", "lastPracticed", "1 month ago", "retention", 45, "needsRevision", true, "refresherMinutes", 20)
            );
        } else {
            return List.of(
                    Map.of("skill", "Java Collections & Concurrency", "lastPracticed", "2 months ago", "retention", 69, "needsRevision", true, "refresherMinutes", 10),
                    Map.of("skill", "Data Structures & Algorithms", "lastPracticed", "Today", "retention", 92, "needsRevision", false, "refresherMinutes", 0),
                    Map.of("skill", "PostgreSQL & Indexing", "lastPracticed", "3 weeks ago", "retention", 61, "needsRevision", true, "refresherMinutes", 15),
                    Map.of("skill", "Spring Boot 3 REST APIs", "lastPracticed", "Yesterday", "retention", 84, "needsRevision", false, "refresherMinutes", 0)
            );
        }
    }

    private List<Map<String, Object>> get5PhaseRoadmapForRole(String canonical) {
        if (canonical.equals("AIML")) {
            return List.of(
                    Map.of("phaseNumber", 1, "title", "Phase 1: Python & Mathematical Foundations", "status", "IN_PROGRESS", "items", List.of(
                            Map.of("skill", "Python Vectorization & NumPy", "status", "DONE", "score", 85, "proofOfMastery", "NumPy Matrix Project Verified"),
                            Map.of("skill", "Linear Algebra & Gradient Calculus", "status", "ACTIVE", "score", 54, "proofOfMastery", "Math Quiz (54% - Revision active)")
                    )),
                    Map.of("phaseNumber", 2, "title", "Phase 2: Data Wrangling & Exploratory Analysis", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Pandas Data Wrangling & Feature Engineering", "status", "NEXT", "score", 42, "proofOfMastery", "Kaggle Dataset Lab"),
                            Map.of("skill", "Statistical Evaluation & Hypothesis Testing", "status", "LOCKED", "score", 0, "proofOfMastery", "Statistical Analysis Report")
                    )),
                    Map.of("phaseNumber", 3, "title", "Phase 3: Machine Learning & Scikit-Learn", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Supervised Learning (Regression, Trees, SVM)", "status", "LOCKED", "score", 0, "proofOfMastery", "End-to-End ML Pipeline"),
                            Map.of("skill", "Unsupervised Clustering & Dimensionality Reduction", "status", "LOCKED", "score", 0, "proofOfMastery", "PCA & K-Means Lab")
                    )),
                    Map.of("phaseNumber", 4, "title", "Phase 4: Deep Learning, PyTorch & Transformers", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "PyTorch Neural Networks & Backprop", "status", "LOCKED", "score", 0, "proofOfMastery", "Custom NN Architecture"),
                            Map.of("skill", "Transformer Attention & Fine-Tuning LLMs", "status", "LOCKED", "score", 0, "proofOfMastery", "HuggingFace Model Fine-Tune")
                    )),
                    Map.of("phaseNumber", 5, "title", "Phase 5: Generative AI, RAG & Production MLOps", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "RAG Pipelines & Vector Databases (Milvus/Chroma)", "status", "LOCKED", "score", 0, "proofOfMastery", "Production RAG App"),
                            Map.of("skill", "FastAPI Model Serving & Docker Deployment", "status", "LOCKED", "score", 0, "proofOfMastery", "Cloud ML Endpoint Live")
                    ))
            );
        } else if (canonical.equals("DEVOPS")) {
            return List.of(
                    Map.of("phaseNumber", 1, "title", "Phase 1: Linux & Networking Foundations", "status", "IN_PROGRESS", "items", List.of(
                            Map.of("skill", "Linux System Administration & Bash Scripting", "status", "ACTIVE", "score", 65, "proofOfMastery", "Linux Admin Lab"),
                            Map.of("skill", "Networking (TCP/IP, DNS, HTTP/S, Firewalls)", "status", "NEXT", "score", 50, "proofOfMastery", "Subnetting Assessment")
                    )),
                    Map.of("phaseNumber", 2, "title", "Phase 2: Containerization & Docker Ecosystem", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Docker Multi-Stage Builds & Volumes", "status", "LOCKED", "score", 0, "proofOfMastery", "Microservice Containerization"),
                            Map.of("skill", "Docker Compose Multi-Container Orchestration", "status", "LOCKED", "score", 0, "proofOfMastery", "Full Stack Compose Stack")
                    )),
                    Map.of("phaseNumber", 3, "title", "Phase 3: CI/CD Automation & GitOps", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "GitHub Actions & Automated Testing Pipelines", "status", "LOCKED", "score", 0, "proofOfMastery", "Automated Release Workflow"),
                            Map.of("skill", "Security Scanning & Artifact Registries", "status", "LOCKED", "score", 0, "proofOfMastery", "Trivy & Docker Hub Scan")
                    )),
                    Map.of("phaseNumber", 4, "title", "Phase 4: Kubernetes Orchestration & Helm", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Kubernetes Pods, Deployments, Services & Ingress", "status", "LOCKED", "score", 0, "proofOfMastery", "Production K8s Cluster Deploy"),
                            Map.of("skill", "Helm Charts & ConfigMaps/Secrets Management", "status", "LOCKED", "score", 0, "proofOfMastery", "Helm Release Deployment")
                    )),
                    Map.of("phaseNumber", 5, "title", "Phase 5: Cloud IaC & Observability", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Terraform Infrastructure as Code (AWS/VPC/EKS)", "status", "LOCKED", "score", 0, "proofOfMastery", "Complete Terraform VPC + EKS"),
                            Map.of("skill", "Prometheus Metrics & Grafana Dashboards", "status", "LOCKED", "score", 0, "proofOfMastery", "Live Incident Alerting Setup")
                    ))
            );
        } else if (canonical.equals("DATA_SCIENCE")) {
            return List.of(
                    Map.of("phaseNumber", 1, "title", "Phase 1: Python & Analytical Data Wrangling", "status", "IN_PROGRESS", "items", List.of(
                            Map.of("skill", "Pandas Dataframes & NumPy Transformations", "status", "DONE", "score", 82, "proofOfMastery", "Pandas Benchmark Verified"),
                            Map.of("skill", "SQL Analytics & Window Functions", "status", "ACTIVE", "score", 68, "proofOfMastery", "Complex Query Submission")
                    )),
                    Map.of("phaseNumber", 2, "title", "Phase 2: Exploratory Data Analysis & Statistics", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Exploratory Data Analysis (EDA) & Seaborn Viz", "status", "NEXT", "score", 75, "proofOfMastery", "Kaggle EDA Notebook"),
                            Map.of("skill", "Hypothesis Testing, ANOVA & Confidence Intervals", "status", "LOCKED", "score", 0, "proofOfMastery", "Statistical Report")
                    )),
                    Map.of("phaseNumber", 3, "title", "Phase 3: Machine Learning & Predictive Modeling", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Supervised Learning & Cross-Validation", "status", "LOCKED", "score", 0, "proofOfMastery", "Model Scoring >= 85%"),
                            Map.of("skill", "Feature Engineering & Imbalanced Datasets", "status", "LOCKED", "score", 0, "proofOfMastery", "SMOTE & Encoding Lab")
                    )),
                    Map.of("phaseNumber", 4, "title", "Phase 4: Specialized Domains (NLP & Time Series)", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Time Series Forecasting (ARIMA, Prophet)", "status", "LOCKED", "score", 0, "proofOfMastery", "Financial Trend Model"),
                            Map.of("skill", "Natural Language Processing (TF-IDF, Sentiment)", "status", "LOCKED", "score", 0, "proofOfMastery", "Text Classifier Project")
                    )),
                    Map.of("phaseNumber", 5, "title", "Phase 5: Business Storytelling & Model Deployment", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Streamlit Interactive Data Dashboards", "status", "LOCKED", "score", 0, "proofOfMastery", "Live Web App Dashboard"),
                            Map.of("skill", "FAANG Data Science Technical Interviews", "status", "LOCKED", "score", 0, "proofOfMastery", "3 Mock Interview Passes")
                    ))
            );
        } else if (canonical.equals("FULLSTACK")) {
            return List.of(
                    Map.of("phaseNumber", 1, "title", "Phase 1: Modern Frontend & TypeScript", "status", "IN_PROGRESS", "items", List.of(
                            Map.of("skill", "JavaScript ES6+ & TypeScript Typings", "status", "DONE", "score", 80, "proofOfMastery", "TypeScript Type System Test"),
                            Map.of("skill", "React 18 Component State & Hooks", "status", "ACTIVE", "score", 74, "proofOfMastery", "Interactive Frontend App")
                    )),
                    Map.of("phaseNumber", 2, "title", "Phase 2: Full-Stack Architecture & REST APIs", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Node.js Express / Spring Boot REST Endpoints", "status", "NEXT", "score", 65, "proofOfMastery", "CRUD API Endpoints Verified"),
                            Map.of("skill", "SQL & MongoDB Schema Relationships", "status", "LOCKED", "score", 0, "proofOfMastery", "Database Design Schema")
                    )),
                    Map.of("phaseNumber", 3, "title", "Phase 3: Authentication & Security", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "JWT Token Auth & OAuth2 Social Login", "status", "LOCKED", "score", 0, "proofOfMastery", "Secure Auth Middleware"),
                            Map.of("skill", "CORS, Rate Limiting & Input Validation", "status", "LOCKED", "score", 0, "proofOfMastery", "Security Audit Passed")
                    )),
                    Map.of("phaseNumber", 4, "title", "Phase 4: Full-Stack Realtime Project", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "WebSockets / Realtime State Sync", "status", "LOCKED", "score", 0, "proofOfMastery", "Realtime Chat / Collaboration"),
                            Map.of("skill", "State Management (Zustand / Redux Toolkit)", "status", "LOCKED", "score", 0, "proofOfMastery", "Global Store Implementation")
                    )),
                    Map.of("phaseNumber", 5, "title", "Phase 5: Cloud Deployment & Portfolio Readiness", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Docker Containerization & CI/CD Pipeline", "status", "LOCKED", "score", 0, "proofOfMastery", "Automated Cloud Deploy"),
                            Map.of("skill", "Full Stack Portfolio & ATS Resume", "status", "LOCKED", "score", 0, "proofOfMastery", "ATS Score >= 88%")
                    ))
            );
        } else { // BACKEND
            return List.of(
                    Map.of("phaseNumber", 1, "title", "Phase 1: Core Programming Foundations", "status", "COMPLETED", "items", List.of(
                            Map.of("skill", "Java Core & OOP Patterns", "status", "DONE", "score", 92, "proofOfMastery", "Verified via Quiz & Coding Test"),
                            Map.of("skill", "Data Structures & Algorithms", "status", "DONE", "score", 84, "proofOfMastery", "45 LeetCode Problems Solved")
                    )),
                    Map.of("phaseNumber", 2, "title", "Phase 2: Backend & Database Architecture", "status", "IN_PROGRESS", "items", List.of(
                            Map.of("skill", "SQL & Query Tuning [REINFORCEMENT ADDED]", "status", "ACTIVE", "score", 61, "proofOfMastery", "Pending Re-assessment", "reason", "Reinforcement active"),
                            Map.of("skill", "Spring Boot 3 REST API Design", "status", "NEXT", "score", 76, "proofOfMastery", "Full API Project Required")
                    )),
                    Map.of("phaseNumber", 3, "title", "Phase 3: Production Microservices & Containers", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Microservices & Message Queues (Kafka)", "status", "LOCKED", "score", 0, "proofOfMastery", "Prerequisite: Phase 2"),
                            Map.of("skill", "Docker & Container Orchestration", "status", "LOCKED", "score", 0, "proofOfMastery", "Dockerization Lab Required")
                    )),
                    Map.of("phaseNumber", 4, "title", "Phase 4: High-Throughput System Design", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "Distributed Caching (Redis) & Rate Limiting", "status", "LOCKED", "score", 0, "proofOfMastery", "System Design Case Study"),
                            Map.of("skill", "Scalable Cloud Architecture (AWS)", "status", "LOCKED", "score", 0, "proofOfMastery", "Architecture Review")
                    )),
                    Map.of("phaseNumber", 5, "title", "Phase 5: Career Preparation & Verified Readiness", "status", "UPCOMING", "items", List.of(
                            Map.of("skill", "FAANG Mock Technical Interviews", "status", "LOCKED", "score", 0, "proofOfMastery", "Score >= 80% on 3 AI Mock Rounds"),
                            Map.of("skill", "ATS Resume Tailoring & Placement Readiness", "status", "LOCKED", "score", 0, "proofOfMastery", "ATS Score >= 85%")
                    ))
            );
        }
    }

    private Map<String, Object> getGraphForRole(String canonical) {
        if (canonical.equals("AIML")) {
            List<Map<String, Object>> nodes = List.of(
                    Map.of("id", "python_math", "name", "Python & Vector Math", "category", "FOUNDATION", "status", "MASTERED", "score", 85, "required", 80, "prerequisites", List.of(), "whyThisSkill", "Matrix transformations and numerical computing foundations."),
                    Map.of("id", "stats_prob", "name", "Probability & Statistics", "category", "FOUNDATION", "status", "WEAK", "score", 54, "required", 80, "prerequisites", List.of("python_math"), "whyThisSkill", "Bayesian inference and distribution modeling."),
                    Map.of("id", "scikit_learn", "name", "Scikit-Learn ML", "category", "AI_ML", "status", "CRITICAL_GAP", "score", 42, "required", 80, "prerequisites", List.of("stats_prob"), "whyThisSkill", "Classical regression, classification, and clustering."),
                    Map.of("id", "pytorch_nn", "name", "PyTorch & Deep Learning", "category", "AI_ML", "status", "CRITICAL_GAP", "score", 20, "required", 75, "prerequisites", List.of("scikit_learn"), "whyThisSkill", "Backpropagation, CNNs, and sequence modeling."),
                    Map.of("id", "transformers", "name", "Transformers & LLMs", "category", "AI_ML", "status", "CRITICAL_GAP", "score", 10, "required", 70, "prerequisites", List.of("pytorch_nn"), "whyThisSkill", "Self-attention mechanism and modern foundation models."),
                    Map.of("id", "rag_vectordb", "name", "RAG & Vector DBs", "category", "AI_ML", "status", "CRITICAL_GAP", "score", 15, "required", 70, "prerequisites", List.of("transformers"), "whyThisSkill", "Retrieval augmented generation for enterprise AI systems."),
                    Map.of("id", "fastapi_deploy", "name", "FastAPI & ML Serving", "category", "DEPLOYMENT", "status", "CRITICAL_GAP", "score", 25, "required", 65, "prerequisites", List.of("rag_vectordb"), "whyThisSkill", "Low-latency inference deployment.")
            );
            List<Map<String, Object>> edges = List.of(
                    Map.of("from", "python_math", "to", "stats_prob"),
                    Map.of("from", "stats_prob", "to", "scikit_learn"),
                    Map.of("from", "scikit_learn", "to", "pytorch_nn"),
                    Map.of("from", "pytorch_nn", "to", "transformers"),
                    Map.of("from", "transformers", "to", "rag_vectordb"),
                    Map.of("from", "rag_vectordb", "to", "fastapi_deploy")
            );
            return Map.of("nodes", nodes, "edges", edges);
        } else if (canonical.equals("DEVOPS")) {
            List<Map<String, Object>> nodes = List.of(
                    Map.of("id", "linux_core", "name", "Linux Admin & Bash", "category", "FOUNDATION", "status", "LEARNING", "score", 65, "required", 85, "prerequisites", List.of(), "whyThisSkill", "Server configuration, systemd, and cron automation."),
                    Map.of("id", "networking", "name", "Networking & Protocols", "category", "FOUNDATION", "status", "LEARNING", "score", 50, "required", 80, "prerequisites", List.of("linux_core"), "whyThisSkill", "Subnets, DNS, and secure certificate routing."),
                    Map.of("id", "docker_k8s", "name", "Docker Containers", "category", "CONTAINERS", "status", "WEAK", "score", 55, "required", 85, "prerequisites", List.of("linux_core"), "whyThisSkill", "Image optimization and multi-container architectures."),
                    Map.of("id", "cicd", "name", "CI/CD Automation", "category", "AUTOMATION", "status", "CRITICAL_GAP", "score", 35, "required", 80, "prerequisites", List.of("docker_k8s"), "whyThisSkill", "Automated linting, test execution, and deployment pipelines."),
                    Map.of("id", "k8s", "name", "Kubernetes Pods & Ingress", "category", "ORCHESTRATION", "status", "CRITICAL_GAP", "score", 20, "required", 80, "prerequisites", List.of("docker_k8s", "networking"), "whyThisSkill", "Production orchestration and auto-scaling pods."),
                    Map.of("id", "terraform", "name", "Terraform IaC", "category", "INFRASTRUCTURE", "status", "CRITICAL_GAP", "score", 15, "required", 75, "prerequisites", List.of("k8s"), "whyThisSkill", "Declarative cloud provisioning."),
                    Map.of("id", "observability", "name", "Prometheus & Grafana", "category", "OBSERVABILITY", "status", "CRITICAL_GAP", "score", 10, "required", 65, "prerequisites", List.of("k8s"), "whyThisSkill", "System metrics and proactive incident alerting.")
            );
            List<Map<String, Object>> edges = List.of(
                    Map.of("from", "linux_core", "to", "networking"),
                    Map.of("from", "linux_core", "to", "docker_k8s"),
                    Map.of("from", "docker_k8s", "to", "cicd"),
                    Map.of("from", "docker_k8s", "to", "k8s"),
                    Map.of("from", "networking", "to", "k8s"),
                    Map.of("from", "k8s", "to", "terraform"),
                    Map.of("from", "k8s", "to", "observability")
            );
            return Map.of("nodes", nodes, "edges", edges);
        } else { // BACKEND
            List<Map<String, Object>> nodes = List.of(
                    Map.of("id", "java", "name", "Java Core & OOP", "category", "FOUNDATION", "status", "MASTERED", "score", 92, "required", 75, "prerequisites", List.of(), "whyThisSkill", "Foundational language for enterprise backend services."),
                    Map.of("id", "dsa", "name", "Data Structures & Algos", "category", "FOUNDATION", "status", "MASTERED", "score", 84, "required", 75, "prerequisites", List.of("java"), "whyThisSkill", "Core algorithmic problem-solving for FAANG technical interviews."),
                    Map.of("id", "sql", "name", "SQL & Database Indexing", "category", "DATABASE", "status", "WEAK", "score", 61, "required", 80, "prerequisites", List.of(), "whyThisSkill", "Query optimization, window functions, and schema design for data integrity."),
                    Map.of("id", "spring", "name", "Spring Boot 3 & REST", "category", "BACKEND", "status", "LEARNING", "score", 76, "required", 80, "prerequisites", List.of("java", "sql"), "whyThisSkill", "Enterprise framework required for target competencies."),
                    Map.of("id", "microservices", "name", "Microservices & Kafka", "category", "BACKEND", "status", "LEARNING", "score", 58, "required", 75, "prerequisites", List.of("spring"), "whyThisSkill", "Distributed event streaming and decoupled microservice communication."),
                    Map.of("id", "docker", "name", "Docker & Containerization", "category", "DEVOPS", "status", "CRITICAL_GAP", "score", 34, "required", 70, "prerequisites", List.of("spring"), "whyThisSkill", "Cloud portability and standard deployment pipelines."),
                    Map.of("id", "system_design", "name", "System Design & LLD/HLD", "category", "SYSTEM_DESIGN", "status", "CRITICAL_GAP", "score", 43, "required", 65, "prerequisites", List.of("microservices", "sql"), "whyThisSkill", "Architecting high-throughput, low-latency scalable architectures (100k+ QPS)."),
                    Map.of("id", "aws_cloud", "name", "AWS Cloud & Kubernetes", "category", "CLOUD", "status", "CRITICAL_GAP", "score", 21, "required", 55, "prerequisites", List.of("docker"), "whyThisSkill", "Production cloud orchestration and serverless compute.")
            );
            List<Map<String, Object>> edges = List.of(
                    Map.of("from", "java", "to", "dsa"),
                    Map.of("from", "java", "to", "spring"),
                    Map.of("from", "sql", "to", "spring"),
                    Map.of("from", "spring", "to", "microservices"),
                    Map.of("from", "spring", "to", "docker"),
                    Map.of("from", "microservices", "to", "system_design"),
                    Map.of("from", "sql", "to", "system_design"),
                    Map.of("from", "docker", "to", "aws_cloud")
            );
            return Map.of("nodes", nodes, "edges", edges);
        }
    }

    private Map<String, Object> getSkillGapDataForRole(String canonical) {
        if (canonical.equals("AIML")) {
            return Map.of(
                    "targetRole", "AI & Machine Learning Engineer",
                    "overallReadiness", 41.0,
                    "gaps", List.of(
                            Map.of("skill", "Transformers & LLM Fine-Tuning", "current", 10, "required", 70, "gap", 60, "priority", "CRITICAL", "importance", "Essential", "missingPrereqs", List.of("PyTorch")),
                            Map.of("skill", "RAG & Vector Databases", "current", 15, "required", 70, "gap", 55, "priority", "CRITICAL", "importance", "High", "missingPrereqs", List.of("Transformers")),
                            Map.of("skill", "Deep Learning & PyTorch", "current", 20, "required", 75, "gap", 55, "priority", "CRITICAL", "importance", "Essential", "missingPrereqs", List.of("Scikit-Learn")),
                            Map.of("skill", "Machine Learning (Scikit-Learn)", "current", 42, "required", 80, "gap", 38, "priority", "CRITICAL", "importance", "Core", "missingPrereqs", List.of("Statistics")),
                            Map.of("skill", "Linear Algebra & Statistics", "current", 54, "required", 80, "gap", 26, "priority", "HIGH", "importance", "Foundational", "missingPrereqs", List.of()),
                            Map.of("skill", "Python for AI & NumPy", "current", 78, "required", 85, "gap", 7, "priority", "MEDIUM", "importance", "Mastered", "missingPrereqs", List.of())
                    )
            );
        } else if (canonical.equals("DEVOPS")) {
            return Map.of(
                    "targetRole", "DevOps & Cloud SRE",
                    "overallReadiness", 35.0,
                    "gaps", List.of(
                            Map.of("skill", "Kubernetes (Pods, Ingress, Helm)", "current", 20, "required", 80, "gap", 60, "priority", "CRITICAL", "importance", "Essential", "missingPrereqs", List.of("Docker")),
                            Map.of("skill", "Terraform (Infrastructure as Code)", "current", 15, "required", 75, "gap", 60, "priority", "CRITICAL", "importance", "High", "missingPrereqs", List.of("Kubernetes")),
                            Map.of("skill", "CI/CD (GitHub Actions / Jenkins)", "current", 35, "required", 80, "gap", 45, "priority", "CRITICAL", "importance", "Core", "missingPrereqs", List.of("Docker")),
                            Map.of("skill", "Docker Containerization", "current", 55, "required", 85, "gap", 30, "priority", "HIGH", "importance", "Foundational", "missingPrereqs", List.of("Linux")),
                            Map.of("skill", "Networking (TCP/IP, DNS, VPC)", "current", 50, "required", 80, "gap", 30, "priority", "HIGH", "importance", "Foundational", "missingPrereqs", List.of()),
                            Map.of("skill", "Linux & Shell Scripting", "current", 65, "required", 85, "gap", 20, "priority", "MEDIUM", "importance", "Core", "missingPrereqs", List.of())
                    )
            );
        } else {
            return Map.of(
                    "targetRole", "Backend Systems Engineer",
                    "overallReadiness", 72.0,
                    "gaps", List.of(
                            Map.of("skill", "AWS Cloud & Kubernetes", "current", 21, "required", 55, "gap", 34, "priority", "CRITICAL", "importance", "High", "missingPrereqs", List.of("Docker")),
                            Map.of("skill", "Docker Containerization", "current", 34, "required", 70, "gap", 36, "priority", "CRITICAL", "importance", "High", "missingPrereqs", List.of("Spring Boot")),
                            Map.of("skill", "System Design (HLD/LLD)", "current", 43, "required", 65, "gap", 22, "priority", "CRITICAL", "importance", "Essential", "missingPrereqs", List.of("Microservices", "SQL")),
                            Map.of("skill", "SQL & Database Indexing", "current", 61, "required", 80, "gap", 19, "priority", "HIGH", "importance", "Foundational", "missingPrereqs", List.of()),
                            Map.of("skill", "Spring Boot REST APIs", "current", 76, "required", 80, "gap", 4, "priority", "MEDIUM", "importance", "Core", "missingPrereqs", List.of()),
                            Map.of("skill", "Java Core & OOP", "current", 92, "required", 75, "gap", 0, "priority", "NONE", "importance", "Mastered", "missingPrereqs", List.of())
                    )
            );
        }
    }

    private List<Map<String, Object>> getTargetCompetencies(String canonical) {
        if (canonical.equals("AIML")) {
            return List.of(
                    Map.of("id", "python_ml", "name", "Python for AI & NumPy", "category", "FOUNDATIONS", "required", 85, "weight", 1.0, "defaultScore", 78),
                    Map.of("id", "math_stats", "name", "Linear Algebra & Statistics", "category", "FOUNDATIONS", "required", 80, "weight", 0.9, "defaultScore", 54),
                    Map.of("id", "scikit_ml", "name", "Machine Learning (Scikit-Learn)", "category", "AI_ML", "required", 80, "weight", 1.0, "defaultScore", 42),
                    Map.of("id", "pytorch_dl", "name", "Deep Learning & PyTorch", "category", "AI_ML", "required", 75, "weight", 0.95, "defaultScore", 20),
                    Map.of("id", "transformers_llm", "name", "Transformers & LLMs", "category", "AI_ML", "required", 70, "weight", 0.9, "defaultScore", 10),
                    Map.of("id", "rag_vector", "name", "RAG & Vector Databases", "category", "AI_ML", "required", 70, "weight", 0.85, "defaultScore", 15),
                    Map.of("id", "ml_deploy", "name", "FastAPI & Model Deployment", "category", "PRODUCTION", "required", 65, "weight", 0.8, "defaultScore", 25)
            );
        } else if (canonical.equals("DEVOPS")) {
            return List.of(
                    Map.of("id", "linux_shell", "name", "Linux & Shell Scripting", "category", "FOUNDATIONS", "required", 85, "weight", 0.95, "defaultScore", 65),
                    Map.of("id", "networking", "name", "Networking & Protocols", "category", "FOUNDATIONS", "required", 80, "weight", 0.9, "defaultScore", 50),
                    Map.of("id", "docker_cont", "name", "Docker & Containerization", "category", "CONTAINERS", "required", 85, "weight", 1.0, "defaultScore", 55),
                    Map.of("id", "cicd_pipeline", "name", "CI/CD (GitHub Actions / Jenkins)", "category", "AUTOMATION", "required", 80, "weight", 1.0, "defaultScore", 35),
                    Map.of("id", "k8s_orchestration", "name", "Kubernetes (Pods, Ingress, Helm)", "category", "ORCHESTRATION", "required", 80, "weight", 0.95, "defaultScore", 20),
                    Map.of("id", "terraform_iac", "name", "Terraform (IaC)", "category", "INFRASTRUCTURE", "required", 75, "weight", 0.8, "defaultScore", 15),
                    Map.of("id", "monitoring_obs", "name", "Prometheus & Grafana", "category", "OBSERVABILITY", "required", 65, "weight", 0.75, "defaultScore", 10)
            );
        } else if (canonical.equals("DATA_SCIENCE")) {
            return List.of(
                    Map.of("id", "python_ds", "name", "Python & Pandas Data Wrangling", "category", "DATA_ENGINEERING", "required", 85, "weight", 1.0, "defaultScore", 82),
                    Map.of("id", "stats_inference", "name", "Inferential Statistics", "category", "FOUNDATIONS", "required", 85, "weight", 0.95, "defaultScore", 60),
                    Map.of("id", "sql_analytics", "name", "SQL Analytics & Window Functions", "category", "DATABASE", "required", 80, "weight", 0.9, "defaultScore", 68),
                    Map.of("id", "eda_viz", "name", "Exploratory Data Analysis (EDA)", "category", "VISUALIZATION", "required", 80, "weight", 0.85, "defaultScore", 75),
                    Map.of("id", "ml_modeling", "name", "Machine Learning & Scikit-Learn", "category", "MODELING", "required", 80, "weight", 0.9, "defaultScore", 40),
                    Map.of("id", "time_series", "name", "Time Series & Forecasting", "category", "ADVANCED", "required", 70, "weight", 0.75, "defaultScore", 20)
            );
        } else if (canonical.equals("FULLSTACK")) {
            return List.of(
                    Map.of("id", "js_ts", "name", "JavaScript ES6+ & TypeScript", "category", "FRONTEND", "required", 85, "weight", 1.0, "defaultScore", 80),
                    Map.of("id", "react_state", "name", "React 18 & State Architecture", "category", "FRONTEND", "required", 85, "weight", 1.0, "defaultScore", 74),
                    Map.of("id", "node_express", "name", "Node.js / Spring REST APIs", "category", "BACKEND", "required", 80, "weight", 0.95, "defaultScore", 65),
                    Map.of("id", "db_sql_mongo", "name", "SQL & MongoDB Data Models", "category", "DATABASE", "required", 75, "weight", 0.85, "defaultScore", 60),
                    Map.of("id", "auth_security", "name", "Authentication (JWT, OAuth2)", "category", "SECURITY", "required", 75, "weight", 0.8, "defaultScore", 45),
                    Map.of("id", "docker_deploy", "name", "Docker & Cloud Deploy", "category", "PRODUCTION", "required", 70, "weight", 0.75, "defaultScore", 30)
            );
        } else { // BACKEND
            return List.of(
                    Map.of("id", "java_core", "name", "Java Core & OOP", "category", "FOUNDATIONS", "required", 75, "weight", 0.95, "defaultScore", 92),
                    Map.of("id", "dsa_core", "name", "Data Structures & Algorithms", "category", "FOUNDATIONS", "required", 75, "weight", 0.9, "defaultScore", 84),
                    Map.of("id", "sql_db", "name", "SQL & Database Indexing", "category", "DATABASE", "required", 80, "weight", 0.9, "defaultScore", 61),
                    Map.of("id", "spring_boot", "name", "Spring Boot 3 REST APIs", "category", "BACKEND", "required", 80, "weight", 0.95, "defaultScore", 76),
                    Map.of("id", "microservices", "name", "Microservices & Kafka", "category", "BACKEND", "required", 75, "weight", 0.85, "defaultScore", 58),
                    Map.of("id", "docker_cont", "name", "Docker Containerization", "category", "DEVOPS", "required", 70, "weight", 0.75, "defaultScore", 34),
                    Map.of("id", "sys_design", "name", "System Design (LLD/HLD)", "category", "SYSTEM_DESIGN", "required", 65, "weight", 0.9, "defaultScore", 43),
                    Map.of("id", "aws_cloud", "name", "AWS Cloud & Kubernetes", "category", "CLOUD", "required", 55, "weight", 0.7, "defaultScore", 21)
            );
        }
    }

    private List<RoadmapChangeLog> initDefaultLogsForRole(String userEmail, String canonical) {
        if (canonical.equals("AIML")) {
            return List.of(
                    RoadmapChangeLog.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).changeType("REINFORCEMENT_ADDED").affectedSkill("Linear Algebra & Calculus").reason("Statistics score was 54% (below 70% threshold). Added Linear Algebra reinforcement module before Neural Networks.").triggerEvent("ASSESSMENT_BELOW_THRESHOLD").timeLabel("Today").build(),
                    RoadmapChangeLog.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).changeType("SCHEDULE_COMPRESSED").affectedSkill("PyTorch & Deep Learning").reason("Deep Learning is high priority for target AI Engineer. Accelerated timeline by 2 weeks.").triggerEvent("ROLE_GOAL_PRIORITY").timeLabel("2 days ago").build()
            );
        } else if (canonical.equals("DEVOPS")) {
            return List.of(
                    RoadmapChangeLog.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).changeType("REINFORCEMENT_ADDED").affectedSkill("Docker Compose & Networks").reason("Docker score was 55%. Added multi-container networking lab before Kubernetes phase.").triggerEvent("ASSESSMENT_BELOW_THRESHOLD").timeLabel("Today").build(),
                    RoadmapChangeLog.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).changeType("SCHEDULE_COMPRESSED").affectedSkill("Kubernetes Pod Ingress").reason("Kubernetes is critical priority for DevOps SRE trajectory.").triggerEvent("HIGH_PRIORITY_REQUIREMENT").timeLabel("3 days ago").build()
            );
        } else {
            return List.of(
                    RoadmapChangeLog.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).changeType("REINFORCEMENT_ADDED").affectedSkill("SQL Joins & Indexing").reason("SQL assessment score was 45% (below 70% threshold). Added SQL reinforcement module before Spring Boot.").triggerEvent("ASSESSMENT_BELOW_THRESHOLD").timeLabel("Today").build(),
                    RoadmapChangeLog.builder().id(UUID.randomUUID().toString()).userEmail(userEmail).changeType("SCHEDULE_COMPRESSED").affectedSkill("Docker Containerization").reason("Docker is a high-priority requirement for target SDE role. Moved 2 weeks earlier.").triggerEvent("HIGH_PRIORITY_REQUIREMENT").timeLabel("2 days ago").build()
            );
        }
    }

    private String callGemini(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                List candidates = (List) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List parts = (List) content.get("parts");
                    Map part = (Map) parts.get(0);
                    return (String) part.get("text");
                }
            }
        } catch (Exception e) {
            // Silently fallback to role-deterministic generation
        }
        return "";
    }
}
