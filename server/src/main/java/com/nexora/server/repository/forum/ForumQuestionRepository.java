package com.nexora.server.repository.forum;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.nexora.server.model.forum.ForumQuestion;

import java.util.List;

@Repository
public interface ForumQuestionRepository extends MongoRepository<ForumQuestion, String> {
    List<ForumQuestion> findByTagsIn(List<String> tags); // Updated to search by tag names

    List<ForumQuestion> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    List<ForumQuestion> findByIsFlaggedTrue();

    List<ForumQuestion> findByUpvoteUserIdsContaining(String userId);
}