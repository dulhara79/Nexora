package com.nexora.server.model.forum;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "forum_notifications")
public class Notification {
    @Id
    private String id;

    private String userId; // Recipient User.id
    private String message; // e.g., "User X commented on your question"
    private String relatedQuestionId;
    private String relatedCommentId;
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}