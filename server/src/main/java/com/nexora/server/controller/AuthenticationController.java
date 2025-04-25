package com.nexora.server.controller;

import com.nexora.server.model.User;
import com.nexora.server.service.AuthenticationService;
import com.nexora.server.controller.UserResponse;

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

record LoginRequest(String email, String password) {
}

record VerifyOtpRequest(String email, String otp) {
}

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Validated
public class AuthenticationController {

  private static final Logger LOGGER = Logger.getLogger(AuthenticationController.class.getName());

  @Autowired
  private AuthenticationService authenticationService;

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

  @PostMapping(value = "/login/verify", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> verifyLogin(@Valid @RequestBody VerifyOtpRequest verifyRequest) {
    LOGGER.info(
        "Received OTP verification request for email: " + verifyRequest.email() + " with OTP: " + verifyRequest.otp());
    try {
      User user = authenticationService.verifyLoginOtp(verifyRequest.email(), verifyRequest.otp());
      String token = authenticationService.generateJwtToken(user);
      Map<String, String> links = new HashMap<>();
      links.put("self", "/api/auth/check-session");
      links.put("logout", "/api/auth/logout");
      LOGGER.info("Login successful for userId: " + user.getId());
      return ResponseEntity.ok()
          .header(HttpHeaders.CACHE_CONTROL, "no-store")
          .body(new UserResponse(user.getId(), user.getEmail(), user.getName(), token, links));
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

  @GetMapping(value = "/google-redirect", produces = MediaType.TEXT_HTML_VALUE)
  public ResponseEntity<String> googleRedirect(@AuthenticationPrincipal OAuth2User principal) {
    LOGGER.info("Handling Google redirect for OAuth2 authentication");
    if (principal == null) {
      LOGGER.severe("OAuth2User principal is null");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .header(HttpHeaders.CACHE_CONTROL, "no-store")
          .body(
              "<html><body><script>window.opener.postMessage({ error: 'No authenticated user found' }, 'http://localhost:5173'); window.close();</script></body></html>");
    }
    try {
      String email = principal.getAttribute("email");
      String name = principal.getAttribute("name");
      if (email == null || name == null) {
        LOGGER.severe("Email or name missing in OAuth2User principal");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .header(HttpHeaders.CACHE_CONTROL, "no-store")
            .body(
                "<html><body><script>window.opener.postMessage({ error: 'Invalid user data from Google' }, 'http://localhost:5173'); window.close();</script></body></html>");
      }
      User user = authenticationService.handleGoogleLogin(email, name);
      String token = authenticationService.generateJwtToken(user);
      String html = String.format(
          "<html><body><script>" +
              "window.opener.postMessage({ userId: '%s', token: '%s', email: '%s', name: '%s' }, 'http://localhost:5173');"
              +
              "window.close();" +
              "</script></body></html>",
          user.getId(), token, user.getEmail(), user.getName());
      LOGGER.info("Google login successful for userId: " + user.getId());
      return ResponseEntity.ok()
          .header(HttpHeaders.CACHE_CONTROL, "no-store")
          .body(html);
    } catch (Exception e) {
      LOGGER.severe("Google login error: " + e.getMessage());
      return ResponseEntity.badRequest()
          .header(HttpHeaders.CACHE_CONTROL, "no-store")
          .body("<html><body><script>window.opener.postMessage({ error: 'Google login failed: " + e.getMessage()
              + "' }, 'http://localhost:5173'); window.close();</script></body></html>");
    }
  }

  @GetMapping("/login/failure")
  public ResponseEntity<?> googleLoginFailure() {
    LOGGER.info("Handling login failure");
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .header(HttpHeaders.CACHE_CONTROL, "no-store")
        .body(Map.of("error", "Google login failed"));
  }

  @GetMapping("/check-session")
  public ResponseEntity<?> checkSession(@RequestHeader(value = "Authorization", required = false) String authHeader) {
    LOGGER.info("Checking session with auth header: " + authHeader);
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .header(HttpHeaders.CACHE_CONTROL, "no-store")
          .body("No valid token provided");
    }
    String token = authHeader.substring(7);
    LOGGER.info("...Extracted token: " + token);
    try {
      User user = authenticationService.validateJwtToken(token);
      Map<String, String> links = new HashMap<>();
      links.put("self", "/api/auth/check-session");
      links.put("logout", "/api/auth/logout");
      return ResponseEntity.ok()
          .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
          .header(HttpHeaders.ETAG, "\"" + user.getId() + "\"")
          .body(new UserResponse(user.getId(), user.getEmail(), user.getName(), token, links));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .header(HttpHeaders.CACHE_CONTROL, "no-store")
          .body("Invalid or expired token: " + e.getMessage());
    }
  }

  /**
   * 
   * const handleLogout = () => {
   * localStorage.removeItem("jwt"); // or sessionStorage, or cookies
   * navigate("/login");
   * };
   * 
   */
  @PostMapping("/logout")
  public ResponseEntity<?> logout() {
    LOGGER.info("Handling logout");

    // Tell the client to clear the JWT
    Map<String, String> links = new HashMap<>();
    links.put("login", "/api/auth/login");

    LOGGER.info("Logout successful, instructing client to clear token");

    return ResponseEntity.ok()
        .header(HttpHeaders.CACHE_CONTROL, "no-store")
        .body(Map.of(
            "message", "Logged out successfully. Please clear the token on client side.",
            "_links", links));
  }

}
