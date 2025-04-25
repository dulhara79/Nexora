package com.nexora.server.model;

import lombok.Data;
import java.util.UUID;

@Data
public class Recipe {
    private String id = UUID.randomUUID().toString();   // Unique ID for the recipe
    private String name;                                  // e.g., "Masala Dosa"
    private int order;                                    // Order from easiest (1) to hardest (5)
    private boolean isCompleted;     
    
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

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean isCompleted) {
        this.isCompleted = isCompleted;
    }
}
