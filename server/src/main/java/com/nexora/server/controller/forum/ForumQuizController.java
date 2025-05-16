package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumQuiz;
import com.nexora.server.service.AuthenticationService;
import com.nexora.server.service.forum.ForumQuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ForumQuizController {

    @Autowired
    private ForumQuizService quizService;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createQuiz(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ForumQuiz quiz,
            UriComponentsBuilder ucb) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumQuiz createdQuiz = quizService.createQuiz(quiz, userId);
            URI locationUri = ucb.path("/api/quizzes/{id}")
                    .buildAndExpand(createdQuiz.getId()).toUri();
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/quizzes/" + createdQuiz.getId());
            Map<String, Object> response = new HashMap<>();
            response.put("quiz", createdQuiz);
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

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateQuiz(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ForumQuiz quizUpdate) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumQuiz updatedQuiz = quizService.updateQuiz(id, quizUpdate, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/quizzes/" + id);
            Map<String, Object> response = new HashMap<>();
            response.put("quiz", updatedQuiz);
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

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteQuiz(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            quizService.deleteQuiz(id, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Quiz deleted successfully");
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @PatchMapping(value = "/{id}/answer", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> submitAnswer(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<Integer, String> answers) {
        String userId = extractUserIdFromToken(authHeader);
        System.out.println();
        System.out.println("......Quiz controller submit answer... userId: " + userId);
        System.out.println("......Quiz controller submit answer... answers: " + answers);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumQuiz updatedQuiz = quizService.submitAnswer(id, answers, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/quizzes/" + id);
            Map<String, Object> response = new HashMap<>();
            response.put("quiz", updatedQuiz);
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

    @PatchMapping(value = "/{id}/clear-attempt", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> clearAttempt(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumQuiz updatedQuiz = quizService.clearAttempt(id, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/quizzes/" + id);
            Map<String, Object> response = new HashMap<>();
            response.put("quiz", updatedQuiz);
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

    @PatchMapping(value = "/{id}/vote", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> upvoteQuiz(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumQuiz updatedQuiz = quizService.upvoteQuiz(id, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/quizzes/" + id);
            Map<String, Object> response = new HashMap<>();
            response.put("quiz", updatedQuiz);
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

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getActiveQuizzes(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        try {
            quizService.closeExpiredQuizzes();
            List<ForumQuiz> quizzes = quizService.getActiveQuizzes();
            String etag = "\"" + Integer.toHexString(quizzes.hashCode()) + "\"";
            if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
                return ResponseEntity.status(304)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .header(HttpHeaders.ETAG, etag)
                        .build();
            }
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/quizzes");
            Map<String, Object> response = new HashMap<>();
            response.put("quizzes", quizzes);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .header(HttpHeaders.ETAG, etag)
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping(value = "/{id}/stats", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getQuizStats(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            Map<String, Object> stats = quizService.getQuizStats(id, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/quizzes/" + id + "/stats");
            Map<String, Object> response = new HashMap<>();
            response.put("stats", stats);
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

    @GetMapping(value = "/author/{authorId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getQuizzesByAuthor(
            @PathVariable String authorId,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        try {
            List<ForumQuiz> quizzes = quizService.getQuizzesByAuthor(authorId);
            String etag = "\"" + Integer.toHexString(quizzes.hashCode()) + "\"";
            if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
                return ResponseEntity.status(304)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .header(HttpHeaders.ETAG, etag)
                        .build();
            }
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/quizzes/author/" + authorId);
            Map<String, Object> response = new HashMap<>();
            response.put("quizzes", quizzes);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .header(HttpHeaders.ETAG, etag)
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getQuiz(
            @PathVariable String id,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        try {
            Optional<ForumQuiz> quizOptional = quizService.getQuizById(id);
            if (!quizOptional.isPresent()) {
                return ResponseEntity.status(404)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(createErrorResponse("Quiz not found"));
            }
            ForumQuiz quiz = quizOptional.get();
            if (quiz.getDeadline().isBefore(LocalDateTime.now())) {
                quiz.setActive(false);
                quizService.saveQuiz(quiz);
            }
            String etag = "\"" + Integer.toHexString(quiz.hashCode()) + "\"";
            if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
                return ResponseEntity.status(304)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .header(HttpHeaders.ETAG, etag)
                        .build();
            }
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/quizzes/" + id);
            Map<String, Object> response = new HashMap<>();
            response.put("quiz", quiz);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .header(HttpHeaders.ETAG, etag)
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