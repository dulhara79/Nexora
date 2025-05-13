package com.nexora.server.service.forum;

import com.nexora.server.model.forum.ForumNotification;
import com.nexora.server.repository.forum.ForumNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ForumNotificationService {

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
            messagingTemplate.convertAndSendToUser(
                    notification.getUserId(),
                    "/queue/notifications",
                    notification);
        });
    }

    public void markAllAsRead(String userId) {
        List<ForumNotification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
            messagingTemplate.convertAndSendToUser(
                    notification.getUserId(),
                    "/queue/notifications",
                    notification);
        });
    }

    public void createNotification(ForumNotification notification) {
        // Deduplication logic: Check if a similar notification exists within the last 5
        // minutes
        List<ForumNotification> recentNotifications = notificationRepository
                .findByUserIdAndTypeAndRelatedQuestionIdAndRelatedCommentIdAndCreatedAtAfter(
                        notification.getUserId(),
                        notification.getType(),
                        notification.getRelatedQuestionId(),
                        notification.getRelatedCommentId(),
                        LocalDateTime.now().minusMinutes(5));
        if (recentNotifications.isEmpty()) {
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
            messagingTemplate.convertAndSendToUser(
                    notification.getUserId(),
                    "/queue/notifications",
                    notification);
        }
    }
}