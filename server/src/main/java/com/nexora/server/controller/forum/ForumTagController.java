package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumQuestion;
import com.nexora.server.model.forum.ForumTag;
import com.nexora.server.repository.forum.ForumQuestionRepository;
import com.nexora.server.repository.forum.ForumTagRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.ZoneId;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ForumTagController {

    @Autowired
    private ForumTagRepository tagRepository;

    @Autowired
    private ForumQuestionRepository questionRepository;

    private ZoneId zoneId = ZoneId.systemDefault();

    @GetMapping
    public ResponseEntity<List<ForumTag>> getAllTags() {
        return ResponseEntity.ok(tagRepository.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<String>> searchTags(@RequestParam String query) {
        List<String> matchingTags = tagRepository.findAll().stream()
                .map(ForumTag::getName)
                .filter(name -> name.toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(matchingTags);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<String>> getTrendingTags() {
        // Get questions from the last 7 days
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -7);
        Date lastWeek = calendar.getTime();

        List<ForumQuestion> recentQuestions = questionRepository.findAll()
                .stream()
                .filter(q -> q.getCreatedAt().isAfter(lastWeek.toInstant().atZone(zoneId).toLocalDateTime()))
                .collect(Collectors.toList());

        // Count tag occurrences
        Map<String, Long> tagCounts = new HashMap<>();
        for (ForumQuestion q : recentQuestions) {
            for (String tag : q.getTags()) {
                tagCounts.put(tag, tagCounts.getOrDefault(tag, 0L) + 1);
            }
        }

        // Sort tags by count and take top 10
        List<String> trendingTags = tagCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return ResponseEntity.ok(trendingTags);
    }
}