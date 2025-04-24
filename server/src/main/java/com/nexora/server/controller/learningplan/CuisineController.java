package com.nexora.server.controller.learningplan;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.nexora.server.model.learningplan.Cuisine;
import com.nexora.server.service.learningplan.CuisineService;

@RestController
@RequestMapping("/api/cuisines")
public class CuisineController {

    @Autowired
    private CuisineService svc;

    @GetMapping
    public List<Cuisine> all(@RequestParam String level) {
        return svc.getByLevel(level);
    }

    @GetMapping("/{level}/{name}")
    public Cuisine one(@PathVariable String level, @PathVariable String name) {
        return svc.getCuisine(level, name)
                  .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuisine not found"));
    }
}
