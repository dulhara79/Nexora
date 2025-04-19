package com.nexora.server.model.forum;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "forum_comments")
public class Comment {
    @Id
    private String id;

    private String questionId; // References Question.id
    private String authorId; // References User.id
    private String authorName; // Optional: can be fetched from User service
    private String content;
    private String parentCommentId; // For threaded replies (null for top-level comments)
    private List<String> upvoteUserIds = new ArrayList<>();
    private List<String> downvoteUserIds = new ArrayList<>();
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private boolean isFlagged = false;
}