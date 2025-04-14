package com.nexora.server.model;

import lombok.Data;
import java.util.UUID;

@Data
public class Recipe {
    private String id = UUID.randomUUID().toString();   // Unique ID for the recipe
    private String name;                                  // e.g., "Masala Dosa"
    private int order;                                    // Order from easiest (1) to hardest (5)
    private boolean isCompleted;                          // Whether the recipe is marked complete
}
