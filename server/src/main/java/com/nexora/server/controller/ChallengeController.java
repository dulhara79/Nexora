// package com.nexora.server.controller;

// import com.nexora.server.model.Challenge;
// import com.nexora.server.service.ChallengeService;
// import jakarta.servlet.http.HttpSession;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.format.annotation.DateTimeFormat;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.time.LocalDate;
// import java.util.List;
// import java.util.Optional;
// import java.util.logging.Logger;

// @RestController
// @RequestMapping("/api/challenges")
// @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
// public class ChallengeController {

//     private static final Logger LOGGER = Logger.getLogger(ChallengeController.class.getName());

//     @Autowired
//     private ChallengeService challengeService;

//     @PostMapping
//     public ResponseEntity<?> createChallenge(
//             @RequestParam("title") String title,
//             @RequestParam("description") String description,
//             @RequestParam("theme") String theme,
//             @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//             @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
//             @RequestParam(value = "photo", required = false) MultipartFile photo,
//             HttpSession session) {
//         try {
//             String userId = (String) session.getAttribute("userId");
//             if (userId == null) {
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//             }
//             LOGGER.info("Create challenge post request>> " + userId + " " + title + " " + description + " " + theme + " " + startDate + " " + endDate);
//             Challenge challenge = challengeService.createChallenge(title, description, theme, 
//                                                                 startDate, endDate, userId, photo);
//             return ResponseEntity.ok(challenge);
//         } catch (Exception e) {
//             LOGGER.severe("Error creating challenge: " + e.getMessage());
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @GetMapping
//     public ResponseEntity<List<Challenge>> getAllChallenges() {
//         return ResponseEntity.ok(challengeService.getAllChallenges());
//     }

//     @GetMapping("/{challengeId}")
//     public ResponseEntity<?> getChallengeById(@PathVariable String challengeId) {
//         Optional<Challenge> challenge = challengeService.getChallengeById(challengeId);
//         if (challenge.isPresent()) {
//             return ResponseEntity.ok(challenge.get());
//         }
//         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Challenge not found");
//     }

//     @PutMapping("/{challengeId}")
//     public ResponseEntity<?> updateChallenge(
//             @PathVariable String challengeId,
//             @RequestParam(value = "title", required = false) String title,
//             @RequestParam(value = "description", required = false) String description,
//             @RequestParam(value = "theme", required = false) String theme,
//             @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//             @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
//             @RequestParam(value = "photo", required = false) MultipartFile photo,
//             HttpSession session) {
//         try {
//             String userId = (String) session.getAttribute("userId");
//             if (userId == null) {
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//             }
//             Challenge updatedChallenge = challengeService.updateChallenge(challengeId, title, description, 
//                                                                        theme, startDate, endDate, userId, photo);
//             return ResponseEntity.ok(updatedChallenge);
//         } catch (Exception e) {
//             LOGGER.severe("Error updating challenge: " + e.getMessage());
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @DeleteMapping("/{challengeId}")
//     public ResponseEntity<?> deleteChallenge(@PathVariable String challengeId, HttpSession session) {
//         try {
//             String userId = (String) session.getAttribute("userId");
//             if (userId == null) {
//                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//             }
//             challengeService.deleteChallenge(challengeId, userId);
//             return ResponseEntity.ok("Challenge deleted successfully");
//         } catch (Exception e) {
//             LOGGER.severe("Error deleting challenge: " + e.getMessage());
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }
// }



package com.nexora.server.controller;

import com.nexora.server.model.Challenge;
import com.nexora.server.service.ChallengeService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

record ChallengeRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String theme,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
) {}

@RestController
@RequestMapping(value = "/api/challenges", produces = MediaType.APPLICATION_JSON_VALUE)
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Validated
public class ChallengeController {

    private static final Logger LOGGER = Logger.getLogger(ChallengeController.class.getName());

    @Autowired
    private ChallengeService challengeService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createChallenge(
            @Valid @RequestPart("challenge") ChallengeRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            String userId = jwt.getSubject();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "User not authenticated"));
            }
            LOGGER.info("Create challenge request by user: " + userId);
            Challenge challenge = challengeService.createChallenge(
                    request.title(),
                    request.description(),
                    request.theme(),
                    request.startDate(),
                    request.endDate(),
                    userId,
                    photo
            );
            EntityModel<Challenge> resource = toEntityModel(challenge);
            return ResponseEntity.created(resource.getRequiredLink("self").toUri())
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(resource);
        } catch (Exception e) {
            LOGGER.severe("Error creating challenge: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<EntityModel<Challenge>>> getAllChallenges() {
        List<EntityModel<Challenge>> challenges = challengeService.getAllChallenges()
                .stream()
                .map(this::toEntityModel)
                .collect(Collectors.toList());
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=3600, must-revalidate")
                .header(HttpHeaders.ETAG, generateETag(challenges))
                .body(challenges);
    }

    @GetMapping("/{challengeId}")
    public ResponseEntity<?> getChallengeById(@PathVariable String challengeId) {
        Optional<Challenge> challenge = challengeService.getChallengeById(challengeId);
        if (challenge.isPresent()) {
            EntityModel<Challenge> resource = toEntityModel(challenge.get());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600, must-revalidate")
                    .header(HttpHeaders.ETAG, generateETag(challenge.get()))
                    .body(resource);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(Map.of("error", "Challenge not found"));
    }

    @PutMapping(value = "/{challengeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateChallenge(
            @PathVariable String challengeId,
            @Valid @RequestPart("challenge") ChallengeRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            String userId = jwt.getSubject();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "User not authenticated"));
            }
            Challenge updatedChallenge = challengeService.updateChallenge(
                    challengeId,
                    request.title(),
                    request.description(),
                    request.theme(),
                    request.startDate(),
                    request.endDate(),
                    userId,
                    photo
            );
            EntityModel<Challenge> resource = toEntityModel(updatedChallenge);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(resource);
        } catch (Exception e) {
            LOGGER.severe("Error updating challenge: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{challengeId}")
    public ResponseEntity<?> deleteChallenge(
            @PathVariable String challengeId,
            @AuthenticationPrincipal Jwt jwt) {
        try {
            String userId = jwt.getSubject();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "User not authenticated"));
            }
            challengeService.deleteChallenge(challengeId, userId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("message", "Challenge deleted successfully"));
        } catch (Exception e) {
            LOGGER.severe("Error deleting challenge: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    private EntityModel<Challenge> toEntityModel(Challenge challenge) {
        EntityModel<Challenge> model = EntityModel.of(challenge);
        model.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(ChallengeController.class).getChallengeById(challenge.getChallengeId())
        ).withSelfRel());
        model.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(ChallengeController.class).getAllChallenges()
        ).withRel("challenges"));
        if (challenge.getCreatedBy() != null) {
            model.add(WebMvcLinkBuilder.linkTo(
                    WebMvcLinkBuilder.methodOn(ChallengeController.class).updateChallenge(challenge.getChallengeId(), null, null, null)
            ).withRel("update"));
            model.add(WebMvcLinkBuilder.linkTo(
                    WebMvcLinkBuilder.methodOn(ChallengeController.class).deleteChallenge(challenge.getChallengeId(), null)
            ).withRel("delete"));
        }
        return model;
    }

    private String generateETag(Object resource) {
        return "\"" + resource.hashCode() + "\"";
    }
}