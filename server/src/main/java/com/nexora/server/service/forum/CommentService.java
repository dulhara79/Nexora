package com.nexora.server.service.forum;

import com.nexora.server.model.Role;
import com.nexora.server.model.User;
import com.nexora.server.model.forum.Comment;
import com.nexora.server.model.forum.Notification;
import com.nexora.server.model.forum.Question;
import com.nexora.server.repository.UserRepository;
import com.nexora.server.repository.forum.CommentRepository;
import com.nexora.server.repository.forum.NotificationRepository;
import com.nexora.server.repository.forum.QuestionRepository;
import com.nexora.server.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class CommentService {
    private static final Logger LOGGER = Logger.getLogger(CommentService.class.getName());

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserService userService;

    public Comment createComment(Comment comment, String userId) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        User user = userService.getUserById(userId);

        Optional<Question> questionOptional = questionRepository.findById(comment.getQuestionId());
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        // Validate parent comment if it exists
        if (comment.getParentCommentId() != null) {
            Optional<Comment> parentCommentOptional = commentRepository.findById(comment.getParentCommentId());
            if (!parentCommentOptional.isPresent()) {
                throw new Exception("Parent comment not found");
            }
        }

        comment.setAuthorId(userId);
        comment.setAuthorName(user.getName()); // Optional: can be fetched from User service
        Comment savedComment = commentRepository.save(comment);
        LOGGER.info("Comment created with ID: " + savedComment.getId());

        // Notify question author
        Question question = questionOptional.get();
        if (!question.getAuthorId().equals(userId)) {
            Notification notification = new Notification();
            notification.setUserId(question.getAuthorId());
            notification.setMessage("User commented on your question: " + question.getTitle());
            notification.setRelatedQuestionId(question.getId());
            notification.setRelatedCommentId(savedComment.getId());
            notificationRepository.save(notification);
        }

        return savedComment;
    }

    public Comment updateComment(String commentId, Comment updatedComment, String userId) throws Exception {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        Comment comment = commentOptional.get();
        if (!comment.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to edit this comment");
        }

        // Check time limit (24 hours)
        if (comment.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
            throw new Exception("Edit time limit exceeded");
        }

        comment.setContent(updatedComment.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String userId) throws Exception {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        Comment comment = commentOptional.get();
        if (!comment.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to delete this comment");
        }

        // Check time limit (24 hours)
        if (comment.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
            throw new Exception("Delete time limit exceeded");
        }

        commentRepository.deleteById(commentId);
        LOGGER.info("Comment deleted with ID: " + commentId);
    }

    public List<Comment> getCommentsByQuestionId(String questionId) {
        return commentRepository.findByQuestionId(questionId);
    }

    public Comment upvoteComment(String commentId, String userId) throws Exception {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        Comment comment = commentOptional.get();
        if (comment.getUpvoteUserIds().contains(userId)) {
            comment.getUpvoteUserIds().remove(userId);
        } else {
            comment.getUpvoteUserIds().add(userId);
            comment.getDownvoteUserIds().remove(userId); // Remove downvote if exists
        }

        return commentRepository.save(comment);
    }

    public Comment downvoteComment(String commentId, String userId) throws Exception {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        Comment comment = commentOptional.get();
        if (comment.getDownvoteUserIds().contains(userId)) {
            comment.getDownvoteUserIds().remove(userId);
        } else {
            comment.getDownvoteUserIds().add(userId);
            comment.getUpvoteUserIds().remove(userId); // Remove upvote if exists
        }

        return commentRepository.save(comment);
    }

    public void flagComment(String commentId, String userId) throws Exception {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        Comment comment = commentOptional.get();
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