package com.nexora.server.model.learningplan;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Document(collection="user_plans")
public class UserPlan {
    @Id
    private String id;
    private String userId;             // later tie to authenticated user
    private String cuisineName;
    private String level;
    private String description;
    private String image;
    private List<Recipe> recipes;
}
