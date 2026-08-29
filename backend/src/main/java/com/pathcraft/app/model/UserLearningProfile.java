package com.pathcraft.app.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_learning_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLearningProfile {

    @Id
    private String id;

    @Column(nullable = false)
    private String userEmail;

    private String fullName;

    @Column(columnDefinition = "TEXT")
    private String naturalLanguageGoal;

    private String targetRole; // e.g. "Full-Stack AI & Cloud Engineer"

    private String experienceLevel; // "Beginner", "Intermediate", "Advanced"

    private Integer deadlineDays; // e.g. 90

    private Double hoursPerDay; // e.g. 2.0
    private Integer daysPerWeek; // e.g. 6
    private String codingExperienceYears; // e.g. "1–2 years"
    private String learningGoals; // e.g. "Prepare for a specific job"

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    private String targetCompanies; // e.g. "Amazon, Google, Microsoft"

    private String preferredLearningStyle; // "HANDS_ON", "VIDEO", "MIXED"

    private Double overallReadinessPercentage; // e.g. 68.0

    private Boolean profileCompleted; // true once onboarding is completed

    private Integer currentStreakDays; // e.g. 7

    private Integer totalCoins; // e.g. 120

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
