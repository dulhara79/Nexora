package com.nexora.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "questions")
public class Question {
    @Id
    private String id;
    private String title;
    private String description;
    private String authorId;
    private String authorUsername; // Add username field
    private List<String> tags;
    private List<String> upvoteUserIds;
    private List<String> downvoteUserIds;
    private List<String> commentIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isFlagged;
    private int views;
    private boolean isPinned;
   
    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getUpvoteUserIds() {
        return upvoteUserIds;
    }

    public void setUpvoteUserIds(List<String> upvoteUserIds) {
        this.upvoteUserIds = upvoteUserIds;
    }

    public List<String> getDownvoteUserIds() {
        return downvoteUserIds;
    }

    public void setDownvoteUserIds(List<String> downvoteUserIds) {
        this.downvoteUserIds = downvoteUserIds;
    }

    public List<String> getCommentIds() {
        return commentIds;
    }

    public void setCommentIds(List<String> commentIds) {
        this.commentIds = commentIds;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isFlagged() {
        return isFlagged;
    }

    public void setFlagged(boolean flagged) {
        this.isFlagged = flagged;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public boolean isPinned() {
        return isPinned;
    }

    public void setPinned(boolean pinned) {
        this.isPinned = pinned;
    }
}