package com.nexora.server.service.learningplan;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nexora.server.model.learningplan.LearningPlan;
import com.nexora.server.repository.learningplan.LearningPlanRepository;

@Service
public class PlanService {

    @Autowired
    private LearningPlanRepository repo;

    public List<LearningPlan> getPlans(String userId) {
        return repo.findByUserId(userId);
    }

    public LearningPlan createPlan(LearningPlan plan) {
        return repo.save(plan);
    }

    public LearningPlan updateProgress(String planId, String recipeName, boolean done) {
        LearningPlan plan = repo.findById(planId).orElseThrow();
        plan.getProgress().stream()
            .filter(r -> r.getName().equals(recipeName))
            .findFirst()
            .ifPresent(r -> r.setCompleted(done));
        return repo.save(plan);
    }

    public void deletePlan(String planId) {
        repo.deleteById(planId);
    }
}
