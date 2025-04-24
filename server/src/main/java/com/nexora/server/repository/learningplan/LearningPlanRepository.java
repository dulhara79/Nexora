package com.nexora.server.repository.learningplan;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.nexora.server.model.learningplan.LearningPlan;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
  List<LearningPlan> findByUserId(String userId);
  Optional<LearningPlan> findByUserIdAndCuisineName(String userId, String cuisineName);
}


