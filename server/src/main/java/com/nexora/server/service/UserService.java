package com.nexora.server.service;

import com.cloudinary.Cloudinary;
import com.nexora.server.model.User;
import com.nexora.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class UserService {

    private static final Logger LOGGER = Logger.getLogger(UserService.class.getName());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private MongoTemplate mongoTemplate;

    private static final String DEFAULT_PROFILE_PHOTO_URL = "http://res.cloudinary.comWcloudinary.com/ddwgayqfm/image/upload/v1742983076/profile_photos/ah7dfgumdxuayfrcbxtx.jpg";

    public User getUserById(String userId) throws Exception {
        return userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with ID: " + userId));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String followUser(String userId, String targetUserId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new Exception("Target user not found"));

        if (user.getFollowing().contains(targetUserId)) {
            throw new Exception("Already following this user");
        }

        user.getFollowing().add(targetUserId);
        targetUser.getFollowers().add(userId);

        userRepository.save(user);
        userRepository.save(targetUser);
        return "Successfully followed user";
    }

    public String unfollowUser(String userId, String targetUserId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new Exception("Target user not found"));

        user.getFollowing().remove(targetUserId);
        targetUser.getFollowers().remove(userId);

        userRepository.save(user);
        userRepository.save(targetUser);
        return "Successfully unfollowed user";
    }

    public String deleteUser(String userId) throws Exception {
        LOGGER.info("Deleting user with ID: " + userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with ID: " + userId));

        if (user.getProfilePhotoUrl() != null &&
                !user.getProfilePhotoUrl().equals(DEFAULT_PROFILE_PHOTO_URL)) {
            String publicId = extractPublicIdFromUrl(user.getProfilePhotoUrl());
            cloudinary.uploader().destroy(publicId, Map.of());
            LOGGER.info("Profile photo deleted from Cloudinary for user: " + userId);
        }

        for (String followerId : user.getFollowers()) {
            Optional<User> follower = userRepository.findById(followerId);
            follower.ifPresent(f -> {
                f.getFollowing().remove(userId);
                userRepository.save(f);
            });
        }
        for (String followingId : user.getFollowing()) {
            Optional<User> following = userRepository.findById(followingId);
            following.ifPresent(f -> {
                f.getFollowers().remove(userId);
                userRepository.save(f);
            });
        }

        userRepository.delete(user);
        LOGGER.info("User deleted successfully: " + userId);
        return "User deleted successfully";
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File targetFile = new File("uploads/" + fileName);
        file.transferTo(targetFile);
        return "/uploads/" + fileName;
    }

    private String extractPublicIdFromUrl(String url) {
        String[] parts = url.split("/");
        String fileName = parts[parts.length - 1];
        return "profile_photos/" + fileName.substring(0, fileName.lastIndexOf("."));
    }

    public User findById(String id) {
        return mongoTemplate.findById(id, User.class);
    }

    public void save(User user) {
        mongoTemplate.save(user);
    }
}