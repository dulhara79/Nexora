package com.nexora.server.service;

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

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.logging.Logger;

/**
 * Service class for handling authentication logic such as login, OTP, JWT, and Google login.
 */
@Service
public class AuthenticationService {

    private static final Logger LOGGER = Logger.getLogger(AuthenticationService.class.getName());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Set to store revoked JWT tokens
    private Set<String> revokedTokens = new HashSet<>();

    /**
     * Revoke a JWT token by adding it to the revokedTokens set.
     */
    public void revokeToken(String token) {
        revokedTokens.add(token);
    }

    /**
     * Check if a JWT token has been revoked.
     */
    public boolean isTokenRevoked(String token) {
        return revokedTokens.contains(token);
    }

    /**
     * Send a login OTP to the user's email after verifying credentials.
     * @param email User's email
     * @param password User's password
     * @return Status message
     * @throws Exception if user not found, email not verified, or password invalid
     */
    public String sendLoginOtp(String email, String password) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found with this email");
        }

        User user = userOptional.get();
        if (!user.isEmailVerified()) {
            throw new Exception("Email not verified. Please verify your email first");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid password");
        }

        String otp = generateVerificationCode();
        user.setVerificationCode(otp);
        userRepository.save(user);

        sendLoginOtpEmail(email, otp);
        LOGGER.info("Login OTP sent to: " + email);
        return "OTP sent to your email";
    }

    /**
     * Verify the OTP entered by the user for login.
     * @param email User's email
     * @param otp OTP entered by user
     * @return User object if verification is successful
     * @throws Exception if user not found, email not verified, or OTP invalid
     */
    public User verifyLoginOtp(String email, String otp) throws Exception {
        LOGGER.info("Verifying login for email: " + email);
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            LOGGER.warning("User not found for email: " + email);
            throw new Exception("User not found");
        }

        User user = userOptional.get();
        if (!user.isEmailVerified()) {
            throw new Exception("Email not verified");
        }

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(otp)) {
            LOGGER.warning("OTP mismatch for email: " + email);
            throw new Exception("Invalid OTP");
        }

        user.setVerificationCode(null); // Clear OTP after successful verification
        userRepository.save(user);
        LOGGER.info("Login successful for: " + email);
        return user;
    }

    /**
     * Handle login or registration via Google.
     * @param email User's Google email
     * @param name User's name
     * @return User object
     * @throws Exception if registration fails
     */
    public User handleGoogleLogin(String email, String name) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setEmailVerified(true);
            user = registrationService.registerWithGoogle(user, null);
        }
        return user;
    }

    /**
     * Find a user by their ID.
     * @param id User ID
     * @return User object or null if not found
     */
    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Generate a JWT token for the given user.
     * @param user User object
     * @return JWT token string
     */
    public String generateJwtToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key) // Updated to use SecretKey
                .compact();
    }

    /**
     * Validate a JWT token and return the corresponding user.
     * @param token JWT token string
     * @return User object if token is valid
     * @throws Exception if token is revoked, invalid, or expired
     */
    public User validateJwtToken(String token) throws Exception {
        if (isTokenRevoked(token)) {
            throw new Exception("Token revoked");
        }
        try {
            String userId = Jwts.parser()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            User user = findById(userId);
            if (user == null) {
                throw new Exception("User not found");
            }
            return user;
        } catch (Exception e) {
            LOGGER.warning("Invalid JWT token: " + e.getMessage());
            throw new Exception("Invalid or expired token");
        }
    }

    /**
     * Generate a 6-digit verification code for OTP.
     * @return 6-digit OTP as string
     */
    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    /**
     * Send the login OTP to the user's email.
     * @param email User's email
     * @param otp OTP code
     */
    private void sendLoginOtpEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Login OTP");
        message.setText("Your login OTP is: " + otp + "\nThis OTP is valid for 10 minutes.");
        mailSender.send(message);
    }
}