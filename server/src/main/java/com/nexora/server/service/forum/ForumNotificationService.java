package com.nexora.server.service.forum;

import com.nexora.server.model.forum.ForumNotification;
import com.nexora.server.repository.forum.ForumNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;

/**
 * Service for managing forum notifications, including creation, retrieval,
 * marking as read, and sending real-time updates via WebSocket.
 */
@Service
public class ForumNotificationService {
    private static final Logger LOGGER = Logger.getLogger(ForumNotificationService.class.getName());

    @Autowired
    private ForumNotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Retrieves all unread notifications for a given user.
     *
     * @param userId the ID of the user
     * @return list of unread ForumNotification objects
     */
    public List<ForumNotification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    /**
     * Marks a specific notification as read and sends a WebSocket update to the user.
     *
     * @param notificationId the ID of the notification to mark as read
     */
    public void markNotificationAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
            try {
                // Send updated notification to the user via WebSocket
                messagingTemplate.convertAndSendToUser(
                        notification.getUserId(),
                        "/queue/notifications",
                        notification);
            } catch (Exception e) {
                LOGGER.severe("Failed to send WebSocket notification to user: " + notification.getUserId() + ", error: " + e.getMessage());
            }
        });
    }

    /**
     * Marks all unread notifications for a user as read and sends WebSocket updates.
     *
     * @param userId the ID of the user
     */
    public void markAllAsRead(String userId) {
        List<ForumNotification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
            try {
                // Send updated notification to the user via WebSocket
                messagingTemplate.convertAndSendToUser(
                        notification.getUserId(),
                        "/queue/notifications",
                        notification);
            } catch (Exception e) {
                LOGGER.severe("Failed to send WebSocket notification to user: " + notification.getUserId() + ", error: " + e.getMessage());
            }
        });
    }

    /**
     * Creates a new notification for a user, with deduplication logic to avoid
     * sending similar notifications within a 5-minute window. Sends the notification
     * via WebSocket if created.
     *
     * @param notification the ForumNotification to create
     */
    public void createNotification(ForumNotification notification) {
        // Deduplication: Check for similar notifications in the last 5 minutes
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
                // Send new notification to the user via WebSocket
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