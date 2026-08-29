package com.pathcraft.app.dto;

import java.util.List;
import java.util.Map;

public class ParseGoalResponse {
    private String parsedTargetRole;
    private String targetSkillNodeId;
    private Integer timeframeMonths;
    private Double hoursPerWeek;
    private String learningStyle;
    private Map<String, Integer> extractedSkills;
    private List<String> clarifyingQuestions;
    private String summary;

    public ParseGoalResponse() {}

    public ParseGoalResponse(String parsedTargetRole, String targetSkillNodeId, Integer timeframeMonths, Double hoursPerWeek, String learningStyle, Map<String, Integer> extractedSkills, List<String> clarifyingQuestions, String summary) {
        this.parsedTargetRole = parsedTargetRole;
        this.targetSkillNodeId = targetSkillNodeId;
        this.timeframeMonths = timeframeMonths;
        this.hoursPerWeek = hoursPerWeek;
        this.learningStyle = learningStyle;
        this.extractedSkills = extractedSkills;
        this.clarifyingQuestions = clarifyingQuestions;
        this.summary = summary;
    }

    public static ParseGoalResponseBuilder builder() { return new ParseGoalResponseBuilder(); }

    public static class ParseGoalResponseBuilder {
        private String parsedTargetRole;
        private String targetSkillNodeId;
        private Integer timeframeMonths;
        private Double hoursPerWeek;
        private String learningStyle;
        private Map<String, Integer> extractedSkills;
        private List<String> clarifyingQuestions;
        private String summary;

        public ParseGoalResponseBuilder parsedTargetRole(String parsedTargetRole) { this.parsedTargetRole = parsedTargetRole; return this; }
        public ParseGoalResponseBuilder targetSkillNodeId(String targetSkillNodeId) { this.targetSkillNodeId = targetSkillNodeId; return this; }
        public ParseGoalResponseBuilder timeframeMonths(Integer timeframeMonths) { this.timeframeMonths = timeframeMonths; return this; }
        public ParseGoalResponseBuilder hoursPerWeek(Double hoursPerWeek) { this.hoursPerWeek = hoursPerWeek; return this; }
        public ParseGoalResponseBuilder learningStyle(String learningStyle) { this.learningStyle = learningStyle; return this; }
        public ParseGoalResponseBuilder extractedSkills(Map<String, Integer> extractedSkills) { this.extractedSkills = extractedSkills; return this; }
        public ParseGoalResponseBuilder clarifyingQuestions(List<String> clarifyingQuestions) { this.clarifyingQuestions = clarifyingQuestions; return this; }
        public ParseGoalResponseBuilder summary(String summary) { this.summary = summary; return this; }

        public ParseGoalResponse build() {
            return new ParseGoalResponse(parsedTargetRole, targetSkillNodeId, timeframeMonths, hoursPerWeek, learningStyle, extractedSkills, clarifyingQuestions, summary);
        }
    }

    public String getParsedTargetRole() { return parsedTargetRole; }
    public void setParsedTargetRole(String parsedTargetRole) { this.parsedTargetRole = parsedTargetRole; }

    public String getTargetSkillNodeId() { return targetSkillNodeId; }
    public void setTargetSkillNodeId(String targetSkillNodeId) { this.targetSkillNodeId = targetSkillNodeId; }

    public Integer getTimeframeMonths() { return timeframeMonths; }
    public void setTimeframeMonths(Integer timeframeMonths) { this.timeframeMonths = timeframeMonths; }

    public Double getHoursPerWeek() { return hoursPerWeek; }
    public void setHoursPerWeek(Double hoursPerWeek) { this.hoursPerWeek = hoursPerWeek; }

    public String getLearningStyle() { return learningStyle; }
    public void setLearningStyle(String learningStyle) { this.learningStyle = learningStyle; }

    public Map<String, Integer> getExtractedSkills() { return extractedSkills; }
    public void setExtractedSkills(Map<String, Integer> extractedSkills) { this.extractedSkills = extractedSkills; }

    public List<String> getClarifyingQuestions() { return clarifyingQuestions; }
    public void setClarifyingQuestions(List<String> clarifyingQuestions) { this.clarifyingQuestions = clarifyingQuestions; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
}
