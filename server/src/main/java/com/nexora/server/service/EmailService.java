package com.nexora.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service class for sending emails, such as OTPs for email verification.
 */
@Service
public class EmailService {
    
    // Injects the JavaMailSender bean to handle email sending
    @Autowired
    private JavaMailSender mailSender;

    /**
     * Sends an OTP email to the specified address.
     *
     * @param email the recipient's email address
     * @param otp the one-time password to send
     */
    public void sendOTP(String email, String otp) {
        // Create a simple mail message
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email); // Set recipient
        message.setSubject("Email Verification OTP"); // Set subject
        message.setText("Your verification OTP is: " + otp + 
                       "\nPlease use this code to verify your email address."); // Set email body
        mailSender.send(message); // Send the email
    }
}