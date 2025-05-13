package com.nexora.server.repository.post;

import com.nexora.server.model.post.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findBySavedByContaining(String userId);
}