package com.nexora.server.model.forum;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "quizzes")
public class ForumQuiz {
    @Id
    private String id;
    private String title; // Added for quiz title
    private String description; // Added for quiz description
    private String category; // Already present
    private String difficulty; // Added for difficulty level
    private boolean allowComments; // Added for comment permission
    private boolean isPublic; // Added for visibility
    private List<Question> questions; // Changed to list of questions
    private String authorId;
    private String authorUsername;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime deadline;
    private boolean isActive = true;
    private Map<String, Map<Integer, String>> participantAnswers = new HashMap<>(); // Updated to map user to
                                                                                    // question-indexed answers
    private Map<String, Integer> participantScores = new HashMap<>();
    private List<String> upvoteUserIds = new ArrayList<>();
    private Map<String, Boolean> clearedAttempts = new HashMap<>();

    // Nested Question class
    public static class Question {
        private String question;
        private List<String> options;
        private String correctAnswer;
        private String explanation; // Added for explanation

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

    // Getters and Setters
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