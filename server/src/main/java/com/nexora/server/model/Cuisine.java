package com.nexora.server.model;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class Cuisine {
    private String id = UUID.randomUUID().toString();   // Unique ID for the cuisine (generated)
    private String name;                                  // e.g., "Indian Beginner"
    private List<Recipe> recipes;                         // 5 recipes for this cuisine
    private double progress;                              // Percentage progress for this cuisine
}
