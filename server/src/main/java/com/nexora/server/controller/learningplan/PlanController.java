package com.nexora.server.controller.learningplan;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nexora.server.model.learningplan.LearningPlan;
import com.nexora.server.service.learningplan.PlanService;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

    @Autowired
    private PlanService svc;

    @GetMapping("/{userId}")
    public List<LearningPlan> getAll(@PathVariable String userId) {
        return svc.getPlans(userId);
    }

    @PostMapping
    public LearningPlan create(@RequestBody LearningPlan plan) {
        return svc.createPlan(plan);
    }

    @PutMapping("/{planId}/recipes/{recipeName}")
    public LearningPlan toggle(
            @PathVariable String planId,
            @PathVariable String recipeName,
            @RequestParam boolean done) {
        return svc.updateProgress(planId, recipeName, done);
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<?> delete(@PathVariable String planId) {
        svc.deletePlan(planId);
        return ResponseEntity.noContent().build();
    }
}
