package com.pathcraft.app.dto;

import java.util.List;

public class SkillGapResponse {
    private String targetRole;
    private Double overallReadinessPercentage;
    private List<SkillItem> currentSkills;
    private List<SkillItem> targetSkills;
    private List<SkillGapDetail> gaps;

    public SkillGapResponse() {}

    public SkillGapResponse(String targetRole, Double overallReadinessPercentage, List<SkillItem> currentSkills, List<SkillItem> targetSkills, List<SkillGapDetail> gaps) {
        this.targetRole = targetRole;
        this.overallReadinessPercentage = overallReadinessPercentage;
        this.currentSkills = currentSkills;
        this.targetSkills = targetSkills;
        this.gaps = gaps;
    }

    public static SkillGapResponseBuilder builder() { return new SkillGapResponseBuilder(); }

    public static class SkillGapResponseBuilder {
        private String targetRole;
        private Double overallReadinessPercentage;
        private List<SkillItem> currentSkills;
        private List<SkillItem> targetSkills;
        private List<SkillGapDetail> gaps;

        public SkillGapResponseBuilder targetRole(String targetRole) { this.targetRole = targetRole; return this; }
        public SkillGapResponseBuilder overallReadinessPercentage(Double overallReadinessPercentage) { this.overallReadinessPercentage = overallReadinessPercentage; return this; }
        public SkillGapResponseBuilder currentSkills(List<SkillItem> currentSkills) { this.currentSkills = currentSkills; return this; }
        public SkillGapResponseBuilder targetSkills(List<SkillItem> targetSkills) { this.targetSkills = targetSkills; return this; }
        public SkillGapResponseBuilder gaps(List<SkillGapDetail> gaps) { this.gaps = gaps; return this; }

        public SkillGapResponse build() {
            return new SkillGapResponse(targetRole, overallReadinessPercentage, currentSkills, targetSkills, gaps);
        }
    }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public Double getOverallReadinessPercentage() { return overallReadinessPercentage; }
    public void setOverallReadinessPercentage(Double overallReadinessPercentage) { this.overallReadinessPercentage = overallReadinessPercentage; }

    public List<SkillItem> getCurrentSkills() { return currentSkills; }
    public void setCurrentSkills(List<SkillItem> currentSkills) { this.currentSkills = currentSkills; }

    public List<SkillItem> getTargetSkills() { return targetSkills; }
    public void setTargetSkills(List<SkillItem> targetSkills) { this.targetSkills = targetSkills; }

    public List<SkillGapDetail> getGaps() { return gaps; }
    public void setGaps(List<SkillGapDetail> gaps) { this.gaps = gaps; }

    public static class SkillItem {
        private String skillId;
        private String name;
        private String category;
        private Integer level;

        public SkillItem() {}

        public SkillItem(String skillId, String name, String category, Integer level) {
            this.skillId = skillId;
            this.name = name;
            this.category = category;
            this.level = level;
        }

        public static SkillItemBuilder builder() { return new SkillItemBuilder(); }

        public static class SkillItemBuilder {
            private String skillId;
            private String name;
            private String category;
            private Integer level;

            public SkillItemBuilder skillId(String skillId) { this.skillId = skillId; return this; }
            public SkillItemBuilder name(String name) { this.name = name; return this; }
            public SkillItemBuilder category(String category) { this.category = category; return this; }
            public SkillItemBuilder level(Integer level) { this.level = level; return this; }

            public SkillItem build() {
                return new SkillItem(skillId, name, category, level);
            }
        }

        public String getSkillId() { return skillId; }
        public void setSkillId(String skillId) { this.skillId = skillId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Integer getLevel() { return level; }
        public void setLevel(Integer level) { this.level = level; }
    }

    public static class SkillGapDetail {
        private String skillId;
        private String name;
        private String category;
        private Integer currentLevel;
        private Integer targetLevel;
        private List<String> missingPrerequisites;
        private String importance;

        public SkillGapDetail() {}

        public SkillGapDetail(String skillId, String name, String category, Integer currentLevel, Integer targetLevel, List<String> missingPrerequisites, String importance) {
            this.skillId = skillId;
            this.name = name;
            this.category = category;
            this.currentLevel = currentLevel;
            this.targetLevel = targetLevel;
            this.missingPrerequisites = missingPrerequisites;
            this.importance = importance;
        }

        public static SkillGapDetailBuilder builder() { return new SkillGapDetailBuilder(); }

        public static class SkillGapDetailBuilder {
            private String skillId;
            private String name;
            private String category;
            private Integer currentLevel;
            private Integer targetLevel;
            private List<String> missingPrerequisites;
            private String importance;

            public SkillGapDetailBuilder skillId(String skillId) { this.skillId = skillId; return this; }
            public SkillGapDetailBuilder name(String name) { this.name = name; return this; }
            public SkillGapDetailBuilder category(String category) { this.category = category; return this; }
            public SkillGapDetailBuilder currentLevel(Integer currentLevel) { this.currentLevel = currentLevel; return this; }
            public SkillGapDetailBuilder targetLevel(Integer targetLevel) { this.targetLevel = targetLevel; return this; }
            public SkillGapDetailBuilder missingPrerequisites(List<String> missingPrerequisites) { this.missingPrerequisites = missingPrerequisites; return this; }
            public SkillGapDetailBuilder importance(String importance) { this.importance = importance; return this; }

            public SkillGapDetail build() {
                return new SkillGapDetail(skillId, name, category, currentLevel, targetLevel, missingPrerequisites, importance);
            }
        }

        public String getSkillId() { return skillId; }
        public void setSkillId(String skillId) { this.skillId = skillId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Integer getCurrentLevel() { return currentLevel; }
        public void setCurrentLevel(Integer currentLevel) { this.currentLevel = currentLevel; }

        public Integer getTargetLevel() { return targetLevel; }
        public void setTargetLevel(Integer targetLevel) { this.targetLevel = targetLevel; }

        public List<String> getMissingPrerequisites() { return missingPrerequisites; }
        public void setMissingPrerequisites(List<String> missingPrerequisites) { this.missingPrerequisites = missingPrerequisites; }

        public String getImportance() { return importance; }
        public void setImportance(String importance) { this.importance = importance; }
    }
}
