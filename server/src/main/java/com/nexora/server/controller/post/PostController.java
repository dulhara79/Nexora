// package com.nexora.server.controller.post;

// import com.nexora.server.model.post.Post;
// import com.nexora.server.service.post.PostService;
// import io.jsonwebtoken.Jwts;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;
// import jakarta.servlet.http.HttpServletResponse;

// import java.util.Arrays;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/posts")
// @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
// public class PostController {

//     @Autowired
//     private PostService postService;

//     @Value("${jwt.secret}")
//     private String jwtSecret;

//     // Extract userId from JWT token, aligned with AuthenticationService
//     private String extractUserIdFromToken(String authHeader) {
//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             return null;
//         }
//         String token = authHeader.substring(7); // Remove "Bearer " prefix
//         try {
//             return Jwts.parser()
//                 .setSigningKey(jwtSecret)
//                 .parseClaimsJws(token)
//                 .getBody()
//                 .getSubject(); // Assumes userId is stored as the subject in the JWT
//         } catch (Exception e) {
//             System.err.println("Error parsing JWT: " + e.getMessage());
//             return null;
//         }
//     }

//     @PostMapping(consumes = "multipart/form-data")
//     public ResponseEntity<?> createPost(
//             @RequestPart("description") String description,
//             @RequestPart(value = "files", required = false) List<MultipartFile> files,
//             @RequestHeader("Authorization") String authHeader,
//             HttpServletResponse response) {
//         String userId = extractUserIdFromToken(authHeader);
//         if (userId == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//         }

//         try {
//             Post post = postService.createPost(userId, description, files);
//             response.setHeader("Cache-Control", "no-cache"); // Prevent caching for POST

//             Map<String, Object> responseBody = new HashMap<>();
//             responseBody.put("post", post);
//             responseBody.put("_links", Arrays.asList(
//                 Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
//                 Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
//                 Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
//             ));

//             return ResponseEntity.ok(responseBody);
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//         } catch (Exception e) {
//             System.err.println("Error creating post: " + e.getMessage());
//             e.printStackTrace();
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating post: " + e.getMessage());
//         }
//     }

//     @GetMapping
//     public ResponseEntity<List<Map<String, Object>>> getAllPosts(HttpServletResponse response) {
//         try {
//             List<Post> posts = postService.getAllPosts();
//             List<Map<String, Object>> responseBody = posts.stream().map(post -> {
//                 Map<String, Object> postWithLinks = new HashMap<>();
//                 postWithLinks.put("post", post);
//                 postWithLinks.put("_links", Arrays.asList(
//                     Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
//                     Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
//                     Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
//                 ));
//                 return postWithLinks;
//             }).collect(Collectors.toList());

//             response.setHeader("Cache-Control", "max-age=3600"); // Cache for 1 hour
//             return ResponseEntity.ok(responseBody);
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//         }
//     }

//     @PutMapping(value = "/{postId}", consumes = "multipart/form-data")
//     public ResponseEntity<?> updatePost(
//             @PathVariable String postId,
//             @RequestPart("description") String description,
//             @RequestPart(value = "files", required = false) List<MultipartFile> files,
//             @RequestHeader("Authorization") String authHeader,
//             HttpServletResponse response) {
//         String userId = extractUserIdFromToken(authHeader);
//         if (userId == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//         }

//         try {
//             Post updatedPost = postService.updatePost(postId, userId, description, files);
//             response.setHeader("Cache-Control", "no-cache"); // Prevent caching for PUT

//             Map<String, Object> responseBody = new HashMap<>();
//             responseBody.put("post", updatedPost);
//             responseBody.put("_links", Arrays.asList(
//                 Map.of("rel", "self", "href", "/api/posts/" + updatedPost.getId()),
//                 Map.of("rel", "comments", "href", "/api/posts/" + updatedPost.getId() + "/comment"),
//                 Map.of("rel", "like", "href", "/api/posts/" + updatedPost.getId() + "/like")
//             ));

