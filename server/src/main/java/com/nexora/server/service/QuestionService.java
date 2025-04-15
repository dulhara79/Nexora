package com.nexora.server.service;

import com.nexora.server.model.Question;
import com.nexora.server.model.Role;
import com.nexora.server.model.Tag;
import com.nexora.server.model.User;
import com.nexora.server.repository.QuestionRepository;
import com.nexora.server.repository.TagRepository;
import com.nexora.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class QuestionService {
    private static final Logger LOGGER = Logger.getLogger(QuestionService.class.getName());

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserRepository userRepository;

    public Question createQuestion(Question question, String userId) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new Exception("User not found");
        }

        question.setAuthorId(userId);
        question.setTags(processTags(question.getTags()));
        Question savedQuestion = questionRepository.save(question);
        LOGGER.info("Question created with ID: " + savedQuestion.getId());
        return savedQuestion;
    }

    public Question updateQuestion(String questionId, Question updatedQuestion, String userId) throws Exception {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        Question question = questionOptional.get();
        if (!question.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to edit this question");
        }

        // Check time limit (24 hours)
        if (question.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
            throw new Exception("Edit time limit exceeded");
        }

        question.setTitle(updatedQuestion.getTitle());
        question.setDescription(updatedQuestion.getDescription());
        question.setTags(processTags(updatedQuestion.getTags()));
        question.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }

    public void deleteQuestion(String questionId, String userId) throws Exception {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        Question question = questionOptional.get();
        if (!question.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
            throw new Exception("Unauthorized to delete this question");
        }

        // Check time limit (24 hours)
        if (question.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
            throw new Exception("Delete time limit exceeded");
        }

        questionRepository.deleteById(questionId);
        LOGGER.info("Question deleted with ID: " + questionId);
    }

    public List<Question> getQuestions(String tag, String search, String sortBy) {
        List<Question> questions;

        // Handle tag search
        if (tag != null && !tag.isEmpty()) {
            Tag tagObj = tagRepository.findByName(tag);
            if (tagObj != null) {
                questions = questionRepository.findByTags(tagObj.getId());
            } else {
                return Collections.emptyList(); // No questions if tag not found
            }
        } else if (search != null && !search.isEmpty()) {
            // Handle search by title or description
            questions = questionRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search);
        } else {
            // Get all questions
            questions = questionRepository.findAll();
        }

        // Handle sorting
        if ("newest".equalsIgnoreCase(sortBy)) {
            questions.sort(Comparator.comparing(Question::getCreatedAt).reversed());
        } else if ("mostCommented".equalsIgnoreCase(sortBy)) {
            questions.sort(Comparator.comparingInt((Question q) -> q.getCommentIds() != null ? q.getCommentIds().size() : 0).reversed());
        }

        return questions;
    }

    public Question upvoteQuestion(String questionId, String userId) throws Exception {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        Question question = questionOptional.get();
        if (question.getUpvoteUserIds().contains(userId)) {
            question.getUpvoteUserIds().remove(userId);
        } else {
            question.getUpvoteUserIds().add(userId);
            question.getDownvoteUserIds().remove(userId); // Remove downvote if exists
        }

        return questionRepository.save(question);
    }

    public Question downvoteQuestion(String questionId, String userId) throws Exception {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        Question question = questionOptional.get();
        if (question.getDownvoteUserIds().contains(userId)) {
            question.getDownvoteUserIds().remove(userId);
        } else {
            question.getDownvoteUserIds().add(userId);
            question.getUpvoteUserIds().remove(userId); // Remove upvote if exists
        }

        return questionRepository.save(question);
    }

    public void flagQuestion(String questionId, String userId) throws Exception {
        Optional<Question> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }

        Question question = questionOptional.get();
        question.setFlagged(true);
        questionRepository.save(question);
        LOGGER.info("Question flagged with ID: " + questionId);
    }

    private List<String> processTags(List<String> tags) {
        List<String> tagIds = new ArrayList<>();
        for (String tagName : tags) {
            Tag tag = tagRepository.findByName(tagName);
            if (tag == null) {
                tag = new Tag();
                tag.setName(tagName);
                tag = tagRepository.save(tag);
            }
            tagIds.add(tag.getId());
        }
        return tagIds;
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