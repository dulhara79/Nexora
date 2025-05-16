package com.nexora.server.controller.post;

import com.nexora.server.model.post.Notification;
import com.nexora.server.service.post.NotificationService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// REST controller for managing notifications, mapped to /api/notifications
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NotificationController {

    // Injects NotificationService for business logic
    @Autowired
    private NotificationService notificationService;

    // JWT secret for token verification
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Creates a SecretKey for JWT parsing
    private SecretKey getJwtSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // Extracts user ID from JWT token in Authorization header
    private String extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        try {
            return Jwts.parserBuilder()
                .setSigningKey(getJwtSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        } catch (Exception e) {
            System.err.println("Error parsing JWT: " + e.getMessage());
            return null;
        }
    }

    // Builds HATEOAS-style links for notification-related endpoints
    private List<Map<String, String>> buildNotificationLinks(String notificationId) {
        return Arrays.asList(
            Map.of("rel", "self", "href", "/api/notifications/" + notificationId),
            Map.of("rel", "mark-as-read", "href", "/api/notifications/" + notificationId + "/read"),
            Map.of("rel", "all-notifications", "href", "/api/notifications")
        );
    }

    // Endpoint: GET /api/notifications
    // Purpose: Retrieves all notifications for the authenticated user
    // Request: Authorization header (Bearer token)
    // Response: 200 OK with list of notifications and links, or 401/500 for errors
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getNotifications(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(List.of(Map.of("error", "User not authenticated")));
        }
        try {
            // Fetch notifications
            List<Notification> notifications = notificationService.getNotifications(userId);
            // Map notifications to response format with links
            List<Map<String, Object>> responseBody = notifications.stream().map(notification -> {
                Map<String, Object> notificationWithLinks = new HashMap<>();
                notificationWithLinks.put("notification", notification);
                notificationWithLinks.put("_links", buildNotificationLinks(notification.getId()));
                return notificationWithLinks;
            }).collect(Collectors.toList());

            // Set cache control to ensure fresh data
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + System.currentTimeMillis() + "\"");

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            System.err.println("Error fetching notifications for userId " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of(Map.of("error", "Error fetching notifications: " + e.getMessage())));
        }
    }

    // Endpoint: PUT /api/notifications/{notificationId}/read
    // Purpose: Marks a specific notification as read
    // Request: Path variable notificationId, Authorization header
    // Response: 200 OK with success message and links, or 401/403/404/500 for errors
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(
            @PathVariable String notificationId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }
        try {
            // Verify notification exists and belongs to user
            Notification notification = notificationService.getNotifications(userId).stream()
                    .filter(n -> n.getId().equals(notificationId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
            if (!notification.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Not authorized to mark this notification as read"));
            }
            // Mark notification as read
            notificationService.markAsRead(notificationId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

            // Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Notification marked as read");
            responseBody.put("_links", buildNotificationLinks(notificationId));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error marking notification as read: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error marking notification as read: " + e.getMessage()));
        }
    }

    // Endpoint: PUT /api/notifications/read-all
    // Purpose: Marks all notifications for the authenticated user as read
    // Request: Authorization header
    // Response: 200 OK with success message and links, or 401/500 for errors
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }
        try {
            // Mark all notifications as read
            notificationService.markAllAsRead(userId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

            // Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "All notifications marked as read");
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "all-notifications", "href", "/api/notifications")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            System.err.println("Error marking all notifications as read: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error marking all notifications as read: " + e.getMessage()));
        }
    }
}