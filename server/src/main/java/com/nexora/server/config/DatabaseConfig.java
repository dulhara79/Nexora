package com.nexora.server.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConfig implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final MongoClient mongoClient;

    public DatabaseConfig(MongoTemplate mongoTemplate, MongoClient mongoClient) {
        this.mongoTemplate = mongoTemplate;
        this.mongoClient = mongoClient;
    }

    @Override
    public void run(String... args) {
        try {
            String databaseName = mongoTemplate.getDb().getName();
            System.out.println("");
            System.out.println("<> Successfully connected to MongoDB: " + databaseName);
            System.out.println("");
        } catch (Exception e) {
            System.err.println("'X' Failed to connect to MongoDB: " + e.getMessage());
        }
    }
}
