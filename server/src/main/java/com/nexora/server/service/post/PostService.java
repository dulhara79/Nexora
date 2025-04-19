package com.nexora.server.service.post;

import com.nexora.server.model.User;
import com.nexora.server.model.post.Notification;
import com.nexora.server.model.post.Post;
import com.nexora.server.repository.post.NotificationRepository;
import com.nexora.server.repository.post.PostRepository;
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
            List<Post.Media> mediaList = new ArrayList<>();
            for (MultipartFile file : files) {
                try {
                    // Upload to Cloudinary
                    Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of("resource_type", "auto"));
                    System.out.println("Cloudinary Upload Result: " + uploadResult);
                    String fileUrl = uploadResult.get("url").toString();
                    String fileType = uploadResult.get("resource_type").equals("video") ? "video/mp4" : file.getContentType();

                    Post.Media media = new Post.Media();
                    media.setFileName(file.getOriginalFilename());
                    media.setFileUrl(fileUrl);
                    media.setFileType(fileType);
                    System.out.println("Media URL: " + media.getFileUrl() + ", Type: " + media.getFileType());
                    mediaList.add(media);
                } catch (Exception e) {
                    System.err.println("Error uploading file to Cloudinary: " + e.getMessage());
                    throw new RuntimeException("Failed to upload media to Cloudinary", e);
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
        System.out.println("@.........posts.........");
        System.out.println("All Posts: " + posts);
        System.out.println("Total Posts: " + posts.size());
        return posts;
    }

    public Post likePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getLikes().contains(userId)) {
            post.getLikes().add(userId);

            if (!userId.equals(post.getUserId())) {
                Notification notification = new Notification();
                notification.setId(UUID.randomUUID().toString());
                notification.setUserId(post.getUserId());
                notification.setMessage(userId + " liked your post");
                notification.setCreatedAt(LocalDateTime.now());
                notificationRepository.save(notification);
            }
        }

        return postRepository.save(post);
    }

    public Post addComment(String postId, String userId, String commentText) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post.Comment comment = new Post.Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setName(user.getName());
        comment.setText(commentText);
        comment.setCreatedAt(LocalDateTime.now());

        post.getComments().add(comment);

        if (!userId.equals(post.getUserId())) {
            Notification notification = new Notification();
            notification.setId(UUID.randomUUID().toString());
            notification.setUserId(post.getUserId());
            notification.setName(user.getName());
            notification.setMessage(userId + " commented on your post");
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
}