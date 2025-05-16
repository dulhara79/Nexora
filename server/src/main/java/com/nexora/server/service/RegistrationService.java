package com.nexora.server.service;

import com.cloudinary.Cloudinary;
import com.nexora.server.controller.UserRequest;
import com.nexora.server.model.Role;
import com.nexora.server.model.User;
import com.nexora.server.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

/**
 * Service class for handling user registration, email verification,
 * and JWT token generation.
 */
@Service
public class RegistrationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private Cloudinary cloudinary;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Registers a new user with the provided details and profile photo.
     * Sends a verification email after registration.
     *
     * @param userRequest   The user registration request data.
     * @param profilePhoto  The user's profile photo (optional).
     * @return The registered User entity.
     * @throws Exception if validation fails or upload fails.
     */
    public User registerUser(UserRequest userRequest, MultipartFile profilePhoto) throws Exception {
        // Validate required fields
        if (userRequest.email() == null || userRequest.email().isBlank()) {
            throw new Exception("Email is required");
        }
        if (userRequest.username() == null || userRequest.username().isBlank()) {
            throw new Exception("Username is required");
        }
        // Check for existing email and username
        if (userRepository.findByEmail(userRequest.email()).isPresent()) {
            throw new Exception("Email already exists");
        }
        if (userRepository.findByUsername(userRequest.username()).isPresent()) {
            throw new Exception("Username already exists");
        }

        // Create new user entity
        User user = new User();
        user.setEmail(userRequest.email());
        user.setUsername(userRequest.username());
        user.setName(userRequest.name());
        user.setPassword(userRequest.password() != null ? passwordEncoder.encode(userRequest.password()) : null);

        // Generate and set verification code
        String code = generateVerificationCode();
        user.setVerificationCode(code);
        user.setRole(Role.USER);

        // Handle profile photo upload if provided
        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(profilePhoto.getBytes(),
                    Map.of("folder", "profile_photos"));
            user.setProfilePhotoUrl(uploadResult.get("url").toString());
        } else if (userRequest.profilePhotoBase64() != null && !userRequest.profilePhotoBase64().isBlank()) {
            // Optional: Handle base64 image if needed
            throw new UnsupportedOperationException("Base64 image upload not implemented");
        }

        // Send verification email
        sendVerificationEmail(user.getEmail(), code);

        // Save user to repository
        return userRepository.save(user);
    }

    /**
     * Registers a user using Google authentication.
     * If the user already exists, returns the existing user.
     *
     * @param user         The user entity with Google details.
     * @param profilePhoto The user's profile photo (optional).
     * @return The registered or existing User entity.
     * @throws Exception if validation fails.
     */
    public User registerWithGoogle(User user, MultipartFile profilePhoto) throws Exception {
        // Validate required fields
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new Exception("Email is required");
        }
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new Exception("Username already exists");
        }

        // Check if user already exists by email
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // Generate unique username and set user properties
        String username = generateUniqueUsername(user.getEmail());
        user.setUsername(username);
        user.setRole(Role.USER);
        user.setEmailVerified(true);

        // Handle profile photo upload if provided
        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(profilePhoto.getBytes(),
                    Map.of("folder", "profile_photos"));
            user.setProfilePhotoUrl(uploadResult.get("url").toString());
        } else if (user.getProfilePhotoUrl() != null) {
            user.setProfilePhotoUrl(user.getProfilePhotoUrl());
        }

        // Save user to repository
        return userRepository.save(user);
    }

    /**
     * Verifies the user's email using the provided verification code.
     *
     * @param email The user's email address.
     * @param code  The verification code sent to the user.
     * @return Success message if verification is successful.
     * @throws Exception if user not found or code is invalid.
     */
    public String verifyEmail(String email, String code) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();
        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            throw new Exception("Invalid verification code");
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);
        return "Email verified successfully";
    }

    /**
     * Generates a JWT token for the authenticated user.
     *
     * @param user The user entity.
     * @return The generated JWT token as a String.
     */
    public String generateJwtToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key)
                .compact();
    }

    /**
     * Generates a random 6-digit verification code.
     *
     * @return The verification code as a String.
     */
    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    /**
     * Sends a verification email to the user with the provided code.
     *
     * @param email The recipient's email address.
     * @param code  The verification code to send.
     */
    private void sendVerificationEmail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Email Verification");
        message.setText("Your verification code is: " + code);
        mailSender.send(message);
    }

    /**
     * Generates a unique username based on the user's email.
     * Appends a numeric suffix if the username already exists.
     *
     * @param email The user's email address.
     * @return A unique username.
     */
    private String generateUniqueUsername(String email) {
        String baseUsername = email.split("@")[0];
        String username = baseUsername;
        int suffix = 1;
        while (userRepository.findByUsername(username).isPresent()) {
            username = baseUsername + suffix;
            suffix++;
        }
        return username;
    }
}