// package com.nexora.server.controller;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.nexora.server.model.User;
// import com.nexora.server.service.RegistrationService;
// import jakarta.validation.Valid;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.validation.annotation.Validated;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/users")
// @CrossOrigin(origins = "http://localhost:5173")
// @Validated
// public class RegistrationController {

//     @Autowired
//     private RegistrationService registrationService;

//     @Autowired
//     private ObjectMapper objectMapper; // Add ObjectMapper for JSON parsing

//     @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
//     public ResponseEntity<?> register(
//             @RequestPart("user") String userJson, // Change to String to receive JSON string
//             @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto) {
//         try {
//             // Parse the JSON string into a UserRequest object
//             UserRequest userRequest = objectMapper.readValue(userJson, UserRequest.class);

//             // Validate MultipartFile if provided
//             if (profilePhoto != null && (profilePhoto.isEmpty() || !isValidFileType(profilePhoto))) {
//                 return ResponseEntity.badRequest()
//                         .header(HttpHeaders.CACHE_CONTROL, "no-store")
//                         .body(Map.of("error", "Invalid or empty profile photo"));
//             }

//             User registeredUser = registrationService.registerUser(userRequest, profilePhoto);
//             Map<String, String> links = new HashMap<>();
//             links.put("verify", "/api/users/" + registeredUser.getEmail() + "/verification");
//             links.put("self", "/api/users/" + registeredUser.getId());
//             String token = registrationService.generateJwtToken(registeredUser);
//             return ResponseEntity.ok()
//                     .header(HttpHeaders.CACHE_CONTROL, "no-store")
//                     .body(new UserResponse(registeredUser.getId(), registeredUser.getEmail(),
//                             registeredUser.getName(), token, links));
//         } catch (Exception e) {
//             return ResponseEntity.badRequest()
//                     .header(HttpHeaders.CACHE_CONTROL, "no-store")
//                     .body(Map.of("error", e.getMessage()));
//         }
//     }

//     @PostMapping(value = "/{email}/verification", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
//     public ResponseEntity<?> verifyEmail(
//             @PathVariable String email,
//             @RequestBody Map<String, String> verificationRequest) {
//         try {
//             String code = verificationRequest.get("code");
//             if (code == null || code.isBlank()) {
//                 throw new IllegalArgumentException("Verification code is required");
//             }
//             String result = registrationService.verifyEmail(email, code);
//             Map<String, String> links = new HashMap<>();
//             links.put("self", "/api/users/" + email + "/verification");
//             links.put("login", "/api/auth/login");
//             return ResponseEntity.ok()
//                     .header(HttpHeaders.CACHE_CONTROL, "no-store")
//                     .body(Map.of("message", result, "_links", links));
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                     .header(HttpHeaders.CACHE_CONTROL, "no-store")
//                     .body(Map.of("error", e.getMessage(), "email", email));
//         }
//     }

//     // Utility method to validate file type
//     private boolean isValidFileType(MultipartFile file) {
//         String contentType = file.getContentType();
//         return contentType != null && (
//                 contentType.equals("image/jpeg") ||
//                 contentType.equals("image/png") ||
//                 contentType.equals("image/gif")
//         );
//     }
// }

package com.nexora.server.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexora.server.model.User;
import com.nexora.server.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(
            @RequestPart("user") String userJson,
            @RequestPart(value = "profilePhoto", required = false) MultipartFile profilePhoto) {
        try {
            UserRequest userRequest = objectMapper.readValue(userJson, UserRequest.class);

            if (profilePhoto != null && (profilePhoto.isEmpty() || !isValidFileType(profilePhoto))) {
                return ResponseEntity.badRequest()
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(Map.of("error", "Invalid or empty profile photo"));
            }

            User registeredUser = registrationService.registerUser(userRequest, profilePhoto);
            Map<String, String> links = new HashMap<>();
            links.put("verify", "/api/users/" + registeredUser.getEmail() + "/verification");
            links.put("self", "/api/users/" + registeredUser.getId());
            String token = registrationService.generateJwtToken(registeredUser);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(new UserResponse(registeredUser.getId(), registeredUser.getEmail(),
                            registeredUser.getName(), registeredUser.getProfilePhotoUrl(), token, links));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/{email}/verification", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> verifyEmail(
            @PathVariable String email,
            @RequestBody Map<String, String> verificationRequest) {
        try {
            String code = verificationRequest.get("code");
            if (code == null || code.isBlank()) {
                throw new IllegalArgumentException("Verification code is required");
            }
            String result = registrationService.verifyEmail(email, code);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/users/" + email + "/verification");
            links.put("login", "/api/auth/login");
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("message", result, "_links", links));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage(), "email", email));
        }
    }

    private boolean isValidFileType(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                contentType.equals("image/png") ||
                contentType.equals("image/gif")
        );
    }
}