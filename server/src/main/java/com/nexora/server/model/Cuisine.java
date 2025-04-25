package com.nexora.server.model;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class Cuisine {
    private String id = UUID.randomUUID().toString();   // Unique ID for the cuisine (generated)
    private String name;                                  // e.g., "Indian Beginner"
    private List<Recipe> recipes;                         // 5 recipes for this cuisine
    private double progress;      
    
    // Percentage progress for this cuisine
    public double getProgress() {
        return progress;
    }

    public void setProgress(double progress) {
        this.progress = progress;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Recipe> getRecipes() {
        return recipes;
    }

    public void setRecipes(List<Recipe> recipes) {
        this.recipes = recipes;
    }
}
