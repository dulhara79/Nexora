package com.nexora.server.controller.post;

import com.nexora.server.model.post.Post;
import com.nexora.server.service.post.PostService;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PostController {

    @Autowired
    private PostService postService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    // Extract userId from JWT token, aligned with AuthenticationService
    private String extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        try {
            return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // Assumes userId is stored as the subject in the JWT
        } catch (Exception e) {
            System.err.println("Error parsing JWT: " + e.getMessage());
            return null;
        }
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createPost(
            @RequestPart("description") String description,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            Post post = postService.createPost(userId, description, files);
            response.setHeader("Cache-Control", "no-cache"); // Prevent caching for POST

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
                Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
                Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error creating post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating post: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPosts(HttpServletResponse response) {
        try {
            List<Post> posts = postService.getAllPosts();
            List<Map<String, Object>> responseBody = posts.stream().map(post -> {
                Map<String, Object> postWithLinks = new HashMap<>();
                postWithLinks.put("post", post);
                postWithLinks.put("_links", Arrays.asList(
                    Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
                    Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
                    Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
                ));
                return postWithLinks;
            }).collect(Collectors.toList());

            response.setHeader("Cache-Control", "max-age=3600"); // Cache for 1 hour
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping(value = "/{postId}", consumes = "multipart/form-data")
    public ResponseEntity<?> updatePost(
            @PathVariable String postId,
            @RequestPart("description") String description,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            Post updatedPost = postService.updatePost(postId, userId, description, files);
            response.setHeader("Cache-Control", "no-cache"); // Prevent caching for PUT

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", updatedPost);
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "self", "href", "/api/posts/" + updatedPost.getId()),
                Map.of("rel", "comments", "href", "/api/posts/" + updatedPost.getId() + "/comment"),
                Map.of("rel", "like", "href", "/api/posts/" + updatedPost.getId() + "/like")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating post: " + e.getMessage());
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            postService.deletePost(postId, userId);
            response.setHeader("Cache-Control", "no-cache"); // Prevent caching for DELETE

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Post deleted successfully");
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "all-posts", "href", "/api/posts")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting post: " + e.getMessage());
        }
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            Post post = postService.likePost(postId, userId);
            response.setHeader("Cache-Control", "no-cache"); // Prevent caching for POST

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
                Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
                Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error liking post: " + e.getMessage());
        }
    }

    @PostMapping("/{postId}/comment")
    public ResponseEntity<?> addComment(
            @PathVariable String postId,
            @RequestBody CommentRequest commentRequest,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            Post post = postService.addComment(postId, userId, commentRequest.getComment());
            response.setHeader("Cache-Control", "no-cache"); // Prevent caching for POST

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
                Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
                Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding comment: " + e.getMessage());
        }
    }

    @PutMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestBody CommentRequest commentRequest,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            Post post = postService.updateComment(postId, commentId, userId, commentRequest.getComment());
            response.setHeader("Cache-Control", "no-cache"); // Prevent caching for PUT

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
                Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
                Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating comment: " + e.getMessage());
        }
    }

    @DeleteMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            Post post = postService.deleteComment(postId, commentId, userId);
            response.setHeader("Cache-Control", "no-cache"); // Prevent caching for DELETE

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("post", post);
            responseBody.put("_links", Arrays.asList(
                Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
                Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
                Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
            ));

            return ResponseEntity.ok(responseBody);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting comment: " + e.getMessage());
        }
    }
}

class CommentRequest {
    private String comment;

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}