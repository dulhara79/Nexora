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
}
