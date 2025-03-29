package com.nexora.server.service;

import com.cloudinary.Cloudinary;
import com.nexora.server.model.Role;
import com.nexora.server.model.User;
import com.nexora.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    public User registerUser(User user, MultipartFile profilePhoto) throws Exception {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        String code = generateVerificationCode();
        user.setVerificationCode(code);
        user.setRole(Role.USER);

        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(profilePhoto.getBytes(),
                    Map.of("folder", "profile_photos"));
            user.setProfilePhotoUrl(uploadResult.get("url").toString());
        }

        sendVerificationEmail(user.getEmail(), code);
        return userRepository.save(user);
    }

    public User registerWithGoogle(User user, MultipartFile profilePhoto) throws Exception {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }

        String code = generateVerificationCode();
        user.setVerificationCode(code);

        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(profilePhoto.getBytes(),
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