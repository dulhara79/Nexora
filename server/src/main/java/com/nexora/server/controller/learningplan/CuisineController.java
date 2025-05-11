// package com.nexora.server.controller.learningplan;

// import com.nexora.server.model.learningplan.Cuisine;
// import com.nexora.server.repository.learningplan.CuisineRepository;
// import org.springframework.web.bind.annotation.*;
// import java.util.List;
// import java.util.Optional;

// // import these two for exception handling
// import org.springframework.web.server.ResponseStatusException;
// import org.springframework.http.HttpStatus;

// @RestController
// @RequestMapping("/api/cuisines")
// public class CuisineController {

//     private final CuisineRepository cuisineRepository;

//     public CuisineController(CuisineRepository cuisineRepository) {
//         this.cuisineRepository = cuisineRepository;
//     }

//     /**
//      * Get all cuisines by level (e.g., beginner, intermediate, advanced)
//      */
//     @GetMapping
//     public List<Cuisine> getCuisinesByLevel(@RequestParam String level) {
//         return cuisineRepository.findByLevel(level);
//     }

//     /**
//      * Fetch a single cuisine (with all recipes) by its exact name.
//      * Throws 404 if not found.
//      */
//     @GetMapping("/by-name")
//     public Cuisine getByName(@RequestParam String name) {
//       return cuisineRepository.findByName(name)
//         .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuisine not found: " + name));
//     }
    
// }








//REST
// src/main/java/com/nexora/server/controller/learningplan/CuisineController.java
// package com.nexora.server.controller.learningplan;

// import com.nexora.server.model.learningplan.Cuisine;
// import com.nexora.server.repository.learningplan.CuisineRepository;
// import org.springframework.http.CacheControl;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.server.ResponseStatusException;
// import org.springframework.http.HttpStatus;

// import java.util.List;
// import java.util.concurrent.TimeUnit;

// @RestController
// @RequestMapping("/api/cuisines")
// @CrossOrigin(origins = "http://localhost:5173")
// public class CuisineController {

//     private final CuisineRepository cuisineRepository;

//     public CuisineController(CuisineRepository cuisineRepository) {
//         this.cuisineRepository = cuisineRepository;
//     }

//     /**
//      * GET /api/cuisines?level={level}
//      */
//     @GetMapping(produces = "application/json")
//     public ResponseEntity<List<Cuisine>> getCuisinesByLevel(@RequestParam("level") String level) {
//         List<Cuisine> cuisines = cuisineRepository.findByLevel(level);
//         return ResponseEntity.ok()
//             .cacheControl(CacheControl.noCache())
//             .body(cuisines);
//     }

//     /**
//      * GET /api/cuisines/{name}
//      */
//     @GetMapping(path = "/{name}", produces = "application/json")
//     public ResponseEntity<Cuisine> getCuisineByName(@PathVariable String name) {
//         return cuisineRepository.findByName(name)
//             .map(c -> ResponseEntity.ok()
//                 .cacheControl(CacheControl.noCache())
//                 .body(c))
//             .orElseThrow(() -> new ResponseStatusException(
//                 HttpStatus.NOT_FOUND, "Cuisine not found: " + name));
//     }
// }






package com.nexora.server.controller.learningplan;

import com.nexora.server.model.learningplan.Cuisine;
import com.nexora.server.repository.learningplan.CuisineRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/cuisines")
@CrossOrigin(origins = "http://localhost:5173")
public class CuisineController {

    private final CuisineRepository cuisineRepository;
    private final CuisineModelAssembler assembler;

    public CuisineController(
        CuisineRepository cuisineRepository,
        CuisineModelAssembler assembler
    ) {
        this.cuisineRepository = cuisineRepository;
        this.assembler = assembler;
    }

    /**
     * GET /api/cuisines?level={level}
     */
    @GetMapping(produces = "application/json")
    public ResponseEntity<CollectionModel<EntityModel<Cuisine>>> getCuisinesByLevel(
        @RequestParam("level") String level
    ) {
        List<EntityModel<Cuisine>> cuisines = cuisineRepository.findByLevel(level).stream()
            .map(assembler::toModel)
            .toList();

        CollectionModel<EntityModel<Cuisine>> collection = CollectionModel.of(
            cuisines,
            linkTo(methodOn(CuisineController.class)
                .getCuisinesByLevel(level))
            .withSelfRel()
        );

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(collection);
    }

    /**
     * GET /api/cuisines/{name}
     */
    @GetMapping(path = "/{name}", produces = "application/json")
    public ResponseEntity<EntityModel<Cuisine>> getCuisineByName(
        @PathVariable String name
    ) {
        Cuisine cuisine = cuisineRepository.findByName(name)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Cuisine not found: " + name
            ));

        EntityModel<Cuisine> model = assembler.toModel(cuisine);
        return ResponseEntity.ok()
            .cacheControl(CacheControl.noCache())
            .body(model);
    }
}
