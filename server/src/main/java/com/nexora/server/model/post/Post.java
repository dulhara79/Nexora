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
    private List<Comment> comments = new ArrayList<>();
    private List<String> savedBy = new ArrayList<>(); // New field to track users who saved the post
    private LocalDateTime createdAt;

    @Data
    public static class Comment {
        private String id;
        private String userId;
        private String name;
        private String text;
        private LocalDateTime createdAt;
    }

    @Data
    public static class Media {
        private String fileName;
        private String fileUrl;
        private String fileType;
    }
}