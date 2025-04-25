package com.nexora.server.service;

import com.nexora.server.model.User;
import com.nexora.server.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.Random;
import java.util.logging.Logger;

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

    public User verifyLoginOtp(String email, String otp) throws Exception {
        LOGGER.info("Verifying login for email: " + email + " with OTP: " + otp);

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
            LOGGER.warning("OTP mismatch for email: " + email + ". Provided: " + otp + ", Stored: "
                + user.getVerificationCode());
            throw new Exception("Invalid OTP");
        }

        user.setVerificationCode(null);
        userRepository.save(user);
        LOGGER.info("Login successful for: " + email);
        return user;
    }

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

    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public String generateJwtToken(User user) {
        return Jwts.builder()
            .setSubject(user.getId())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public User validateJwtToken(String token) throws Exception {
        try {
            String userId = Jwts.parser()
                .setSigningKey(jwtSecret)
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

    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    private void sendLoginOtpEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Login OTP");
        message.setText("Your login OTP is: " + otp + "\nThis OTP is valid for 10 minutes.");
        mailSender.send(message);
    }
}