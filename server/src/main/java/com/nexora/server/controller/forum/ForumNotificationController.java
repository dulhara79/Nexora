package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumNotification;
import com.nexora.server.service.forum.ForumNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forum/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ForumNotificationController {

    @Autowired
    private ForumNotificationService notificationService;

    // Changed: Removed HttpSession, use JWT token; added Cache-Control
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUnreadNotifications(@RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        List<ForumNotification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                .body(notifications);
    }

    // Changed: Added HATEOAS links, no-store header
    @PostMapping(value = "/{id}/read", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> markNotificationAsRead(@PathVariable String id) {
        try {
            notificationService.markNotificationAsRead(id);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/forum/notifications/" + id);
            links.put("notifications", "/api/forum/notifications");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notification marked as read");
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Helper method to extract userId from JWT
    private String extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        try {
            return token; // Placeholder
        } catch (Exception e) {
            return null;
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}