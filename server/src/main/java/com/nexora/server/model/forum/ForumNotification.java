package com.nexora.server.model.forum;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Represents a notification for forum-related events.
 */
@Document(collection = "forum_notifications")
@Data
public class ForumNotification {
    @Id
    private String id; // Unique identifier for the notification

    private String userId; // Recipient User.id
    private String userName; // Recipient User.name
    private String message; // Notification message, e.g., "John upvoted your comment"
    private String relatedQuestionId; // Associated question ID, if applicable
    private String relatedCommentId; // Associated comment ID, if applicable
    private String relatedQuizId; // Associated quiz ID, if applicable
    private String type; // Type of notification, e.g., "COMMENT_VOTE", "QUESTION_VOTE", "COMMENT"
    private boolean isRead = false; // Read status of the notification
    private LocalDateTime createdAt = LocalDateTime.now(); // Timestamp when the notification was created

    /**
     * Gets the notification ID.
     * @return the notification ID
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the notification ID.
     * @param id the notification ID
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Gets the recipient user ID.
     * @return the user ID
     */
    public String getUserId() {
        return userId;
    }

    /**
     * Sets the recipient user ID.
     * @param userId the user ID
     */
    public void setUserId(String userId) {
        this.userId = userId;
    }

    /**
     * Gets the notification message.
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets the notification message.
     * @param message the message
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Gets the related question ID.
     * @return the question ID
     */
    public String getRelatedQuestionId() {
        return relatedQuestionId;
    }

    /**
     * Sets the related question ID.
     * @param relatedQuestionId the question ID
     */
    public void setRelatedQuestionId(String relatedQuestionId) {
        this.relatedQuestionId = relatedQuestionId;
    }

    /**
     * Gets the related comment ID.
     * @return the comment ID
     */
    public String getRelatedCommentId() {
        return relatedCommentId;
    }

    /**
     * Sets the related comment ID.
     * @param relatedCommentId the comment ID
     */
    public void setRelatedCommentId(String relatedCommentId) {
        this.relatedCommentId = relatedCommentId;
    }

    /**
     * Gets the related quiz ID.
     * @return the quiz ID
     */
    public String getRelatedQuizId() {
        return relatedQuizId;
    }

    /**
     * Sets the related quiz ID.
     * @param relatedQuizId the quiz ID
     */
    public void setRelatedQuizId(String relatedQuizId) {
        this.relatedQuizId = relatedQuizId;
    }

    /**
     * Checks if the notification has been read.
     * @return true if read, false otherwise
     */
    public boolean isRead() {
        return isRead;
    }

    /**
     * Sets the read status of the notification.
     * @param read the read status
     */
    public void setRead(boolean read) {
        isRead = read;
    }

    /**
     * Gets the creation timestamp.
     * @return the creation time
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets the creation timestamp.
     * @param createdAt the creation time
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}