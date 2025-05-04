// // package com.nexora.server.service;

// // import com.cloudinary.Cloudinary;
// // import com.nexora.server.model.User;
// // import com.nexora.server.repository.UserRepository;
// // import io.jsonwebtoken.Jwts;
// // import io.jsonwebtoken.security.Keys;
// // import org.springframework.beans.factory.annotation.Autowired;
// // import org.springframework.beans.factory.annotation.Value;
// // import org.springframework.data.domain.Page;
// // import org.springframework.data.domain.PageRequest;
// // import org.springframework.data.domain.Sort;
// // import org.springframework.data.mongodb.core.MongoTemplate;
// // import org.springframework.data.mongodb.core.aggregation.Aggregation;
// // import org.springframework.data.mongodb.core.aggregation.AggregationResults;
// // import org.springframework.data.mongodb.core.query.Criteria;
// // import org.springframework.security.crypto.password.PasswordEncoder;
// // import org.springframework.stereotype.Service;
// // import org.springframework.web.multipart.MultipartFile;

// // import java.nio.charset.StandardCharsets;
// // import java.security.Key;
// // import java.util.List;
// // import java.util.Map;
// // import java.util.Optional;

// // @Service
// // public class UserService {

// //     @Autowired
// //     private UserRepository userRepository;

// //     @Autowired
// //     private MongoTemplate mongoTemplate;

// //     @Autowired
// //     private PasswordEncoder passwordEncoder;

// //     @Autowired
// //     private Cloudinary cloudinary;

// //     @Value("${jwt.secret}")
// //     private String jwtSecret;

// //     public User findById(String id) {
// //         return userRepository.findById(id).orElse(null);
// //     }

// //     public Optional<User> findByEmail(String email) {
// //         return userRepository.findByEmail(email);
// //     }

// //     public Optional<User> findByUsername(String username) {
// //         return userRepository.findByUsername(username);
// //     }

// //     public Page<User> getAllUsers(PageRequest pageRequest) {
// //         return userRepository.findAll(pageRequest);
// //     }

// //     public String followUser(String userId, String targetUserId) {
// //         User user = findById(userId);
// //         User target = findById(targetUserId);
// //         if (user == null || target == null) {
// //             throw new IllegalArgumentException("User or target user not found");
// //         }
// //         if (user.getFollowing().contains(targetUserId)) {
// //             throw new IllegalStateException("Already following this user");
// //         }
// //         user.getFollowing().add(targetUserId);
// //         target.getFollowers().add(userId);
// //         userRepository.save(user);
// //         userRepository.save(target);
// //         return "Successfully followed user";
// //     }

// //     public String unfollowUser(String userId, String targetUserId) {
// //         User user = findById(userId);
// //         User target = findById(targetUserId);
// //         if (user == null || target == null) {
// //             throw new IllegalArgumentException("User or target user not found");
// //         }
// //         if (!user.getFollowing().contains(targetUserId)) {
// //             throw new IllegalStateException("Not following this user");
// //         }
// //         user.getFollowing().remove(targetUserId);
// //         target.getFollowers().remove(userId);
// //         userRepository.save(user);
// //         userRepository.save(target);
// //         return "Successfully unfollowed user";
// //     }

// //     public User getUserById(String userId) {
// //         User user = findById(userId);
// //         if (user == null) {
// //             throw new IllegalArgumentException("User not found");
// //         }
// //         return user;
// //     }

// //     public String uploadFile(MultipartFile file) {
// //         try {
// //             Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
// //                     Map.of("folder", "profile_photos"));
// //             return uploadResult.get("url").toString();
// //         } catch (Exception e) {
// //             throw new RuntimeException("Failed to upload file: " + e.getMessage());
// //         }
// //     }

// //     public void save(User user) {
// //         userRepository.save(user);
// //     }

// //     public String deleteUser(String userId) {
// //         User user = findById(userId);
// //         if (user == null) {
// //             throw new IllegalArgumentException("User not found");
// //         }
// //         userRepository.delete(user);
// //         return "User deactivated successfully";
// //     }

