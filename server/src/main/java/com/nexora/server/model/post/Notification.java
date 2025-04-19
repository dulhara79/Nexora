package com.nexora.server.model.post;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "snotifications")
public class Notification {

    @Id
    private String id;
    private String userId; // Recipient of the notification
    private String name; // Name of the user who triggered the notification
    private String postId;
    private String type; // e.g., "LIKE", "COMMENT"
    private String message;
    private LocalDateTime createdAt;
}