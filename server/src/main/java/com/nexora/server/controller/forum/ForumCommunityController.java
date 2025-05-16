package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumCommunity;
import com.nexora.server.repository.forum.ForumCommunityRepository;
import com.nexora.server.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing forum communities.
 */
@RestController
@RequestMapping("/api/communities")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ForumCommunityController {

    @Autowired
    private ForumCommunityRepository communityRepository;

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * Retrieves all forum communities.
     * Requires a valid JWT token in the Authorization header.
     * Supports ETag caching.
     *
     * @param authHeader   The Authorization header containing the JWT token.
     * @param ifNoneMatch  The If-None-Match header for ETag support.
     * @return             A list of communities or 304 if not modified.
     */
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllCommunities(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            // Return 401 Unauthorized if token is missing or invalid
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        // Fetch all communities from the repository
        List<ForumCommunity> communities = communityRepository.findAll();
        // Generate ETag based on the communities list hash
        String etag = "\"" + Integer.toHexString(communities.hashCode()) + "\"";
        // If the ETag matches, return 304 Not Modified
        if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
            return ResponseEntity.status(304)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                    .header(HttpHeaders.ETAG, etag)
                    .build();
        }
        // Prepare HATEOAS-style links
        Map<String, String> links = new HashMap<>();
        links.put("self", "/api/communities");
        // Prepare the response body
        Map<String, Object> response = new HashMap<>();
        response.put("communities", communities);
        response.put("_links", links);
        // Return the response with ETag and cache headers
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                .header(HttpHeaders.ETAG, etag)
                .body(response);
    }

    /**
     * Extracts the user ID from the JWT token in the Authorization header.
     *
     * @param authHeader The Authorization header.
     * @return           The user ID if valid, otherwise null.
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
     * @param message The error message.
     * @return        A map containing the error message.
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}