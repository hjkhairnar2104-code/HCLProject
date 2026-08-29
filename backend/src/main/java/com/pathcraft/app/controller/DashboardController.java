package com.pathcraft.app.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pathcraft.app.dto.SkillGapResponse;
import com.pathcraft.app.model.LearnerProfile;
import com.pathcraft.app.model.LearningMilestone;
import com.pathcraft.app.model.Roadmap;
import com.pathcraft.app.repository.LearnerProfileRepository;
import com.pathcraft.app.repository.LearningMilestoneRepository;
import com.pathcraft.app.repository.RoadmapRepository;
import com.pathcraft.app.service.SkillGraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final LearnerProfileRepository learnerProfileRepository;
    private final RoadmapRepository roadmapRepository;
    private final LearningMilestoneRepository learningMilestoneRepository;
    private final SkillGraphService skillGraphService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/{profileId}")
    public ResponseEntity<Map<String, Object>> getDashboardData(@PathVariable String profileId) {
        LearnerProfile profile = learnerProfileRepository.findById(profileId)
                .orElse(null);

        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Integer> claimedSkills = parseSkillsJson(profile.getClaimedSkillsJson());
        SkillGapResponse skillGap = skillGraphService.calculateSkillGap(
                profile.getTargetRole(),
                profile.getTargetSkillNodeId() != null ? profile.getTargetSkillNodeId() : "ds_capstone",
                claimedSkills
        );

        Optional<Roadmap> roadmapOpt = roadmapRepository.findTopByLearnerProfileIdOrderByGeneratedAtDesc(profileId);
        List<LearningMilestone> milestones = Collections.emptyList();
        Roadmap roadmap = null;

        LearningMilestone nextBestAction = null;

        if (roadmapOpt.isPresent()) {
            roadmap = roadmapOpt.get();
            milestones = learningMilestoneRepository.findByRoadmapIdOrderByStepOrderAsc(roadmap.getId());

            for (LearningMilestone m : milestones) {
                if ("IN_PROGRESS".equals(m.getStatus()) || "LOCKED".equals(m.getStatus())) {
                    nextBestAction = m;
                    break;
                }
            }
        }

        double completionPercentage = 0.0;
        if (roadmap != null && roadmap.getTotalEstimatedHours() > 0) {
            completionPercentage = Math.round((roadmap.getCompletedHours() / roadmap.getTotalEstimatedHours()) * 100.0 * 10.0) / 10.0;
        }

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("profile", profile);
        dashboard.put("skillGap", skillGap);
        dashboard.put("roadmap", roadmap);
        dashboard.put("milestones", milestones);
        dashboard.put("completionPercentage", completionPercentage);
        dashboard.put("nextBestAction", nextBestAction);
        dashboard.put("streakDays", profile.getStreakDays() != null ? profile.getStreakDays() : 3);
        dashboard.put("totalHoursInvested", profile.getTotalHoursInvested() != null ? profile.getTotalHoursInvested() : 4.5);

        return ResponseEntity.ok(dashboard);
    }

    private Map<String, Integer> parseSkillsJson(String json) {
        if (json == null || json.trim().isEmpty()) return new HashMap<>();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Integer>>() {});
        } catch (Exception e) {
            return new HashMap<>();
        }
    }
}
