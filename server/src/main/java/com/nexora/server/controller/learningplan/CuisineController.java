package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.Cuisine;
import com.nexora.server.repository.learningplan.CuisineRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cuisines")
public class CuisineController {

    private final CuisineRepository cuisineRepository;

    public CuisineController(CuisineRepository cuisineRepository) {
        this.cuisineRepository = cuisineRepository;
    }

    @GetMapping
    public List<Cuisine> getCuisinesByLevel(@RequestParam String level) {
        return cuisineRepository.findByLevel(level);
    }   
    

}