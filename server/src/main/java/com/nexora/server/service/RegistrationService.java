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

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

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

    public User registerUser(UserRequest userRequest, MultipartFile profilePhoto) throws Exception {
        if (userRequest.email() == null || userRequest.email().isBlank()) {
            throw new Exception("Email is required");
        }
        if (userRequest.username() == null || userRequest.username().isBlank()) {
            throw new Exception("Username is required");
        }
        if (userRepository.findByEmail(userRequest.email()).isPresent()) {
            throw new Exception("Email already exists");
        }
        if (userRepository.findByUsername(userRequest.username()).isPresent()) {
            throw new Exception("Username already exists");
        }

        User user = new User();
        user.setEmail(userRequest.email());
        user.setUsername(userRequest.username());
        user.setName(userRequest.name());
        user.setPassword(userRequest.password() != null ? passwordEncoder.encode(userRequest.password()) : null);
        String code = generateVerificationCode();
        user.setVerificationCode(code);
        user.setRole(Role.USER);

        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(profilePhoto.getBytes(),
                    Map.of("folder", "profile_photos"));
            user.setProfilePhotoUrl(uploadResult.get("url").toString());
        }

        sendVerificationEmail(user.getEmail(), code);
        return userRepository.save(user);
    }

    public User registerWithGoogle(User user, MultipartFile profilePhoto) throws Exception {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new Exception("Email is required");
        }
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            throw new Exception("Username is required");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new Exception("Username already exists");
        }

        String code = generateVerificationCode();
        user.setVerificationCode(code);
        user.setRole(Role.USER);
        user.setEmailVerified(true);

        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(profilePhoto.getBytes(),
                    Map.of("folder", "profile_photos"));
            user.setProfilePhotoUrl(uploadResult.get("url").toString());
        }

        sendVerificationEmail(user.getEmail(), code);
        return userRepository.save(user);
    }

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

    public String generateJwtToken(User user) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key)
                .compact();
    }

    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    private void sendVerificationEmail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Email Verification");
        message.setText("Your verification code is: " + code);
        mailSender.send(message);
    }
}