package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumComment;
import com.nexora.server.service.AuthenticationService;
import com.nexora.server.service.forum.ForumCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing forum comments.
 */
@RestController
@RequestMapping("/api/forum/comments")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ForumCommentController {

    @Autowired
    private ForumCommentService commentService;

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * Creates a new comment for a forum question.
     *
     * @param authHeader Authorization header containing JWT token
     * @param comment    Comment data from request body
     * @param ucb        UriComponentsBuilder for building resource URI
     * @return ResponseEntity with created comment or error
     */
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createComment(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ForumComment comment,
            UriComponentsBuilder ucb) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumComment createdComment = commentService.createComment(comment, userId);
            URI locationUri = ucb.path("/api/forum/comments/{id}")
                    .buildAndExpand(createdComment.getId()).toUri();
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/forum/comments/" + createdComment.getId());
            links.put("question", "/api/questions/" + createdComment.getQuestionId());
            Map<String, Object> response = new HashMap<>();
            response.put("comment", createdComment);
            response.put("_links", links);
            return ResponseEntity.created(locationUri)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Updates an existing comment.
     *
     * @param id         Comment ID
     * @param authHeader Authorization header containing JWT token
     * @param comment    Updated comment data
     * @return ResponseEntity with updated comment or error
     */
    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateComment(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ForumComment comment) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumComment updatedComment = commentService.updateComment(id, comment, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/forum/comments/" + id);
            links.put("question", "/api/questions/" + updatedComment.getQuestionId());
            Map<String, Object> response = new HashMap<>();
            response.put("comment", updatedComment);
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

    /**
     * Deletes a comment by ID.
     *
     * @param id         Comment ID
     * @param authHeader Authorization header containing JWT token
     * @return ResponseEntity with success message or error
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            commentService.deleteComment(id, userId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("message", "Comment deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    /**
     * Retrieves all comments for a specific question.
     *
     * @param questionId Question ID
     * @param ifNoneMatch Optional ETag for caching
     * @return ResponseEntity with list of comments or 304 if not modified
     */
    @GetMapping(value = "/question/{questionId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getCommentsByQuestionId(
            @PathVariable String questionId,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        List<ForumComment> comments = commentService.getCommentsByQuestionId(questionId);
        String etag = "\"" + Integer.toHexString(comments.hashCode()) + "\"";
        if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
            return ResponseEntity.status(304)
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .header(HttpHeaders.ETAG, etag)
                    .build();
        }
        Map<String, String> links = new HashMap<>();
        links.put("self", "/api/forum/comments/question/" + questionId);
        links.put("question", "/api/questions/" + questionId);
        Map<String, Object> response = new HashMap<>();
        response.put("comments", comments);
        response.put("_links", links);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .header(HttpHeaders.ETAG, etag)
                .body(response);
    }

    /**
     * Upvotes or downvotes a comment.
     *
     * @param id         Comment ID
     * @param authHeader Authorization header containing JWT token
     * @param voteRequest Map containing "voteType" ("upvote" or "downvote")
     * @return ResponseEntity with updated comment or error
     */
    @PatchMapping(value = "/{id}/vote", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> voteComment(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> voteRequest) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            String voteType = voteRequest.get("voteType"); // "upvote" or "downvote"
            ForumComment comment;
            if ("upvote".equalsIgnoreCase(voteType)) {
                comment = commentService.upvoteComment(id, userId);
            } else if ("downvote".equalsIgnoreCase(voteType)) {
                comment = commentService.downvoteComment(id, userId);
            } else {
                return ResponseEntity.badRequest()
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(createErrorResponse("Invalid vote type"));
            }
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/forum/comments/" + id);
            links.put("question", "/api/questions/" + comment.getQuestionId());
            Map<String, Object> response = new HashMap<>();
            response.put("comment", comment);
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

    /**
     * Flags a comment as inappropriate.
     *
     * @param id         Comment ID
     * @param authHeader Authorization header containing JWT token
     * @return ResponseEntity with success message or error
     */
    @PatchMapping(value = "/{id}/flag", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> flagComment(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            commentService.flagComment(id, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/forum/comments/" + id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Comment flagged");
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

    /**
     * Extracts the user ID from the JWT token in the Authorization header.
     *
     * @param authHeader Authorization header
     * @return User ID if valid, null otherwise
     */
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

    /**
     * Creates a simple error response map.
     *
     * @param message Error message
     * @return Map containing the error message
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}