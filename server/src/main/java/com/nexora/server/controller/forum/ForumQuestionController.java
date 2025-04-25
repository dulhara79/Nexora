package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumQuestion;
import com.nexora.server.repository.forum.ForumQuestionRepository;
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

    // Changed: Renamed /add to root, removed HttpSession, added Location header, HATEOAS
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
            links.put("upvote", "/api/questions/" + createdQuestion.getId() + "/upvote");
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

    // Changed: Removed HttpSession, added HATEOAS links, no-store header
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

    // Changed: Removed HttpSession, added no-store header
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

    // Changed: Added Cache-Control for cacheability
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ForumQuestion>> getQuestions(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "newest") String sortBy) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                .body(questionService.getQuestions(tag, search, sortBy));
    }

    // Changed: Added Cache-Control, standardized error response
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getQuestion(@PathVariable String id) {
        try {
            Optional<ForumQuestion> question = questionRepository.findById(id);
            if (question.isPresent()) {
                Map<String, String> links = new HashMap<>();
                links.put("self", "/api/questions/" + id);
                links.put("comments", "/api/forum/comments/question/" + id);
                Map<String, Object> response = new HashMap<>();
                response.put("question", question.get());
                response.put("_links", links);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
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

    // Changed: Removed HttpSession, added HATEOAS links, no-store header
    @PostMapping(value = "/{id}/upvote", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> upvoteQuestion(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumQuestion question = questionService.upvoteQuestion(id, userId);
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

    // Changed: Removed HttpSession, added HATEOAS links, no-store header
    @PostMapping(value = "/{id}/downvote", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> downvoteQuestion(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            ForumQuestion question = questionService.downvoteQuestion(id, userId);
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

    // Changed: Removed HttpSession, added no-store header
    @PostMapping(value = "/{id}/flag", produces = MediaType.APPLICATION_JSON_VALUE)
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
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("message", "Question flagged"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Changed: Renamed /save to /saved-questions, removed HttpSession, added Location header
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
            return ResponseEntity.created(locationUri)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("message", "Question saved"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Changed: Removed HttpSession, added Cache-Control
    @GetMapping(value = "/saved-questions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getSavedQuestions(@RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            List<ForumQuestion> savedQuestions = questionService.getSavedQuestions(userId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                    .body(savedQuestions);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Changed: Renamed /unsave, removed HttpSession, added no-store header
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
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("message", "Question unsaved"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Changed: Added HATEOAS links, no-store header
    @PostMapping(value = "/{id}/view", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> incrementQuestionViews(@PathVariable String id) {
        try {
            ForumQuestion question = questionService.incrementViews(id);
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

    // Changed: Removed HttpSession, added HATEOAS links, no-store header
    @PostMapping(value = "/{id}/pin", produces = MediaType.APPLICATION_JSON_VALUE)
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
            return token; // Placeholder
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