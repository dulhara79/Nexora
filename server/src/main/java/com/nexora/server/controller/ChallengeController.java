package com.nexora.server.controller;

import com.nexora.server.model.Challenge;
import com.nexora.server.service.AuthenticationService;
import com.nexora.server.service.ChallengeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

// Define a record for the request body to ensure structured JSON input
record ChallengeRequest(
        String title,
        String description,
        String theme,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate startDate,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate endDate
) {}

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ChallengeController {

    private static final Logger LOGGER = Logger.getLogger(ChallengeController.class.getName());

    @Autowired
    private ChallengeService challengeService;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createChallenge(
            @Valid @ModelAttribute ChallengeRequest challengeRequest,
            @RequestParam(value = "photo", required = false) org.springframework.web.multipart.MultipartFile photo,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            LOGGER.info("Create challenge request>> " + userId + " " + challengeRequest.title());
            Challenge challenge = challengeService.createChallenge(
                    challengeRequest.title(),
                    challengeRequest.description(),
                    challengeRequest.theme(),
                    challengeRequest.startDate(),
                    challengeRequest.endDate(),
                    userId,
                    photo
            );
            // Add HATEOAS links
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/challenges/" + challenge.getChallengeId());
            links.put("all", "/api/challenges");
            Map<String, Object> response = new HashMap<>();
            response.put("challenge", challenge);
            response.put("_links", links);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            LOGGER.severe("Error creating challenge: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllChallenges(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        try {
            List<Challenge> challenges = challengeService.getAllChallenges();
            String etag = "\"" + Integer.toHexString(challenges.hashCode()) + "\"";
            if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
                return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .header(HttpHeaders.ETAG, etag)
                        .build();
            }
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/challenges");
            Map<String, Object> response = new HashMap<>();
            response.put("challenges", challenges);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .header(HttpHeaders.ETAG, etag)
                    .body(response);
        } catch (Exception e) {
            LOGGER.severe("Error fetching challenges: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{challengeId}")
    public ResponseEntity<?> getChallengeById(
            @PathVariable String challengeId,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        try {
            Optional<Challenge> challenge = challengeService.getChallengeById(challengeId);
            if (challenge.isPresent()) {
                String etag = "\"" + Integer.toHexString(challenge.get().hashCode()) + "\"";
                if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
                    return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                            .header(HttpHeaders.CACHE_CONTROL, "no-store")
                            .header(HttpHeaders.ETAG, etag)
                            .build();
                }
                Map<String, String> links = new HashMap<>();
                links.put("self", "/api/challenges/" + challengeId);
                links.put("all", "/api/challenges");
                Map<String, Object> response = new HashMap<>();
                response.put("challenge", challenge.get());
                response.put("_links", links);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .header(HttpHeaders.ETAG, etag)
                        .body(response);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Challenge not found"));
        } catch (Exception e) {
            LOGGER.severe("Error fetching challenge: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @PutMapping(value = "/{challengeId}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateChallenge(
            @PathVariable String challengeId,
            @Valid @ModelAttribute ChallengeRequest challengeRequest,
            @RequestParam(value = "photo", required = false) org.springframework.web.multipart.MultipartFile photo,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            Challenge updatedChallenge = challengeService.updateChallenge(
                    challengeId,
                    challengeRequest.title(),
                    challengeRequest.description(),
                    challengeRequest.theme(),
                    challengeRequest.startDate(),
                    challengeRequest.endDate(),
                    userId,
                    photo
            );
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/challenges/" + challengeId);
            links.put("all", "/api/challenges");
            Map<String, Object> response = new HashMap<>();
            response.put("challenge", updatedChallenge);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            LOGGER.severe("Error updating challenge: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{challengeId}")
    public ResponseEntity<?> deleteChallenge(
            @PathVariable String challengeId,
            @RequestHeader("Authorization") String authHeader) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        try {
            challengeService.deleteChallenge(challengeId, userId);
            Map<String, String> links = new HashMap<>();
            links.put("all", "/api/challenges");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Challenge deleted successfully");
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            LOGGER.severe("Error deleting challenge: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    private String extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            LOGGER.warning("Invalid Authorization header");
            return null;
        }
        String token = authHeader.substring(7);
        try {
            return authenticationService.validateJwtToken(token).getId();
        } catch (Exception e) {
            LOGGER.warning("Token validation failed: " + e.getMessage());
            return null;
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}