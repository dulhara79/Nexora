package com.nexora.server.controller;

import com.nexora.server.model.Tag;
import com.nexora.server.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TagController {

    @Autowired
    private TagRepository tagRepository;

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(tagRepository.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<String>> searchTags(@RequestParam String query) {
        List<String> matchingTags = tagRepository.findAll().stream()
                .map(Tag::getName)
                .filter(name -> name.toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(matchingTags);
    }
}