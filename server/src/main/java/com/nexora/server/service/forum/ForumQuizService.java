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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

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

    public ForumQuiz createQuiz(ForumQuiz quiz, String userId) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }
        User user = userService.getUserById(userId);

        if (quiz.getQuestion() == null || quiz.getQuestion().trim().isEmpty()) {
            throw new Exception("ForumQuiz question is required");
        }
        if (quiz.getOptions() == null || quiz.getOptions().size() < 2) {
            throw new Exception("ForumQuiz must have at least two options");
        }
        if (quiz.getCorrectAnswer() == null || !quiz.getOptions().contains(quiz.getCorrectAnswer())) {
            throw new Exception("Valid correct answer is required");
        }
        if (quiz.getDeadline() == null || quiz.getDeadline().isBefore(LocalDateTime.now())) {
            throw new Exception("Valid deadline is required");
        }

        quiz.setAuthorId(userId);
        quiz.setAuthorUsername(user.getName());
        ForumQuiz savedQuiz = forumQuizRepository.save(quiz);
        LOGGER.info("ForumQuiz created with ID: " + savedQuiz.getId());

        ForumNotification notification = new ForumNotification();
        notification.setUserId(userId);
        notification.setUserName(user.getName());
        notification.setMessage(user.getName() + " created a new quiz: " + quiz.getQuestion());
        notification.setType("QUIZ_CREATION");
        notification.setRelatedQuizId(savedQuiz.getId());
        notificationService.createNotification(notification);

        return savedQuiz;
    }

    public ForumQuiz submitAnswer(String quizId, String answer, String userId) throws Exception {
        Optional<ForumQuiz> quizOptional = forumQuizRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            throw new Exception("ForumQuiz not found");
        }
        ForumQuiz quiz = quizOptional.get();
        LOGGER.info("Checking quiz ID: " + quizId + ", isActive: " + quiz.isActive() + ", Deadline: "
                + quiz.getDeadline() + ", Now: " + LocalDateTime.now());
        if (!quiz.isActive()) {
            throw new Exception("ForumQuiz is closed");
        }
        if (quiz.getDeadline().isBefore(LocalDateTime.now())) {
            quiz.setActive(false);
            forumQuizRepository.save(quiz);
            throw new Exception("ForumQuiz deadline has passed");
        }
        if (!quiz.getOptions().contains(answer)) {
            throw new Exception("Invalid answer option");
        }
        if (quiz.getParticipantAnswers().containsKey(userId) && !quiz.getClearedAttempts().containsKey(userId)) {
            throw new Exception("User has already answered this quiz");
        }

        quiz.getParticipantAnswers().put(userId, answer);
        int score = answer.equals(quiz.getCorrectAnswer()) ? 1 : 0;
        quiz.getParticipantScores().put(userId, score);
        quiz.getClearedAttempts().remove(userId);
        forumQuizRepository.save(quiz);
        LOGGER.info("User " + userId + " submitted answer to quiz " + quizId);

        if (!quiz.getAuthorId().equals(userId)) {
            ForumNotification notification = new ForumNotification();
            notification.setUserId(quiz.getAuthorId());
            notification.setUserName(quiz.getAuthorUsername());
            notification.setMessage(
                    userService.getUserById(userId).getName() + " answered your quiz: " + quiz.getQuestion());
            notification.setType("QUIZ_ANSWER");
            notification.setRelatedQuizId(quizId);
            notificationService.createNotification(notification);
        }

        return quiz;
    }

    public ForumQuiz clearAttempt(String quizId, String userId) throws Exception {
        Optional<ForumQuiz> quizOptional = forumQuizRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            throw new Exception("ForumQuiz not found");
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

    public ForumQuiz upvoteQuiz(String quizId, String userId) throws Exception {
        Optional<ForumQuiz> quizOptional = forumQuizRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            throw new Exception("ForumQuiz not found");
        }
        ForumQuiz quiz = quizOptional.get();
        if (quiz.getUpvoteUserIds().contains(userId)) {
            quiz.getUpvoteUserIds().remove(userId);
        } else {
            quiz.getUpvoteUserIds().add(userId);
            if (!quiz.getAuthorId().equals(userId)) {
                Optional<User> voter = userRepository.findById(userId);
                String voterName = voter.map(User::getName).orElse("A user");
                ForumNotification notification = new ForumNotification();
                notification.setUserId(quiz.getAuthorId());
                notification.setUserName(quiz.getAuthorUsername());
                notification.setMessage(voterName + " upvoted your quiz: " + quiz.getQuestion());
                notification.setType("QUIZ_VOTE");
                notification.setRelatedQuizId(quizId);
                notificationService.createNotification(notification);
            }
        }
        return forumQuizRepository.save(quiz);
    }

    public Map<String, Object> getQuizStats(String quizId, String userId) throws Exception {
        Optional<ForumQuiz> quizOptional = forumQuizRepository.findById(quizId);
        if (!quizOptional.isPresent()) {
            throw new Exception("ForumQuiz not found");
        }
        ForumQuiz quiz = quizOptional.get();
        if (!quiz.getAuthorId().equals(userId)) {
            throw new Exception("Only the quiz creator can view statistics");
        }

        Map<String, Integer> answerDistribution = new HashMap<>();
        for (String option : quiz.getOptions()) {
            answerDistribution.put(option, 0);
        }
        for (String answer : quiz.getParticipantAnswers().values()) {
            answerDistribution.put(answer, answerDistribution.getOrDefault(answer, 0) + 1);
        }

        int totalParticipants = quiz.getParticipantAnswers().size();
        int correctAnswers = quiz.getParticipantScores().values().stream().mapToInt(Integer::intValue).sum();
        double percentageCorrect = totalParticipants > 0 ? ((double) correctAnswers / totalParticipants) * 100 : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalParticipants", totalParticipants);
        stats.put("correctAnswers", correctAnswers);
        stats.put("percentageCorrect", String.format("%.0f", percentageCorrect));
        stats.put("answerDistribution", answerDistribution);
        return stats;
    }

    public Optional<ForumQuiz> getQuizById(String quizId) {
        return forumQuizRepository.findById(quizId);
    }

    public List<ForumQuiz> getActiveQuizzes() {
        return forumQuizRepository.findByIsActiveTrue();
    }

    public List<ForumQuiz> getQuizzesByAuthor(String authorId) {
        return forumQuizRepository.findByAuthorId(authorId);
    }

    public void closeExpiredQuizzes() {
        List<ForumQuiz> expiredQuizzes = forumQuizRepository.findByDeadlineBeforeAndIsActiveTrue(LocalDateTime.now());
        for (ForumQuiz quiz : expiredQuizzes) {
            quiz.setActive(false);
            forumQuizRepository.save(quiz);
            LOGGER.info("Closed expired quiz: " + quiz.getId());

            quiz.getParticipantScores().forEach((userId, score) -> {
                try {
                    ForumNotification notification = new ForumNotification();
                    notification.setUserId(userId);
                    notification.setUserName(userService.getUserById(userId).getName());
                    notification
                            .setMessage("Results are in for quiz: " + quiz.getQuestion() + ". Your score: " + score);
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
