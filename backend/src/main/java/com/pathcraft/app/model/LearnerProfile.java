package com.pathcraft.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "learner_profiles")
public class LearnerProfile {

    @Id
    private String id;
    private String name;

    @Column(length = 2000)
    private String naturalLanguageGoal;

    private String targetRole;
    private String targetSkillNodeId;
    private Integer timeframeMonths;
    private Double hoursPerWeek;
    private String learningStyle;
    private String budgetPreference;

    @Column(length = 4000)
    private String claimedSkillsJson;

    @Column(length = 4000)
    private String calibratedSkillsJson;

    private Integer streakDays;
    private Double totalHoursInvested;

    public LearnerProfile() {}

    public LearnerProfile(String id, String name, String naturalLanguageGoal, String targetRole, String targetSkillNodeId, Integer timeframeMonths, Double hoursPerWeek, String learningStyle, String budgetPreference, String claimedSkillsJson, String calibratedSkillsJson, Integer streakDays, Double totalHoursInvested) {
        this.id = id;
        this.name = name;
        this.naturalLanguageGoal = naturalLanguageGoal;
        this.targetRole = targetRole;
        this.targetSkillNodeId = targetSkillNodeId;
        this.timeframeMonths = timeframeMonths;
        this.hoursPerWeek = hoursPerWeek;
        this.learningStyle = learningStyle;
        this.budgetPreference = budgetPreference;
        this.claimedSkillsJson = claimedSkillsJson;
        this.calibratedSkillsJson = calibratedSkillsJson;
        this.streakDays = streakDays;
        this.totalHoursInvested = totalHoursInvested;
    }

    public static LearnerProfileBuilder builder() {
        return new LearnerProfileBuilder();
    }

    public static class LearnerProfileBuilder {
        private String id;
        private String name;
        private String naturalLanguageGoal;
        private String targetRole;
        private String targetSkillNodeId;
        private Integer timeframeMonths;
        private Double hoursPerWeek;
        private String learningStyle;
        private String budgetPreference;
        private String claimedSkillsJson;
        private String calibratedSkillsJson;
        private Integer streakDays;
        private Double totalHoursInvested;

        public LearnerProfileBuilder id(String id) { this.id = id; return this; }
        public LearnerProfileBuilder name(String name) { this.name = name; return this; }
        public LearnerProfileBuilder naturalLanguageGoal(String naturalLanguageGoal) { this.naturalLanguageGoal = naturalLanguageGoal; return this; }
        public LearnerProfileBuilder targetRole(String targetRole) { this.targetRole = targetRole; return this; }
        public LearnerProfileBuilder targetSkillNodeId(String targetSkillNodeId) { this.targetSkillNodeId = targetSkillNodeId; return this; }
        public LearnerProfileBuilder timeframeMonths(Integer timeframeMonths) { this.timeframeMonths = timeframeMonths; return this; }
        public LearnerProfileBuilder hoursPerWeek(Double hoursPerWeek) { this.hoursPerWeek = hoursPerWeek; return this; }
        public LearnerProfileBuilder learningStyle(String learningStyle) { this.learningStyle = learningStyle; return this; }
        public LearnerProfileBuilder budgetPreference(String budgetPreference) { this.budgetPreference = budgetPreference; return this; }
        public LearnerProfileBuilder claimedSkillsJson(String claimedSkillsJson) { this.claimedSkillsJson = claimedSkillsJson; return this; }
        public LearnerProfileBuilder calibratedSkillsJson(String calibratedSkillsJson) { this.calibratedSkillsJson = calibratedSkillsJson; return this; }
        public LearnerProfileBuilder streakDays(Integer streakDays) { this.streakDays = streakDays; return this; }
        public LearnerProfileBuilder totalHoursInvested(Double totalHoursInvested) { this.totalHoursInvested = totalHoursInvested; return this; }

        public LearnerProfile build() {
            return new LearnerProfile(id, name, naturalLanguageGoal, targetRole, targetSkillNodeId, timeframeMonths, hoursPerWeek, learningStyle, budgetPreference, claimedSkillsJson, calibratedSkillsJson, streakDays, totalHoursInvested);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNaturalLanguageGoal() { return naturalLanguageGoal; }
    public void setNaturalLanguageGoal(String naturalLanguageGoal) { this.naturalLanguageGoal = naturalLanguageGoal; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public String getTargetSkillNodeId() { return targetSkillNodeId; }
    public void setTargetSkillNodeId(String targetSkillNodeId) { this.targetSkillNodeId = targetSkillNodeId; }

    public Integer getTimeframeMonths() { return timeframeMonths; }
    public void setTimeframeMonths(Integer timeframeMonths) { this.timeframeMonths = timeframeMonths; }

    public Double getHoursPerWeek() { return hoursPerWeek; }
    public void setHoursPerWeek(Double hoursPerWeek) { this.hoursPerWeek = hoursPerWeek; }

    public String getLearningStyle() { return learningStyle; }
    public void setLearningStyle(String learningStyle) { this.learningStyle = learningStyle; }

    public String getBudgetPreference() { return budgetPreference; }
    public void setBudgetPreference(String budgetPreference) { this.budgetPreference = budgetPreference; }

    public String getClaimedSkillsJson() { return claimedSkillsJson; }
    public void setClaimedSkillsJson(String claimedSkillsJson) { this.claimedSkillsJson = claimedSkillsJson; }

    public String getCalibratedSkillsJson() { return calibratedSkillsJson; }
    public void setCalibratedSkillsJson(String calibratedSkillsJson) { this.calibratedSkillsJson = calibratedSkillsJson; }

    public Integer getStreakDays() { return streakDays; }
    public void setStreakDays(Integer streakDays) { this.streakDays = streakDays; }

    public Double getTotalHoursInvested() { return totalHoursInvested; }
    public void setTotalHoursInvested(Double totalHoursInvested) { this.totalHoursInvested = totalHoursInvested; }
}
