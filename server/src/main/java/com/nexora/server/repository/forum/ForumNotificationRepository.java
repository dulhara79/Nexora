package com.nexora.server.repository.forum;

import com.nexora.server.model.forum.ForumNotification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ForumNotificationRepository extends MongoRepository<ForumNotification, String> {
    
    // Find unread notifications by user ID
    List<ForumNotification> findByUserIdAndIsReadFalse(String userId);
    
    // Find unread notifications by user ID with pagination
    List<ForumNotification> findByUserIdAndIsReadFalse(String userId, Pageable pageable);
    
    // Find all notifications by user ID (read or unread) with pagination
    List<ForumNotification> findByUserId(String userId, Pageable pageable);
    
    // Find notifications for deduplication (same user, type, question/comment, within time range)
    List<ForumNotification> findByUserIdAndTypeAndRelatedQuestionIdAndRelatedCommentIdAndRelatedQuizIdAndCreatedAtAfter(
        String userId, 
        String type, 
        String relatedQuestionId, 
        String relatedCommentId,
        String relatedQuizId,
        LocalDateTime createdAtAfter
    );
}