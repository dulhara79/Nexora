package com.nexora.server.model.learningplan;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "cuisines")
public class Cuisine {
    @Id
    private String id;
    private String name;
    private String level;           // "beginner"|"intermediate"|"advanced"
    private String description;
    private String image;
    private List<Recipe> recipes;
}
