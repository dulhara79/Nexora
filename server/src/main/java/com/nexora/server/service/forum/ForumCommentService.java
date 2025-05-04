// package com.nexora.server.service.forum;

// import com.nexora.server.model.Role;
// import com.nexora.server.model.User;
// import com.nexora.server.model.forum.ForumComment;
// import com.nexora.server.model.forum.ForumNotification;
// import com.nexora.server.model.forum.ForumQuestion;
// import com.nexora.server.repository.UserRepository;
// import com.nexora.server.repository.forum.ForumCommentRepository;
// import com.nexora.server.repository.forum.ForumNotificationRepository;
// import com.nexora.server.repository.forum.ForumQuestionRepository;
// import com.nexora.server.service.UserService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;
// import java.util.logging.Logger;

// @Service
// public class ForumCommentService {
//     private static final Logger LOGGER = Logger.getLogger(ForumCommentService.class.getName());

//     @Autowired
//     private ForumCommentRepository commentRepository;

//     @Autowired
//     private ForumQuestionRepository questionRepository;

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private ForumNotificationRepository notificationRepository;

//     @Autowired
//     private UserService userService;

//     public ForumComment createComment(ForumComment comment, String userId) throws Exception {
//         Optional<User> userOptional = userRepository.findById(userId);
//         if (!userOptional.isPresent()) {
//             throw new Exception("User not found");
//         }

//         User user = userService.getUserById(userId);

//         Optional<ForumQuestion> questionOptional = questionRepository.findById(comment.getQuestionId());
//         if (!questionOptional.isPresent()) {
//             throw new Exception("Question not found");
//         }

//         // Validate parent comment if it exists
//         if (comment.getParentCommentId() != null) {
//             Optional<ForumComment> parentCommentOptional = commentRepository.findById(comment.getParentCommentId());
//             if (!parentCommentOptional.isPresent()) {
//                 throw new Exception("Parent comment not found");
//             }
//         }

//         comment.setAuthorId(userId);
//         comment.setAuthorName(user.getName()); // Optional: can be fetched from User service
//         ForumComment savedComment = commentRepository.save(comment);
//         LOGGER.info("Comment created with ID: " + savedComment.getId());

//         // Notify question author
//         ForumQuestion question = questionOptional.get();
//         if (!question.getAuthorId().equals(userId)) {
//             ForumNotification notification = new ForumNotification();
//             notification.setUserId(question.getAuthorId());
//             notification.setMessage("User commented on your question: " + question.getTitle());
//             notification.setRelatedQuestionId(question.getId());
//             notification.setRelatedCommentId(savedComment.getId());
//             notificationRepository.save(notification);
//         }

//         return savedComment;
//     }

//     public ForumComment updateComment(String commentId, ForumComment updatedComment, String userId) throws Exception {
//         Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
//         if (!commentOptional.isPresent()) {
//             throw new Exception("Comment not found");
//         }

//         ForumComment comment = commentOptional.get();
//         if (!comment.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
//             throw new Exception("Unauthorized to edit this comment");
//         }

//         // Check time limit (24 hours)
//         if (comment.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
//             throw new Exception("Edit time limit exceeded");
//         }

//         comment.setContent(updatedComment.getContent());
//         comment.setUpdatedAt(LocalDateTime.now());
//         return commentRepository.save(comment);
//     }

//     public void deleteComment(String commentId, String userId) throws Exception {
//         Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
//         if (!commentOptional.isPresent()) {
//             throw new Exception("Comment not found");
//         }

//         ForumComment comment = commentOptional.get();
//         if (!comment.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
//             throw new Exception("Unauthorized to delete this comment");
//         }

//         // Check time limit (24 hours)
//         if (comment.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
//             throw new Exception("Delete time limit exceeded");
//         }

//         commentRepository.deleteById(commentId);
//         LOGGER.info("Comment deleted with ID: " + commentId);
//     }

//     public List<ForumComment> getCommentsByQuestionId(String questionId) {
//         return commentRepository.findByQuestionId(questionId);
//     }

//     public ForumComment upvoteComment(String commentId, String userId) throws Exception {
//         Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
//         if (!commentOptional.isPresent()) {
//             throw new Exception("Comment not found");
//         }

//         ForumComment comment = commentOptional.get();
//         if (comment.getUpvoteUserIds().contains(userId)) {
//             comment.getUpvoteUserIds().remove(userId);
//         } else {
//             comment.getUpvoteUserIds().add(userId);
//             comment.getDownvoteUserIds().remove(userId); // Remove downvote if exists
//         }

//         return commentRepository.save(comment);
//     }

//     public ForumComment downvoteComment(String commentId, String userId) throws Exception {
//         Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
//         if (!commentOptional.isPresent()) {
//             throw new Exception("Comment not found");
//         }

//         ForumComment comment = commentOptional.get();
//         if (comment.getDownvoteUserIds().contains(userId)) {
//             comment.getDownvoteUserIds().remove(userId);
//         } else {
//             comment.getDownvoteUserIds().add(userId);
//             comment.getUpvoteUserIds().remove(userId); // Remove upvote if exists
//         }

//         return commentRepository.save(comment);
//     }

//     public void flagComment(String commentId, String userId) throws Exception {
//         Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
//         if (!commentOptional.isPresent()) {
//             throw new Exception("Comment not found");
//         }

//         ForumComment comment = commentOptional.get();
//         comment.setFlagged(true);
//         commentRepository.save(comment);
//         LOGGER.info("Comment flagged with ID: " + commentId);
//     }

//     private boolean isAdminOrModerator(String userId) {
//         Optional<User> userOptional = userRepository.findById(userId);
//         if (userOptional.isPresent()) {
//             User user = userOptional.get();
//             return user.getRole() == Role.ADMIN || user.getRole() == Role.MODERATOR;
//         }
//         return false;
//     }
// }

