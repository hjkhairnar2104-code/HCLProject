package com.pathcraft.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_accounts")
public class UserAccount {

    @Id
    private String id;
    private String email;
    private String fullName;
    private String password;
    private String googleId;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private int coins;
    private String badges; // JSON array of badge names
    private boolean profileCompleted = true;

    public UserAccount() {}

    public UserAccount(String id, String email, String fullName, String password, String googleId, String avatarUrl, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.googleId = googleId;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
        this.coins = 0;
        this.badges = "[]";
        this.profileCompleted = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getCoins() { return coins; }
    public void setCoins(int coins) { this.coins = coins; }

    public String getBadges() { return badges; }
    public void setBadges(String badges) { this.badges = badges; }

    public boolean isProfileCompleted() { return profileCompleted; }
    public void setProfileCompleted(boolean profileCompleted) { this.profileCompleted = profileCompleted; }
}
