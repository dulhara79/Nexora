// package com.nexora.server.service;

// import com.cloudinary.Cloudinary;
// import com.nexora.server.model.User;
// import com.nexora.server.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.mongodb.core.MongoTemplate;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.File;
// import java.io.IOException;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;
// import java.util.UUID;
// import java.util.logging.Logger;

// @Service
// public class UserService {

//     private static final Logger LOGGER = Logger.getLogger(UserService.class.getName());

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private Cloudinary cloudinary;

//     @Autowired
//     private MongoTemplate mongoTemplate;

//     private static final String DEFAULT_PROFILE_PHOTO_URL = "http://res.cloudinary.comWcloudinary.com/ddwgayqfm/image/upload/v1742983076/profile_photos/ah7dfgumdxuayfrcbxtx.jpg";

//     public User getUserById(String userId) throws Exception {
//         return userRepository.findById(userId)
//                 .orElseThrow(() -> new Exception("User not found with ID: " + userId));
//     }

//     public List<User> getAllUsers() {
//         return userRepository.findAll();
//     }

//     public String followUser(String userId, String targetUserId) throws Exception {
//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new Exception("User not found"));
//         User targetUser = userRepository.findById(targetUserId)
//                 .orElseThrow(() -> new Exception("Target user not found"));

//         if (user.getFollowing().contains(targetUserId)) {
//             throw new Exception("Already following this user");
//         }

//         user.getFollowing().add(targetUserId);
//         targetUser.getFollowers().add(userId);

//         userRepository.save(user);
//         userRepository.save(targetUser);
//         return "Successfully followed user";
//     }

//     public String unfollowUser(String userId, String targetUserId) throws Exception {
//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new Exception("User not found"));
//         User targetUser = userRepository.findById(targetUserId)
//                 .orElseThrow(() -> new Exception("Target user not found"));

//         user.getFollowing().remove(targetUserId);
//         targetUser.getFollowers().remove(userId);

//         userRepository.save(user);
//         userRepository.save(targetUser);
//         return "Successfully unfollowed user";
//     }

//     public String deleteUser(String userId) throws Exception {
//         LOGGER.info("Deleting user with ID: " + userId);

//         User user = userRepository.findById(userId)
//                 .orElseThrow(() -> new Exception("User not found with ID: " + userId));

//         if (user.getProfilePhotoUrl() != null &&
//                 !user.getProfilePhotoUrl().equals(DEFAULT_PROFILE_PHOTO_URL)) {
//             String publicId = extractPublicIdFromUrl(user.getProfilePhotoUrl());
//             cloudinary.uploader().destroy(publicId, Map.of());
//             LOGGER.info("Profile photo deleted from Cloudinary for user: " + userId);
//         }

//         for (String followerId : user.getFollowers()) {
//             Optional<User> follower = userRepository.findById(followerId);
//             follower.ifPresent(f -> {
//                 f.getFollowing().remove(userId);
//                 userRepository.save(f);
//             });
//         }
//         for (String followingId : user.getFollowing()) {
//             Optional<User> following = userRepository.findById(followingId);
//             following.ifPresent(f -> {
//                 f.getFollowers().remove(userId);
//                 userRepository.save(f);
//             });
//         }

//         userRepository.delete(user);
//         LOGGER.info("User deleted successfully: " + userId);
//         return "User deleted successfully";
//     }

//     public String uploadFile(MultipartFile file) throws IOException {
//         String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//         File targetFile = new File("uploads/" + fileName);
//         file.transferTo(targetFile);
//         return "/uploads/" + fileName;
//     }

//     private String extractPublicIdFromUrl(String url) {
//         String[] parts = url.split("/");
//         String fileName = parts[parts.length - 1];
//         return "profile_photos/" + fileName.substring(0, fileName.lastIndexOf("."));
//     }

//     public User findById(String id) {
//         return mongoTemplate.findById(id, User.class);
//     }

//     public void save(User user) {
//         mongoTemplate.save(user);
//     }
// }

package com.nexora.server.service;

import com.nexora.server.model.User;
import com.nexora.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String followUser(String userId, String targetUserId) {
        User user = findById(userId);
        User target = findById(targetUserId);
        if (user == null || target == null) {
            throw new IllegalArgumentException("User or target user not found");
        }
        if (user.getFollowing().contains(targetUserId)) {
            throw new IllegalStateException("Already following this user");
        }
        user.getFollowing().add(targetUserId);
        target.getFollowers().add(userId);
        userRepository.save(user);
        userRepository.save(target);
        return "Successfully followed user";
    }

    public String unfollowUser(String userId, String targetUserId) {
        User user = findById(userId);
        User target = findById(targetUserId);
        if (user == null || target == null) {
            throw new IllegalArgumentException("User or target user not found");
        }
        if (!user.getFollowing().contains(targetUserId)) {
            throw new IllegalStateException("Not following this user");
        }
        user.getFollowing().remove(targetUserId);
        target.getFollowers().remove(userId);
        userRepository.save(user);
        userRepository.save(target);
        return "Successfully unfollowed user";
    }

    public User getUserById(String userId) {
        User user = findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        return user;
    }

    public String uploadFile(MultipartFile file) {
        // Placeholder for file upload logic
        return "https://example.com/uploaded/" + file.getOriginalFilename();
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public String deleteUser(String userId) {
        User user = findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.delete(user);
        return "User deactivated successfully";
    }

    public List<User> getSuggestedUsers(String userId, int limit) {
        Aggregation aggregation = Aggregation.newAggregation(
                // Match users who are not the current user and not followed
                Aggregation.match(Criteria.where("_id").ne(userId).and("following").nin(userId)),
                // Lookup mutual followers
                Aggregation.lookup("users", "_id", "followers", "mutualFollowers"),
                // Unwind mutual followers
                Aggregation.unwind("mutualFollowers", true),
                // Group by user and count mutual followers
                Aggregation.group("_id")
                        .first("email").as("email")
                        .first("name").as("name")
                        .first("username").as("username")
                        .first("profilePhotoUrl").as("profilePhotoUrl")
                        .first("likeSkill").as("likeSkill")
                        .first("createdAt").as("createdAt")
                        .count().as("mutualFollowerCount"),
                // Sort by mutual followers and recent activity
                Aggregation.sort(Sort.by(Sort.Order.desc("mutualFollowerCount"), Sort.Order.desc("createdAt"))),
                // Limit results
                Aggregation.limit(limit),
                // Project to include only necessary fields
                Aggregation.project()
                        .and("_id").as("id")
                        .and("email").as("email")
                        .and("name").as("name")
                        .and("username").as("username")
                        .and("profilePhotoUrl").as("profilePhotoUrl")
                        .and("likeSkill").as("likeSkill")
                        .and("createdAt").as("createdAt"));

        AggregationResults<User> results = mongoTemplate.aggregate(aggregation, "users", User.class);
        return results.getMappedResults();
    }
}