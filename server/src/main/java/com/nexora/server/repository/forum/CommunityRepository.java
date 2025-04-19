package com.nexora.server.repository.forum;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.nexora.server.model.forum.Community;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
}