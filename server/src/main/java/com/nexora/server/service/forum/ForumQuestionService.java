package com.nexora.server.service.forum;

import com.nexora.server.model.Role;
import com.nexora.server.model.User;
import com.nexora.server.model.forum.ForumQuestion;
import com.nexora.server.model.forum.ForumNotification;
import com.nexora.server.repository.UserRepository;
import com.nexora.server.repository.forum.ForumQuestionRepository;
import com.nexora.server.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

/**
 * Service class for managing forum questions.
 */
@Service
public class ForumQuestionService {
    private static final Logger LOGGER = Logger.getLogger(ForumQuestionService.class.getName());

    @Autowired
    private ForumQuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ForumTagService tagService;

    @Autowired
    private ForumNotificationService notificationService;

    /**
     * Creates a new forum question.
     * @param question The question to create.
     * @param userId The ID of the user creating the question.
     * @return The saved ForumQuestion.
     * @throws Exception if user not found or validation fails.
     */
    public ForumQuestion createQuestion(ForumQuestion question, String userId) throws Exception {
        LOGGER.info("Creating question with title: " + question.getTitle());
        Optional<User> userOptional = userRepository.findById(userId);
        User user = userService.getUserById(userId);
        String username = user.getName();
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        if (question.getTitle() == null || question.getTitle().trim().isEmpty()) {
            throw new Exception("Title is required");
        }
        if (question.getDescription() == null || question.getDescription().trim().isEmpty()) {
            throw new Exception("Description is required");
        }

        question.setAuthorId(userId);
        question.setAuthorAvatarUrl(user.getProfilePhotoUrl());
        question.setCreatedAt(LocalDateTime.now());
        List<String> tags = question.getTags() != null ? question.getTags() : new ArrayList<>();
        question.setTags(tags);
        tagService.saveTags(tags);
        question.setAuthorUsername(username);
        ForumQuestion savedQuestion = questionRepository.save(question);
        LOGGER.info("Question created with ID: " + savedQuestion.getId());
        return savedQuestion;
    }

    /**
     * Updates an existing forum question.
     * @param questionId The ID of the question to update.
     * @param updatedQuestion The updated question data.
     * @param userId The ID of the user performing the update.
     * @return The updated ForumQuestion.
     * @throws Exception if not found, unauthorized, or time limit exceeded.
     */
    public ForumQuestion updateQuestion(String questionId, ForumQuestion updatedQuestion, String userId) throws Exception {
        Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        ForumQuestion question = questionOptional.get();
        if (!question.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to edit this question");
        }

        if (question.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
            throw new Exception("Edit time limit exceeded");
        }

        question.setTitle(updatedQuestion.getTitle());
        question.setDescription(updatedQuestion.getDescription());
        List<String> tags = updatedQuestion.getTags() != null ? updatedQuestion.getTags() : new ArrayList<>();
        question.setTags(tags);
        tagService.saveTags(tags);
        question.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }

    /**
     * Deletes a forum question.
     * @param questionId The ID of the question to delete.
     * @param userId The ID of the user performing the deletion.
     * @throws Exception if not found, unauthorized, or time limit exceeded.
     */
    public void deleteQuestion(String questionId, String userId) throws Exception {
        Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        ForumQuestion question = questionOptional.get();
        if (!question.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to delete this question");
        }

        if (question.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
            throw new Exception("Delete time limit exceeded");
        }

        questionRepository.deleteById(questionId);
        LOGGER.info("Question deleted with ID: " + questionId);
    }

    /**
     * Retrieves a list of forum questions with optional filtering and sorting.
     * @param tag Filter by tag.
     * @param search Search by title or description.
     * @param sortBy Sort by "newest" or "mostCommented".
     * @param authorId Filter by author ID.
     * @return List of ForumQuestion.
     */
    public List<ForumQuestion> getQuestions(String tag, String search, String sortBy, String authorId) {
        List<ForumQuestion> questions;

        System.out.println("<> Author ID: " + authorId);

        if (tag != null && !tag.trim().isEmpty()) {
            questions = questionRepository.findByTagsIn(Collections.singletonList(tag.trim().toLowerCase()));
        } else if (search != null && !search.trim().isEmpty()) {
            questions = questionRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search);
        } else {
            questions = questionRepository.findAll();
        }

