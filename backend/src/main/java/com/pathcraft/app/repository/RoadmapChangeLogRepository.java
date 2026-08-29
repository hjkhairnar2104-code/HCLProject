package com.pathcraft.app.repository;

import com.pathcraft.app.model.RoadmapChangeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoadmapChangeLogRepository extends JpaRepository<RoadmapChangeLog, String> {
    List<RoadmapChangeLog> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}
