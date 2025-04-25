package com.nexora.server.service.post;

import com.nexora.server.model.User;
import com.nexora.server.model.post.Notification;
import com.nexora.server.model.post.Post;
import com.nexora.server.repository.post.NotificationRepository;
import com.nexora.server.repository.post.PostRepository;
import com.nexora.server.service.UserService;
import com.nexora.server.repository.UserRepository;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private UserService userService;

    public Post createPost(String userId, String description, List<MultipartFile> files) throws Exception {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        Post post = new Post();
        post.setUserId(userId);
        post.setDescription(description);
        post.setCreatedAt(LocalDateTime.now());

        // Fetch username
        com.nexora.server.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
        post.setUserName(user.getName());

        if (files != null && !files.isEmpty()) {
            // Limit to 3 files
            if (files.size() > 3) {
                throw new IllegalArgumentException("A post can contain a maximum of 3 photos or videos.");
            }

            // Check if all files are of the same type (all images or all videos)
            boolean isVideo = files.get(0).getContentType().startsWith("video");
            for (MultipartFile file : files) {
                boolean currentIsVideo = file.getContentType().startsWith("video");
                if (currentIsVideo != isVideo) {
                    throw new IllegalArgumentException("A post can contain either photos or videos, but not both.");
                }
            }

            List<Post.Media> mediaList = new ArrayList<>();
            for (MultipartFile file : files) {
                try {
                    // Upload to Cloudinary
                    Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of("resource_type", "auto"));
                    System.out.println("Cloudinary Upload Result: " + uploadResult);

                    // Check video duration if it's a video
                    if (isVideo) {
                        Object durationObj = uploadResult.get("duration");
                        if (durationObj == null) {
                            throw new IllegalArgumentException("Unable to determine video duration.");
                        }
                        double duration = Double.parseDouble(durationObj.toString());
                        if (duration > 30) {
                            throw new IllegalArgumentException("Videos must be 30 seconds or less.");
                        }
                    }

                    String fileUrl = uploadResult.get("url").toString();
                    String fileType = isVideo ? "video/mp4" : file.getContentType();

                    Post.Media media = new Post.Media();
                    media.setFileName(file.getOriginalFilename());
                    media.setFileUrl(fileUrl);
                    media.setFileType(fileType);
                    System.out.println("Media URL: " + media.getFileUrl() + ", Type: " + media.getFileType());
                    mediaList.add(media);
                } catch (Exception e) {
                    System.err.println("Error uploading file to Cloudinary: " + e.getMessage());
                    throw new RuntimeException("Failed to upload media to Cloudinary: " + e.getMessage(), e);
                }
            }
            post.setMedia(mediaList);
        }

        Post savedPost = postRepository.save(post);
        System.out.println("Saved Post: " + savedPost);
        return savedPost;
    }

    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        for (Post post : posts) {
            if (post.getUserId() != null) {
                com.nexora.server.model.User user = userRepository.findById(post.getUserId())
                        .orElse(null);
                post.setUserName(user != null ? user.getName() : "Unknown User");
            } else {
                post.setUserName("Unknown User");
            }
            System.out.println("Post Media: " + post.getMedia());
        }
        return posts;
    }

    public Post updatePost(String postId, String userId, String description, List<MultipartFile> files) throws Exception {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        // Check if the user is the owner of the post
        if (!post.getUserId().equals(userId)) {
            throw new SecurityException("You are not authorized to edit this post");
        }

        // Update description if provided
        if (description != null && !description.trim().isEmpty()) {
            post.setDescription(description);
        }

        // Update media if new files are provided
        if (files != null && !files.isEmpty()) {
            // Limit to 3 files
            if (files.size() > 3) {
                throw new IllegalArgumentException("A post can contain a maximum of 3 photos or videos.");
            }

            // Check if all files are of the same type
            boolean isVideo = files.get(0).getContentType().startsWith("video");
            for (MultipartFile file : files) {
                boolean currentIsVideo = file.getContentType().startsWith("video");
                if (currentIsVideo != isVideo) {
                    throw new IllegalArgumentException("A post can contain either photos or videos, but not both.");
                }
            }

            // Delete old media from Cloudinary
            List<Post.Media> oldMedia = post.getMedia();
            for (Post.Media media : oldMedia) {
                String publicId = extractPublicIdFromUrl(media.getFileUrl());
                cloudinary.uploader().destroy(publicId, Map.of("resource_type", isVideo ? "video" : "image"));
            }

            // Upload new media
            List<Post.Media> mediaList = new ArrayList<>();
            for (MultipartFile file : files) {
                Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of("resource_type", "auto"));
                if (isVideo) {
                    Object durationObj = uploadResult.get("duration");
                    if (durationObj == null) {
                        throw new IllegalArgumentException("Unable to determine video duration.");
                    }
                    double duration = Double.parseDouble(durationObj.toString());
                    if (duration > 30) {
                        throw new IllegalArgumentException("Videos must be 30 seconds or less.");
                    }
                }

                String fileUrl = uploadResult.get("url").toString();
                String fileType = isVideo ? "video/mp4" : file.getContentType();

                Post.Media media = new Post.Media();
                media.setFileName(file.getOriginalFilename());
                media.setFileUrl(fileUrl);
                media.setFileType(fileType);
                mediaList.add(media);
            }
            post.setMedia(mediaList);
        }

        return postRepository.save(post);
    }

    public void deletePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        // Check if the user is the owner of the post
        if (!post.getUserId().equals(userId)) {
            throw new SecurityException("You are not authorized to delete this post");
        }

        // Delete media from Cloudinary
        List<Post.Media> mediaList = post.getMedia();
        for (Post.Media media : mediaList) {
            String publicId = extractPublicIdFromUrl(media.getFileUrl());
            try {
                cloudinary.uploader().destroy(publicId, Map.of("resource_type", media.getFileType().startsWith("video") ? "video" : "image"));
            } catch (Exception e) {
                System.err.println("Error deleting media from Cloudinary: " + e.getMessage());
            }
        }

        // Delete the post from the database
        postRepository.delete(post);
    }

    public Post likePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getLikes().contains(userId)) {
            post.getLikes().add(userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (!userId.equals(post.getUserId())) {
                Notification notification = new Notification();
                notification.setId(UUID.randomUUID().toString());
                notification.setUserId(post.getUserId());
                notification.setMessage(user.getName() + " liked your post");
                notification.setCreatedAt(LocalDateTime.now());
                notificationRepository.save(notification);
            }
        }

        return postRepository.save(post);
    }

    public Post addComment(String postId, String userId, String commentText) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userService.getUserById(userId);

        Post.Comment comment = new Post.Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setName(user.getName());
        comment.setText(commentText);
        comment.setCreatedAt(LocalDateTime.now());

        // // Fetch username
        // user = userRepository.findById(userId).orElse(null);
        // comment.setName(user != null ? user.getName() : "Unknown User");

        post.getComments().add(comment);

        if (!userId.equals(post.getUserId())) {
            Notification notification = new Notification();
            notification.setId(UUID.randomUUID().toString());
            notification.setUserId(post.getUserId());
            notification.setName(post.getUserName());
            notification.setMessage(user.getName() + " commented on your post");
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }

        return postRepository.save(post);
    }

    public Post updateComment(String postId, String commentId, String userId, String updatedComment) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Post.Comment comment = post.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to edit this comment");
        }

        comment.setText(updatedComment);
        return postRepository.save(post);
    }

    public Post deleteComment(String postId, String commentId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Post.Comment comment = post.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId) && !post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }

        post.getComments().remove(comment);
        return postRepository.save(post);
    }

    // Helper method to extract Cloudinary public ID from URL
    private String extractPublicIdFromUrl(String url) {
        String[] parts = url.split("/");
        String fileName = parts[parts.length - 1];
        return fileName.substring(0, fileName.lastIndexOf("."));
    }
}