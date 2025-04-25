package com.nexora.server.controller;

import com.nexora.server.model.Challenge;
import com.nexora.server.service.ChallengeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ChallengeController {

    private static final Logger LOGGER = Logger.getLogger(ChallengeController.class.getName());

    @Autowired
    private ChallengeService challengeService;

    @PostMapping
    public ResponseEntity<?> createChallenge(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("theme") String theme,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }
            LOGGER.info("Create challenge post request>> " + userId + " " + title + " " + description + " " + theme + " " + startDate + " " + endDate);
            Challenge challenge = challengeService.createChallenge(title, description, theme, 
                                                                startDate, endDate, userId, photo);
            return ResponseEntity.ok(challenge);
        } catch (Exception e) {
            LOGGER.severe("Error creating challenge: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Challenge>> getAllChallenges() {
        return ResponseEntity.ok(challengeService.getAllChallenges());
    }

    @GetMapping("/{challengeId}")
    public ResponseEntity<?> getChallengeById(@PathVariable String challengeId) {
        Optional<Challenge> challenge = challengeService.getChallengeById(challengeId);
        if (challenge.isPresent()) {
            return ResponseEntity.ok(challenge.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Challenge not found");
    }

    @PutMapping("/{challengeId}")
    public ResponseEntity<?> updateChallenge(
            @PathVariable String challengeId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "theme", required = false) String theme,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }
            Challenge updatedChallenge = challengeService.updateChallenge(challengeId, title, description, 
                                                                       theme, startDate, endDate, userId, photo);
            return ResponseEntity.ok(updatedChallenge);
        } catch (Exception e) {
            LOGGER.severe("Error updating challenge: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{challengeId}")
    public ResponseEntity<?> deleteChallenge(@PathVariable String challengeId, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }
            challengeService.deleteChallenge(challengeId, userId);
            return ResponseEntity.ok("Challenge deleted successfully");
        } catch (Exception e) {
            LOGGER.severe("Error deleting challenge: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}