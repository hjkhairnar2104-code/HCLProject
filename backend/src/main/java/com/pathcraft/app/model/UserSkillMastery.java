package com.pathcraft.app.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_skill_masteries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkillMastery {

    @Id
    private String id;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String skillId; // e.g. "java_core", "sql_indexing", "docker_k8s"

    private String skillName; // e.g. "Java Collections & Concurrency"

    private String category; // "FOUNDATIONS", "BACKEND", "DATABASE", "SYSTEM_DESIGN", "CLOUD"

    private Integer currentScore; // 0 - 100

    private Integer requiredScore; // 0 - 100

    private String status; // "MASTERED", "LEARNING", "WEAK", "CRITICAL_GAP", "NOT_STARTED"

    private Boolean courseCompleted;
    private Integer quizScore;
    private Integer codingScore;
    private Boolean projectCompleted;
    private Integer interviewScore;
    private Double confidenceScore;

    private Integer decayScore;
    private Boolean needsRevision;

    private LocalDateTime lastPracticedAt;
    private LocalDateTime lastAssessedAt;
}
