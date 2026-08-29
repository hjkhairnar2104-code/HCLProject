package com.pathcraft.app.dto;

import java.util.Map;

public class ReplanRequest {
    private String roadmapId;
    private String feedbackText;
    private Double updatedHoursPerWeek;
    private Map<String, String> statusUpdates;

    public ReplanRequest() {}

    public ReplanRequest(String roadmapId, String feedbackText, Double updatedHoursPerWeek, Map<String, String> statusUpdates) {
        this.roadmapId = roadmapId;
        this.feedbackText = feedbackText;
        this.updatedHoursPerWeek = updatedHoursPerWeek;
        this.statusUpdates = statusUpdates;
    }

    public String getRoadmapId() { return roadmapId; }
    public void setRoadmapId(String roadmapId) { this.roadmapId = roadmapId; }

    public String getFeedbackText() { return feedbackText; }
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }

    public Double getUpdatedHoursPerWeek() { return updatedHoursPerWeek; }
    public void setUpdatedHoursPerWeek(Double updatedHoursPerWeek) { this.updatedHoursPerWeek = updatedHoursPerWeek; }

    public Map<String, String> getStatusUpdates() { return statusUpdates; }
    public void setStatusUpdates(Map<String, String> statusUpdates) { this.statusUpdates = statusUpdates; }
}
