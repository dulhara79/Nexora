package com.nexora.server.repository.learningplan;

import com.nexora.server.model.learningplan.Cuisine;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CuisineRepository extends MongoRepository<Cuisine, String> {
    boolean existsByName(String name);
    List<Cuisine> findByLevel(String level);
}


