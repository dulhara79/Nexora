package com.nexora.server.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nexora.server.model.Challenge;
import com.nexora.server.repository.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private Cloudinary cloudinary;

    public Challenge createChallenge(String title, String description, String theme, 
                                    LocalDate startDate, LocalDate endDate, String createdBy, 
                                    MultipartFile photo) throws IOException {
        // Generate unique challenge ID
        String challengeId = UUID.randomUUID().toString();

        // Handle photo upload to Cloudinary
        String photoUrl = savePhoto(photo, challengeId);

        // Create and save challenge
        Challenge challenge = new Challenge(challengeId, title, description, theme, 
                                          startDate, endDate, createdBy, photoUrl);
        return challengeRepository.save(challenge);
    }

    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    public Optional<Challenge> getChallengeById(String challengeId) {
        return challengeRepository.findById(challengeId);
    }

    public Challenge updateChallenge(String challengeId, String title, String description, 
                                   String theme, LocalDate startDate, LocalDate endDate, 
                                   String createdBy, MultipartFile photo) throws IOException {
        Optional<Challenge> existingChallenge = challengeRepository.findById(challengeId);
        if (existingChallenge.isPresent()) {
            Challenge challenge = existingChallenge.get();
            // Only update fields if provided
            if (title != null) challenge.setTitle(title);
            if (description != null) challenge.setDescription(description);
            if (theme != null) challenge.setTheme(theme);
            if (startDate != null) challenge.setStartDate(startDate);
            if (endDate != null) challenge.setEndDate(endDate);
            if (photo != null && !photo.isEmpty()) {
                // Delete old photo from Cloudinary if exists
                if (challenge.getPhotoUrl() != null) {
                    String publicId = extractPublicId(challenge.getPhotoUrl());
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                }
                // Upload new photo
                String photoUrl = savePhoto(photo, challengeId);
                challenge.setPhotoUrl(photoUrl);
            }
            return challengeRepository.save(challenge);
        }
        throw new RuntimeException("Challenge not found");
    }

    public void deleteChallenge(String challengeId, String createdBy) {
        Optional<Challenge> challenge = challengeRepository.findById(challengeId);
        if (challenge.isPresent() && challenge.get().getCreatedBy().equals(createdBy)) {
            // Delete photo from Cloudinary if exists
            String photoUrl = challenge.get().getPhotoUrl();
            if (photoUrl != null) {
                String publicId = extractPublicId(photoUrl);
                try {
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                } catch (IOException e) {
                    throw new RuntimeException("Failed to delete photo from Cloudinary", e);
                }
            }
            challengeRepository.deleteById(challengeId);
        } else {
            throw new RuntimeException("Challenge not found or unauthorized");
        }
    }

    private String savePhoto(MultipartFile photo, String challengeId) throws IOException {
        if (photo == null || photo.isEmpty()) {
            return null;
        }
        String fileName = challengeId + "_" + photo.getOriginalFilename();
        String folder = "challenges/";

        // Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(photo.getBytes(),
                ObjectUtils.asMap("folder", folder, "public_id", fileName));

        // Return the secure URL
        return (String) uploadResult.get("secure_url");
    }

    private String extractPublicId(String fileUrl) {
        String[] parts = fileUrl.split("/");
        String fileNameWithExtension = parts[parts.length - 1];
        return parts[parts.length - 2] + "/" + fileNameWithExtension.split("\\.")[0];
    }
}