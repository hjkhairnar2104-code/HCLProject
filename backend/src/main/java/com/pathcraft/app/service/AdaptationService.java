package com.pathcraft.app.service;

import com.pathcraft.app.dto.ReplanRequest;
import com.pathcraft.app.model.LearnerProfile;
import com.pathcraft.app.model.LearningMilestone;
import com.pathcraft.app.model.Roadmap;
import com.pathcraft.app.repository.LearnerProfileRepository;
import com.pathcraft.app.repository.LearningMilestoneRepository;
import com.pathcraft.app.repository.RoadmapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdaptationService {

    private final RoadmapRepository roadmapRepository;
    private final LearningMilestoneRepository learningMilestoneRepository;
    private final LearnerProfileRepository learnerProfileRepository;

    @Transactional
    public Roadmap replanRoadmap(ReplanRequest request) {
        Roadmap roadmap = roadmapRepository.findById(request.getRoadmapId())
                .orElseThrow(() -> new IllegalArgumentException("Roadmap not found: " + request.getRoadmapId()));

        List<LearningMilestone> milestones = learningMilestoneRepository.findByRoadmapIdOrderByStepOrderAsc(roadmap.getId());

        // 1. Process Status Updates
        if (request.getStatusUpdates() != null && !request.getStatusUpdates().isEmpty()) {
            for (LearningMilestone m : milestones) {
                if (request.getStatusUpdates().containsKey(m.getId())) {
                    String newStatus = request.getStatusUpdates().get(m.getId());
                    m.setStatus(newStatus);
                    if ("COMPLETED".equalsIgnoreCase(newStatus)) {
                        m.setQuizPassed(true);
                    }
                }
            }
        }

        // 2. Process Schedule Adjustments
        if (request.getUpdatedHoursPerWeek() != null && request.getUpdatedHoursPerWeek() > 0) {
            LearnerProfile profile = learnerProfileRepository.findById(roadmap.getLearnerProfileId()).orElse(null);
            if (profile != null) {
                profile.setHoursPerWeek(request.getUpdatedHoursPerWeek());
                learnerProfileRepository.save(profile);
            }
            int newWeeks = (int) Math.ceil(roadmap.getTotalEstimatedHours() / request.getUpdatedHoursPerWeek());
            roadmap.setEstimatedWeeks(newWeeks);
        }

        // 3. Process Feedback Text (e.g. "too hard", "reduce hours", "skip math")
        String reason = "Adapted roadmap live based on user input.";
        if (request.getFeedbackText() != null && !request.getFeedbackText().trim().isEmpty()) {
            String feedback = request.getFeedbackText().toLowerCase();
            reason = "Live Adaptation: " + request.getFeedbackText();

            if (feedback.contains("too hard") || feedback.contains("struggling") || feedback.contains("refresher")) {
                // Insert a refresher lab or adjust explanations
                for (LearningMilestone m : milestones) {
                    if ("IN_PROGRESS".equals(m.getStatus())) {
                        m.setWhyRecommended("ADAPTED: Added remedial practice lab and extended timeline based on feedback ('" + request.getFeedbackText() + "').");
                        m.setEstimatedHours(m.getEstimatedHours() + 3.0);
                    }
                }
            } else if (feedback.contains("too easy") || feedback.contains("accelerate")) {
                for (LearningMilestone m : milestones) {
                    if ("IN_PROGRESS".equals(m.getStatus())) {
                        m.setStatus("COMPLETED");
                        break;
                    }
                }
            }
        }

        // Calculate completed hours
        double completed = milestones.stream()
                .filter(m -> "COMPLETED".equals(m.getStatus()))
                .mapToDouble(LearningMilestone::getEstimatedHours)
                .sum();

        roadmap.setCompletedHours(completed);
        roadmap.setAdaptationCount(roadmap.getAdaptationCount() != null ? roadmap.getAdaptationCount() + 1 : 1);
        roadmap.setLastAdaptationReason(reason);

        learningMilestoneRepository.saveAll(milestones);
        return roadmapRepository.save(roadmap);
    }
}
