package com.nexora.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "questions")
public class Question {
    @Id
    private String id;

    private String title;
    private String description;
    private String authorId; // References User.id
    private List<String> tags = new ArrayList<>();
    private List<String> upvoteUserIds = new ArrayList<>();
    private List<String> downvoteUserIds = new ArrayList<>();
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private boolean isFlagged = false;
}