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
    private String question;
    private List<String> options;
    private String correctAnswer;
    private String authorId;
    private String authorUsername;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime deadline;
    private boolean isActive = true;
    private Map<String, String> participantAnswers = new HashMap<>();
    private Map<String, Integer> participantScores = new HashMap<>();
    private List<String> upvoteUserIds = new ArrayList<>();
    private Map<String, Boolean> clearedAttempts = new HashMap<>(); // Tracks if user cleared their attempt

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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
        isActive = active;
    }

    public Map<String, String> getParticipantAnswers() {
        return participantAnswers;
    }

    public void setParticipantAnswers(Map<String, String> participantAnswers) {
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
