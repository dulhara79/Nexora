package com.nexora.server.model.forum;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "forum_notifications")
public class ForumNotification {
    @Id
    private String id;

    private String userId; // Recipient User.id
    private String message; // e.g., "User X commented on your question"
    private String relatedQuestionId;
    private String relatedCommentId;
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRelatedQuestionId() {
        return relatedQuestionId;
    }

    public void setRelatedQuestionId(String relatedQuestionId) {
        this.relatedQuestionId = relatedQuestionId;
    }

    public String getRelatedCommentId() {
        return relatedCommentId;
    }

    public void setRelatedCommentId(String relatedCommentId) {
        this.relatedCommentId = relatedCommentId;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}