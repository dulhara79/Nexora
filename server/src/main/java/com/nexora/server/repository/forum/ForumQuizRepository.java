package com.nexora.server.repository.forum;

import com.nexora.server.model.forum.ForumQuiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ForumQuizRepository extends MongoRepository<ForumQuiz, String> {
    List<ForumQuiz> findByIsActiveTrue();
    List<ForumQuiz> findByAuthorId(String authorId);
    List<ForumQuiz> findByDeadlineBeforeAndIsActiveTrue(LocalDateTime deadline);
}