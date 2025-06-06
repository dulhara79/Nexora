package com.nexora.server.repository.forum;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.nexora.server.model.forum.ForumTag;

@Repository
public interface ForumTagRepository extends MongoRepository<ForumTag, String> {
    ForumTag findByName(String name);
}