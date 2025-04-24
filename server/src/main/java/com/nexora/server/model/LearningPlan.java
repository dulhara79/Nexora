// package com.nexora.server.model;

// import lombok.Data;
// import org.springframework.data.annotation.Id;
// import org.springframework.data.mongodb.core.mapping.Document;
// import java.time.LocalDateTime;
// import java.util.List;

// @Data
// @Document(collection = "learning_plans")
// public class LearningPlan {
//     @Id
//     private String id;
//     private String userId;               // ID of the user who created the plan
//     private String level;                // e.g., "beginner", "intermediate", "advanced"
//     private List<Cuisine> cuisines;      // List of cuisines (each with recipes)
//     private double overallProgress;      // Overall progress percentage (computed)
//     private LocalDateTime createdAt;     // When the plan was created
// }

