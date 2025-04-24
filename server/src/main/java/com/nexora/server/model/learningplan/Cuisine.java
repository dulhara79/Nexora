package com.nexora.server.model.learningplan;

import java.util.List;

import lombok.Data;

@Data
public class Cuisine {
    private final String name;
    private final String description;
    private final String image;
    private final List<Recipe> recipes;
}
