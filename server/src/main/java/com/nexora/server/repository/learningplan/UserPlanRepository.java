package com.nexora.server.repository.learningplan;

import com.nexora.server.model.learningplan.UserPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UserPlanRepository extends MongoRepository<UserPlan,String> {
    List<UserPlan> findByUserId(String userId);
}
