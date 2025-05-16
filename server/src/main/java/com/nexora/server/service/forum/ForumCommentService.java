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

/**
 * Service class for managing forum comments, including creation, update, deletion,
 * voting, and flagging. Handles related notifications and authorization checks.
 */
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

    /**
     * Creates a new comment for a forum question or as a reply to another comment.
     * Sends a notification to the question author if applicable.
     *
     * @param comment The comment to create.
     * @param userId  The ID of the user creating the comment.
     * @return The saved ForumComment.
     * @throws Exception if user, question, or parent comment is not found.
     */
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

        // If replying to another comment, check if parent exists
        if (comment.getParentCommentId() != null) {
            Optional<ForumComment> parentCommentOptional = commentRepository.findById(comment.getParentCommentId());
            if (!parentCommentOptional.isPresent()) {
                throw new Exception("Parent comment not found");
            }
        }

        // Set author details
        comment.setAuthorId(userId);
        comment.setAuthorName(user.getName());
        comment.setAuthorAvatarUrl(user.getProfilePhotoUrl());
        ForumComment savedComment = commentRepository.save(comment);
        LOGGER.info("Comment created with ID: " + savedComment.getId());

        // Notify question author if not self-comment
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

    /**
     * Updates the content of an existing comment.
     * Only the author or an admin/moderator can update within 24 hours.
     *
     * @param commentId      The ID of the comment to update.
     * @param updatedComment The comment object with updated content.
     * @param userId         The ID of the user attempting the update.
     * @return The updated ForumComment.
     * @throws Exception if comment not found, unauthorized, or time limit exceeded.
     */
    public ForumComment updateComment(String commentId, ForumComment updatedComment, String userId) throws Exception {
        Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        ForumComment comment = commentOptional.get();
        // Check authorization
        if (!comment.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to edit this comment");
        }

        // Check 24-hour edit window
        if (comment.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
            throw new Exception("Edit time limit exceeded");
        }

        comment.setContent(updatedComment.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    /**
     * Deletes a comment. Only the author or an admin/moderator can delete within 24 hours.
     *
     * @param commentId The ID of the comment to delete.
     * @param userId    The ID of the user attempting the deletion.
     * @throws Exception if comment not found, unauthorized, or time limit exceeded.
     */
    public void deleteComment(String commentId, String userId) throws Exception {
        Optional<ForumComment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            throw new Exception("Comment not found");
        }

        ForumComment comment = commentOptional.get();
        // Check authorization
        if (!comment.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to delete this comment");
        }

        // Check 24-hour delete window
        if (comment.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
            throw new Exception("Delete time limit exceeded");
        }

        commentRepository.deleteById(commentId);
        LOGGER.info("Comment deleted with ID: " + commentId);
    }

    /**
     * Retrieves all comments for a given question.
     *
     * @param questionId The ID of the question.
     * @return List of ForumComment.
     */
    public List<ForumComment> getCommentsByQuestionId(String questionId) {
        return commentRepository.findByQuestionId(questionId);
    }

    /**
     * Upvotes a comment. If already upvoted, removes the upvote.
     * Sends a notification to the comment author if not self-voted.
     *
     * @param commentId The ID of the comment to upvote.
     * @param userId    The ID of the user upvoting.
     * @return The updated ForumComment.
     * @throws Exception if comment not found.
     */
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
            // Notify comment author if not self-vote
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

    /**
     * Downvotes a comment. If already downvoted, removes the downvote.
     * Sends a notification to the comment author if not self-voted.
     *
     * @param commentId The ID of the comment to downvote.
     * @param userId    The ID of the user downvoting.
     * @return The updated ForumComment.
     * @throws Exception if comment not found.
     */
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
            // Notify comment author if not self-vote
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

    /**
     * Flags a comment as inappropriate.
     *
     * @param commentId The ID of the comment to flag.
     * @param userId    The ID of the user flagging the comment.
     * @throws Exception if comment not found.
     */
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

    /**
     * Checks if a user is an admin or moderator.
     *
     * @param userId The ID of the user.
     * @return true if user is admin or moderator, false otherwise.
     */
    private boolean isAdminOrModerator(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getRole() == Role.ADMIN || user.getRole() == Role.MODERATOR;
        }
        return false;
    }
}