package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.UserPlan;
import com.nexora.server.repository.learningplan.UserPlanRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learningplan")
public class UserPlanController {
    private final UserPlanRepository repo;
    public UserPlanController(UserPlanRepository repo) { this.repo=repo; }

    // 1. Get all plans for user
    @GetMapping
    public List<UserPlan> getPlans(@RequestParam String userId) {
        return repo.findByUserId(userId);
    }

    // 2. Add a cuisine to plan
    @PostMapping
    public UserPlan addPlan(@RequestBody UserPlan plan) {
        return repo.save(plan);
    }

    // 3. Remove a recipe from a cuisine in plan
    @PatchMapping("/{planId}/recipes")
    public UserPlan updateRecipes(
        @PathVariable String planId,
        @RequestBody List<String> keepRecipes
    ) {
        UserPlan p=repo.findById(planId).orElseThrow();
        p.setRecipes(p.getRecipes()
            .stream()
            .filter(r->keepRecipes.contains(r.getName()))
            .toList());
        return repo.save(p);
    }

    // 4. Delete a cuisine entirely
    @DeleteMapping("/{planId}")
    public void deletePlan(@PathVariable String planId) {
        repo.deleteById(planId);
    }
}
