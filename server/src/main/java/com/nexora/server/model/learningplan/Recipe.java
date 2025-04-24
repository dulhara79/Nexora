package com.nexora.server.model.learningplan;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {
    private String name;
    private String time;
    private String image;
    private List<String> ingredients;
    private String method;
}
