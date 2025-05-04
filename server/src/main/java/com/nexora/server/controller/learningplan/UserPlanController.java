// package com.nexora.server.controller.learningplan;

// import com.nexora.server.model.learningplan.UserPlan;
// import com.nexora.server.model.learningplan.CompletedPlan;
// import com.nexora.server.repository.learningplan.UserPlanRepository;
// import com.nexora.server.repository.learningplan.CompletedPlanRepository;

// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.server.ResponseStatusException;
// import org.springframework.http.HttpStatus;

// import java.time.Instant;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/learningplan")
// @CrossOrigin(
//   origins = "http://localhost:5173",
//   allowedHeaders = "*",
//   methods = {
//     RequestMethod.GET,
//     RequestMethod.POST,
//     RequestMethod.PUT,
//     RequestMethod.DELETE,
//     RequestMethod.OPTIONS
//   },
//   allowCredentials = "true"
// )
// public class UserPlanController {

//     private final UserPlanRepository userPlanRepository;
//     private final CompletedPlanRepository completedPlanRepository;

//     public UserPlanController(UserPlanRepository userPlanRepository,
//                               CompletedPlanRepository completedPlanRepository) {
//         this.userPlanRepository       = userPlanRepository;
//         this.completedPlanRepository  = completedPlanRepository;
//     }

//     // 1. Get all plans for user
//     @GetMapping
//     public List<UserPlan> getPlans(@RequestParam String userId) {
//         return userPlanRepository.findByUserId(userId);
//     }

//     // 2. Add a cuisine to plan
//     @PostMapping
//     public UserPlan addPlan(@RequestBody UserPlan plan) {
//         return userPlanRepository.save(plan);
//     }

//     // 3. Delete a cuisine entirely
//     @DeleteMapping("/{planId}")
//     public void deletePlan(@PathVariable String planId) {
//         userPlanRepository.deleteById(planId);
//     }

//     // 4. Replace the recipes on a plan (full list) — your existing PUT /{planId}/recipes
//     @PutMapping("/{planId}/recipes")
//     public UserPlan updatePlanRecipes(
//         @PathVariable String planId,
//         @RequestBody List<String> keepRecipeNames
//     ) {
//         UserPlan plan = userPlanRepository.findById(planId)
//             .orElseThrow(() -> new ResponseStatusException(
//                 HttpStatus.NOT_FOUND, "Plan not found: " + planId
//             ));

//         plan.setRecipes(
//           plan.getRecipes()
//               .stream()
//               .filter(r -> keepRecipeNames.contains(r.getName()))
//               .collect(Collectors.toList())
//         );
//         return userPlanRepository.save(plan);
//     }

//     /**
//      * 5. Toggle a single recipe's done‐status.
//      *    If, after toggling, **all** recipes are done, we:
//      *      • move this plan into CompletedPlanRepository, and
//      *      • delete it from UserPlanRepository
//      */
//     @PutMapping("/{planId}/recipe/{recipeName}")
//     public UserPlan toggleRecipeDone(
//         @PathVariable String planId,
//         @PathVariable String recipeName,
//         @RequestBody Map<String, Boolean> payload
//     ) {
//         boolean isDone = payload.getOrDefault("isDone", false);

//         UserPlan plan = userPlanRepository.findById(planId)
//             .orElseThrow(() -> new ResponseStatusException(
//                 HttpStatus.NOT_FOUND, "Plan not found: " + planId
//             ));

//         // 1) mark that one recipe
//         plan.getRecipes().stream()
//             .filter(r -> r.getName().equals(recipeName))
//             .findFirst()
//             .ifPresent(r -> r.setIsDone(isDone));

//         // 2) check if **all** recipes are done
//         boolean allDone = plan.getRecipes().stream().allMatch(r -> Boolean.TRUE.equals(r.getIsDone()));
//         if (allDone) {
//             // create a CompletedPlan record
//             CompletedPlan completed = new CompletedPlan();
//             completed.setUserId(plan.getUserId());
//             completed.setCuisineName(plan.getCuisineName());
//             completed.setCompletedAt(Instant.now());
//             completedPlanRepository.save(completed);

//             // remove from ongoing plans
//             userPlanRepository.deleteById(planId);

//             // you could return null or throw 204, but we'll return the original plan for client cleanup
//             return plan;
//         }

//         // 3) otherwise save the updated plan back
//         return userPlanRepository.save(plan);
//     }
// }


// src/main/java/com/nexora/server/controller/learningplan/UserPlanController.java
package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.UserPlan;
import com.nexora.server.model.learningplan.CompletedPlan;
import com.nexora.server.repository.learningplan.UserPlanRepository;
import com.nexora.server.repository.learningplan.CompletedPlanRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
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

  private final UserPlanRepository userPlanRepo;
  private final CompletedPlanRepository completedRepo;

  public UserPlanController(
    UserPlanRepository userPlanRepo,
    CompletedPlanRepository completedRepo
  ) {
    this.userPlanRepo = userPlanRepo;
    this.completedRepo = completedRepo;
  }

  // existing: list, add, delete, updatePlanRecipes...
  @GetMapping
  public List<UserPlan> getPlans(@RequestParam String userId) {
    return userPlanRepo.findByUserId(userId);
  }

  @PostMapping
  public UserPlan addPlan(@RequestBody UserPlan plan) {
    return userPlanRepo.save(plan);
  }

  @DeleteMapping("/{planId}")
  public void deletePlan(@PathVariable String planId) {
    userPlanRepo.deleteById(planId);
  }

  @PutMapping("/{planId}/recipes")
  public UserPlan updatePlanRecipes(
    @PathVariable String planId,
    @RequestBody List<String> keepRecipeNames
  ) {
    UserPlan plan = userPlanRepo.findById(planId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    plan.setRecipes(
      plan.getRecipes()
          .stream()
          .filter(r -> keepRecipeNames.contains(r.getName()))
          .collect(Collectors.toList())
    );
    return userPlanRepo.save(plan);
  }

  /**
   * 5. New: flip one recipe’s isDone flag, then if *all* are done,
   *    archive into completedPlans + delete from UserPlan.
   */
  @PutMapping("/{planId}/recipe/{recipeName}")
  public void markRecipeDone(
    @PathVariable String planId,
    @PathVariable String recipeName,
    @RequestBody Map<String,Boolean> body
  ) {
    boolean isDone = body.getOrDefault("isDone", false);

    UserPlan plan = userPlanRepo.findById(planId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    // update the flag
    plan.getRecipes().forEach(r -> {
      if (r.getName().equals(recipeName)) {
        r.setIsDone(isDone);
      }
    });

    // if *all* done → archive
    boolean allDone = plan.getRecipes().stream().allMatch(r -> r.getIsDone());
    if (allDone) {
      // copy into a CompletedPlan
      CompletedPlan cp = new CompletedPlan();
      cp.setUserId(plan.getUserId());
      cp.setCuisineName(plan.getCuisineName());
      cp.setRecipes(plan.getRecipes());
      cp.setCompletedAt(Instant.now());
      completedRepo.save(cp);
      userPlanRepo.deleteById(planId);
    } else {
      // otherwise just persist the updated flag
      userPlanRepo.save(plan);
    }
  }
}