//             return ResponseEntity.ok(responseBody);
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//         } catch (SecurityException e) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating post: " + e.getMessage());
//         }
//     }

//     @DeleteMapping("/{postId}")
//     public ResponseEntity<?> deletePost(
//             @PathVariable String postId,
//             @RequestHeader("Authorization") String authHeader,
//             HttpServletResponse response) {
//         String userId = extractUserIdFromToken(authHeader);
//         if (userId == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//         }

//         try {
//             postService.deletePost(postId, userId);
//             response.setHeader("Cache-Control", "no-cache"); // Prevent caching for DELETE

//             Map<String, Object> responseBody = new HashMap<>();
//             responseBody.put("message", "Post deleted successfully");
//             responseBody.put("_links", Arrays.asList(
//                 Map.of("rel", "all-posts", "href", "/api/posts")
//             ));

//             return ResponseEntity.ok(responseBody);
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//         } catch (SecurityException e) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting post: " + e.getMessage());
//         }
//     }

//     @PostMapping("/{postId}/like")
//     public ResponseEntity<?> likePost(
//             @PathVariable String postId,
//             @RequestHeader("Authorization") String authHeader,
//             HttpServletResponse response) {
//         String userId = extractUserIdFromToken(authHeader);
//         if (userId == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//         }

//         try {
//             Post post = postService.likePost(postId, userId);
//             response.setHeader("Cache-Control", "no-cache"); // Prevent caching for POST

//             Map<String, Object> responseBody = new HashMap<>();
//             responseBody.put("post", post);
//             responseBody.put("_links", Arrays.asList(
//                 Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
//                 Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
//                 Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
//             ));

//             return ResponseEntity.ok(responseBody);
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error liking post: " + e.getMessage());
//         }
//     }

//     @PostMapping("/{postId}/comment")
//     public ResponseEntity<?> addComment(
//             @PathVariable String postId,
//             @RequestBody CommentRequest commentRequest,
//             @RequestHeader("Authorization") String authHeader,
//             HttpServletResponse response) {
//         String userId = extractUserIdFromToken(authHeader);
//         if (userId == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//         }

//         try {
//             Post post = postService.addComment(postId, userId, commentRequest.getComment());
//             response.setHeader("Cache-Control", "no-cache"); // Prevent caching for POST

//             Map<String, Object> responseBody = new HashMap<>();
//             responseBody.put("post", post);
//             responseBody.put("_links", Arrays.asList(
//                 Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
//                 Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
//                 Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
//             ));

//             return ResponseEntity.ok(responseBody);
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding comment: " + e.getMessage());
//         }
//     }

//     @PutMapping("/{postId}/comment/{commentId}")
//     public ResponseEntity<?> updateComment(
//             @PathVariable String postId,
//             @PathVariable String commentId,
//             @RequestBody CommentRequest commentRequest,
//             @RequestHeader("Authorization") String authHeader,
//             HttpServletResponse response) {
//         String userId = extractUserIdFromToken(authHeader);
//         if (userId == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//         }

//         try {
//             Post post = postService.updateComment(postId, commentId, userId, commentRequest.getComment());
//             response.setHeader("Cache-Control", "no-cache"); // Prevent caching for PUT

//             Map<String, Object> responseBody = new HashMap<>();
//             responseBody.put("post", post);
//             responseBody.put("_links", Arrays.asList(
//                 Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
//                 Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
//                 Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
//             ));

//             return ResponseEntity.ok(responseBody);
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating comment: " + e.getMessage());
//         }
//     }

//     @DeleteMapping("/{postId}/comment/{commentId}")
//     public ResponseEntity<?> deleteComment(
//             @PathVariable String postId,
//             @PathVariable String commentId,
//             @RequestHeader("Authorization") String authHeader,
//             HttpServletResponse response) {
//         String userId = extractUserIdFromToken(authHeader);
//         if (userId == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//         }

