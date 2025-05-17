package com.nexora.server.model.forum;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Represents a quiz in the forum, containing questions, metadata, and participant data.
 */
@Document(collection = "quizzes")
public class ForumQuiz {
    @Id
    private String id; // Unique identifier for the quiz

    private String title; // Title of the quiz
    private String description; // Description of the quiz
    private String category; // Category to which the quiz belongs
    private String difficulty; // Difficulty level of the quiz
    private boolean allowComments; // Whether comments are allowed on the quiz
    private boolean isPublic; // Visibility of the quiz (public/private)
    private List<Question> questions; // List of questions in the quiz

    private String authorId; // ID of the quiz creator
    private String authorUsername; // Username of the quiz creator

    private LocalDateTime createdAt = LocalDateTime.now(); // Creation timestamp
    private LocalDateTime deadline; // Deadline for quiz participation

    private boolean isActive = true; // Whether the quiz is currently active

    // Maps participant userId to their answers (question index -> answer)
    private Map<String, Map<Integer, String>> participantAnswers = new HashMap<>();

    // Maps participant userId to their score
    private Map<String, Integer> participantScores = new HashMap<>();

    // List of userIds who upvoted the quiz
    private List<String> upvoteUserIds = new ArrayList<>();

    // Maps userId to whether they have cleared their attempt
    private Map<String, Boolean> clearedAttempts = new HashMap<>();

    /**
     * Represents a single question in the quiz.
     */
    public static class Question {
        private String question; // The question text
        private List<String> options; // List of possible answer options
        private String correctAnswer; // The correct answer
        private String explanation; // Explanation for the correct answer

        // Getters and Setters
        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public List<String> getOptions() {
            return options;
        }

        public void setOptions(List<String> options) {
            this.options = options;
        }

        public String getCorrectAnswer() {
            return correctAnswer;
        }

        public void setCorrectAnswer(String correctAnswer) {
            this.correctAnswer = correctAnswer;
        }

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }
    }

    // Getters and Setters for ForumQuiz fields

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public boolean isAllowComments() {
        return allowComments;
    }

    public void setAllowComments(boolean allowComments) {
        this.allowComments = allowComments;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        this.isActive = active;
    }

    public Map<String, Map<Integer, String>> getParticipantAnswers() {
        return participantAnswers;
    }

    public void setParticipantAnswers(Map<String, Map<Integer, String>> participantAnswers) {
        this.participantAnswers = participantAnswers;
    }

    public Map<String, Integer> getParticipantScores() {
        return participantScores;
    }

    public void setParticipantScores(Map<String, Integer> participantScores) {
        this.participantScores = participantScores;
    }

    public List<String> getUpvoteUserIds() {
        return upvoteUserIds;
    }

    public void setUpvoteUserIds(List<String> upvoteUserIds) {
        this.upvoteUserIds = upvoteUserIds;
    }

    public Map<String, Boolean> getClearedAttempts() {
        return clearedAttempts;
    }

    public void setClearedAttempts(Map<String, Boolean> clearedAttempts) {
        this.clearedAttempts = clearedAttempts;
    }
}