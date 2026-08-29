package com.pathcraft.app.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roadmap_change_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapChangeLog {

    @Id
    private String id;

    @Column(nullable = false)
    private String userEmail;

    private String changeType; // "REINFORCEMENT_ADDED", "MODULE_SKIPPED", "SCHEDULE_COMPRESSED", "PREREQUISITE_INSERTED"

    private String affectedSkill; // e.g. "SQL Joins & Indexing"

    @Column(columnDefinition = "TEXT")
    private String reason; // e.g. "Your SQL assessment score was 45%, so we added a SQL reinforcement module before Spring Boot."

    private String triggerEvent; // "ASSESSMENT_BELOW_THRESHOLD", "HIGH_MASTERY_DEMONSTRATED", "MISSED_STUDY_DAYS"

    private String timeLabel; // "Today", "2 days ago", "5 days ago"

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