// //     public List<User> getSuggestedUsers(String userId, int limit) {
// //         Aggregation aggregation = Aggregation.newAggregation(
// //                 Aggregation.match(Criteria.where("_id").ne(userId).and("following").nin(userId)),
// //                 Aggregation.lookup("users", "_id", "followers", "mutualFollowers"),
// //                 Aggregation.unwind("mutualFollowers", true),
// //                 Aggregation.group("_id")
// //                         .first("email").as("email")
// //                         .first("name").as("name")
// //                         .first("username").as("username")
// //                         .first("profilePhotoUrl").as("profilePhotoUrl")
// //                         .first("likeSkill").as("likeSkill")
// //                         .first("createdAt").as("createdAt")
// //                         .count().as("mutualFollowerCount"),
// //                 Aggregation.sort(Sort.by(Sort.Order.desc("mutualFollowerCount"), Sort.Order.desc("createdAt"))),
// //                 Aggregation.limit(limit),
// //                 Aggregation.project()
// //                         .and("_id").as("id")
// //                         .and("email").as("email")
// //                         .and("name").as("name")
// //                         .and("username").as("username")
// //                         .and("profilePhotoUrl").as("profilePhotoUrl")
// //                         .and("likeSkill").as("likeSkill")
// //                         .and("createdAt").as("createdAt"));
// //         AggregationResults<User> results = mongoTemplate.aggregate(aggregation, "users", User.class);
// //         return results.getMappedResults();
// //     }

// //     public User validateJwtToken(String token) throws Exception {
// //         try {
// //             Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
// //             String userId = Jwts.parserBuilder()
// //                     .setSigningKey(key)
// //                     .build()
// //                     .parseClaimsJws(token)
// //                     .getBody()
// //                     .getSubject();
// //             User user = findById(userId);
// //             if (user == null) {
// //                 throw new Exception("User not found");
// //             }
// //             return user;
// //         } catch (Exception e) {
// //             throw new Exception("Invalid or expired token: " + e.getMessage());
// //         }
// //     }

// //     public boolean validatePassword(String rawPassword, String encodedPassword) {
// //         return passwordEncoder.matches(rawPassword, encodedPassword);
// //     }

// //     public String encodePassword(String rawPassword) {
// //         return passwordEncoder.encode(rawPassword);
// //     }
// // }


// package com.nexora.server.service;

// import com.cloudinary.Cloudinary;
// import com.nexora.server.model.User;
// import com.nexora.server.repository.UserRepository;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Sort;
// import org.springframework.data.mongodb.core.MongoTemplate;
// import org.springframework.data.mongodb.core.aggregation.Aggregation;
// import org.springframework.data.mongodb.core.aggregation.AggregationResults;
// import org.springframework.data.mongodb.core.query.Criteria;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.util.List;
// import java.util.Map;
// import java.util.Optional;

// @Service
// public class UserService {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private MongoTemplate mongoTemplate;

//     @Autowired
//     private PasswordEncoder passwordEncoder;

//     @Autowired
//     private Cloudinary cloudinary;

//     @Value("${jwt.secret}")
//     private String jwtSecret;

//     public User findById(String id) {
//         return userRepository.findById(id).orElse(null);
//     }

//     public Optional<User> findByEmail(String email) {
//         return userRepository.findByEmail(email);
//     }

//     public Optional<User> findByUsername(String username) {
//         return userRepository.findByUsername(username);
//     }

//     public Page<User> getAllUsers(PageRequest pageRequest) {
//         return userRepository.findAll(pageRequest);
//     }

//     public String followUser(String userId, String targetUserId) {
//         User user = findById(userId);
//         User target = findById(targetUserId);
//         if (user == null || target == null) {
//             throw new IllegalArgumentException("User or target user not found");
//         }
//         if (user.getFollowing().contains(targetUserId)) {
//             throw new IllegalStateException("Already following this user");
//         }
//         user.getFollowing().add(targetUserId);
//         target.getFollowers().add(userId);
//         userRepository.save(user);
//         userRepository.save(target);
//         return "Successfully followed user";
//     }

