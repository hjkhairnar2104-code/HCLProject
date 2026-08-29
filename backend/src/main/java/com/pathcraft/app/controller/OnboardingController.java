package com.pathcraft.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pathcraft.app.dto.ParseGoalRequest;
import com.pathcraft.app.dto.ParseGoalResponse;
import com.pathcraft.app.model.LearnerProfile;
import com.pathcraft.app.repository.LearnerProfileRepository;
import com.pathcraft.app.service.GoalParserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final GoalParserService goalParserService;
    private final LearnerProfileRepository learnerProfileRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/parse-goal")
    public ResponseEntity<ParseGoalResponse> parseGoal(@RequestBody ParseGoalRequest request) {
        ParseGoalResponse response = goalParserService.parseUserGoal(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-profile")
    public ResponseEntity<LearnerProfile> createProfile(@RequestBody Map<String, Object> body) {
        String id = UUID.randomUUID().toString();
        String name = (String) body.getOrDefault("name", "Learner");
        String naturalLanguageGoal = (String) body.getOrDefault("naturalLanguageGoal", "Become a Data Scientist");
        String targetRole = (String) body.getOrDefault("targetRole", "Data Scientist & AI Specialist");
        String targetSkillNodeId = (String) body.getOrDefault("targetSkillNodeId", "ds_capstone");
        
        Integer timeframe = body.get("timeframeMonths") != null ? Integer.parseInt(body.get("timeframeMonths").toString()) : 4;
        Double hoursPerWeek = body.get("hoursPerWeek") != null ? Double.parseDouble(body.get("hoursPerWeek").toString()) : 8.0;
        String learningStyle = (String) body.getOrDefault("learningStyle", "HANDS_ON");

        Object skillsObj = body.get("claimedSkills");
        String skillsJson = "{}";
        try {
            if (skillsObj != null) {
                skillsJson = objectMapper.writeValueAsString(skillsObj);
            }
        } catch (Exception ignored) {}

        LearnerProfile profile = LearnerProfile.builder()
                .id(id)
                .name(name)
                .naturalLanguageGoal(naturalLanguageGoal)
                .targetRole(targetRole)
                .targetSkillNodeId(targetSkillNodeId)
                .timeframeMonths(timeframe)
                .hoursPerWeek(hoursPerWeek)
                .learningStyle(learningStyle)
                .claimedSkillsJson(skillsJson)
                .calibratedSkillsJson(skillsJson)
                .streakDays(3)
                .totalHoursInvested(4.5)
                .build();

        LearnerProfile saved = learnerProfileRepository.save(profile);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/personas")
    public ResponseEntity<List<Map<String, Object>>> getExamplePersonas() {
        List<Map<String, Object>> personas = List.of(
                Map.of(
                        "id", "persona_ds",
                        "title", "Data Science Career Switcher",
                        "subtitle", "6 Months · 8 hrs/wk · Python basics known",
                        "prompt", "I want to become a Data Scientist in 6 months. I know basic Python programming but no linear algebra or machine learning.",
                        "targetRole", "Data Scientist & AI Specialist",
                        "targetSkillNodeId", "ds_capstone"
                ),
                Map.of(
                        "id", "persona_web",
                        "title", "Full-Stack Web Dev Upskiller",
                        "subtitle", "4 Months · 10 hrs/wk · Knows HTML/CSS",
                        "prompt", "I want to build full-stack web applications with React and Spring Boot in 4 months. I know basic HTML/CSS.",
                        "targetRole", "Full-Stack Software Engineer",
                        "targetSkillNodeId", "fullstack_capstone"
                ),
                Map.of(
                        "id", "persona_cloud",
                        "title", "Cloud DevOps Specialist",
                        "subtitle", "3 Months · 6 hrs/wk · Knows Linux",
                        "prompt", "I want to become a DevOps engineer focusing on Docker, Kubernetes, and Terraform. I know basic Linux shell.",
                        "targetRole", "Cloud DevOps Engineer",
                        "targetSkillNodeId", "cicd_iac"
                )
        );
        return ResponseEntity.ok(personas);
    }
}
