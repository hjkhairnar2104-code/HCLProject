package com.pathcraft.app.repository;

import com.pathcraft.app.model.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, String> {
    Optional<Roadmap> findTopByLearnerProfileIdOrderByGeneratedAtDesc(String learnerProfileId);
}
