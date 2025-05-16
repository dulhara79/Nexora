package com.nexora.server.service.forum;

import com.nexora.server.model.forum.ForumNotification;
import com.nexora.server.repository.forum.ForumNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;

@Service
public class ForumNotificationService {
    private static final Logger LOGGER = Logger.getLogger(ForumNotificationService.class.getName());

    @Autowired
    private ForumNotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<ForumNotification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    public void markNotificationAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
            try {
                messagingTemplate.convertAndSendToUser(
                        notification.getUserId(),
                        "/queue/notifications",
                        notification);
            } catch (Exception e) {
                LOGGER.severe("Failed to send WebSocket notification to user: " + notification.getUserId() + ", error: " + e.getMessage());
            }
        });
    }

    public void markAllAsRead(String userId) {
        List<ForumNotification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
            try {
                messagingTemplate.convertAndSendToUser(
                        notification.getUserId(),
                        "/queue/notifications",
                        notification);
            } catch (Exception e) {
                LOGGER.severe("Failed to send WebSocket notification to user: " + notification.getUserId() + ", error: " + e.getMessage());
            }
        });
    }

    public void createNotification(ForumNotification notification) {
        // Deduplication logic: Check if a similar notification exists within the last 5 minutes
        List<ForumNotification> recentNotifications = notificationRepository
                .findByUserIdAndTypeAndRelatedQuestionIdAndRelatedCommentIdAndRelatedQuizIdAndCreatedAtAfter(
                        notification.getUserId(),
                        notification.getType(),
                        notification.getRelatedQuestionId(),
                        notification.getRelatedCommentId(),
                        notification.getRelatedQuizId(),
                        LocalDateTime.now().minusMinutes(5));
        if (recentNotifications.isEmpty()) {
            notification.setCreatedAt(LocalDateTime.now());
            ForumNotification savedNotification = notificationRepository.save(notification);
            LOGGER.info("Notification created for user: " + notification.getUserId() + ", type: " + notification.getType());
            try {
                messagingTemplate.convertAndSendToUser(
                        notification.getUserId(),
                        "/queue/notifications",
                        savedNotification);
            } catch (Exception e) {
                LOGGER.severe("Failed to send WebSocket notification to user: " + notification.getUserId() + ", error: " + e.getMessage());
            }
        } else {
            LOGGER.info("Duplicate notification skipped for user: " + notification.getUserId() + ", type: " + notification.getType());
        }
    }
}