package com.nexora.server.service.forum;

import com.nexora.server.model.Role;
import com.nexora.server.model.User;
import com.nexora.server.model.forum.ForumComment;
import com.nexora.server.model.forum.ForumNotification;
import com.nexora.server.model.forum.ForumQuestion;
import com.nexora.server.repository.UserRepository;
import com.nexora.server.repository.forum.ForumCommentRepository;
import com.nexora.server.repository.forum.ForumNotificationRepository;
import com.nexora.server.repository.forum.ForumQuestionRepository;
import com.nexora.server.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class ForumCommentService {
    private static final Logger LOGGER = Logger.getLogger(ForumCommentService.class.getName());

    @Autowired
    private ForumCommentRepository commentRepository;

    @Autowired
    private ForumQuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ForumNotificationRepository notificationRepository;

    @Autowired
    private ForumNotificationService notificationService;

    @Autowired
    private UserService userService;

    public ForumComment createComment(ForumComment comment, String userId) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        User user = userService.getUserById(userId);

        Optional<ForumQuestion> questionOptional = questionRepository.findById(comment.getQuestionId());
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        if (comment.getParentCommentId() != null) {
            Optional<ForumComment> parentCommentOptional = commentRepository.findById(comment.getParentCommentId());
            if (!parentCommentOptional.isPresent()) {
                throw new Exception("Parent comment not found");
            }
        }

        comment.setAuthorId(userId);
        comment.setAuthorName(user.getName());
        ForumComment savedComment = commentRepository.save(comment);
        LOGGER.info("Comment created with ID: " + savedComment.getId());

        ForumQuestion question = questionOptional.get();
        if (!question.getAuthorId().equals(userId)) {
            ForumNotification notification = new ForumNotification();
            notification.setUserId(question.getAuthorId());
            notification.setUserName(question.getAuthorUsername());
            notification.setMessage(user.getName() + " commented on your question: " + question.getTitle());
            notification.setRelatedQuestionId(question.getId());
            notification.setRelatedCommentId(savedComment.getId());
            notification.setType("COMMENT");
            notificationService.createNotification(notification);
        }

        return savedComment;
    }

    public ForumComment updateComment(String commentId, ForumComment updatedComment, String userId) throws Exception {
        Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        ForumComment comment = commentOptional.get();
        if (!comment.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to edit this comment");
        }

        if (comment.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
            throw new Exception("Edit time limit exceeded");
        }

        comment.setContent(updatedComment.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String userId) throws Exception {
        Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        ForumComment comment = commentOptional.get();
        if (!comment.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to delete this comment");
        }

        if (comment.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
            throw new Exception("Delete time limit exceeded");
        }

        commentRepository.deleteById(commentId);
        LOGGER.info("Comment deleted with ID: " + commentId);
    }

    public List<ForumComment> getCommentsByQuestionId(String questionId) {
        return commentRepository.findByQuestionId(questionId);
    }

    public ForumComment upvoteComment(String commentId, String userId) throws Exception {
        Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        ForumComment comment = commentOptional.get();
        boolean wasUpvoted = comment.getUpvoteUserIds().contains(userId);
        if (wasUpvoted) {
            comment.getUpvoteUserIds().remove(userId);
        } else {
            comment.getUpvoteUserIds().add(userId);
            comment.getDownvoteUserIds().remove(userId);
            if (!comment.getAuthorId().equals(userId)) {
                Optional<User> voter = userRepository.findById(userId);
                Optional<User> recipient = userRepository.findById(comment.getAuthorId());
                String voterName = voter.map(User::getName).orElse("A user");
                ForumNotification notification = new ForumNotification();
                notification.setUserId(comment.getAuthorId());
                notification.setUserName(recipient.map(User::getName).orElse(""));
                notification.setMessage(voterName + " upvoted your comment");
                notification.setRelatedCommentId(commentId);
                notification.setRelatedQuestionId(comment.getQuestionId());
                notification.setType("COMMENT_VOTE");
                notificationService.createNotification(notification);
            }
        }

        return commentRepository.save(comment);
    }

    public ForumComment downvoteComment(String commentId, String userId) throws Exception {
        Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        ForumComment comment = commentOptional.get();
        boolean wasDownvoted = comment.getDownvoteUserIds().contains(userId);
        if (wasDownvoted) {
            comment.getDownvoteUserIds().remove(userId);
        } else {
            comment.getDownvoteUserIds().add(userId);
            comment.getUpvoteUserIds().remove(userId);
            if (!comment.getAuthorId().equals(userId)) {
                Optional<User> voter = userRepository.findById(userId);
                Optional<User> recipient = userRepository.findById(comment.getAuthorId());
                String voterName = voter.map(User::getName).orElse("A user");
                ForumNotification notification = new ForumNotification();
                notification.setUserId(comment.getAuthorId());
                notification.setUserName(recipient.map(User::getName).orElse(""));
                notification.setMessage(voterName + " downvoted your comment");
                notification.setRelatedCommentId(commentId);
                notification.setRelatedQuestionId(comment.getQuestionId());
                notification.setType("COMMENT_VOTE");
                notificationService.createNotification(notification);
            }
        }

        return commentRepository.save(comment);
    }

    public void flagComment(String commentId, String userId) throws Exception {
        Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        ForumComment comment = commentOptional.get();
        comment.setFlagged(true);
        commentRepository.save(comment);
        LOGGER.info("Comment flagged with ID: " + commentId);
    }

    private boolean isAdminOrModerator(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getRole() == Role.ADMIN || user.getRole() == Role.MODERATOR;
        }
        return false;
    }
}