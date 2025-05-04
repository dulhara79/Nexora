// package com.nexora.server.service.forum;

// import com.nexora.server.model.Role;
// import com.nexora.server.model.User;
// import com.nexora.server.model.forum.ForumQuestion;
// import com.nexora.server.repository.UserRepository;
// import com.nexora.server.repository.forum.ForumQuestionRepository;
// import com.nexora.server.service.UserService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.Collections;
// import java.util.Comparator;
// import java.util.List;
// import java.util.Optional;
// import java.util.logging.Logger;

// @Service
// public class ForumQuestionService {
//     private static final Logger LOGGER = Logger.getLogger(ForumQuestionService.class.getName());

//     @Autowired
//     private ForumQuestionRepository questionRepository;

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private UserService userService;

//     @Autowired
//     private ForumTagService tagService;

//     public ForumQuestion createQuestion(ForumQuestion question, String userId) throws Exception {
//         LOGGER.info("Creating question with title: " + question.getTitle());
//         LOGGER.info("Description: " + question.getDescription());
//         LOGGER.info("Tags: " + question.getTags());
//         LOGGER.info("User ID: " + userId);

//         Optional<User> userOptional = userRepository.findById(userId);
//         User user = userService.getUserById(userId);
//         String username = user.getName(); // Get username from User object
//         if (!userOptional.isPresent()) {
//             throw new Exception("User not found");
//         }

//         if (question.getTitle() == null || question.getTitle().trim().isEmpty()) {
//             throw new Exception("Title is required");
//         }
//         if (question.getDescription() == null || question.getDescription().trim().isEmpty()) {
//             throw new Exception("Description is required");
//         }

//         question.setAuthorId(userId);
//         question.setCreatedAt(LocalDateTime.now());
//         List<String> tags = question.getTags() != null ? question.getTags() : new ArrayList<>();
//         question.setTags(tags);
//         tagService.saveTags(tags); // Save new tags to ForumTagRepository
//         LOGGER.warning(".......................question: " + user.getName() + ".......................");
//         question.setAuthorUsername(username); // Set the username in the question object
//         ForumQuestion savedQuestion = questionRepository.save(question);
//         LOGGER.info("Question created with ID: " + savedQuestion.getId());
//         return savedQuestion;
//     }

//     public ForumQuestion updateQuestion(String questionId, ForumQuestion updatedQuestion, String userId) throws Exception {
//         Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
//         if (!questionOptional.isPresent()) {
//             throw new Exception("Question not found");
//         }

//         ForumQuestion question = questionOptional.get();
//         if (!question.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
//             throw new Exception("Unauthorized to edit this question");
//         }

//         if (question.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
//             throw new Exception("Edit time limit exceeded");
//         }

//         question.setTitle(updatedQuestion.getTitle());
//         question.setDescription(updatedQuestion.getDescription());
//         List<String> tags = updatedQuestion.getTags() != null ? updatedQuestion.getTags() : new ArrayList<>();
//         question.setTags(tags);
//         tagService.saveTags(tags); // Save new tags to ForumTagRepository
//         question.setUpdatedAt(LocalDateTime.now());
//         return questionRepository.save(question);
//     }

//     public void deleteQuestion(String questionId, String userId) throws Exception {
//         Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
//         if (!questionOptional.isPresent()) {
//             throw new Exception("Question not found");
//         }

//         ForumQuestion question = questionOptional.get();
//         if (!question.getAuthorId().equals(userId) && !isAdminOrModerator(userId)) {
//             throw new Exception("Unauthorized to delete this question");
//         }

//         if (question.getCreatedAt().plusHours(24).isBefore(LocalDateTime.now()) && !isAdminOrModerator(userId)) {
//             throw new Exception("Delete time limit exceeded");
//         }

//         questionRepository.deleteById(questionId);
//         LOGGER.info("Question deleted with ID: " + questionId);
//     }

//     public List<ForumQuestion> getQuestions(String tag, String search, String sortBy) {
//         List<ForumQuestion> questions;

//         if (tag != null && !tag.trim().isEmpty()) {
//             // Search for questions with the exact tag name (case-insensitive)
//             questions = questionRepository.findByTagsIn(Collections.singletonList(tag.trim().toLowerCase()));
//             System.out.println("Questions with tag: " + questions);
//         } else if (search != null && !search.trim().isEmpty()) {
//             // Search by title or description
//             questions = questionRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search,
//                     search);
//             System.out.println("Questions with search term: " + questions);
//         } else {
//             // Get all questions
//             questions = questionRepository.findAll();
//             System.out.println("All questions: " + questions);
//         }

//         // Sorting logic
//         if ("newest".equalsIgnoreCase(sortBy)) {
//             questions.sort(Comparator.comparing(
//                     ForumQuestion::getCreatedAt,
//                     Comparator.nullsLast(Comparator.naturalOrder())).reversed());
//         } else if ("mostCommented".equalsIgnoreCase(sortBy)) {
//             questions.sort(Comparator.comparingInt(
//                     (ForumQuestion q) -> q.getCommentIds() != null ? q.getCommentIds().size() : 0).reversed());
//         }

//         return questions;
//     }

//     public ForumQuestion upvoteQuestion(String questionId, String userId) throws Exception {
//         Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
//         if (!questionOptional.isPresent()) {
//             throw new Exception("Question not found");
//         }

//         ForumQuestion question = questionOptional.get();
//         if (question.getUpvoteUserIds() == null) {
//             question.setUpvoteUserIds(new ArrayList<>());
//         }
//         if (question.getDownvoteUserIds() == null) {
//             question.setDownvoteUserIds(new ArrayList<>());
//         }

