package com.pathcraft.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_resume_profiles")
public class UserResumeProfile {

    @Id
    private String id;
    private String userEmail;
    private String fullName;
    private String phone;
    private String location;
    private String headline;

    @Column(length = 2000)
    private String summary;

    @Column(length = 2000)
    private String skillsJson;

    @Column(length = 4000)
    private String experienceJson;

    @Column(length = 2000)
    private String educationJson;

    @Column(length = 4000)
    private String projectsJson;

    private LocalDateTime updatedAt;

    public UserResumeProfile() {}

    public UserResumeProfile(String id, String userEmail, String fullName, String phone, String location, String headline, String summary, String skillsJson, String experienceJson, String educationJson, String projectsJson, LocalDateTime updatedAt) {
        this.id = id;
        this.userEmail = userEmail;
        this.fullName = fullName;
        this.phone = phone;
        this.location = location;
        this.headline = headline;
        this.summary = summary;
        this.skillsJson = skillsJson;
        this.experienceJson = experienceJson;
        this.educationJson = educationJson;
        this.projectsJson = projectsJson;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getSkillsJson() { return skillsJson; }
    public void setSkillsJson(String skillsJson) { this.skillsJson = skillsJson; }

    public String getExperienceJson() { return experienceJson; }
    public void setExperienceJson(String experienceJson) { this.experienceJson = experienceJson; }

    public String getEducationJson() { return educationJson; }
    public void setEducationJson(String educationJson) { this.educationJson = educationJson; }

    public String getProjectsJson() { return projectsJson; }
    public void setProjectsJson(String projectsJson) { this.projectsJson = projectsJson; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
