package com.nexora.server.controller;

import com.nexora.server.model.User;
import com.nexora.server.service.AuthenticationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Validated
public class AuthenticationController {

  private static final Logger LOGGER = Logger.getLogger(AuthenticationController.class.getName());

  @Autowired
  private AuthenticationService authenticationService;

  @PostMapping("/login")
  public ResponseEntity<?> login(
      @RequestParam String email,
      @RequestParam String password) {
    LOGGER.info("Received login request for email: " + email);
    try {
      String result = authenticationService.sendLoginOtp(email, password);
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PostMapping("/login/verify")
  public ResponseEntity<?> verifyLogin(
      @RequestParam String email,
      @RequestParam String otp,
      HttpSession session) {
    LOGGER.info("Received OTP verification request for email: " + email + " with OTP: " + otp);
    try {
      User user = authenticationService.verifyLoginOtp(email, otp);
      session.setAttribute("userId", user.getId());
      LOGGER.info("Session set with userId: " + user.getId());
      return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmail(), user.getName()));
    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", e.getMessage());
      errorResponse.put("email", email);
      LOGGER.warning("Verification failed: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
  }

  @GetMapping("/google-success")
  public ResponseEntity<?> googleLoginSuccess(
      @AuthenticationPrincipal OAuth2User principal,
      HttpSession session) {
    try {
      String email = principal.getAttribute("email");
      String name = principal.getAttribute("name");
      User user = authenticationService.handleGoogleLogin(email, name);
      session.setAttribute("userId", user.getId());
      return ResponseEntity.ok().body(Map.of(
          "message", "Google login successful",
          "userId", user.getId()));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @GetMapping("/login/failure")
  public ResponseEntity<?> googleLoginFailure() {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(Map.of("error", "Google login failed"));
  }

  @GetMapping("/check-session")
  public ResponseEntity<?> checkSession(HttpSession session) {
    String userId = (String) session.getAttribute("userId");
    if (userId == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session");
    }
    try {
      User user = authenticationService.findById(userId);
      if (user == null) {
        session.invalidate();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
      }
      return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmail(), user.getName()));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpSession session) {
    try {
      session.invalidate();
      return ResponseEntity.ok("Logged out successfully");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}

record UserResponse(String id, String email, String name) {
}
