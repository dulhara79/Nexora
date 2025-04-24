// package com.nexora.server.controller;

// import com.nexora.server.model.LearningPlan;
// import com.nexora.server.service.LearningPlanService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/learning-plans")
// public class LearningPlanController {

//     @Autowired
//     private LearningPlanService learningPlanService;

//     // Endpoint to create a new learning plan
//     @PostMapping
//     public ResponseEntity<?> createPlan(@RequestParam String level, @RequestParam String userId) {
//         try {
//             // In a real setup, you would extract userId from the session or token
//             LearningPlan plan = learningPlanService.createLearningPlan(userId, level);
//             return ResponseEntity.ok(plan);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     // Endpoint to get a learning plan by ID
//     @GetMapping("/{planId}")
//     public ResponseEntity<?> getPlan(@PathVariable String planId) {
//         try {
//             LearningPlan plan = learningPlanService.getLearningPlan(planId);
//             return ResponseEntity.ok(plan);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     // Endpoint to update recipe progress (mark a recipe as completed/incomplete)
//     @PutMapping("/{planId}/cuisines/{cuisineId}/recipes/{recipeId}")
//     public ResponseEntity<?> updateRecipe(@PathVariable String planId,
//                                           @PathVariable String cuisineId,
//                                           @PathVariable String recipeId,
//                                           @RequestParam boolean completed) {
//         try {
//             LearningPlan plan = learningPlanService.updateRecipeProgress(planId, cuisineId, recipeId, completed);
//             return ResponseEntity.ok(plan);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }
// }
