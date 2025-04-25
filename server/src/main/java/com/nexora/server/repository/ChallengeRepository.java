package com.nexora.server.repository;

import com.nexora.server.model.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    // Custom queries can be added if needed
}