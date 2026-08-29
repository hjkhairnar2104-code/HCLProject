package com.pathcraft.app.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pathcraft.app.model.*;
import com.pathcraft.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendationEngineService {

    private final SkillGraphService skillGraphService;
    private final SkillNodeRepository skillNodeRepository;
    private final CourseResourceRepository courseResourceRepository;
    private final LearnerProfileRepository learnerProfileRepository;
    private final LearningMilestoneRepository learningMilestoneRepository;
    private final RoadmapRepository roadmapRepository;
    private final ExplainabilityService explainabilityService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Roadmap generateRoadmapForProfile(String profileId) {
        LearnerProfile profile = learnerProfileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found: " + profileId));

        Map<String, Integer> currentSkills = parseSkillsJson(profile.getClaimedSkillsJson());

        String targetSkillNodeId = profile.getTargetSkillNodeId() != null ? profile.getTargetSkillNodeId() : "ds_capstone";
        List<SkillNode> orderedSkills = skillGraphService.getPrerequisiteChain(targetSkillNodeId);

        String roadmapId = UUID.randomUUID().toString();
        double totalHours = 0.0;
        int stepOrder = 1;

        List<LearningMilestone> milestones = new ArrayList<>();

        for (SkillNode node : orderedSkills) {
            List<CourseResource> resources = courseResourceRepository.findBySkillNodeId(node.getId());
            CourseResource selectedResource = resources.isEmpty() ? null : resources.get(0);

            String stage = "FOUNDATION";
            if (node.getLevel() == 2) stage = "CORE";
            else if (node.getLevel() == 3) stage = "SPECIALIZATION";
            else if (node.getLevel() >= 4) stage = "CAPSTONE";

            double estHours = selectedResource != null ? selectedResource.getDurationHours() : 10.0;
            totalHours += estHours;

            double readiness = 1.0;
            double relevance = 0.95;

            int curLevel = currentSkills.getOrDefault(node.getId(), 0);
            String status = "LOCKED";
            if (curLevel > 0) {
                status = "COMPLETED";
            } else if (stepOrder == 1 || milestones.stream().allMatch(m -> "COMPLETED".equals(m.getStatus()))) {
                status = "IN_PROGRESS";
            }

            String explanation = explainabilityService.generateExplanation(node, selectedResource, profile, readiness, relevance);

            LearningMilestone milestone = LearningMilestone.builder()
                    .id(UUID.randomUUID().toString())
                    .roadmapId(roadmapId)
                    .stepOrder(stepOrder++)
                    .title(node.getName())
                    .skillNodeId(node.getId())
                    .skillName(node.getName())
                    .stage(stage)
                    .status(status)
                    .estimatedHours(estHours)
                    .whyRecommended(explanation)
                    .resourceId(selectedResource != null ? selectedResource.getId() : null)
                    .resourceTitle(selectedResource != null ? selectedResource.getTitle() : node.getName() + " Guide")
                    .resourceProvider(selectedResource != null ? selectedResource.getProvider() : "PathCraft AI")
                    .resourceUrl(selectedResource != null ? selectedResource.getUrl() : "#")
                    .resourceType(selectedResource != null ? selectedResource.getType() : "COURSE")
                    .resourceFormat(selectedResource != null ? selectedResource.getFormat() : "HANDS_ON")
                    .resourceCost(selectedResource != null ? selectedResource.getCostType() : "FREE")
                    .prerequisiteNodeIdsJson(toJson(node.getPrerequisites()))
                    .relevanceScore(relevance)
                    .readinessScore(readiness)
                    .quizPassed(curLevel > 0)
                    .build();

            milestones.add(milestone);
        }

        double hoursPerWeek = profile.getHoursPerWeek() != null && profile.getHoursPerWeek() > 0 ? profile.getHoursPerWeek() : 8.0;
        int estimatedWeeks = (int) Math.ceil(totalHours / hoursPerWeek);

        Roadmap roadmap = Roadmap.builder()
                .id(roadmapId)
                .learnerProfileId(profileId)
                .generatedAt(LocalDateTime.now())
                .totalEstimatedHours(totalHours)
                .estimatedWeeks(estimatedWeeks)
                .completedHours(0.0)
                .adaptationCount(0)
                .lastAdaptationReason("Initial personalized path generated.")
                .build();

        roadmapRepository.save(roadmap);
        learningMilestoneRepository.saveAll(milestones);

        return roadmap;
    }

    private Map<String, Integer> parseSkillsJson(String json) {
        if (json == null || json.trim().isEmpty()) return new HashMap<>();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Integer>>() {});
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "[]";
        }
    }
}
