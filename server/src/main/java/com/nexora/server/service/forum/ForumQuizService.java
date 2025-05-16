package com.nexora.server.service.forum;

import com.nexora.server.model.User;
import com.nexora.server.model.forum.ForumNotification;
import com.nexora.server.model.forum.ForumQuiz;
import com.nexora.server.repository.UserRepository;
import com.nexora.server.repository.forum.ForumQuizRepository;
import com.nexora.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

/**
 * Service class for managing forum quizzes, including creation, update, deletion,
 * answer submission, upvoting, statistics, and notifications.
 */
@Service
public class ForumQuizService {
    private static final Logger LOGGER = Logger.getLogger(ForumQuizService.class.getName());

    @Autowired
    private ForumQuizRepository forumQuizRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ForumNotificationService notificationService;

    /**
     * Creates a new quiz and notifies users.
     */
    public ForumQuiz createQuiz(ForumQuiz quiz, String userId) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }
        User user = userService.getUserById(userId);

        // Validate quiz data
        if (quiz.getTitle() == null || quiz.getTitle().trim().isEmpty()) {
            throw new Exception("Quiz title is required");
        }
        if (quiz.getDescription() == null || quiz.getDescription().trim().isEmpty()) {
            throw new Exception("Quiz description is required");
        }
        if (quiz.getCategory() == null || quiz.getCategory().trim().isEmpty()) {
            throw new Exception("Quiz category is required");
        }
        if (quiz.getDifficulty() == null || quiz.getDifficulty().trim().isEmpty()) {
            throw new Exception("Quiz difficulty is required");
        }
        if (quiz.getDeadline() == null || quiz.getDeadline().isBefore(LocalDateTime.now())) {
            throw new Exception("Valid deadline is required");
        }
        if (quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
            throw new Exception("Quiz must have at least one question");
        }

        // Validate each question
        for (ForumQuiz.Question question : quiz.getQuestions()) {
            if (question.getQuestion() == null || question.getQuestion().trim().isEmpty()) {
                throw new Exception("Question text is required");
            }
            if (question.getOptions() == null || question.getOptions().size() < 2) {
                throw new Exception("Each question must have at least two options");
            }
            if (question.getCorrectAnswer() == null || !question.getOptions().contains(question.getCorrectAnswer())) {
                throw new Exception("Valid correct answer is required for each question");
            }
        }

        // Set author info
        quiz.setAuthorId(userId);
        quiz.setAuthorUsername(user.getName());
        ForumQuiz savedQuiz = forumQuizRepository.save(quiz);
        LOGGER.info("Quiz created with ID: " + savedQuiz.getId());

        // Notify about quiz creation
        ForumNotification notification = new ForumNotification();
        notification.setUserId(userId);
        notification.setUserName(user.getName());
        notification.setMessage(user.getName() + " created a new quiz: " + quiz.getTitle());
        notification.setType("QUIZ_CREATION");
        notification.setRelatedQuizId(savedQuiz.getId());
        notificationService.createNotification(notification);

        return savedQuiz;
    }

    /**
     * Updates an existing quiz. Only the creator can update.
     */
    public ForumQuiz updateQuiz(String quizId, ForumQuiz quizUpdate, String userId) throws Exception {
        Optional<ForumQuiz> quizOptional = forumQuizRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            throw new Exception("Quiz not found");
        }
        ForumQuiz quiz = quizOptional.get();

        // Verify the user is the quiz creator
        if (!quiz.getAuthorId().equals(userId)) {
            throw new Exception("Only the quiz creator can update the quiz");
        }

        // Validate quiz update data
        if (quizUpdate.getTitle() == null || quizUpdate.getTitle().trim().isEmpty()) {
            throw new Exception("Quiz title is required");
        }
        if (quizUpdate.getDescription() == null || quizUpdate.getDescription().trim().isEmpty()) {
            throw new Exception("Quiz description is required");
        }
        if (quizUpdate.getCategory() == null || quizUpdate.getCategory().trim().isEmpty()) {
            throw new Exception("Quiz category is required");
        }
        if (quizUpdate.getDifficulty() == null || quizUpdate.getDifficulty().trim().isEmpty()) {
            throw new Exception("Quiz difficulty is required");
        }
        if (quizUpdate.getDeadline() == null || quizUpdate.getDeadline().isBefore(LocalDateTime.now())) {
            throw new Exception("Valid deadline is required");
        }
        if (quizUpdate.getQuestions() == null || quizUpdate.getQuestions().isEmpty()) {
            throw new Exception("Quiz must have at least one question");
        }

        // Validate each question
        for (ForumQuiz.Question question : quizUpdate.getQuestions()) {
            if (question.getQuestion() == null || question.getQuestion().trim().isEmpty()) {
                throw new Exception("Question text is required");
            }
            if (question.getOptions() == null || question.getOptions().size() < 2) {
                throw new Exception("Each question must have at least two options");
            }
            if (question.getCorrectAnswer() == null || !question.getOptions().contains(question.getCorrectAnswer())) {
                throw new Exception("Valid correct answer is required for each question");
            }
        }

        // Update quiz fields
        quiz.setTitle(quizUpdate.getTitle());
        quiz.setDescription(quizUpdate.getDescription());
        quiz.setCategory(quizUpdate.getCategory());
        quiz.setDifficulty(quizUpdate.getDifficulty());
        quiz.setDeadline(quizUpdate.getDeadline());
        quiz.setQuestions(quizUpdate.getQuestions());

        // Clear participant answers if any exist, to maintain consistency
        if (!quiz.getParticipantAnswers().isEmpty()) {
            quiz.getParticipantAnswers().clear();
            quiz.getParticipantScores().clear();
            quiz.getClearedAttempts().clear();
            LOGGER.info("Cleared participant answers due to quiz update for quiz " + quizId);
        }

        ForumQuiz updatedQuiz = forumQuizRepository.save(quiz);
        LOGGER.info("Quiz updated with ID: " + quizId);

        // Notify about quiz update
        ForumNotification notification = new ForumNotification();
        notification.setUserId(userId);
        notification.setUserName(userService.getUserById(userId).getName());
        notification.setMessage("Quiz updated: " + quiz.getTitle());
        notification.setType("QUIZ_UPDATE");
        notification.setRelatedQuizId(quizId);
        notificationService.createNotification(notification);

        return updatedQuiz;
    }

    /**
     * Deletes a quiz. Only the creator can delete.
     */
    public void deleteQuiz(String quizId, String userId) throws Exception {
        Optional<ForumQuiz> quizOptional = forumQuizRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            throw new Exception("Quiz not found");
        }
        ForumQuiz quiz = quizOptional.get();

        // Verify the user is the quiz creator
        if (!quiz.getAuthorId().equals(userId)) {
            throw new Exception("Only the quiz creator can delete the quiz");
        }

        forumQuizRepository.delete(quiz);
        LOGGER.info("Quiz deleted with ID: " + quizId);

        // Notify about quiz deletion
        ForumNotification notification = new ForumNotification();
        notification.setUserId(userId);
        notification.setUserName(userService.getUserById(userId).getName());
        notification.setMessage("Quiz deleted: " + quiz.getTitle());
        notification.setType("QUIZ_DELETION");
        notification.setRelatedQuizId(quizId);
        notificationService.createNotification(notification);
    }

    /**
     * Saves a quiz (generic save).
     */
    public ForumQuiz saveQuiz(ForumQuiz quiz) {
        return forumQuizRepository.save(quiz);
    }

    /**
     * Submits answers for a quiz. Validates answers and calculates score.
     */
    public ForumQuiz submitAnswer(String quizId, Map<Integer, String> answers, String userId) throws Exception {
        Optional<ForumQuiz> quizOptional = forumQuizRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            throw new Exception("Quiz not found");
        }
        ForumQuiz quiz = quizOptional.get();
        if (!quiz.isActive()) {
            throw new Exception("Quiz is closed");
        }
        if (quiz.getDeadline().isBefore(LocalDateTime.now())) {
            quiz.setActive(false);
            forumQuizRepository.save(quiz);
            throw new Exception("Quiz deadline has passed");
        }
        if (answers == null || answers.isEmpty()) {
            throw new Exception("No answers provided");
        }

        // Validate answers
        for (Map.Entry<Integer, String> entry : answers.entrySet()) {
            Integer questionIndex = entry.getKey();
            String answer = entry.getValue();
            if (questionIndex < 0 || questionIndex >= quiz.getQuestions().size()) {
                throw new Exception("Invalid question index: " + questionIndex);
            }
            ForumQuiz.Question question = quiz.getQuestions().get(questionIndex);
            if (!question.getOptions().contains(answer)) {
                throw new Exception("Invalid answer option for question " + (questionIndex + 1));
            }
        }

        // Check if user has already answered
        if (quiz.getParticipantAnswers().containsKey(userId) && !quiz.getClearedAttempts().containsKey(userId)) {
            throw new Exception("User has already answered this quiz");
        }

        // Store answers and calculate score
        quiz.getParticipantAnswers().put(userId, answers);
        int score = 0;
        for (int i = 0; i < quiz.getQuestions().size(); i++) {
            if (answers.containsKey(i)) {
                String answer = answers.get(i);
                String correctAnswer = quiz.getQuestions().get(i).getCorrectAnswer();
                if (answer.equals(correctAnswer)) {
                    score++;
                }
            }
        }
        quiz.getParticipantScores().put(userId, score);
        quiz.getClearedAttempts().remove(userId);
        forumQuizRepository.save(quiz);
        LOGGER.info("User " + userId + " submitted answers to quiz " + quizId);

        // Notify quiz author if someone else answered
        if (!quiz.getAuthorId().equals(userId)) {
            ForumNotification notification = new ForumNotification();
            notification.setUserId(quiz.getAuthorId());
            notification.setUserName(quiz.getAuthorUsername());
            notification.setMessage(
                    userService.getUserById(userId).getName() + " answered your quiz: " + quiz.getTitle());
            notification.setType("QUIZ_ANSWER");
            notification.setRelatedQuizId(quizId);
            notificationService.createNotification(notification);
        }

        return quiz;
    }

    /**
     * Clears a user's attempt for a quiz, allowing them to retake it.
     */
    public ForumQuiz clearAttempt(String quizId, String userId) throws Exception {
        Optional<ForumQuiz> quizOptional = forumQuizRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            throw new Exception("Quiz not found");
        }
        ForumQuiz quiz = quizOptional.get();
        if (!quiz.getParticipantAnswers().containsKey(userId)) {
            throw new Exception("User has not attempted this quiz");
        }
        if (!quiz.isActive() || quiz.getDeadline().isBefore(LocalDateTime.now())) {
            throw new Exception("Cannot clear attempt for a closed quiz");
        }

        quiz.getParticipantAnswers().remove(userId);
        quiz.getParticipantScores().remove(userId);
        quiz.getClearedAttempts().put(userId, true);
        forumQuizRepository.save(quiz);
        LOGGER.info("User " + userId + " cleared their attempt for quiz " + quizId);
        return quiz;
    }

    /**
     * Upvotes or removes upvote for a quiz. Notifies the author if upvoted.
     */
    public ForumQuiz upvoteQuiz(String quizId, String userId) throws Exception {
        Optional<ForumQuiz> quizOptional = forumQuizRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            throw new Exception("Quiz not found");
        }
        ForumQuiz quiz = quizOptional.get();
        if (quiz.getUpvoteUserIds().contains(userId)) {
            // Remove upvote
            quiz.getUpvoteUserIds().remove(userId);
        } else {
            // Add upvote and notify author
            quiz.getUpvoteUserIds().add(userId);
            if (!quiz.getAuthorId().equals(userId)) {
                Optional<User> voter = userRepository.findById(userId);
                String voterName = voter.map(User::getName).orElse("A user");
                ForumNotification notification = new ForumNotification();
                notification.setUserId(quiz.getAuthorId());
                notification.setUserName(quiz.getAuthorUsername());
                notification.setMessage(voterName + " upvoted your quiz: " + quiz.getTitle());
                notification.setType("QUIZ_VOTE");
                notification.setRelatedQuizId(quizId);
                notificationService.createNotification(notification);
            }
        }
        return forumQuizRepository.save(quiz);
    }

    /**
     * Returns statistics for a quiz (only for the creator).
     */
    public Map<String, Object> getQuizStats(String quizId, String userId) throws Exception {
        Optional<ForumQuiz> quizOptional = forumQuizRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            throw new Exception("Quiz not found");
        }
        ForumQuiz quiz = quizOptional.get();
        if (!quiz.getAuthorId().equals(userId)) {
            throw new Exception("Only the quiz creator can view statistics");
        }

        // Calculate answer distributions for each question
        List<Map<String, Integer>> answerDistributions = new ArrayList<>();
        for (ForumQuiz.Question question : quiz.getQuestions()) {
            Map<String, Integer> distribution = new HashMap<>();
            for (String option : question.getOptions()) {
                distribution.put(option, 0);
            }
            for (Map<Integer, String> userAnswers : quiz.getParticipantAnswers().values()) {
                String answer = userAnswers.get(quiz.getQuestions().indexOf(question));
                if (answer != null) {
                    distribution.put(answer, distribution.getOrDefault(answer, 0) + 1);
                }
            }
            answerDistributions.add(distribution);
        }

        int totalParticipants = quiz.getParticipantAnswers().size();
        int totalCorrectAnswers = quiz.getParticipantScores().values().stream().mapToInt(Integer::intValue).sum();
        double percentageCorrect = totalParticipants > 0
                ? ((double) totalCorrectAnswers / (totalParticipants * quiz.getQuestions().size())) * 100
                : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalParticipants", totalParticipants);
        stats.put("totalCorrectAnswers", totalCorrectAnswers);
        stats.put("percentageCorrect", String.format("%.0f", percentageCorrect));
        stats.put("answerDistributions", answerDistributions);
        return stats;
    }

    /**
     * Retrieves a quiz by its ID.
     */
    public Optional<ForumQuiz> getQuizById(String quizId) {
        return forumQuizRepository.findById(quizId);
    }

    /**
     * Returns all active quizzes.
     */
    public List<ForumQuiz> getActiveQuizzes() {
        return forumQuizRepository.findByIsActiveTrue();
    }

    /**
     * Returns all quizzes created by a specific author.
     */
    public List<ForumQuiz> getQuizzesByAuthor(String authorId) {
        return forumQuizRepository.findByAuthorId(authorId);
    }

    /**
     * Closes all expired quizzes and notifies participants of their results.
     */
    public void closeExpiredQuizzes() {
        List<ForumQuiz> expiredQuizzes = forumQuizRepository.findByDeadlineBeforeAndIsActiveTrue(LocalDateTime.now());
        for (ForumQuiz quiz : expiredQuizzes) {
            quiz.setActive(false);
            forumQuizRepository.save(quiz);
            LOGGER.info("Closed expired quiz: " + quiz.getId());

            // Notify each participant of their result
            quiz.getParticipantScores().forEach((userId, score) -> {
                try {
                    ForumNotification notification = new ForumNotification();
                    notification.setUserId(userId);
                    notification.setUserName(userService.getUserById(userId).getName());
                    notification.setMessage("Results are in for quiz: " + quiz.getTitle() + ". Your score: " + score
                            + "/" + quiz.getQuestions().size());
                    notification.setType("QUIZ_RESULT");
                    notification.setRelatedQuizId(quiz.getId());
                    notificationService.createNotification(notification);
                } catch (Exception e) {
                    LOGGER.severe("Failed to notify user " + userId + ": " + e.getMessage());
                }
            });
        }
    }
}