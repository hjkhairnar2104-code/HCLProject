package com.pathcraft.app.repository;

import com.pathcraft.app.model.LearningMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningMilestoneRepository extends JpaRepository<LearningMilestone, String> {
    List<LearningMilestone> findByRoadmapIdOrderByStepOrderAsc(String roadmapId);
    void deleteByRoadmapId(String roadmapId);
}
