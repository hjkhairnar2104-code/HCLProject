package com.pathcraft.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "course_resources")
public class CourseResource {

    @Id
    private String id;
    private String title;
    private String provider;
    private String url;
    private String type;
    private String format;
    private String difficulty;
    private Double durationHours;
    private Double rating;
    private String skillNodeId;

    @Column(length = 1000)
    private String description;
    private String costType;

    public CourseResource() {}

    public CourseResource(String id, String title, String provider, String url, String type, String format, String difficulty, Double durationHours, Double rating, String skillNodeId, String description, String costType) {
        this.id = id;
        this.title = title;
        this.provider = provider;
        this.url = url;
        this.type = type;
        this.format = format;
        this.difficulty = difficulty;
        this.durationHours = durationHours;
        this.rating = rating;
        this.skillNodeId = skillNodeId;
        this.description = description;
        this.costType = costType;
    }

    public static CourseResourceBuilder builder() {
        return new CourseResourceBuilder();
    }

    public static class CourseResourceBuilder {
        private String id;
        private String title;
        private String provider;
        private String url;
        private String type;
        private String format;
        private String difficulty;
        private Double durationHours;
        private Double rating;
        private String skillNodeId;
        private String description;
        private String costType;

        public CourseResourceBuilder id(String id) { this.id = id; return this; }
        public CourseResourceBuilder title(String title) { this.title = title; return this; }
        public CourseResourceBuilder provider(String provider) { this.provider = provider; return this; }
        public CourseResourceBuilder url(String url) { this.url = url; return this; }
        public CourseResourceBuilder type(String type) { this.type = type; return this; }
        public CourseResourceBuilder format(String format) { this.format = format; return this; }
        public CourseResourceBuilder difficulty(String difficulty) { this.difficulty = difficulty; return this; }
        public CourseResourceBuilder durationHours(Double durationHours) { this.durationHours = durationHours; return this; }
        public CourseResourceBuilder rating(Double rating) { this.rating = rating; return this; }
        public CourseResourceBuilder skillNodeId(String skillNodeId) { this.skillNodeId = skillNodeId; return this; }
        public CourseResourceBuilder description(String description) { this.description = description; return this; }
        public CourseResourceBuilder costType(String costType) { this.costType = costType; return this; }

        public CourseResource build() {
            return new CourseResource(id, title, provider, url, type, format, difficulty, durationHours, rating, skillNodeId, description, costType);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Double getDurationHours() { return durationHours; }
    public void setDurationHours(Double durationHours) { this.durationHours = durationHours; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getSkillNodeId() { return skillNodeId; }
    public void setSkillNodeId(String skillNodeId) { this.skillNodeId = skillNodeId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCostType() { return costType; }
    public void setCostType(String costType) { this.costType = costType; }
}
