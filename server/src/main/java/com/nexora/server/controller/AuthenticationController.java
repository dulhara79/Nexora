package com.nexora.server.controller;

import com.nexora.server.model.User;
import com.nexora.server.repository.UserRepository;
import com.nexora.server.service.AuthenticationService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

// Request payload for login endpoint
record LoginRequest(String email, String password) {}
// Request payload for OTP verification endpoint
record VerifyOtpRequest(String email, String otp) {}

/**
 * Controller for handling authentication-related endpoints.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Validated
public class AuthenticationController {

    private static final Logger LOGGER = Logger.getLogger(AuthenticationController.class.getName());

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Handles login requests by sending an OTP to the user's email.
     */
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        LOGGER.info("Received login request for email: " + loginRequest.email());
        try {
            String result = authenticationService.sendLoginOtp(loginRequest.email(), loginRequest.password());
            Map<String, String> links = new HashMap<>();
            links.put("verify", "/api/auth/login/verify");
            Map<String, Object> response = new HashMap<>();
            response.put("message", result);
            response.put("_links", links);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Verifies the OTP sent to the user's email and returns a JWT token if successful.
     */
    @PostMapping(value = "/login/verify", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> verifyLogin(@Valid @RequestBody VerifyOtpRequest verifyRequest) {
        LOGGER.info("Received OTP verification request for email: " + verifyRequest.email());
        try {
            User user = authenticationService.verifyLoginOtp(verifyRequest.email(), verifyRequest.otp());
            String token = authenticationService.generateJwtToken(user);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/auth/check-session");
            links.put("logout", "/api/auth/logout");
            LOGGER.info("Login successful for userId: " + user.getId());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getProfilePhotoUrl(), token, links));
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("email", verifyRequest.email());
            LOGGER.warning("Verification failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(errorResponse);
        }
    }

    /**
     * Handles Google OAuth2 login redirect. Returns a script to post user info or error to the frontend.
     */
    @GetMapping(value = "/google-redirect", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<?> googleRedirect(@AuthenticationPrincipal OAuth2User principal) {
        LOGGER.info("Handling Google redirect for OAuth2 authentication");
        if (principal == null) {
            LOGGER.severe("OAuth2User principal is null");
            String errorScript = "<script>window.opener.postMessage({ error: 'No authenticated user found' }, 'http://localhost:5173'); window.close();</script>";
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(errorScript);
        }
        try {
            String email = principal.getAttribute("email");
            String name = principal.getAttribute("name");
            String picture = principal.getAttribute("picture");
            if (email == null || name == null) {
                LOGGER.severe("Email or name missing in OAuth2User principal");
                String errorScript = "<script>window.opener.postMessage({ error: 'Invalid user data from Google' }, 'http://localhost:5173'); window.close();</script>";
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .header(HttpHeaders.CACHE_CONTROL, "no-store")
                        .body(errorScript);
            }
            // Handle Google login and update user info
            User user = authenticationService.handleGoogleLogin(email, name);
            user.setProfilePhotoUrl(picture != null ? picture : user.getProfilePhotoUrl());
            user = userRepository.save(user);
            String token = authenticationService.generateJwtToken(user);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/auth/check-session");
            links.put("logout", "/api/auth/logout");
            LOGGER.info("Google login successful for userId: " + user.getId());

            // Return script to post user info to frontend and close popup
            String script = String.format(
                    "<script>" +
                    "window.opener.postMessage({" +
                    "  userId: '%s'," +
                    "  token: '%s'," +
                    "  email: '%s'," +
                    "  name: '%s'" +
                    "}, 'http://localhost:5173');" +
                    "window.close();" +
                    "</script>",
                    user.getId(), token, user.getEmail(), user.getName()
            );
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(script);
        } catch (Exception e) {
            LOGGER.severe("Google login error: " + e.getMessage());
            String errorScript = String.format(
                    "<script>window.opener.postMessage({ error: 'Google login failed: %s' }, 'http://localhost:5173'); window.close();</script>",
                    e.getMessage()
            );
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(errorScript);
        }
    }

    /**
     * Handles Google login failure and notifies the frontend.
     */
    @GetMapping("/login/failure")
    public ResponseEntity<?> googleLoginFailure() {
        LOGGER.info("Handling login failure");
        String errorScript = "<script>window.opener.postMessage({ error: 'Google login failed' }, 'http://localhost:5173'); window.close();</script>";
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(errorScript);
    }

    /**
     * Checks if the provided JWT token is valid and returns user info if so.
     */
    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", "No valid token provided"));
        }

        String token = authHeader.substring(7);

        try {
            User user = authenticationService.validateJwtToken(token);
            Map<String, String> links = new HashMap<>();
            links.put("self", "/api/auth/check-session");
            links.put("logout", "/api/auth/logout");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate") // Prevent caching
                    .header(HttpHeaders.VARY, "Authorization") // Differentiate by token
                    .header(HttpHeaders.ETAG, "\"" + user.getId() + "\"")
                    .body(new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getProfilePhotoUrl(), token, links));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(HttpHeaders.CACHE_CONTROL, "no-store")
                    .body(Map.of("error", "Invalid or expired token: " + e.getMessage()));
        }
    }

    /**
     * Logs out the user by revoking the JWT token.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        authenticationService.revokeToken(token);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(Map.of("message", "Logged out successfully."));
    }
}
