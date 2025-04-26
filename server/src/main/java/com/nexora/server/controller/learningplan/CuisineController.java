// package com.nexora.server.controller.learningplan;

// import com.nexora.server.model.learningplan.Cuisine;
// import com.nexora.server.repository.learningplan.CuisineRepository;
// import org.springframework.web.bind.annotation.*;
// import java.util.List;

// @RestController
// @RequestMapping("/api/cuisines")
// public class CuisineController {
//     private final CuisineRepository cuisineRepository;

//     public CuisineController(CuisineRepository cuisineRepository) {
//         this.cuisineRepository = cuisineRepository;
//     }

//     @GetMapping
//     public List<Cuisine> getCuisinesByLevel(@RequestParam String level) {
//         return cuisineRepository.findByLevel(level);
//     }

//     // ← new endpoint to fetch a full cuisine by its name
//     @GetMapping("/by-name")
//     public Cuisine getCuisineByName(@RequestParam String name) {
//         return cuisineRepository.findByName(name)
//             .orElseThrow(() -> new ResponseStatusException(
//                 HttpStatus.NOT_FOUND, "Cuisine not found: " + name
//             ));
//     }
// }


package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.Cuisine;
import com.nexora.server.repository.learningplan.CuisineRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

// import these two for exception handling
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/cuisines")
public class CuisineController {

    private final CuisineRepository cuisineRepository;

    public CuisineController(CuisineRepository cuisineRepository) {
        this.cuisineRepository = cuisineRepository;
    }

    /**
     * Get all cuisines by level (e.g., beginner, intermediate, advanced)
     */
    @GetMapping
    public List<Cuisine> getCuisinesByLevel(@RequestParam String level) {
        return cuisineRepository.findByLevel(level);
    }

    /**
     * Fetch a single cuisine (with all recipes) by its exact name.
     * Throws 404 if not found.
     */
    @GetMapping("/by-name")
    public Cuisine getByName(@RequestParam String name) {
      return cuisineRepository.findByName(name)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuisine not found: " + name));
    }
    
}
