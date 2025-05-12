package com.nexora.server.service.forum;

import com.nexora.server.model.forum.ForumNotification;
import com.nexora.server.repository.forum.ForumNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

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
            // Notify client of updated notification status
            messagingTemplate.convertAndSendToUser(
                notification.getUserId(),
                "/queue/notifications",
                notification
            );
        });
    }

    public void createNotification(ForumNotification notification) {
        notificationRepository.save(notification);
        // Send real-time notification to the user
        messagingTemplate.convertAndSendToUser(
            notification.getUserId(),
            "/queue/notifications",
            notification
        );
    }
}