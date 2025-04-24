// package com.nexora.server.service;

// import com.nexora.server.model.Cuisine;
// import com.nexora.server.model.LearningPlan;
// import com.nexora.server.model.Recipe;
// import com.nexora.server.repository.LearningPlanRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import java.time.LocalDateTime;
// import java.util.*;

// @Service
// public class LearningPlanService {

//     @Autowired
//     private LearningPlanRepository learningPlanRepository;

//     // Create a new learning plan for a given user and level
//     public LearningPlan createLearningPlan(String userId, String level) {
//         LearningPlan plan = new LearningPlan();
//         plan.setUserId(userId);
//         plan.setLevel(level);
//         plan.setCreatedAt(LocalDateTime.now());

//         // Prepopulate with 3 cuisines based on level. Here, we demonstrate for beginner.
//         List<Cuisine> cuisines = new ArrayList<>();
//         if (level.equalsIgnoreCase("beginner")) {
//             cuisines.add(generateCuisine("Indian Beginner", Arrays.asList("Masala Dosa", "Poha", "Idli", "Sambar", "Chutney")));
//             cuisines.add(generateCuisine("Chinese Beginner", Arrays.asList("Fried Rice", "Spring Rolls", "Manchurian", "Dumplings", "Noodles")));
//             cuisines.add(generateCuisine("Italian Beginner", Arrays.asList("Bruschetta", "Caprese Salad", "Pasta Pomodoro", "Margherita Pizza", "Tiramisu")));
//         } 
//         // For intermediate and advanced, add or modify recipes as needed.

//         plan.setCuisines(cuisines);
//         plan.setOverallProgress(0);  // Initially 0% progress
//         return learningPlanRepository.save(plan);
//     }

//     // Helper method to generate a Cuisine with 5 recipes
//     private Cuisine generateCuisine(String cuisineName, List<String> recipeNames) {
//         Cuisine cuisine = new Cuisine();
//         cuisine.setName(cuisineName);
//         List<Recipe> recipes = new ArrayList<>();
//         int order = 1;
//         for (String recipeName : recipeNames) {
//             Recipe recipe = new Recipe();
//             recipe.setName(recipeName);
//             recipe.setOrder(order++);
//             recipe.setCompleted(false);
//             recipes.add(recipe);
//         }
//         cuisine.setRecipes(recipes);
//         cuisine.setProgress(0);
//         return cuisine;
//     }

//     // Update a recipe's completion status; recalc progress for the cuisine and overall plan
//     public LearningPlan updateRecipeProgress(String planId, String cuisineId, String recipeId, boolean completed) throws Exception {
//         Optional<LearningPlan> optionalPlan = learningPlanRepository.findById(planId);
//         if (!optionalPlan.isPresent()) {
//             throw new Exception("Learning plan not found");
//         }
//         LearningPlan plan = optionalPlan.get();
//         double totalProgress = 0;

//         // Loop over cuisines to update the specific recipe and recalc cuisine progress
//         for (Cuisine cuisine : plan.getCuisines()) {
//             if (cuisine.getId().equals(cuisineId)) {
//                 // Update the specific recipe completion status
//                 for (Recipe recipe : cuisine.getRecipes()) {
//                     if (recipe.getId().equals(recipeId)) {
//                         recipe.setCompleted(completed);
//                     }
//                 }
//                 // Calculate cuisine progress: (number of completed recipes / total recipes) * 100
//                 long completedCount = cuisine.getRecipes().stream().filter(Recipe::isCompleted).count();
//                 cuisine.setProgress((completedCount * 100.0) / cuisine.getRecipes().size());
//             }
//             totalProgress += cuisine.getProgress();
//         }
//         // Overall progress is the average progress over all cuisines
//         plan.setOverallProgress(totalProgress / plan.getCuisines().size());
//         return learningPlanRepository.save(plan);
//     }

//     // Retrieve a learning plan by its ID
//     public LearningPlan getLearningPlan(String planId) throws Exception {
//         return learningPlanRepository.findById(planId)
//                 .orElseThrow(() -> new Exception("Learning plan not found"));
//     }
// }
