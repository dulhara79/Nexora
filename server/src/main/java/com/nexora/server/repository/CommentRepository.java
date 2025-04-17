package com.nexora.server.repository;

import com.nexora.server.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByQuestionId(String questionId);
    List<Comment> findByParentCommentId(String parentCommentId);
    List<Comment> findByIsFlaggedTrue();
}