package com.nexora.server.controller;

import com.nexora.server.model.User;
import com.nexora.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Placeholder for admin role validation (e.g., check if user is admin via JWT)
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "No valid token provided"));
            }
            String token = authHeader.substring(7);
            User adminUser = userService.validateJwtToken(token);
            // Note: Add role check (e.g., adminUser.getRole() == Role.ADMIN) when Role enum is updated

            Page<User> users = userService.getAllUsers(PageRequest.of(page, size));
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/admin/users?page=" + page + "&size=" + size);
            if (users.hasNext()) {
                links.put("next", "/api/admin/users?page=" + (page + 1) + "&size=" + size);
            }
            if (users.hasPrevious()) {
                links.put("previous", "/api/admin/users?page=" + (page - 1) + "&size=" + size);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("users", users.getContent());
            response.put("totalPages", users.getTotalPages());
            response.put("totalElements", users.getTotalElements());
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                    .header(HttpHeaders.ETAG, "\"" + users.getContent().hashCode() + "\"")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }
}