//     public String unfollowUser(String userId, String targetUserId) {
//         User user = findById(userId);
//         User target = findById(targetUserId);
//         if (user == null || target == null) {
//             throw new IllegalArgumentException("User or target user not found");
//         }
//         if (!user.getFollowing().contains(targetUserId)) {
//             throw new IllegalStateException("Not following this user");
//         }
//         user.getFollowing().remove(targetUserId);
//         target.getFollowers().remove(userId);
//         userRepository.save(user);
//         userRepository.save(target);
//         return "Successfully unfollowed user";
//     }

//     public User getUserById(String userId) {
//         User user = findById(userId);
//         if (user == null) {
//             throw new IllegalArgumentException("User not found");
//         }
//         return user;
//     }

//     public String uploadFile(MultipartFile file) {
//         try {
//             Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
//                     Map.of("folder", "profile_photos"));
//             return uploadResult.get("url").toString();
//         } catch (Exception e) {
//             throw new RuntimeException("Failed to upload file: " + e.getMessage());
//         }
//     }

//     public void save(User user) {
//         userRepository.save(user);
//     }

//     public String deleteUser(String userId) {
//         User user = findById(userId);
//         if (user == null) {
//             throw new IllegalArgumentException("User not found");
//         }
//         userRepository.delete(user);
//         return "User deactivated successfully";
//     }

//     public List<User> getSuggestedUsers(String userId, int limit) {
//         Aggregation aggregation = Aggregation.newAggregation(
//                 Aggregation.match(Criteria.where("_id").ne(userId).and("following").nin(userId)),
//                 Aggregation.lookup("users", "_id", "followers", "mutualFollowers"),
//                 Aggregation.unwind("mutualFollowers", true),
//                 Aggregation.group("_id")
//                         .first("email").as("email")
//                         .first("name").as("name")
//                         .first("username").as("username")
//                         .first("profilePhotoUrl").as("profilePhotoUrl")
//                         .first("likeSkill").as("likeSkill")
//                         .first("createdAt").as("createdAt")
//                         .count().as("mutualFollowerCount"),
//                 Aggregation.sort(Sort.by(Sort.Order.desc("mutualFollowerCount"), Sort.Order.desc("createdAt"))),
//                 Aggregation.limit(limit),
//                 Aggregation.project()
//                         .and("_id").as("id")
//                         .and("email").as("email")
//                         .and("name").as("name")
//                         .and("username").as("username")
//                         .and("profilePhotoUrl").as("profilePhotoUrl")
//                         .and("likeSkill").as("likeSkill")
//                         .and("createdAt").as("createdAt"));
//         AggregationResults<User> results = mongoTemplate.aggregate(aggregation, "users", User.class);
//         return results.getMappedResults();
//     }

//     public User validateJwtToken(String token) throws Exception {
//         try {
//             String userId = Jwts.parser()
//                     .setSigningKey(jwtSecret)
//                     .parseClaimsJws(token)
//                     .getBody()
//                     .getSubject();
//             User user = findById(userId);
//             if (user == null) {
//                 throw new Exception("User not found");
//             }
//             return user;
//         } catch (Exception e) {
//             throw new Exception("Invalid or expired token: " + e.getMessage());
//         }
//     }

//     public boolean validatePassword(String rawPassword, String encodedPassword) {
//         return passwordEncoder.matches(rawPassword, encodedPassword);
//     }

//     public String encodePassword(String rawPassword) {
//         return passwordEncoder.encode(rawPassword);
//     }
// }


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
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Page<User> getAllUsers(PageRequest pageRequest) {
        return userRepository.findAll(pageRequest);
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
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    Map.of("folder", "profile_photos"));
            return uploadResult.get("url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
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

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}