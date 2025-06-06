package com.nexora.server.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexora.server.model.SocialMediaLink;
import com.nexora.server.model.User;
import com.nexora.server.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller for user-related endpoints such as profile management,
 * following/unfollowing, searching, and image uploads.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Follow another user.
     */
    @PostMapping("/{userId}/follow/{targetUserId}")
    public ResponseEntity<?> followUser(
            @PathVariable String userId,
            @PathVariable String targetUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Validate JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "No valid token provided"));
            }
            String token = authHeader.substring(7);
            User user = userService.validateJwtToken(token);
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "Unauthorized: Token does not match user"));
            }

            String result = userService.followUser(userId, targetUserId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/users/" + userId);
            links.put("followers", "/api/users/" + userId + "/followers");
            links.put("following", "/api/users/" + userId + "/following");
            Map<String, Object> response = new HashMap<>();
            response.put("message", result);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Unfollow another user.
     */
    @PostMapping("/{userId}/unfollow/{targetUserId}")
    public ResponseEntity<?> unfollowUser(
            @PathVariable String userId,
            @PathVariable String targetUserId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Validate JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "No valid token provided"));
            }
            String token = authHeader.substring(7);
            User user = userService.validateJwtToken(token);
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "Unauthorized: Token does not match user"));
            }

            System.out.println("Unfollowing: " + userId + " -> " + targetUserId);

            String result = userService.unfollowUser(userId, targetUserId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/users/" + userId);
            links.put("followers", "/api/users/" + userId + "/followers");
            links.put("following", "/api/users/" + userId + "/following");
            Map<String, Object> response = new HashMap<>();
            response.put("message", result);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get user profile by ID.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/users/" + userId);
            links.put("followers", "/api/users/" + userId + "/followers");
            links.put("following", "/api/users/" + userId + "/following");
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .header(HttpHeaders.ETAG, "\"" + user.getId() + "\"")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get followers of a user.
     */
    @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowers(
            @PathVariable String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Validate JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "No valid token provided"));
            }
            String token = authHeader.substring(7);
            User currentUser = userService.validateJwtToken(token);

            List<User> followers = userService.getFollowers(userId);
            // Build response for each follower

            List<Map<String, Object>> followerResponses = followers.stream().map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("name", user.getName());
                userMap.put("username", user.getUsername());
                userMap.put("profilePhotoUrl", user.getProfilePhotoUrl());
                userMap.put("isFollowing", currentUser.getFollowing().contains(user.getId()));
                Map<String, String> userLinks = new HashMap<>();
                userLinks.put("self", "/api/users/" + user.getId());
                userMap.put("_links", userLinks);
                return userMap;
            }).collect(Collectors.toList());

            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/users/" + userId + "/followers");
            Map<String, Object> response = new HashMap<>();
            response.put("followers", followerResponses);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .header(HttpHeaders.ETAG, "\"" + userId + "-followers\"")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get users that the given user is following.
     */
    @GetMapping("/{userId}/following")
    public ResponseEntity<?> getFollowing(
            @PathVariable String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Validate JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "No valid token provided"));
            }
            String token = authHeader.substring(7);
            User currentUser = userService.validateJwtToken(token);

            List<User> following = userService.getFollowing(userId);
            // Build response for each followed user

            List<Map<String, Object>> followingResponses = following.stream().map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("name", user.getName());
                userMap.put("username", user.getUsername());
                userMap.put("profilePhotoUrl", user.getProfilePhotoUrl());
                userMap.put("isFollowing", currentUser.getFollowing().contains(user.getId()));
                Map<String, String> userLinks = new HashMap<>();
                userLinks.put("self", "/api/users/" + user.getId());
                userMap.put("_links", userLinks);
                return userMap;
            }).collect(Collectors.toList());

            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/users/" + userId + "/following");
            Map<String, Object> response = new HashMap<>();
            response.put("following", followingResponses);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .header(HttpHeaders.ETAG, "\"" + userId + "-following\"")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get suggested users for the given user.
     */
    @GetMapping("/{userId}/suggested")
    public ResponseEntity<?> getSuggestedUsers(
            @PathVariable String userId,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            List<User> suggestedUsers = userService.getSuggestedUsers(userId, limit);
            // Build response for each suggested user
            List<Map<String, Object>> userResponses = suggestedUsers.stream().map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("email", user.getEmail());
                userMap.put("name", user.getName());
                userMap.put("username", user.getUsername());
                userMap.put("profilePhotoUrl", user.getProfilePhotoUrl());
                Map<String, String> userLinks = new HashMap<>();
                userLinks.put("self", "/api/users/" + user.getId());
                userMap.put("_links", userLinks);
                return userMap;
            }).toList();
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/users/" + userId + "/suggested?limit=" + limit);
            Map<String, Object> response = new HashMap<>();
            response.put("suggestedUsers", userResponses);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .header(HttpHeaders.ETAG, "\"" + userId + "-suggested-" + limit + "\"")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Search for users by query string.
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Validate JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "No valid token provided"));
            }
            String token = authHeader.substring(7);
            User user = userService.validateJwtToken(token);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "Invalid token"));
            }

            // Search for users and related users
            List<User> searchResults = userService.searchUsers(query, user.getId(), limit);
            List<User> relatedUsers = userService.getRelatedUsers(query, user.getId(), limit);
            List<Map<String, Object>> searchResultResponses = searchResults.stream().map(u -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", u.getId());
                userMap.put("name", u.getName());
                userMap.put("username", u.getUsername());
                userMap.put("profilePhotoUrl", u.getProfilePhotoUrl());
                userMap.put("likeSkill", u.getLikeSkill());
                Map<String, String> userLinks = new HashMap<>();
                userLinks.put("self", "/api/users/" + u.getId());
                userMap.put("_links", userLinks);
                return userMap;
            }).toList();
            List<Map<String, Object>> relatedUserResponses = relatedUsers.stream().map(u -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", u.getId());
                userMap.put("name", u.getName());
                userMap.put("username", u.getUsername());
                userMap.put("profilePhotoUrl", u.getProfilePhotoUrl());
                userMap.put("likeSkill", u.getLikeSkill());
                Map<String, String> userLinks = new HashMap<>();
                userLinks.put("self", "/api/users/" + u.getId());
                userMap.put("_links", userLinks);
                return userMap;
            }).toList();
            Map<String, Object> response = new HashMap<>();
            response.put("searchResults", searchResultResponses);
            response.put("relatedUsers", relatedUserResponses);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/users/search?query=" + query + "&limit=" + limit);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .header(HttpHeaders.ETAG, "\"" + query + "-search-" + limit + "\"")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Edit user profile.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> editUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Validate JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "No valid token provided"));
            }
            String token = authHeader.substring(7);
            User authenticatedUser = userService.validateJwtToken(token);
            if (!authenticatedUser.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "Unauthorized: Token does not match user"));
            }

            User user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "User not found"));
            }

            // Check for email and username uniqueness
            if (request.email() != null && !request.email().equals(user.getEmail()) &&
                    userService.findByEmail(request.email()).isPresent()) {
                return ResponseEntity.badRequest()
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "Email already exists"));
            }
            if (request.username() != null && !request.username().equals(user.getUsername()) &&
                    userService.findByUsername(request.username()).isPresent()) {
                return ResponseEntity.badRequest()
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "Username already exists"));
            }

            // Update user fields
            if (request.name() != null) user.setName(request.name());
            if (request.username() != null) user.setUsername(request.username());
            if (request.email() != null) user.setEmail(request.email());
            if (request.about() != null) user.setAbout(request.about());
            if (request.password() != null && request.currentPassword() != null) {
                if (!userService.validatePassword(request.currentPassword(), user.getPassword())) {
                    return ResponseEntity.badRequest()
                            .header(HttpHeaders.CACHE_CONTROL, "no-store")
                            .body(Map.of("error", "Current password is incorrect"));
                }
                user.setPassword(userService.encodePassword(request.password()));
            }
            if (request.socialMedia() != null) {
                List<SocialMediaLink> socialMediaLinks = objectMapper.readValue(
                        request.socialMedia(),
                        new TypeReference<List<SocialMediaLink>>() {}
                );
                user.setSocialMedia(socialMediaLinks);
            }

            userService.save(user);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/users/" + id);
            links.put("images", "/api/users/" + id + "/images");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Upload or update user profile and banner images.
     */
    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadUserImages(
            @PathVariable String id,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "bannerImage", required = false) MultipartFile bannerImage,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Validate JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "No valid token provided"));
            }
            String token = authHeader.substring(7);
            User authenticatedUser = userService.validateJwtToken(token);
            if (!authenticatedUser.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "Unauthorized: Token does not match user"));
            }

            User user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "User not found"));
            }

            // Upload images if provided
            if (profileImage != null && !profileImage.isEmpty()) {
                String profileUrl = userService.uploadFile(profileImage);
                user.setProfilePhotoUrl(profileUrl);
            }
            if (bannerImage != null && !bannerImage.isEmpty()) {
                String bannerUrl = userService.uploadFile(bannerImage);
                user.setBannerPhotoUrl(bannerUrl);
            }

            userService.save(user);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/users/" + id);
            links.put("images", "/api/users/" + id + "/images");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Images updated successfully");
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete a user account.
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String userId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Validate JWT token
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "No valid token provided"));
            }
            String token = authHeader.substring(7);
            User user = userService.validateJwtToken(token);
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "Unauthorized: Token does not match user"));
            }

            String result = userService.deleteUser(userId);
            Map<String, String> links = new HashMap<>();
            links.put("login", "/api/auth/login");
            Map<String, Object> response = new HashMap<>();
            response.put("message", result);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

/**
 * Request record for updating user profile.
 */
record UpdateUserRequest(
        String name,
        String username,
        String email,
        String about,
        String password,
        String currentPassword,
        String socialMedia
) {}