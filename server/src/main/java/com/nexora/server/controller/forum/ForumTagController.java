package com.nexora.server.controller.forum;

import com.nexora.server.model.forum.ForumQuestion;
import com.nexora.server.model.forum.ForumTag;
import com.nexora.server.repository.forum.ForumQuestionRepository;
import com.nexora.server.repository.forum.ForumTagRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAllTags(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        List<ForumTag> tags = tagRepository.findAll();
        String etag = "\"" + Integer.toHexString(tags.hashCode()) + "\"";
        if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
            return ResponseEntity.status(304)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                    .header(HttpHeaders.ETAG, etag)
                    .build();
        }
        Map<String, String> links = new HashMap<>();
        links.put("self", "/api/tags");
        links.put("search", "/api/tags/search");
        links.put("trending", "/api/tags/trending");
        Map<String, Object> response = new HashMap<>();
        response.put("tags", tags);
        response.put("_links", links);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                .header(HttpHeaders.ETAG, etag)
                .body(response);
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> searchTags(
            @RequestParam String query,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        List<String> matchingTags = tagRepository.findAll().stream()
                .map(ForumTag::getName)
                .filter(name -> name.toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
        String etag = "\"" + Integer.toHexString(matchingTags.hashCode()) + "\"";
        if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
            return ResponseEntity.status(304)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                    .header(HttpHeaders.ETAG, etag)
                    .build();
        }
        Map<String, String> links = new HashMap<>();
        links.put("self", "/api/tags/search?query=" + query);
        links.put("tags", "/api/tags");
        Map<String, Object> response = new HashMap<>();
        response.put("tags", matchingTags);
        response.put("_links", links);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                .header(HttpHeaders.ETAG, etag)
                .body(response);
    }

    @GetMapping(value = "/trending", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getTrendingTags(
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -7);
        Date lastWeek = calendar.getTime();

        List<ForumQuestion> recentQuestions = questionRepository.findAll()
                .stream()
                .filter(q -> q.getCreatedAt().isAfter(lastWeek.toInstant().atZone(zoneId).toLocalDateTime()))
                .collect(Collectors.toList());

        Map<String, Long> tagCounts = new HashMap<>();
        for (ForumQuestion q : recentQuestions) {
            for (String tag : q.getTags()) {
                tagCounts.put(tag, tagCounts.getOrDefault(tag, 0L) + 1);
            }
        }

        List<String> trendingTags = tagCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        String etag = "\"" + Integer.toHexString(trendingTags.hashCode()) + "\"";
        if (ifNoneMatch != null && ifNoneMatch.equals(etag)) {
            return ResponseEntity.status(304)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                    .header(HttpHeaders.ETAG, etag)
                    .build();
        }
        Map<String, String> links = new HashMap<>();
        links.put("self", "/api/tags/trending");
        links.put("tags", "/api/tags");
        Map<String, Object> response = new HashMap<>();
        response.put("tags", trendingTags);
        response.put("_links", links);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=300, must-revalidate")
                .header(HttpHeaders.ETAG, etag)
                .body(response);
    }
}