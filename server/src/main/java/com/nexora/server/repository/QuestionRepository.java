package com.nexora.server.repository;

import com.nexora.server.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByTags(String tagId);
    List<Question> findByTagsContaining(String tag);
    List<Question> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<Question> findByIsFlaggedTrue();
}