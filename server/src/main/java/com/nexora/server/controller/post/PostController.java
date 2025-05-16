package com.nexora.server.controller.post;

import com.nexora.server.model.post.Post;
import com.nexora.server.service.post.PostService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// REST controller for managing posts, mapped to /api/posts
@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PostController {

    // Injects PostService for business logic
    @Autowired
    private PostService postService;

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

    // Builds HATEOAS-style links for post-related endpoints
    private List<Map<String, String>> buildPostLinks(String postId) {
        return Arrays.asList(
            Map.of("rel", "self", "href", "/api/posts/" + postId),
            Map.of("rel", "comments", "href", "/api/posts/" + postId + "/comment"),
            Map.of("rel", "like", "href", "/api/posts/" + postId + "/like"),
            Map.of("rel", "save", "href", "/api/posts/" + postId + "/save"),
            Map.of("rel", "all-posts", "href", "/api/posts")
        );
    }

    // Endpoint: POST /api/posts
    // Purpose: Creates a new post with description and optional media files
    // Request: Multipart form-data with description (string), files (List<MultipartFile>, optional), Authorization header (Bearer token)
    // Response: 201 Created with post details and links, or 401/400/500 for errors
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestPart("description") String description,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user via JWT
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Create post using PostService
            Post post = postService.createPost(userId, description, files);
            // Set cache control to prevent caching
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            // Set ETag for cache validation
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response with post and links
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", buildPostLinks(post.getId()));

            return ResponseEntity.status(HttpStatus.CREATED)
                .header("Location", "/api/posts/" + post.getId())
                .body(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error creating post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error creating post: " + e.getMessage()));
        }
    }

    // Endpoint: GET /api/posts/{postId}
    // Purpose: Retrieves a specific post by ID
    // Request: Path variable postId
    // Response: 200 OK with post details and links, or 404/500 for errors
    @GetMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> getPost(
            @PathVariable String postId,
            HttpServletResponse response) {
        try {
            // Fetch post using PostService
            Post post = postService.getPost(postId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response with post and links
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", buildPostLinks(postId));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error fetching post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error fetching post: " + e.getMessage()));
        }
    }

    // Endpoint: GET /api/posts
    // Purpose: Retrieves all posts
    // Request: None
    // Response: 200 OK with list of posts and their links, or 500 for errors
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPosts(HttpServletResponse response) {
        try {
            // Fetch all posts
            List<Post> posts = postService.getAllPosts();
            // Map posts to response format with links
            List<Map<String, Object>> responseBody = posts.stream().map(post -> {
                Map<String, Object> postWithLinks = new HashMap<>();
                postWithLinks.put("post", post);
                postWithLinks.put("_links", buildPostLinks(post.getId()));
                return postWithLinks;
            }).collect(Collectors.toList());

            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + System.currentTimeMillis() + "\"");

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            System.err.println("Error fetching posts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of(Map.of("error", "Error fetching posts: " + e.getMessage())));
        }
    }

    // Endpoint: GET /api/posts/saved
    // Purpose: Retrieves posts saved by the authenticated user
    // Request: Authorization header (Bearer token)
    // Response: 200 OK with list of saved posts and links, or 401/500 for errors
    @GetMapping("/saved")
    public ResponseEntity<List<Map<String, Object>>> getSavedPosts(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(List.of(Map.of("error", "User not authenticated")));
        }

        try {
            // Fetch saved posts
            List<Post> posts = postService.getSavedPosts(userId);
            List<Map<String, Object>> responseBody = posts.stream().map(post -> {
                Map<String, Object> postWithLinks = new HashMap<>();
                postWithLinks.put("post", post);
                postWithLinks.put("_links", buildPostLinks(post.getId()));
                return postWithLinks;
            }).collect(Collectors.toList());

            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + System.currentTimeMillis() + "\"");

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            System.err.println("Error fetching saved posts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of(Map.of("error", "Error fetching saved posts: " + e.getMessage())));
        }
    }

    // Endpoint: PUT /api/posts/{postId}
    // Purpose: Updates an existing post’s description and media
    // Request: Multipart form-data with description (string), files (List<MultipartFile>, optional), Authorization header
    // Response: 200 OK with updated post and links, or 401/403/404/500 for errors
    @PutMapping(value = "/{postId}", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> updatePost(
            @PathVariable String postId,
            @RequestPart("description") String description,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Update post
            Post updatedPost = postService.updatePost(postId, userId, description, files);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + updatedPost.getId() + "-" + updatedPost.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", updatedPost);
            responseBody.put("_links", buildPostLinks(updatedPost.getId()));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error updating post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error updating post: " + e.getMessage()));
        }
    }

    // Endpoint: DELETE /api/posts/{postId}
    // Purpose: Deletes a post
    // Request: Path variable postId, Authorization header
    // Response: 200 OK with success message and links, or 401/403/404/500 for errors
    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> deletePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Delete post
            postService.deletePost(postId, userId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

            // Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Post deleted successfully");
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "all-posts", "href", "/api/posts")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error deleting post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error deleting post: " + e.getMessage()));
        }
    }

    // Endpoint: POST /api/posts/{postId}/like
    // Purpose: Toggles like status for a post
    // Request: Path variable postId, Authorization header
    // Response: 200 OK with updated post and links, or 401/404/500 for errors
    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> likePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Toggle like
            Post post = postService.likePost(postId, userId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", buildPostLinks(post.getId()));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error toggling like: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error toggling like: " + e.getMessage()));
        }
    }

    // Endpoint: POST /api/posts/{postId}/save
    // Purpose: Saves a post for the user
    // Request: Path variable postId, Authorization header
    // Response: 200 OK with updated post and links, or 401/404/500 for errors
    @PostMapping("/{postId}/save")
    public ResponseEntity<Map<String, Object>> savePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Save post
            Post post = postService.savePost(postId, userId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", buildPostLinks(post.getId()));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error saving post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error saving post: " + e.getMessage()));
        }
    }

    // Endpoint: DELETE /api/posts/{postId}/save
    // Purpose: Removes a post from the user’s saved list
    // Request: Path variable postId, Authorization header
    // Response: 200 OK with updated post and links, or 401/404/500 for errors
    @DeleteMapping("/{postId}/save")
    public ResponseEntity<Map<String, Object>> unsavePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Unsave post
            Post post = postService.unsavePost(postId, userId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", buildPostLinks(post.getId()));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error unsaving post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error unsaving post: " + e.getMessage()));
        }
    }

    // Endpoint: POST /api/posts/{postId}/comment
    // Purpose: Adds a comment to a post
    // Request: Path variable postId, JSON body with comment (string), Authorization header
    // Response: 201 Created with updated post and links, or 401/404/500 for errors
    @PostMapping("/{postId}/comment")
    public ResponseEntity<Map<String, Object>> addComment(
            @PathVariable String postId,
            @RequestBody CommentRequest commentRequest,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Add comment
            Post post = postService.addComment(postId, userId, commentRequest.getComment());
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", buildPostLinks(post.getId()));

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error adding comment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error adding comment: " + e.getMessage()));
        }
    }

    // Endpoint: PUT /api/posts/{postId}/comment/{commentId}
    // Purpose: Updates a comment on a post
    // Request: Path variables postId and commentId, JSON body with comment (string), Authorization header
    // Response: 200 OK with updated post and links, or 401/403/404/500 for errors
    @PutMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestBody CommentRequest commentRequest,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Update comment
            Post post = postService.updateComment(postId, commentId, userId, commentRequest.getComment());
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", buildPostLinks(post.getId()));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error updating comment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error updating comment: " + e.getMessage()));
        }
    }

    // Endpoint: DELETE /api/posts/{postId}/comment/{commentId}
    // Purpose: Deletes a comment from a post
    // Request: Path variables postId and commentId, Authorization header
    // Response: 200 OK with updated post and links, or 401/403/404/500 for errors
    @DeleteMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Delete comment
            Post post = postService.deleteComment(postId, commentId, userId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", buildPostLinks(post.getId()));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error deleting comment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error deleting comment: " + e.getMessage()));
        }
    }
}

// DTO for comment requests
class CommentRequest {
    private String comment;

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}