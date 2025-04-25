package com.nexora.server.repository.post;

import com.nexora.server.model.post.Notification;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserId(String userId, Sort sort);

    // Retain the original method for compatibility
    List<Notification> findByUserId(String userId);
}