//         if (question.getUpvoteUserIds().contains(userId)) {
//             question.getUpvoteUserIds().remove(userId);
//         } else {
//             question.getUpvoteUserIds().add(userId);
//             question.getDownvoteUserIds().remove(userId);
//         }

//         return questionRepository.save(question);
//     }

//     public ForumQuestion downvoteQuestion(String questionId, String userId) throws Exception {
//         Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
//         if (!questionOptional.isPresent()) {
//             throw new Exception("Question not found");
//         }

//         ForumQuestion question = questionOptional.get();
//         if (question.getUpvoteUserIds() == null) {
//             question.setUpvoteUserIds(new ArrayList<>());
//         }
//         if (question.getDownvoteUserIds() == null) {
//             question.setDownvoteUserIds(new ArrayList<>());
//         }

//         if (question.getDownvoteUserIds().contains(userId)) {
//             question.getDownvoteUserIds().remove(userId);
//         } else {
//             question.getDownvoteUserIds().add(userId);
//             question.getUpvoteUserIds().remove(userId);
//         }

//         return questionRepository.save(question);
//     }

//     public void flagQuestion(String questionId, String userId) throws Exception {
//         Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
//         if (!questionOptional.isPresent()) {
//             throw new Exception("Question not found");
//         }

//         ForumQuestion question = questionOptional.get();
//         question.setFlagged(true);
//         questionRepository.save(question);
//         LOGGER.info("Question flagged with ID: " + questionId);
//     }

//     public void saveQuestion(String questionId, String userId) throws Exception {
//         Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
//         if (!questionOptional.isPresent()) {
//             throw new Exception("Question not found");
//         }

//         Optional<User> userOptional = userRepository.findById(userId);
//         if (!userOptional.isPresent()) {
//             throw new Exception("User not found");
//         }

//         User user = userOptional.get();
//         if (user.getSavedQuestionIds() == null) {
//             user.setSavedQuestionIds(new ArrayList<>());
//         }

//         if (!user.getSavedQuestionIds().contains(questionId)) {
//             user.getSavedQuestionIds().add(questionId);
//             userRepository.save(user);
//             LOGGER.info("Question saved with ID: " + questionId + " for user: " + userId);
//         }
//     }

//     public List<ForumQuestion> getSavedQuestions(String userId) throws Exception {
//         Optional<User> userOptional = userRepository.findById(userId);
//         if (!userOptional.isPresent()) {
//             throw new Exception("User not found");
//         }

//         User user = userOptional.get();
//         List<String> savedQuestionIds = user.getSavedQuestionIds() != null ? user.getSavedQuestionIds()
//                 : new ArrayList<>();
//         if (savedQuestionIds.isEmpty()) {
//             return new ArrayList<>();
//         }

//         List<ForumQuestion> savedQuestions = questionRepository.findAllById(savedQuestionIds);
//         savedQuestions.sort(Comparator.comparing(
//                 ForumQuestion::getCreatedAt,
//                 Comparator.nullsLast(Comparator.naturalOrder())).reversed());
//         return savedQuestions;
//     }

//     public void unsaveQuestion(String questionId, String userId) throws Exception {
//         Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
//         if (!questionOptional.isPresent()) {
//             throw new Exception("Question not found");
//         }

//         Optional<User> userOptional = userRepository.findById(userId);
//         if (!userOptional.isPresent()) {
//             throw new Exception("User not found");
//         }

//         User user = userOptional.get();
//         if (user.getSavedQuestionIds() != null && user.getSavedQuestionIds().contains(questionId)) {
//             user.getSavedQuestionIds().remove(questionId);
//             userRepository.save(user);
//             LOGGER.info("Question unsaved with ID: " + questionId + " for user: " + userId);
//         }
//     }

//     public ForumQuestion incrementViews(String questionId) throws Exception {
//         Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
//         if (!questionOptional.isPresent()) {
//             throw new Exception("Question not found");
//         }
//         ForumQuestion question = questionOptional.get();
//         question.setViews(question.getViews() + 1);
//         return questionRepository.save(question);
//     }

//     public ForumQuestion togglePinQuestion(String questionId, String userId) throws Exception {
//         if (!isAdminOrModerator(userId)) {
//             throw new Exception("Unauthorized to pin/unpin question");
//         }
//         Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
//         if (!questionOptional.isPresent()) {
//             throw new Exception("Question not found");
//         }
//         ForumQuestion question = questionOptional.get();
//         question.setPinned(!question.isPinned());
//         return questionRepository.save(question);
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
        question.setCreatedAt(LocalDateTime.now());
        List<String> tags = question.getTags() != null ? question.getTags() : new ArrayList<>();
        question.setTags(tags);
        tagService.saveTags(tags);
        question.setAuthorUsername(username);
        ForumQuestion savedQuestion = questionRepository.save(question);
        LOGGER.info("Question created with ID: " + savedQuestion.getId());
        return savedQuestion;
    }

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

    public List<ForumQuestion> getQuestions(String tag, String search, String sortBy) {
        List<ForumQuestion> questions;

        if (tag != null && !tag.trim().isEmpty()) {
            questions = questionRepository.findByTagsIn(Collections.singletonList(tag.trim().toLowerCase()));
        } else if (search != null && !search.trim().isEmpty()) {
            questions = questionRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search);
        } else {
            questions = questionRepository.findAll();
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

    public ForumQuestion incrementViews(String questionId) throws Exception {
        Optional<ForumQuestion> questionOptional = questionRepository.findById(questionId);
        if (!questionOptional.isPresent()) {
            throw new Exception("Question not found");
        }
        ForumQuestion question = questionOptional.get();
        question.setViews(question.getViews() + 1);
        return questionRepository.save(question);
    }

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

    public List<ForumQuestion> getLikedQuestions(String userId) {
        return questionRepository.findByUpvoteUserIdsContaining(userId);
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