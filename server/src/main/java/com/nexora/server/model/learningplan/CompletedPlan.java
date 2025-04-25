// src/main/java/com/nexora/server/model/learningplan/CompletedPlan.java
package com.nexora.server.model.learningplan;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Document(collection = "completedPlans")
public class CompletedPlan {
    @Id
    private String id;

    private String userId;
    private String cuisineName;
    private List<Recipe> recipes;
    private Instant completedAt;

    // --- getters & setters ---

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCuisineName() {
        return cuisineName;
    }
    public void setCuisineName(String cuisineName) {
        this.cuisineName = cuisineName;
    }

    public List<Recipe> getRecipes() {
        return recipes;
    }
    public void setRecipes(List<Recipe> recipes) {
        this.recipes = recipes;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }
    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}
