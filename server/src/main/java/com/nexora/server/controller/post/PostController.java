package com.nexora.server.controller.post;

// Imports for dependencies like JWT handling, Spring components, and HTTP utilities
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

// Defines the REST controller for handling post-related API requests
@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PostController {

    // Injects PostService for business logic
    @Autowired
    private PostService postService;

    // Loads JWT secret from configuration
    @Value("${jwt.secret}")
    private String jwtSecret;

    // Creates a SecretKey for JWT signing
    private SecretKey getJwtSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // Extracts user ID from JWT token in the Authorization header
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

    // Builds HATEOAS-style links for a post (self, comments, like, save, all-posts)
    private List<Map<String, String>> buildPostLinks(String postId) {
        return Arrays.asList(
            Map.of("rel", "self", "href", "/api/posts/" + postId),
            Map.of("rel", "comments", "href", "/api/posts/" + postId + "/comment"),
            Map.of("rel", "like", "href", "/api/posts/" + postId + "/like"),
            Map.of("rel", "save", "href", "/api/posts/" + postId + "/save"),
            Map.of("rel", "all-posts", "href", "/api/posts")
        );
    }

    // Handles POST request to create a new post with description and optional files
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
            // Set cache control and ETag headers
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
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

    // Handles GET request to retrieve a specific post by ID
    @GetMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> getPost(
            @PathVariable String postId,
            HttpServletResponse response) {
        try {
            // Fetch post using PostService
            Post post = postService.getPost(postId);
            // Set cache control and ETag headers
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

    // Handles GET request to retrieve all posts
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPosts(HttpServletResponse response) {
        try {
            // Fetch all posts using PostService
            List<Post> posts = postService.getAllPosts();
            // Map posts to response format with links
            List<Map<String, Object>> responseBody = posts.stream().map(post -> {
                Map<String, Object> postWithLinks = new HashMap<>();
                postWithLinks.put("post", post);
                postWithLinks.put("_links", buildPostLinks(post.getId()));
                return postWithLinks;
            }).collect(Collectors.toList());

            // Set cache control and ETag headers
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + System.currentTimeMillis() + "\"");

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            System.err.println("Error fetching posts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of(Map.of("error", "Error fetching posts: " + e.getMessage())));
        }
    }

    // Handles GET request to retrieve saved posts for the authenticated user
    @GetMapping("/saved")
    public ResponseEntity<List<Map<String, Object>>> getSavedPosts(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user via JWT
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(List.of(Map.of("error", "User not authenticated")));
        }

        try {
            // Fetch saved posts using PostService
            List<Post> posts = postService.getSavedPosts(userId);
            // Map posts to response format with links
            List<Map<String, Object>> responseBody = posts.stream().map(post -> {
                Map<String, Object> postWithLinks = new HashMap<>();
                postWithLinks.put("post", post);
                postWithLinks.put("_links", buildPostLinks(post.getId()));
                return postWithLinks;
            }).collect(Collectors.toList());

            // Set cache control and ETag headers
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + System.currentTimeMillis() + "\"");

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            System.err.println("Error fetching saved posts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of(Map.of("error", "Error fetching saved posts: " + e.getMessage())));
        }
    }

    // Handles PUT request to update a post's description and optional files
    @PutMapping(value = "/{postId}", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> updatePost(
            @PathVariable String postId,
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
            // Update post using PostService
            Post updatedPost = postService.updatePost(postId, userId, description, files);
            // Set cache control and ETag headers
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + updatedPost.getId() + "-" + updatedPost.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response with updated post and links
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

    // Handles DELETE request to delete a post
    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> deletePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user via JWT
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Delete post using PostService
            postService.deletePost(postId, userId);
            // Set cache control header
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

            // Build response with success message and link to all posts
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

    // Handles POST request to like a post
    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> likePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user via JWT
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Like post using PostService
            Post post = postService.likePost(postId, userId);
            // Set cache control and ETag headers
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response with post and links
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", buildPostLinks(post.getId()));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error liking post: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error liking post: " + e.getMessage()));
        }
    }

    // Handles POST request to save a post
    @PostMapping("/{postId}/save")
    public ResponseEntity<Map<String, Object>> savePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user via JWT
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Save post using PostService
            Post post = postService.savePost(postId, userId);
            // Set cache control and ETag headers
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response with post and links
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

    // Handles DELETE request to unsave a post
    @DeleteMapping("/{postId}/save")
    public ResponseEntity<Map<String, Object>> unsavePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user via JWT
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Unsave post using PostService
            Post post = postService.unsavePost(postId, userId);
            // Set cache control and ETag headers
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response with post and links
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

    // Handles POST request to add a comment to a post
    @PostMapping("/{postId}/comment")
    public ResponseEntity<Map<String, Object>> addComment(
            @PathVariable String postId,
            @RequestBody CommentRequest commentRequest,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user via JWT
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Add comment using PostService
            Post post = postService.addComment(postId, userId, commentRequest.getComment());
            // Set cache control and ETag headers
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response with post and links
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

    // Handles PUT request to update a comment on a post
    @PutMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestBody CommentRequest commentRequest,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user via JWT
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Update comment using PostService
            Post post = postService.updateComment(postId, commentId, userId, commentRequest.getComment());
            // Set cache control and ETag headers
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response with post and links
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

    // Handles DELETE request to delete a comment from a post
    @DeleteMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        // Authenticate user via JWT
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            // Delete comment using PostService
            Post post = postService.deleteComment(postId, commentId, userId);
            // Set cache control and ETag headers
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

            // Build response with post and links
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

// Defines a simple DTO for handling comment requests
class CommentRequest {
    private String comment;

    // Getter for comment
    public String getComment() {
        return comment;
    }

    // Setter for comment
    public void setComment(String comment) {
        this.comment = comment;
    }
}