//         try {
//             Post post = postService.deleteComment(postId, commentId, userId);
//             response.setHeader("Cache-Control", "no-cache"); // Prevent caching for DELETE

//             Map<String, Object> responseBody = new HashMap<>();
//             responseBody.put("post", post);
//             responseBody.put("_links", Arrays.asList(
//                 Map.of("rel", "self", "href", "/api/posts/" + post.getId()),
//                 Map.of("rel", "comments", "href", "/api/posts/" + post.getId() + "/comment"),
//                 Map.of("rel", "like", "href", "/api/posts/" + post.getId() + "/like")
//             ));

//             return ResponseEntity.ok(responseBody);
//         } catch (RuntimeException e) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting comment: " + e.getMessage());
//         }
//     }
// }

// class CommentRequest {
//     private String comment;

//     public String getComment() {
//         return comment;
//     }

//     public void setComment(String comment) {
//         this.comment = comment;
//     }
// }

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

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PostController {

    @Autowired
    private PostService postService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey getJwtSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // Extract userId from JWT token
    private String extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        try {
            return Jwts.parserBuilder()
                .setSigningKey(getJwtSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // Assumes userId is stored as the subject in the JWT
        } catch (Exception e) {
            System.err.println("Error parsing JWT: " + e.getMessage());
            return null;
        }
    }

    // Utility to build HATEOAS links
    private List<Map<String, String>> buildPostLinks(String postId) {
        return Arrays.asList(
            Map.of("rel", "self", "href", "/api/posts/" + postId),
            Map.of("rel", "comments", "href", "/api/posts/" + postId + "/comment"),
            Map.of("rel", "like", "href", "/api/posts/" + postId + "/like"),
            Map.of("rel", "all-posts", "href", "/api/posts")
        );
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestPart("description") String description,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            Post post = postService.createPost(userId, description, files);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

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

    @GetMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> getPost(
            @PathVariable String postId,
            HttpServletResponse response) {
        try {
            Post post = postService.getPost(postId);
            response.setHeader("Cache-Control", "max-age=3600, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

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

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPosts(HttpServletResponse response) {
        try {
            List<Post> posts = postService.getAllPosts();
            List<Map<String, Object>> responseBody = posts.stream().map(post -> {
                Map<String, Object> postWithLinks = new HashMap<>();
                postWithLinks.put("post", post);
                postWithLinks.put("_links", buildPostLinks(post.getId()));
                return postWithLinks;
            }).collect(Collectors.toList());

            response.setHeader("Cache-Control", "max-age=3600, must-revalidate");
            response.setHeader("ETag", "\"" + System.currentTimeMillis() + "\"");

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            System.err.println("Error fetching posts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of(Map.of("error", "Error fetching posts: " + e.getMessage())));
        }
    }

    @PutMapping(value = "/{postId}", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> updatePost(
            @PathVariable String postId,
            @RequestPart("description") String description,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            Post updatedPost = postService.updatePost(postId, userId, description, files);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + updatedPost.getId() + "-" + updatedPost.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

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

    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> deletePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            postService.deletePost(postId, userId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

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

    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> likePost(
            @PathVariable String postId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            Post post = postService.likePost(postId, userId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

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

    @PostMapping("/{postId}/comment")
    public ResponseEntity<Map<String, Object>> addComment(
            @PathVariable String postId,
            @RequestBody CommentRequest commentRequest,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            Post post = postService.addComment(postId, userId, commentRequest.getComment());
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

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

    @PutMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestBody CommentRequest commentRequest,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            Post post = postService.updateComment(postId, commentId, userId, commentRequest.getComment());
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

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

    @DeleteMapping("/{postId}/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "User not authenticated"));
        }

        try {
            Post post = postService.deleteComment(postId, commentId, userId);
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("ETag", "\"" + post.getId() + "-" + post.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli() + "\"");

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

class CommentRequest {
    private String comment;

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}