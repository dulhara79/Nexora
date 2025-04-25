package com.nexora.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "challenges")
public class Challenge {

    @Id
    private String challengeId;
    private String title;
    private String description;
    private String theme;
    private LocalDate startDate;
    private LocalDate endDate;
    private String createdBy; // User ID from session
    private String photoUrl; // URL or path to the uploaded photo

    // Constructors
    public Challenge() {}

    public Challenge(String challengeId, String title, String description, String theme, 
                    LocalDate startDate, LocalDate endDate, String createdBy, String photoUrl) {
        this.challengeId = challengeId;
        this.title = title;
        this.description = description;
        this.theme = theme;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdBy = createdBy;
        this.photoUrl = photoUrl;
    }

    // Getters and Setters
    public String getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(String challengeId) {
        this.challengeId = challengeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}