// src/main/java/com/nexora/server/controller/learningplan/CompletedPlanController.java
package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.CompletedPlan;
import com.nexora.server.repository.learningplan.CompletedPlanRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/completedplans")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CompletedPlanController {
  private final CompletedPlanRepository repo;
  public CompletedPlanController(CompletedPlanRepository repo) {
    this.repo = repo;
  }

  @GetMapping
  public List<CompletedPlan> getCompleted(@RequestParam String userId) {
    return repo.findByUserId(userId);
  }
}
