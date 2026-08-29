package com.pathcraft.app.controller;

import com.pathcraft.app.dto.ReplanRequest;
import com.pathcraft.app.model.LearningMilestone;
import com.pathcraft.app.model.Roadmap;
import com.pathcraft.app.repository.LearningMilestoneRepository;
import com.pathcraft.app.repository.RoadmapRepository;
import com.pathcraft.app.service.AdaptationService;
import com.pathcraft.app.service.RecommendationEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roadmap")
@RequiredArgsConstructor
public class RoadmapController {

    private final RecommendationEngineService recommendationEngineService;
    private final AdaptationService adaptationService;
    private final RoadmapRepository roadmapRepository;
    private final LearningMilestoneRepository learningMilestoneRepository;

    @PostMapping("/generate/{profileId}")
    public ResponseEntity<Map<String, Object>> generateRoadmap(@PathVariable String profileId) {
        Roadmap roadmap = recommendationEngineService.generateRoadmapForProfile(profileId);
        List<LearningMilestone> milestones = learningMilestoneRepository.findByRoadmapIdOrderByStepOrderAsc(roadmap.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("roadmap", roadmap);
        response.put("milestones", milestones);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{roadmapId}")
    public ResponseEntity<Map<String, Object>> getRoadmap(@PathVariable String roadmapId) {
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new IllegalArgumentException("Roadmap not found: " + roadmapId));
        List<LearningMilestone> milestones = learningMilestoneRepository.findByRoadmapIdOrderByStepOrderAsc(roadmapId);

        Map<String, Object> response = new HashMap<>();
        response.put("roadmap", roadmap);
        response.put("milestones", milestones);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/replan")
    public ResponseEntity<Map<String, Object>> replanRoadmap(@RequestBody ReplanRequest request) {
        Roadmap updatedRoadmap = adaptationService.replanRoadmap(request);
        List<LearningMilestone> milestones = learningMilestoneRepository.findByRoadmapIdOrderByStepOrderAsc(updatedRoadmap.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("roadmap", updatedRoadmap);
        response.put("milestones", milestones);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/milestone/{milestoneId}/status")
    public ResponseEntity<LearningMilestone> updateMilestoneStatus(
            @PathVariable String milestoneId,
            @RequestParam String status) {
        LearningMilestone milestone = learningMilestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found: " + milestoneId));

        milestone.setStatus(status.toUpperCase());
        if ("COMPLETED".equalsIgnoreCase(status)) {
            milestone.setQuizPassed(true);
        }
        LearningMilestone saved = learningMilestoneRepository.save(milestone);

        // Update overall roadmap completion hours
        List<LearningMilestone> all = learningMilestoneRepository.findByRoadmapIdOrderByStepOrderAsc(milestone.getRoadmapId());
        double completed = all.stream()
                .filter(m -> "COMPLETED".equalsIgnoreCase(m.getStatus()))
                .mapToDouble(LearningMilestone::getEstimatedHours)
                .sum();

        roadmapRepository.findById(milestone.getRoadmapId()).ifPresent(r -> {
            r.setCompletedHours(completed);
            roadmapRepository.save(r);
        });

        return ResponseEntity.ok(saved);
    }
}
