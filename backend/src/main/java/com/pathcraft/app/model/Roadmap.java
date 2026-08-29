package com.pathcraft.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "roadmaps")
public class Roadmap {

    @Id
    private String id;
    private String learnerProfileId;
    private LocalDateTime generatedAt;
    private Double totalEstimatedHours;
    private Integer estimatedWeeks;
    private Double completedHours;
    private Integer adaptationCount;

    @Column(length = 1000)
    private String lastAdaptationReason;

    public Roadmap() {}

    public Roadmap(String id, String learnerProfileId, LocalDateTime generatedAt, Double totalEstimatedHours, Integer estimatedWeeks, Double completedHours, Integer adaptationCount, String lastAdaptationReason) {
        this.id = id;
        this.learnerProfileId = learnerProfileId;
        this.generatedAt = generatedAt;
        this.totalEstimatedHours = totalEstimatedHours;
        this.estimatedWeeks = estimatedWeeks;
        this.completedHours = completedHours;
        this.adaptationCount = adaptationCount;
        this.lastAdaptationReason = lastAdaptationReason;
    }

    public static RoadmapBuilder builder() {
        return new RoadmapBuilder();
    }

    public static class RoadmapBuilder {
        private String id;
        private String learnerProfileId;
        private LocalDateTime generatedAt;
        private Double totalEstimatedHours;
        private Integer estimatedWeeks;
        private Double completedHours;
        private Integer adaptationCount;
        private String lastAdaptationReason;

        public RoadmapBuilder id(String id) { this.id = id; return this; }
        public RoadmapBuilder learnerProfileId(String learnerProfileId) { this.learnerProfileId = learnerProfileId; return this; }
        public RoadmapBuilder generatedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; return this; }
        public RoadmapBuilder totalEstimatedHours(Double totalEstimatedHours) { this.totalEstimatedHours = totalEstimatedHours; return this; }
        public RoadmapBuilder estimatedWeeks(Integer estimatedWeeks) { this.estimatedWeeks = estimatedWeeks; return this; }
        public RoadmapBuilder completedHours(Double completedHours) { this.completedHours = completedHours; return this; }
        public RoadmapBuilder adaptationCount(Integer adaptationCount) { this.adaptationCount = adaptationCount; return this; }
        public RoadmapBuilder lastAdaptationReason(String lastAdaptationReason) { this.lastAdaptationReason = lastAdaptationReason; return this; }

        public Roadmap build() {
            return new Roadmap(id, learnerProfileId, generatedAt, totalEstimatedHours, estimatedWeeks, completedHours, adaptationCount, lastAdaptationReason);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLearnerProfileId() { return learnerProfileId; }
    public void setLearnerProfileId(String learnerProfileId) { this.learnerProfileId = learnerProfileId; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public Double getTotalEstimatedHours() { return totalEstimatedHours; }
    public void setTotalEstimatedHours(Double totalEstimatedHours) { this.totalEstimatedHours = totalEstimatedHours; }

    public Integer getEstimatedWeeks() { return estimatedWeeks; }
    public void setEstimatedWeeks(Integer estimatedWeeks) { this.estimatedWeeks = estimatedWeeks; }

    public Double getCompletedHours() { return completedHours; }
    public void setCompletedHours(Double completedHours) { this.completedHours = completedHours; }

    public Integer getAdaptationCount() { return adaptationCount; }
    public void setAdaptationCount(Integer adaptationCount) { this.adaptationCount = adaptationCount; }

    public String getLastAdaptationReason() { return lastAdaptationReason; }
    public void setLastAdaptationReason(String lastAdaptationReason) { this.lastAdaptationReason = lastAdaptationReason; }
}
