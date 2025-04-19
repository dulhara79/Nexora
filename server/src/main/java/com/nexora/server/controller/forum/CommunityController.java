package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.Community;
import com.nexora.server.repository.forum.CommunityRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CommunityController {

    @Autowired
    private CommunityRepository communityRepository;

    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities(Authentication authentication) {
        // Check if user is authenticated
        // if (authentication == null || !authentication.isAuthenticated()) {
        //     return ResponseEntity.status(401).build(); // Return 401 if not authenticated
        // }
        System.out.println("Authentication: " + authentication); // Log authentication details
        List<Community> communities = communityRepository.findAll();
        return ResponseEntity.ok(communities);
    }
}