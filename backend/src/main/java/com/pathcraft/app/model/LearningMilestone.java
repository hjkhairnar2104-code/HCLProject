package com.pathcraft.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_milestones")
public class LearningMilestone {

    @Id
    private String id;
    private String roadmapId;
    private Integer stepOrder;

    private String title;
    private String skillNodeId;
    private String skillName;
    private String stage;
    private String status;

    private Double estimatedHours;

    @Column(length = 2000)
    private String whyRecommended;

    private String resourceId;
    private String resourceTitle;
    private String resourceProvider;
    private String resourceUrl;
    private String resourceType;
    private String resourceFormat;
    private String resourceCost;

    @Column(length = 1000)
    private String prerequisiteNodeIdsJson;

    private Double relevanceScore;
    private Double readinessScore;
    private Boolean quizPassed;

    public LearningMilestone() {}

    public LearningMilestone(String id, String roadmapId, Integer stepOrder, String title, String skillNodeId, String skillName, String stage, String status, Double estimatedHours, String whyRecommended, String resourceId, String resourceTitle, String resourceProvider, String resourceUrl, String resourceType, String resourceFormat, String resourceCost, String prerequisiteNodeIdsJson, Double relevanceScore, Double readinessScore, Boolean quizPassed) {
        this.id = id;
        this.roadmapId = roadmapId;
        this.stepOrder = stepOrder;
        this.title = title;
        this.skillNodeId = skillNodeId;
        this.skillName = skillName;
        this.stage = stage;
        this.status = status;
        this.estimatedHours = estimatedHours;
        this.whyRecommended = whyRecommended;
        this.resourceId = resourceId;
        this.resourceTitle = resourceTitle;
        this.resourceProvider = resourceProvider;
        this.resourceUrl = resourceUrl;
        this.resourceType = resourceType;
        this.resourceFormat = resourceFormat;
        this.resourceCost = resourceCost;
        this.prerequisiteNodeIdsJson = prerequisiteNodeIdsJson;
        this.relevanceScore = relevanceScore;
        this.readinessScore = readinessScore;
        this.quizPassed = quizPassed;
    }

    public static LearningMilestoneBuilder builder() {
        return new LearningMilestoneBuilder();
    }

    public static class LearningMilestoneBuilder {
        private String id;
        private String roadmapId;
        private Integer stepOrder;
        private String title;
        private String skillNodeId;
        private String skillName;
        private String stage;
        private String status;
        private Double estimatedHours;
        private String whyRecommended;
        private String resourceId;
        private String resourceTitle;
        private String resourceProvider;
        private String resourceUrl;
        private String resourceType;
        private String resourceFormat;
        private String resourceCost;
        private String prerequisiteNodeIdsJson;
        private Double relevanceScore;
        private Double readinessScore;
        private Boolean quizPassed;

        public LearningMilestoneBuilder id(String id) { this.id = id; return this; }
        public LearningMilestoneBuilder roadmapId(String roadmapId) { this.roadmapId = roadmapId; return this; }
        public LearningMilestoneBuilder stepOrder(Integer stepOrder) { this.stepOrder = stepOrder; return this; }
        public LearningMilestoneBuilder title(String title) { this.title = title; return this; }
        public LearningMilestoneBuilder skillNodeId(String skillNodeId) { this.skillNodeId = skillNodeId; return this; }
        public LearningMilestoneBuilder skillName(String skillName) { this.skillName = skillName; return this; }
        public LearningMilestoneBuilder stage(String stage) { this.stage = stage; return this; }
        public LearningMilestoneBuilder status(String status) { this.status = status; return this; }
        public LearningMilestoneBuilder estimatedHours(Double estimatedHours) { this.estimatedHours = estimatedHours; return this; }
        public LearningMilestoneBuilder whyRecommended(String whyRecommended) { this.whyRecommended = whyRecommended; return this; }
        public LearningMilestoneBuilder resourceId(String resourceId) { this.resourceId = resourceId; return this; }
        public LearningMilestoneBuilder resourceTitle(String resourceTitle) { this.resourceTitle = resourceTitle; return this; }
        public LearningMilestoneBuilder resourceProvider(String resourceProvider) { this.resourceProvider = resourceProvider; return this; }
        public LearningMilestoneBuilder resourceUrl(String resourceUrl) { this.resourceUrl = resourceUrl; return this; }
        public LearningMilestoneBuilder resourceType(String resourceType) { this.resourceType = resourceType; return this; }
        public LearningMilestoneBuilder resourceFormat(String resourceFormat) { this.resourceFormat = resourceFormat; return this; }
        public LearningMilestoneBuilder resourceCost(String resourceCost) { this.resourceCost = resourceCost; return this; }
        public LearningMilestoneBuilder prerequisiteNodeIdsJson(String prerequisiteNodeIdsJson) { this.prerequisiteNodeIdsJson = prerequisiteNodeIdsJson; return this; }
        public LearningMilestoneBuilder relevanceScore(Double relevanceScore) { this.relevanceScore = relevanceScore; return this; }
        public LearningMilestoneBuilder readinessScore(Double readinessScore) { this.readinessScore = readinessScore; return this; }
        public LearningMilestoneBuilder quizPassed(Boolean quizPassed) { this.quizPassed = quizPassed; return this; }

        public LearningMilestone build() {
            return new LearningMilestone(id, roadmapId, stepOrder, title, skillNodeId, skillName, stage, status, estimatedHours, whyRecommended, resourceId, resourceTitle, resourceProvider, resourceUrl, resourceType, resourceFormat, resourceCost, prerequisiteNodeIdsJson, relevanceScore, readinessScore, quizPassed);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRoadmapId() { return roadmapId; }
    public void setRoadmapId(String roadmapId) { this.roadmapId = roadmapId; }

    public Integer getStepOrder() { return stepOrder; }
    public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSkillNodeId() { return skillNodeId; }
    public void setSkillNodeId(String skillNodeId) { this.skillNodeId = skillNodeId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Double estimatedHours) { this.estimatedHours = estimatedHours; }

    public String getWhyRecommended() { return whyRecommended; }
    public void setWhyRecommended(String whyRecommended) { this.whyRecommended = whyRecommended; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getResourceTitle() { return resourceTitle; }
    public void setResourceTitle(String resourceTitle) { this.resourceTitle = resourceTitle; }

    public String getResourceProvider() { return resourceProvider; }
    public void setResourceProvider(String resourceProvider) { this.resourceProvider = resourceProvider; }

    public String getResourceUrl() { return resourceUrl; }
    public void setResourceUrl(String resourceUrl) { this.resourceUrl = resourceUrl; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getResourceFormat() { return resourceFormat; }
    public void setResourceFormat(String resourceFormat) { this.resourceFormat = resourceFormat; }

    public String getResourceCost() { return resourceCost; }
    public void setResourceCost(String resourceCost) { this.resourceCost = resourceCost; }

    public String getPrerequisiteNodeIdsJson() { return prerequisiteNodeIdsJson; }
    public void setPrerequisiteNodeIdsJson(String prerequisiteNodeIdsJson) { this.prerequisiteNodeIdsJson = prerequisiteNodeIdsJson; }

    public Double getRelevanceScore() { return relevanceScore; }
    public void setRelevanceScore(Double relevanceScore) { this.relevanceScore = relevanceScore; }

    public Double getReadinessScore() { return readinessScore; }
    public void setReadinessScore(Double readinessScore) { this.readinessScore = readinessScore; }

    public Boolean getQuizPassed() { return quizPassed; }
    public void setQuizPassed(Boolean quizPassed) { this.quizPassed = quizPassed; }
}
