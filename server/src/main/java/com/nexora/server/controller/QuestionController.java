package com.nexora.server.controller;

import com.nexora.server.model.Question;
import com.nexora.server.repository.QuestionRepository;
import com.nexora.server.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuestionRepository questionRepository;

    @PostMapping("/add")
    public ResponseEntity<?> createQuestion(@RequestBody Question question, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        System.out.println("User ID from session: " + userId);
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            Question createdQuestion = questionService.createQuestion(question, userId);
            return ResponseEntity.ok(createdQuestion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable String id, @RequestBody Question question,
            HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            Question updatedQuestion = questionService.updateQuestion(id, question, userId);
            return ResponseEntity.ok(updatedQuestion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            questionService.deleteQuestion(id, userId);
            return ResponseEntity.ok("Question deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Question>> getQuestions(
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "newest") String sortBy) {
        System.out.println("Tag: " + tag);
        System.out.println("Search: " + search);
        System.out.println("Sort By: " + sortBy);
        return ResponseEntity.ok(questionService.getQuestions(tag, search, sortBy));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable String id) {
        try {
            Optional<Question> question = questionRepository.findById(id);
            if (question.isPresent()) {
                return ResponseEntity.ok(question.get());
            }
            return ResponseEntity.status(404).body("Question not found");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<?> upvoteQuestion(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            Question question = questionService.upvoteQuestion(id, userId);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/downvote")
    public ResponseEntity<?> downvoteQuestion(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            Question question = questionService.downvoteQuestion(id, userId);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/flag")
    public ResponseEntity<?> flagQuestion(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            questionService.flagQuestion(id, userId);
            return ResponseEntity.ok("Question flagged");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<?> saveQuestion(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            questionService.saveQuestion(id, userId);
            return ResponseEntity.ok("Question saved");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/saved")
    public ResponseEntity<?> getSavedQuestions(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            List<Question> savedQuestions = questionService.getSavedQuestions(userId);
            return ResponseEntity.ok(savedQuestions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/unsave")
    public ResponseEntity<?> unsaveQuestion(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            questionService.unsaveQuestion(id, userId);
            return ResponseEntity.ok("Question unsaved");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
