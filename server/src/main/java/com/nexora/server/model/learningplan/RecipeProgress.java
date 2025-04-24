package com.nexora.server.model.learningplan;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeProgress {
    private String name;
    private boolean completed;
}
