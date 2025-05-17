package com.nexora.server.model.forum;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a comment in the forum, which can be a top-level comment or a reply to another comment.
 */
@Data
@Document(collection = "forum_comments")
public class ForumComment {
    @Id
    private String id; // Unique identifier for the comment

    private String questionId; // References the associated Question's id
    private String authorId; // References the User's id who wrote the comment
    private String authorName; // Optional: Name of the author (can be fetched from User service)
    private String authorAvatarUrl; // Optional: Avatar URL of the author (can be fetched from User service)
    private String content; // The actual text content of the comment
    private String parentCommentId; // For threaded replies; null if this is a top-level comment

    private List<String> upvoteUserIds = new ArrayList<>(); // List of user IDs who upvoted this comment
    private List<String> downvoteUserIds = new ArrayList<>(); // List of user IDs who downvoted this comment

    private LocalDateTime createdAt = LocalDateTime.now(); // Timestamp when the comment was created
    private LocalDateTime updatedAt; // Timestamp when the comment was last updated

    private boolean isFlagged = false; // Indicates if the comment has been flagged for moderation

    // Getter and setter for isFlagged
    public boolean isFlagged() {
        return isFlagged;
    }

    public void setFlagged(boolean flagged) {
        isFlagged = flagged;
    }

    // Getter and setter for id
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    // Getter and setter for questionId
    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    // Getter and setter for authorId
    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    // Getter and setter for authorName
    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    // Getter and setter for authorAvatarUrl
    public String getAuthorAvatarUrl() {
        return authorAvatarUrl;
    }

    public void setAuthorAvatarUrl(String authorAvatarUrl) {
        this.authorAvatarUrl = authorAvatarUrl;
    }

    // Getter and setter for content
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    // Getter and setter for parentCommentId
    public String getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(String parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    // Getter and setter for upvoteUserIds
    public List<String> getUpvoteUserIds() {
        return upvoteUserIds;
    }

    public void setUpvoteUserIds(List<String> upvoteUserIds) {
        this.upvoteUserIds = upvoteUserIds;
    }

    // Getter and setter for downvoteUserIds
    public List<String> getDownvoteUserIds() {
        return downvoteUserIds;
    }

    public void setDownvoteUserIds(List<String> downvoteUserIds) {
        this.downvoteUserIds = downvoteUserIds;
    }

    // Getter and setter for createdAt
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Getter and setter for updatedAt
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}