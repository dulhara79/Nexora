package com.nexora.server.model.forum;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "forum_notifications")
@Data
public class ForumNotification {
    @Id
    private String id;

    private String userId; // Recipient User.id
    private String userName; // Recipient User.name
    private String message; // e.g., "John upvoted your comment"
    private String relatedQuestionId;
    private String relatedCommentId;
    private String type; // e.g., "COMMENT_VOTE", "QUESTION_VOTE", "COMMENT"
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}