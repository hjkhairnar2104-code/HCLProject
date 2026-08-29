package com.pathcraft.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {

    @Id
    private String id;
    private String userEmail;
    private String topic;
    private Double scorePercentage;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private String skillLevelAssigned;
    private LocalDateTime attemptedAt;

    public QuizAttempt() {}

    public QuizAttempt(String id, String userEmail, String topic, Double scorePercentage, Integer totalQuestions, Integer correctAnswers, String skillLevelAssigned, LocalDateTime attemptedAt) {
        this.id = id;
        this.userEmail = userEmail;
        this.topic = topic;
        this.scorePercentage = scorePercentage;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.skillLevelAssigned = skillLevelAssigned;
        this.attemptedAt = attemptedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public Double getScorePercentage() { return scorePercentage; }
    public void setScorePercentage(Double scorePercentage) { this.scorePercentage = scorePercentage; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }

    public String getSkillLevelAssigned() { return skillLevelAssigned; }
    public void setSkillLevelAssigned(String skillLevelAssigned) { this.skillLevelAssigned = skillLevelAssigned; }

    public LocalDateTime getAttemptedAt() { return attemptedAt; }
    public void setAttemptedAt(LocalDateTime attemptedAt) { this.attemptedAt = attemptedAt; }
}
