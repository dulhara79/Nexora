package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumNotification;
import com.nexora.server.service.AuthenticationService;
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

    @Autowired
    private AuthenticationService authenticationService;

    // @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    // public ResponseEntity<?>
    // getUnreadNotifications(@RequestHeader("Authorization") String authHeader) {
    // String userId = extractUserIdFromToken(authHeader);
    // if (userId == null) {
    // return ResponseEntity.status(401)
    // .header(HttpHeaders.CACHE_CONTROL, "no-store")
    // .body(createErrorResponse("Unauthorized"));
    // }
    // List<ForumNotification> notifications =
    // notificationService.getUnreadNotifications(userId);
    // Map<String, Object> response = new HashMap<>();
    // response.put("notifications", notifications);
    // response.put("_links", Map.of("self", "/api/forum/notifications"));
    // return ResponseEntity.ok()
    // .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
    // .body(response);
    // }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUnreadNotifications(@RequestHeader("Authorization") String authHeader) {
        System.out.println("Received Authorization header: " + authHeader);
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            System.out.println("Failed to extract userId from token");
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        System.out.println("Fetched notifications for userId: " + userId);
        List<ForumNotification> notifications = notificationService.getUnreadNotifications(userId);
        Map<String, Object> response = new HashMap<>();
        response.put("notifications", notifications);
        response.put("_links", Map.of("self", "/api/forum/notifications"));
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(response);
    }

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

    @PostMapping(value = "/mark-all-read", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> markAllNotificationsAsRead(@RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            notificationService.markAllAsRead(userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/forum/notifications");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "All notifications marked as read");
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

    private String extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        try {
            return authenticationService.validateJwtToken(token).getId();
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