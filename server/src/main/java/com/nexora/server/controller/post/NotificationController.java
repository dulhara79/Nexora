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

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    // Extract userId from JWT token
    private String extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        try {
            SecretKey jwtSecretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            return Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // Assumes userId is stored as the subject in the JWT
        } catch (Exception e) {
            System.err.println("Error parsing JWT: " + e.getMessage());
            return null;
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getNotifications(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            List<Notification> notifications = notificationService.getNotifications(userId);
            List<Map<String, Object>> responseBody = notifications.stream().map(notification -> {
                Map<String, Object> notificationWithLinks = new HashMap<>();
                notificationWithLinks.put("notification", notification);
                notificationWithLinks.put("_links", Arrays.asList(
                    Map.of("rel", "self", "href", "/api/notifications/" + notification.getId()),
                    Map.of("rel", "mark-as-read", "href", "/api/notifications/" + notification.getId() + "/read")
                ));
                return notificationWithLinks;
            }).collect(Collectors.toList());

            response.setHeader("Cache-Control", "max-age=3600"); // Cache for 1 hour
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            System.err.println("Error fetching notifications for userId " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable String notificationId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        try {
            Notification notification = notificationService.getNotifications(userId).stream()
                    .filter(n -> n.getId().equals(notificationId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
            if (!notification.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to mark this notification as read");
            }
            notificationService.markAsRead(notificationId);
            response.setHeader("Cache-Control", "no-cache"); // Prevent caching for PUT

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Notification marked as read");
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "notifications", "href", "/api/notifications")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error marking notification as read: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error marking notification as read");
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        try {
            notificationService.markAllAsRead(userId);
            response.setHeader("Cache-Control", "no-cache"); // Prevent caching for PUT

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "All notifications marked as read");
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "notifications", "href", "/api/notifications")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            System.err.println("Error marking all notifications as read: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error marking all notifications as read");
        }
    }
}