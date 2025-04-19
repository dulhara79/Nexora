package com.nexora.server.repository.forum;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.nexora.server.model.forum.Question;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByTagsIn(List<String> tags); // Updated to search by tag names

    List<Question> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    List<Question> findByIsFlaggedTrue();
}