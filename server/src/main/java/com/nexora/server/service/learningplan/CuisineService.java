package com.nexora.server.service.learningplan;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Collections;

import org.springframework.stereotype.Service;
import com.nexora.server.model.learningplan.Cuisine;

@Service
public class CuisineService {

    private final Map<String, List<Cuisine>> data = loadStaticData();

    public List<Cuisine> getByLevel(String lvl) {
        return data.getOrDefault(lvl, Collections.emptyList());
    }

    public Optional<Cuisine> getCuisine(String lvl, String name) {
        return getByLevel(lvl).stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst();
    }

    // Placeholder for static data loading – you’ll define this properly
    private Map<String, List<Cuisine>> loadStaticData() {
        // You should return a Map<String, List<Cuisine>> here.
        // For now, throwing to remind you to implement this
        throw new UnsupportedOperationException("loadStaticData() not implemented yet");
    }
}


    
