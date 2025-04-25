// src/main/java/com/nexora/server/repository/learningplan/CompletedPlanRepository.java
package com.nexora.server.repository.learningplan;

import com.nexora.server.model.learningplan.CompletedPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CompletedPlanRepository
    extends MongoRepository<CompletedPlan, String> {
  List<CompletedPlan> findByUserId(String userId);
}
