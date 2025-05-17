package com.nexora.server.model.forum;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a forum question document stored in the "questions" collection in MongoDB.
 */
@Document(collection = "questions")
public class ForumQuestion {
    @Id
    private String id; // Unique identifier for the question

    private String title; // Title of the question
    private String description; // Detailed description of the question
    private String authorId; // ID of the user who posted the question
    private String authorUsername; // Username of the author
    private String authorAvatarUrl; // URL to the author's avatar image

    private List<String> tags; // List of tags associated with the question
    private List<String> upvoteUserIds; // List of user IDs who upvoted the question
    private List<String> downvoteUserIds; // List of user IDs who downvoted the question
    private List<String> commentIds; // List of comment IDs associated with the question

    private LocalDateTime createdAt; // Timestamp when the question was created
    private LocalDateTime updatedAt; // Timestamp when the question was last updated

    private boolean isFlagged; // Indicates if the question is flagged for moderation
    private int views; // Number of times the question has been viewed
    private boolean isPinned; // Indicates if the question is pinned to the top

    // Getters and Setters

    /**
     * Gets the unique identifier of the question.
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the unique identifier of the question.
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Gets the title of the question.
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the title of the question.
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Gets the description of the question.
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description of the question.
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets the author ID.
     */
    public String getAuthorId() {
        return authorId;
    }

    /**
     * Sets the author ID.
     */
    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    /**
     * Gets the author's username.
     */
    public String getAuthorUsername() {
        return authorUsername;
    }

    /**
     * Sets the author's username.
     */
    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    /**
     * Gets the URL of the author's avatar.
     */
    public String getAuthorAvatarUrl() {
        return authorAvatarUrl;
    }

    /**
     * Sets the URL of the author's avatar.
     */
    public void setAuthorAvatarUrl(String authorAvatarUrl) {
        this.authorAvatarUrl = authorAvatarUrl;
    }

    /**
     * Gets the list of tags.
     */
    public List<String> getTags() {
        return tags;
    }

    /**
     * Sets the list of tags.
     */
    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    /**
     * Gets the list of user IDs who upvoted the question.
     */
    public List<String> getUpvoteUserIds() {
        return upvoteUserIds;
    }

    /**
     * Sets the list of user IDs who upvoted the question.
     */
    public void setUpvoteUserIds(List<String> upvoteUserIds) {
        this.upvoteUserIds = upvoteUserIds;
    }

    /**
     * Gets the list of user IDs who downvoted the question.
     */
    public List<String> getDownvoteUserIds() {
        return downvoteUserIds;
    }

    /**
     * Sets the list of user IDs who downvoted the question.
     */
    public void setDownvoteUserIds(List<String> downvoteUserIds) {
        this.downvoteUserIds = downvoteUserIds;
    }

    /**
     * Gets the list of comment IDs.
     */
    public List<String> getCommentIds() {
        return commentIds;
    }

    /**
     * Sets the list of comment IDs.
     */
    public void setCommentIds(List<String> commentIds) {
        this.commentIds = commentIds;
    }

    /**
     * Gets the creation timestamp.
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets the creation timestamp.
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Gets the last updated timestamp.
     */
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Sets the last updated timestamp.
     */
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Checks if the question is flagged.
     */
    public boolean isFlagged() {
        return isFlagged;
    }

    /**
     * Sets the flagged status of the question.
     */
    public void setFlagged(boolean flagged) {
        this.isFlagged = flagged;
    }

    /**
     * Gets the number of views.
     */
    public int getViews() {
        return views;
    }

    /**
     * Sets the number of views.
     */
    public void setViews(int views) {
        this.views = views;
    }

    /**
     * Checks if the question is pinned.
     */
    public boolean isPinned() {
        return isPinned;
    }

    /**
     * Sets the pinned status of the question.
     */
    public void setPinned(boolean pinned) {
        this.isPinned = pinned;
    }
}