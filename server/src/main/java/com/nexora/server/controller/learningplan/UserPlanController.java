// // src/main/java/com/nexora/server/controller/learningplan/UserPlanController.java
// package com.nexora.server.controller.learningplan;

// import com.nexora.server.model.learningplan.UserPlan;
// import com.nexora.server.model.learningplan.CompletedPlan;
// import com.nexora.server.repository.learningplan.UserPlanRepository;
// import com.nexora.server.repository.learningplan.CompletedPlanRepository;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.http.HttpStatus;
// import org.springframework.web.server.ResponseStatusException;
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

//   private final UserPlanRepository userPlanRepo;
//   private final CompletedPlanRepository completedRepo;

//   public UserPlanController(
//     UserPlanRepository userPlanRepo,
//     CompletedPlanRepository completedRepo
//   ) {
//     this.userPlanRepo = userPlanRepo;
//     this.completedRepo = completedRepo;
//   }

//   // existing: list, add, delete, updatePlanRecipes...
//   @GetMapping
//   public List<UserPlan> getPlans(@RequestParam String userId) {
//     return userPlanRepo.findByUserId(userId);
//   }

//   @PostMapping
//   public UserPlan addPlan(@RequestBody UserPlan plan) {
//     return userPlanRepo.save(plan);
//   }

//   @DeleteMapping("/{planId}")
//   public void deletePlan(@PathVariable String planId) {
//     userPlanRepo.deleteById(planId);
//   }

//   @PutMapping("/{planId}/recipes")
//   public UserPlan updatePlanRecipes(
//     @PathVariable String planId,
//     @RequestBody List<String> keepRecipeNames
//   ) {
//     UserPlan plan = userPlanRepo.findById(planId)
//       .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
//     plan.setRecipes(
//       plan.getRecipes()
//           .stream()
//           .filter(r -> keepRecipeNames.contains(r.getName()))
//           .collect(Collectors.toList())
//     );
//     return userPlanRepo.save(plan);
//   }

//   /**
//    * 5. New: flip one recipe’s isDone flag, then if *all* are done,
//    *    archive into completedPlans + delete from UserPlan.
//    */
//   @PutMapping("/{planId}/recipe/{recipeName}")
//   public void markRecipeDone(
//     @PathVariable String planId,
//     @PathVariable String recipeName,
//     @RequestBody Map<String,Boolean> body
//   ) {
//     boolean isDone = body.getOrDefault("isDone", false);

//     UserPlan plan = userPlanRepo.findById(planId)
//       .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

//     // update the flag
//     plan.getRecipes().forEach(r -> {
//       if (r.getName().equals(recipeName)) {
//         r.setIsDone(isDone);
//       }
//     });

//     // if *all* done → archive
//     boolean allDone = plan.getRecipes().stream().allMatch(r -> r.getIsDone());
//     if (allDone) {
//       // copy into a CompletedPlan
//       CompletedPlan cp = new CompletedPlan();
//       cp.setUserId(plan.getUserId());
//       cp.setCuisineName(plan.getCuisineName());
//       cp.setRecipes(plan.getRecipes());
//       cp.setCompletedAt(Instant.now());
//       completedRepo.save(cp);
//       userPlanRepo.deleteById(planId);
//     } else {
//       // otherwise just persist the updated flag
//       userPlanRepo.save(plan);
//     }
//   }
// }













//REST

// src/main/java/com/nexora/server/controller/learningplan/UserPlanController.java
package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.UserPlan;
import com.nexora.server.model.learningplan.CompletedPlan;
import com.nexora.server.repository.learningplan.UserPlanRepository;
import com.nexora.server.repository.learningplan.CompletedPlanRepository;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/users/{userId}/learning-plans")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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

    /**
     * GET /api/users/{userId}/learning-plans
     */
    @GetMapping(produces = "application/json")
    public ResponseEntity<List<UserPlan>> getPlans(@PathVariable String userId) {
        List<UserPlan> plans = userPlanRepo.findByUserId(userId);
        return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(300, TimeUnit.SECONDS).mustRevalidate())
            .body(plans);
    }

    /**
     * POST /api/users/{userId}/learning-plans
     */
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<UserPlan> createPlan(
        @PathVariable String userId,
        @RequestBody UserPlan plan
    ) {
        plan.setUserId(userId);
        UserPlan saved = userPlanRepo.save(plan);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(saved.getId())
            .toUri();

        return ResponseEntity.created(location)
            .cacheControl(CacheControl.noCache())
            .body(saved);
    }

    /**
     * DELETE /api/users/{userId}/learning-plans/{planId}
     */
    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> deletePlan(
        @PathVariable String userId,
        @PathVariable String planId
    ) {
        if (!userPlanRepo.existsById(planId)) {
            throw new ResponseStatusException(ResponseEntity.notFound().build().getStatusCode());
        }
        userPlanRepo.deleteById(planId);
        return ResponseEntity.noContent()
            .cacheControl(CacheControl.noCache())
            .build();
    }

    /**
     * PUT /api/users/{userId}/learning-plans/{planId}/recipes
     * full replace of recipe list
     */
    @PutMapping(path = "/{planId}/recipes", consumes = "application/json", produces = "application/json")
    public ResponseEntity<UserPlan> replaceRecipes(
        @PathVariable String userId,
        @PathVariable String planId,
        @RequestBody List<String> keepRecipeNames
    ) {
        UserPlan plan = userPlanRepo.findById(planId)
            .orElseThrow(() -> new ResponseStatusException(ResponseEntity.notFound().build().getStatusCode()));

        plan.setRecipes(
            plan.getRecipes().stream()
                .filter(r -> keepRecipeNames.contains(r.getName()))
                .toList()
        );
        UserPlan updated = userPlanRepo.save(plan);
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(updated);
    }

    /**
     * PATCH /api/users/{userId}/learning-plans/{planId}/recipes/{recipeName}
     * toggle one recipe’s isDone; archives plan if all done
     */
    @PatchMapping(path = "/{planId}/recipes/{recipeName}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<UserPlan> updateRecipeDone(
        @PathVariable String userId,
        @PathVariable String planId,
        @PathVariable String recipeName,
        @RequestBody Map<String, Boolean> body
    ) {
        boolean isDone = body.getOrDefault("isDone", false);

        UserPlan plan = userPlanRepo.findById(planId)
            .orElseThrow(() -> new ResponseStatusException(ResponseEntity.notFound().build().getStatusCode()));

        plan.getRecipes().stream()
            .filter(r -> r.getName().equals(recipeName))
            .forEach(r -> r.setIsDone(isDone));

        boolean allDone = plan.getRecipes().stream().allMatch(r -> Boolean.TRUE.equals(r.getIsDone()));
        if (allDone) {
            CompletedPlan cp = new CompletedPlan();
            cp.setUserId(plan.getUserId());
            cp.setCuisineName(plan.getCuisineName());
            cp.setRecipes(plan.getRecipes());
            cp.setCompletedAt(Instant.now());
            completedRepo.save(cp);
            userPlanRepo.deleteById(planId);
            // nothing to return—client should GET /completed-plans next
            return ResponseEntity.noContent()
                .cacheControl(CacheControl.noCache())
                .build();
        }

        UserPlan updated = userPlanRepo.save(plan);
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(updated);
    }
}
