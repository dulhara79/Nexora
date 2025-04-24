package com.nexora.server.repository.forum;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.nexora.server.model.forum.ForumComment;

import java.util.List;

@Repository
public interface ForumCommentRepository extends MongoRepository<ForumComment, String> {
    List<ForumComment> findByQuestionId(String questionId);
    List<ForumComment> findByParentCommentId(String parentCommentId);
    List<ForumComment> findByIsFlaggedTrue();
}