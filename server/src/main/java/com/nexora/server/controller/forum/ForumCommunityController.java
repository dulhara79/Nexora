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

@RestController
@RequestMapping("/api/communities")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ForumCommunityController {

    @Autowired
    private ForumCommunityRepository communityRepository;

    @Autowired
    private AuthenticationService authenticationService;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllCommunities(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        String userId = extractUserIdFromToken(authHeader);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(createErrorResponse("Unauthorized"));
        }
        List<ForumCommunity> communities = communityRepository.findAll();
        String etag = "\"" + Integer.toHexString(communities.hashCode()) + "\"";
        if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
            return ResponseEntity.status(304)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                    .header(HttpHeaders.ETAG, etag)
                    .build();
        }
        Map<String, String> links = new HashMap<>();
        links.put("self", "/api/communities");
        Map<String, Object> response = new HashMap<>();
        response.put("communities", communities);
        response.put("_links", links);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                .header(HttpHeaders.ETAG, etag)
                .body(response);
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