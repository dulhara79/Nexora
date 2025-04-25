package com.nexora.server.model.post;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "sposts")
public class Post {
    @Id
    private String id;
    private String userId;
    private String userName;
    private String description;
    private List<Media> media = new ArrayList<>();
    private List<String> likes = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>(); // Add comments field
    private LocalDateTime createdAt;

    // Embedded Comment class
    @Data
    public static class Comment {
        private String id;
        private String userId;
        private String name;
        private String text;
        private LocalDateTime createdAt;
    }

    // Embedded Media class (already exists, included for completeness)
    @Data
    public static class Media {
        private String fileName;
        private String fileUrl;
        private String fileType;
    }
}