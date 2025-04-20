package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumComment;
import com.nexora.server.service.forum.ForumCommentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api/forum/comments")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ForumCommentController {

    @Autowired
    private ForumCommentService commentService;

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody ForumComment comment, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            ForumComment createdComment = commentService.createComment(comment, userId);
            System.out.println("...............createdComment.................");
            System.out.println("Created comment: " + createdComment);
            return ResponseEntity.ok(createdComment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable String id, @RequestBody ForumComment comment, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            ForumComment updatedComment = commentService.updateComment(id, comment, userId);
            return ResponseEntity.ok(updatedComment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            commentService.deleteComment(id, userId);
            return ResponseEntity.ok("Comment deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<ForumComment>> getCommentsByQuestionId(@PathVariable String questionId) {
        return ResponseEntity.ok(commentService.getCommentsByQuestionId(questionId));
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<?> upvoteComment(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            ForumComment comment = commentService.upvoteComment(id, userId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/downvote")
    public ResponseEntity<?> downvoteComment(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            ForumComment comment = commentService.downvoteComment(id, userId);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/flag")
    public ResponseEntity<?> flagComment(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            commentService.flagComment(id, userId);
            return ResponseEntity.ok("Comment flagged");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}