package com.nexora.server.repository.forum;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.nexora.server.model.forum.Tag;

@Repository
public interface TagRepository extends MongoRepository<Tag, String> {
    Tag findByName(String name);
}