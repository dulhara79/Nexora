package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.UserPlan;
import com.nexora.server.repository.learningplan.UserPlanRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/learningplan")
@CrossOrigin(
  origins = "http://localhost:5173",
  allowedHeaders = "*",
  methods = {
    RequestMethod.GET,
    RequestMethod.POST,
    RequestMethod.PUT,
    RequestMethod.DELETE,
    RequestMethod.OPTIONS
  },
  allowCredentials = "true"
)
public class UserPlanController {

    private final UserPlanRepository userPlanRepository;

    public UserPlanController(UserPlanRepository userPlanRepository) {
        this.userPlanRepository = userPlanRepository;
    }

    // 1. Get all plans for user
    @GetMapping
    public List<UserPlan> getPlans(@RequestParam String userId) {
        return userPlanRepository.findByUserId(userId);
    }

    // 2. Add a cuisine to plan
    @PostMapping
    public UserPlan addPlan(@RequestBody UserPlan plan) {
        return userPlanRepository.save(plan);
    }

    // 3. Delete a cuisine entirely
    @DeleteMapping("/{planId}")
    public void deletePlan(@PathVariable String planId) {
        userPlanRepository.deleteById(planId);
    }

    /**
     * 4. Replace the recipes on a plan with exactly the list of recipe-names
     *    the user has chosen. Uses PUT to fully update the recipe list.
     */
    @PutMapping("/{planId}/recipes")
    public UserPlan updatePlanRecipes(
        @PathVariable String planId,
        @RequestBody List<String> keepRecipeNames
    ) {
        UserPlan plan = userPlanRepository.findById(planId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Plan not found: " + planId
            ));

        plan.setRecipes(
          plan.getRecipes()
              .stream()
              .filter(r -> keepRecipeNames.contains(r.getName()))
              .collect(Collectors.toList())
        );

        return userPlanRepository.save(plan);
    }
}
