package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumNotification;
import com.nexora.server.service.forum.ForumNotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api/forum/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ForumNotificationController {

    @Autowired
    private ForumNotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<ForumNotification>> getUnreadNotifications(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(null);
        }
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable String id) {
        try {
            notificationService.markNotificationAsRead(id);
            return ResponseEntity.ok("Notification marked as read");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}