        if (authorId != null && !authorId.isEmpty()) {
            questions = questionRepository.findByAuthorId(authorId); // Filter by authorId
            System.out.println("Found " + questions.size() + " questions for authorId: " + authorId);
        } else {
            questions = questionRepository.findAll(); // Default behavior
            System.out.println("Returning all " + questions.size() + " questions for all authors.");
        }

        if ("newest".equalsIgnoreCase(sortBy)) {
            questions.sort(Comparator.comparing(
                ForumQuestion::getCreatedAt,
                Comparator.nullsLast(Comparator.naturalOrder())).reversed());
        } else if ("mostCommented".equalsIgnoreCase(sortBy)) {
            questions.sort(Comparator.comparingInt(
                (ForumQuestion q) -> q.getCommentIds() != null ? q.getCommentIds().size() : 0).reversed());
        }

        return questions;
    }

    /**
     * Upvotes a forum question by a user.
     * @param questionId The ID of the question.
     * @param userId The ID of the user upvoting.
     * @return The updated ForumQuestion.
     * @throws Exception if question not found.
     */
    public ForumQuestion upvoteQuestion(String questionId, String userId) throws Exception {
        Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        ForumQuestion question = questionOptional.get();
        if (question.getUpvoteUserIds() == null) {
            question.setUpvoteUserIds(new ArrayList<>());
        }
        if (question.getDownvoteUserIds() == null) {
            question.setDownvoteUserIds(new ArrayList<>());
        }

        boolean wasUpvoted = question.getUpvoteUserIds().contains(userId);
        if (wasUpvoted) {
            question.getUpvoteUserIds().remove(userId);
        } else {
            question.getUpvoteUserIds().add(userId);
            question.getDownvoteUserIds().remove(userId);
            if (!question.getAuthorId().equals(userId)) {
                Optional<User> voter = userRepository.findById(userId);
                Optional<User> recipient = userRepository.findById(question.getAuthorId());
                String voterName = voter.map(User::getName).orElse("A user");
                ForumNotification notification = new ForumNotification();
                notification.setUserId(question.getAuthorId());
                notification.setUserName(recipient.map(User::getName).orElse(""));
                notification.setMessage(voterName + " upvoted your question: " + question.getTitle());
                notification.setRelatedQuestionId(questionId);
                notification.setType("QUESTION_VOTE");
                notificationService.createNotification(notification);
            }
        }

        return questionRepository.save(question);
    }

    /**
     * Downvotes a forum question by a user.
     * @param questionId The ID of the question.
     * @param userId The ID of the user downvoting.
     * @return The updated ForumQuestion.
     * @throws Exception if question not found.
     */
    public ForumQuestion downvoteQuestion(String questionId, String userId) throws Exception {
        Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        ForumQuestion question = questionOptional.get();
        if (question.getUpvoteUserIds() == null) {
            question.setUpvoteUserIds(new ArrayList<>());
        }
        if (question.getDownvoteUserIds() == null) {
            question.setDownvoteUserIds(new ArrayList<>());
        }

        boolean wasDownvoted = question.getDownvoteUserIds().contains(userId);
        if (wasDownvoted) {
            question.getDownvoteUserIds().remove(userId);
        } else {
            question.getDownvoteUserIds().add(userId);
            question.getUpvoteUserIds().remove(userId);
            if (!question.getAuthorId().equals(userId)) {
                Optional<User> voter = userRepository.findById(userId);
                Optional<User> recipient = userRepository.findById(question.getAuthorId());
                String voterName = voter.map(User::getName).orElse("A user");
                ForumNotification notification = new ForumNotification();
                notification.setUserId(question.getAuthorId());
                notification.setUserName(recipient.map(User::getName).orElse(""));
                notification.setMessage(voterName + " downvoted your question: " + question.getTitle());
                notification.setRelatedQuestionId(questionId);
                notification.setType("QUESTION_VOTE");
                notificationService.createNotification(notification);
            }
        }

        return questionRepository.save(question);
    }

    /**
     * Flags a forum question as inappropriate.
     * @param questionId The ID of the question.
     * @param userId The ID of the user flagging.
     * @throws Exception if question not found.
     */
    public void flagQuestion(String questionId, String userId) throws Exception {
        Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        ForumQuestion question = questionOptional.get();
        question.setFlagged(true);
        questionRepository.save(question);
        LOGGER.info("Question flagged with ID: " + questionId);
    }

    /**
     * Saves a question to the user's saved list.
     * @param questionId The ID of the question.
     * @param userId The ID of the user saving.
     * @throws Exception if question or user not found.
     */
    public void saveQuestion(String questionId, String userId) throws Exception {
        Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new Exception("User not nope");
        }

        User user = userOptional.get();
        if (user.getSavedQuestionIds() == null) {
            user.setSavedQuestionIds(new ArrayList<>());
        }

        if (!user.getSavedQuestionIds().contains(questionId)) {
            user.getSavedQuestionIds().add(questionId);
            userRepository.save(user);
            LOGGER.info("Question saved with ID: " + questionId + " for user: " + userId);
        }
    }

    /**
     * Retrieves the list of questions saved by a user.
     * @param userId The ID of the user.
     * @return List of saved ForumQuestion.
     * @throws Exception if user not found.
     */
    public List<ForumQuestion> getSavedQuestions(String userId) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();
        List<String> savedQuestionIds = user.getSavedQuestionIds() != null ? user.getSavedQuestionIds()
                : new ArrayList<>();
        if (savedQuestionIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<ForumQuestion> savedQuestions = questionRepository.findAllById(savedQuestionIds);
        savedQuestions.sort(Comparator.comparing(
                ForumQuestion::getCreatedAt,
                Comparator.nullsLast(Comparator.naturalOrder())).reversed());
        return savedQuestions;
    }

    /**
     * Removes a question from the user's saved list.
     * @param questionId The ID of the question.
     * @param userId The ID of the user.
     * @throws Exception if question or user not found.
     */
    public void unsaveQuestion(String questionId, String userId) throws Exception {
        Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();
        if (user.getSavedQuestionIds() != null && user.getSavedQuestionIds().contains(questionId)) {
            user.getSavedQuestionIds().remove(questionId);
            userRepository.save(user);
            LOGGER.info("Question unsaved with ID: " + questionId + " for user: " + userId);
        }
    }

    /**
     * Increments the view count of a question.
     * @param questionId The ID of the question.
     * @return The updated ForumQuestion.
     * @throws Exception if question not found.
     */
    public ForumQuestion incrementViews(String questionId) throws Exception {
        Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }
        ForumQuestion question = questionOptional.get();
        question.setViews(question.getViews() + 1);
        return questionRepository.save(question);
    }

    /**
     * Toggles the pinned status of a question (admin/moderator only).
     * @param questionId The ID of the question.
     * @param userId The ID of the user performing the action.
     * @return The updated ForumQuestion.
     * @throws Exception if unauthorized or question not found.
     */
    public ForumQuestion togglePinQuestion(String questionId, String userId) throws Exception {
        if (!isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to pin/unpin question");
        }
        Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }
        ForumQuestion question = questionOptional.get();
        question.setPinned(!question.isPinned());
        return questionRepository.save(question);
    }

    /**
     * Checks if a user is an admin or moderator.
     * @param userId The ID of the user.
     * @return true if admin or moderator, false otherwise.
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
