package com.nexora.server.service.post;

import com.nexora.server.model.post.Notification;
import com.nexora.server.repository.post.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getNotifications(String userId) {
        return notificationRepository.findByUserId(userId);
    }
}