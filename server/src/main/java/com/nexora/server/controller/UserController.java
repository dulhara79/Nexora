// package com.nexora.server.controller;

// import com.fasterxml.jackson.core.type.TypeReference;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.nexora.server.model.SocialMediaLink;
// import com.nexora.server.model.User;
// import com.nexora.server.service.UserService;
// import jakarta.servlet.http.HttpSession;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.validation.annotation.Validated;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.util.List;

// @RestController
// @RequestMapping("/api/users")
// @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
// @Validated
// public class UserController {

//     @Autowired
//     private UserService userService;

//     @Autowired
//     private ObjectMapper objectMapper;

//     @Autowired
//     private PasswordEncoder passwordEncoder;

//     @PostMapping("/{userId}/follow/{targetUserId}")
//     public ResponseEntity<?> followUser(
//             @PathVariable String userId,
//             @PathVariable String targetUserId) {
//         try {
//             String result = userService.followUser(userId, targetUserId);
//             return ResponseEntity.ok(result);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @PostMapping("/{userId}/unfollow/{targetUserId}")
//     public ResponseEntity<?> unfollowUser(
//             @PathVariable String userId,
//             @PathVariable String targetUserId) {
//         try {
//             String result = userService.unfollowUser(userId, targetUserId);
//             return ResponseEntity.ok(result);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @GetMapping("/{userId}")
//     public ResponseEntity<?> getUserById(@PathVariable String userId) {
//         try {
//             User user = userService.getUserById(userId);
//             return ResponseEntity.ok(user);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @GetMapping("/")
//     public ResponseEntity<?> getAllUsers() {
//         try {
//             List<User> users = userService.getAllUsers();
//             return ResponseEntity.ok(users);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @PutMapping("/edit/{id}")
//     public ResponseEntity<?> editUser(
//             @PathVariable String id,
//             @RequestParam(required = false) String name,
//             @RequestParam(required = false) String username,
//             @RequestParam(required = false) String email,
//             @RequestParam(required = false) String about,
//             @RequestParam(required = false) String password,
//             @RequestParam(required = false) String currentPassword,
//             @RequestParam(required = false) MultipartFile profileImage,
//             @RequestParam(required = false) MultipartFile bannerImage,
//             @RequestParam(required = false) String socialMedia,
//             HttpSession session) {
//         String sessionUserId = (String) session.getAttribute("userId");
//         if (sessionUserId == null || !sessionUserId.equals(id)) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
//         }

//         try {
//             User user = userService.findById(id);
//             if (user == null)
//                 return ResponseEntity.notFound().build();

//             if (name != null)
//                 user.setName(name);
//             if (username != null)
//                 user.setUsername(username);
//             if (email != null)
//                 user.setEmail(email);
//             if (about != null)
//                 user.setAbout(about);
//             if (password != null && currentPassword != null) {
//                 if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
//                     return ResponseEntity.badRequest().body("Current password is incorrect");
//                 }
//                 user.setPassword(passwordEncoder.encode(password));
//             }
//             if (profileImage != null && !profileImage.isEmpty()) {
//                 String profileUrl = userService.uploadFile(profileImage);
//                 user.setProfilePhotoUrl(profileUrl);
//             }
//             if (bannerImage != null && !bannerImage.isEmpty()) {
//                 String bannerUrl = userService.uploadFile(bannerImage);
//                 user.setBannerPhotoUrl(bannerUrl);
//             }
//             if (socialMedia != null) {
//                 List<SocialMediaLink> socialMediaLinks = objectMapper.readValue(socialMedia,
//                         new TypeReference<List<SocialMediaLink>>() {
//                         });
//                 user.setSocialMedia(socialMediaLinks);
//             }

//             userService.save(user);
//             return ResponseEntity.ok("Profile updated successfully");
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }

//     @DeleteMapping("/deactivate/{userId}")
//     public ResponseEntity<?> deleteUser(@PathVariable String userId) {
//         try {
//             String result = userService.deleteUser(userId);
//             return ResponseEntity.ok(result);
//         } catch (Exception e) {
//             return ResponseEntity.badRequest().body(e.getMessage());
//         }
//     }
// }

package com.nexora.server.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexora.server.model.SocialMediaLink;
import com.nexora.server.model.User;
import com.nexora.server.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/{userId}/follow/{targetUserId}")
    public ResponseEntity<?> followUser(
            @PathVariable String userId,
            @PathVariable String targetUserId) {
        try {
            String result = userService.followUser(userId, targetUserId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/unfollow/{targetUserId}")
    public ResponseEntity<?> unfollowUser(
            @PathVariable String userId,
            @PathVariable String targetUserId) {
        try {
            String result = userService.unfollowUser(userId, targetUserId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/suggested/{userId}")
    public ResponseEntity<?> getSuggestedUsers(@PathVariable String userId,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            List<User> suggestedUsers = userService.getSuggestedUsers(userId, limit);
            return ResponseEntity.ok(suggestedUsers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editUser(
            @PathVariable String id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String about,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) String currentPassword,
            @RequestParam(required = false) MultipartFile profileImage,
            @RequestParam(required = false) MultipartFile bannerImage,
            @RequestParam(required = false) String socialMedia,
            HttpSession session) {
        String sessionUserId = (String) session.getAttribute("userId");
        if (sessionUserId == null || !sessionUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        try {
            User user = userService.findById(id);
            if (user == null)
                return ResponseEntity.notFound().build();

            if (name != null)
                user.setName(name);
            if (username != null)
                user.setUsername(username);
            if (email != null)
                user.setEmail(email);
            if (about != null)
                user.setAbout(about);
            if (password != null && currentPassword != null) {
                if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                    return ResponseEntity.badRequest().body("Current password is incorrect");
                }
                user.setPassword(passwordEncoder.encode(password));
            }
            if (profileImage != null && !profileImage.isEmpty()) {
                String profileUrl = userService.uploadFile(profileImage);
                user.setProfilePhotoUrl(profileUrl);
            }
            if (bannerImage != null && !bannerImage.isEmpty()) {
                String bannerUrl = userService.uploadFile(bannerImage);
                user.setBannerPhotoUrl(bannerUrl);
            }
            if (socialMedia != null) {
                List<SocialMediaLink> socialMediaLinks = objectMapper.readValue(socialMedia,
                        new TypeReference<List<SocialMediaLink>>() {
                        });
                user.setSocialMedia(socialMediaLinks);
            }

            userService.save(user);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/deactivate/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            String result = userService.deleteUser(userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}