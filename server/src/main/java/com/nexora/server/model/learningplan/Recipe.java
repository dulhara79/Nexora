package com.nexora.server.model.learningplan;

import lombok.Data;
import java.util.List;

@Data
public class Recipe {
    private String name;
    private String time;
    private String image;
    private List<String> ingredients;
    private String method;

    // ← NEW FIELD
    private Boolean isDone = false;

    // getters & setters for all fields:
    public String getName() { return name; }
    public void setName(String n) { this.name = n; }
    // ... time, image, ingredients, method ...

    public Boolean getIsDone() { return isDone; }
    public void setIsDone(Boolean done) { this.isDone = done; }
}
