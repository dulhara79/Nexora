package com.nexora.server.repository;

import com.nexora.server.model.Tag;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends MongoRepository<Tag, String> {
    Tag findByName(String name);
}