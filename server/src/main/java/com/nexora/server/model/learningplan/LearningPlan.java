package com.nexora.server.model.learningplan;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningPlan {
    @Id
    private String id;
    private String userId;
    private String level; // beginner|intermediate|advanced
    private String cuisineName;
    private List<RecipeProgress> progress;
}
