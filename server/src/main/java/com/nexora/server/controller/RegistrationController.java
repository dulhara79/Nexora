package com.nexora.server.controller;

import com.nexora.server.model.User;
import com.nexora.server.service.RegistrationService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Validated
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @ModelAttribute User user,
            @RequestParam(required = false) MultipartFile profilePhoto,
            HttpSession session) {
        try {
            User registeredUser = registrationService.registerUser(user, profilePhoto);
            session.setAttribute("userId", registeredUser.getId());
            return ResponseEntity.ok("Registration successful. Please verify your email.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register/google")
    public ResponseEntity<?> registerWithGoogle(
            @Valid @ModelAttribute User user,
            @RequestParam(required = false) MultipartFile profilePhoto) {
        try {
            User registeredUser = registrationService.registerWithGoogle(user, profilePhoto);
            return ResponseEntity.ok("Registration successful. Please verify your email.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(
            @RequestParam String email,
            @RequestParam String code) {
        try {
            String result = registrationService.verifyEmail(email, code);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("email", email);
            errorResponse.put("code", code);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}