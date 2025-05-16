package com.nexora.server.service;

import com.cloudinary.Cloudinary;
import com.nexora.server.model.User;
import com.nexora.server.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class for user-related operations.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Cloudinary cloudinary;

    @Value("${jwt.secret}")
    private String jwtSecret;

    /**
     * Find a user by their ID.
     */
    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Find a user by their email.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Find a user by their username.
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Get all users with pagination.
     */
    public Page<User> getAllUsers(PageRequest pageRequest) {
        return userRepository.findAll(pageRequest);
    }

    /**
     * Follow another user.
     * @param userId The ID of the user who wants to follow.
     * @param targetUserId The ID of the user to be followed.
     * @return Success message.
     */
    public String followUser(String userId, String targetUserId) {
        User user = findById(userId);
        User target = findById(targetUserId);
        if (user == null || target == null) {
            throw new IllegalArgumentException("User or target user not found");
        }
        if (userId.equals(targetUserId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }
        if (user.getFollowing() == null) {
            user.setFollowing(new ArrayList<>());
        }
        if (target.getFollowers() == null) {
            target.setFollowers(new ArrayList<>());
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

    /**
     * Unfollow a user.
     * @param userId The ID of the user who wants to unfollow.
     * @param targetUserId The ID of the user to be unfollowed.
     * @return Success message.
     */
    public String unfollowUser(String userId, String targetUserId) {
        User user = getUserById(userId);
        User target = getUserById(targetUserId);

        if (!user.getFollowing().contains(targetUserId)) {
            throw new RuntimeException("You are not following this user.");
        }

        if (!target.getFollowers().contains(userId)) {
            throw new RuntimeException("Target does not have you as a follower.");
        }

        // Remove from both sides
        user.getFollowing().remove(targetUserId);
        target.getFollowers().remove(userId);

        userRepository.save(user);
        userRepository.save(target);

        return "Successfully unfollowed user";
    }

    /**
     * Get a user by ID or throw exception if not found.
     */
    public User getUserById(String userId) {
        User user = findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        return user;
    }

    /**
     * Upload a file to Cloudinary and return its URL.
     */
    public String uploadFile(MultipartFile file) {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    Map.of("folder", "profile_photos"));
            return uploadResult.get("url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Save or update a user.
     */
    public void save(User user) {
        userRepository.save(user);
    }

    /**
     * Delete (deactivate) a user by ID.
     */
    public String deleteUser(String userId) {
        User user = findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.delete(user);
        return "User deactivated successfully";
    }

    /**
     * Get suggested users for a user to follow, based on mutual followers.
     */
    public List<User> getSuggestedUsers(String userId, int limit) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("_id").ne(userId).and("following").nin(userId)),
                Aggregation.lookup("users", "_id", "followers", "mutualFollowers"),
                Aggregation.unwind("mutualFollowers", true),
                Aggregation.group("_id")
                        .first("email").as("email")
                        .first("name").as("name")
                        .first("username").as("username")
                        .first("profilePhotoUrl").as("profilePhotoUrl")
                        .first("likeSkill").as("likeSkill")
                        .first("createdAt").as("createdAt")
                        .count().as("mutualFollowerCount"),
                Aggregation.sort(Sort.by(Sort.Order.desc("mutualFollowerCount"), Sort.Order.desc("createdAt"))),
                Aggregation.limit(limit),
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

    /**
     * Search users by name or username, excluding the current user.
     * Sets isFollowing flag for each user in the result.
     */
    public List<User> searchUsers(String query, String currentUserId, int limit) {
        User currentUser = findById(currentUserId);
        if (currentUser == null) {
            throw new IllegalArgumentException("Current user not found");
        }
        List<User> users = userRepository.findByNameOrUsername(query);
        users.removeIf(user -> user.getId().equals(currentUserId));
        List<String> currentUserFollowing = currentUser.getFollowing() != null ? currentUser.getFollowing() : new ArrayList<>();
        // Set isFollowing for each user
        users.forEach(user -> user.setFollowing(currentUserFollowing.contains(user.getId()) ? List.of("true") : List.of("false")));
        return users.stream().limit(limit).toList();
    }

    /**
     * Get related users based on search query and likeSkill, excluding the current user and users already followed.
     * Sets isFollowing flag for each user in the result.
     */
    public List<User> getRelatedUsers(String query, String currentUserId, int limit) {
        User currentUser = findById(currentUserId);
        if (currentUser == null) {
            throw new IllegalArgumentException("Current user not found");
        }
        String likeSkill = currentUser.getLikeSkill();
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("_id").ne(currentUserId)
                        .and("following").nin(currentUserId)
                        .andOperator(
                                Criteria.where("name").regex(query, "i")
                                        .orOperator(Criteria.where("username").regex(query, "i")))),
                Aggregation.lookup("users", "_id", "followers", "mutualFollowers"),
                Aggregation.match(Criteria.where("likeSkill").is(likeSkill)),
                Aggregation.unwind("mutualFollowers", true),
                Aggregation.group("_id")
                        .first("email").as("email")
                        .first("name").as("name")
                        .first("username").as("username")
                        .first("profilePhotoUrl").as("profilePhotoUrl")
                        .first("likeSkill").as("likeSkill")
                        .first("createdAt").as("createdAt")
                        .count().as("mutualFollowerCount"),
                Aggregation.sort(Sort.by(Sort.Order.desc("mutualFollowerCount"), Sort.Order.desc("createdAt"))),
                Aggregation.limit(limit),
                Aggregation.project()
                        .and("_id").as("id")
                        .and("email").as("email")
                        .and("name").as("name")
                        .and("username").as("username")
                        .and("profilePhotoUrl").as("profilePhotoUrl")
                        .and("likeSkill").as("likeSkill")
                        .and("createdAt").as("createdAt"));
        AggregationResults<User> results = mongoTemplate.aggregate(aggregation, "users", User.class);
        List<User> relatedUsers = results.getMappedResults();
        List<String> currentUserFollowing = currentUser.getFollowing() != null ? currentUser.getFollowing() : new ArrayList<>();
        // Set isFollowing for each user
        relatedUsers.forEach(user -> user.setFollowing(currentUserFollowing.contains(user.getId()) ? List.of("true") : List.of("false")));
        return relatedUsers;
    }

    /**
     * Get the list of followers for a user.
     */
    public List<User> getFollowers(String userId) {
        User user = findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        List<String> followerIds = user.getFollowers() != null ? user.getFollowers() : new ArrayList<>();
        return userRepository.findAllById(followerIds);
    }

    /**
     * Get the list of users the given user is following.
     */
    public List<User> getFollowing(String userId) {
        User user = findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        List<String> followingIds = user.getFollowing() != null ? user.getFollowing() : new ArrayList<>();
        return userRepository.findAllById(followingIds);
    }

    /**
     * Validate a JWT token and return the corresponding user.
     */
    public User validateJwtToken(String token) throws Exception {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            String userId = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            User user = findById(userId);
            if (user == null) {
                throw new Exception("User not found");
            }
            return user;
        } catch (Exception e) {
            throw new Exception("Invalid or expired token: " + e.getMessage());
        }
    }

    /**
     * Validate a raw password against an encoded password.
     */
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * Encode a raw password.
     */
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}