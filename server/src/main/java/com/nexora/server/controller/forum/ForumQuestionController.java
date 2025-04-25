package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumQuestion;
import com.nexora.server.repository.forum.ForumQuestionRepository;
import com.nexora.server.service.AuthenticationService;
import com.nexora.server.service.forum.ForumQuestionService;
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
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ForumQuestionController {

    @Autowired
    private ForumQuestionService questionService;

    @Autowired
    private ForumQuestionRepository questionRepository;

    @Autowired
    private AuthenticationService authenticationService;
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createQuestion(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ForumQuestion question,
            UriComponentsBuilder ucb) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumQuestion createdQuestion = questionService.createQuestion(question, userId);
            URI locationUri = ucb.path("/api/questions/{id}")
                    .buildAndExpand(createdQuestion.getId()).toUri();
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/questions/" + createdQuestion.getId());
            links.put("comments", "/api/forum/comments/question/" + createdQuestion.getId());
            Map<String, Object> response = new HashMap<>();
            response.put("question", createdQuestion);
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
    public ResponseEntity<?> updateQuestion(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ForumQuestion question) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumQuestion updatedQuestion = questionService.updateQuestion(id, question, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/questions/" + id);
            links.put("comments", "/api/forum/comments/question/" + id);
            Map<String, Object> response = new HashMap<>();
            response.put("question", updatedQuestion);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            questionService.deleteQuestion(id, userId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("message", "Question deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getQuestions(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        List<ForumQuestion> questions = questionService.getQuestions(tag, search, sortBy);
        String etag = "\"" + Integer.toHexString(questions.hashCode()) + "\"";
        if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
            return ResponseEntity.status(304)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                    .header(HttpHeaders.ETAG, etag)
                    .build();
        }
        Map<String, String> links = new HashMap<>();
        links.put("self", "/api/questions");
        Map<String, Object> response = new HashMap<>();
        response.put("questions", questions);
        response.put("_links", links);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                .header(HttpHeaders.ETAG, etag)
                .body(response);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getQuestion(
            @PathVariable String id,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        try {
            Optional<ForumQuestion> question = questionRepository.findById(id);
            if (question.isPresent()) {
                String etag = "\"" + Integer.toHexString(question.get().hashCode()) + "\"";
                if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
                    return ResponseEntity.status(304)
                            .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                            .header(HttpHeaders.ETAG, etag)
                            .build();
                }
                Map<String, String> links = new HashMap<>();
                links.put("self", "/api/questions/" + id);
                links.put("comments", "/api/forum/comments/question/" + id);
                Map<String, Object> response = new HashMap<>();
                response.put("question", question.get());
                response.put("_links", links);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                        .header(HttpHeaders.ETAG, etag)
                        .body(response);
            }
            return ResponseEntity.status(404)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Question not found"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @PatchMapping(value = "/{id}/vote", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> voteQuestion(
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
            ForumQuestion question;
            if ("upvote".equalsIgnoreCase(voteType)) {
                question = questionService.upvoteQuestion(id, userId);
            } else if ("downvote".equalsIgnoreCase(voteType)) {
                question = questionService.downvoteQuestion(id, userId);
            } else {
                return ResponseEntity.badRequest()
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(createErrorResponse("Invalid vote type"));
            }
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/questions/" + id);
            links.put("comments", "/api/forum/comments/question/" + id);
            Map<String, Object> response = new HashMap<>();
            response.put("question", question);
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

    @PatchMapping(value = "/{id}/flag", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> flagQuestion(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            questionService.flagQuestion(id, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/questions/" + id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Question flagged");
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

    @PostMapping(value = "/saved-questions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveQuestion(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> requestBody,
            UriComponentsBuilder ucb) {
        String userId = extractUserIdFromToken(authHeader);
        String questionId = requestBody.get("questionId");
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            questionService.saveQuestion(questionId, userId);
            URI locationUri = ucb.path("/api/questions/saved-questions").build().toUri();
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/questions/saved-questions");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Question saved");
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

    @GetMapping(value = "/saved-questions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getSavedQuestions(
            @RequestHeader("Authorization") String authHeader,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            List<ForumQuestion> savedQuestions = questionService.getSavedQuestions(userId);
            String etag = "\"" + Integer.toHexString(savedQuestions.hashCode()) + "\"";
            if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
                return ResponseEntity.status(304)
                        .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                        .header(HttpHeaders.ETAG, etag)
                        .build();
            }
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/questions/saved-questions");
            Map<String, Object> response = new HashMap<>();
            response.put("questions", savedQuestions);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                    .header(HttpHeaders.ETAG, etag)
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping(value = "/saved-questions/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> unsaveQuestion(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            questionService.unsaveQuestion(id, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/questions/saved-questions");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Question unsaved");
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

    @PatchMapping(value = "/{id}/pin", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> togglePinQuestion(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumQuestion question = questionService.togglePinQuestion(id, userId);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/questions/" + id);
            links.put("comments", "/api/forum/comments/question/" + id);
            Map<String, Object> response = new HashMap<>();
            response.put("question", question);
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