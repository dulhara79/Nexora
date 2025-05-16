package com.nexora.server.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

/**
 * DatabaseConfig is a Spring component that checks the MongoDB connection
 * when the application starts and logs the connection status.
 */
@Component
public class DatabaseConfig implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final MongoClient mongoClient;

    /**
     * Constructor for DatabaseConfig.
     *
     * @param mongoTemplate the MongoTemplate used for MongoDB operations
     * @param mongoClient the MongoClient instance
     */
    public DatabaseConfig(MongoTemplate mongoTemplate, MongoClient mongoClient) {
        this.mongoTemplate = mongoTemplate;
        this.mongoClient = mongoClient;
    }

    /**
     * This method runs on application startup and checks the MongoDB connection.
     *
     * @param args command line arguments
     */
    @Override
    public void run(String... args) {
        try {
            // Get the name of the connected MongoDB database
            String databaseName = mongoTemplate.getDb().getName();
            System.out.println("");
            System.out.println("<> Successfully connected to MongoDB: " + databaseName);
            System.out.println("");
        } catch (Exception e) {
            // Log an error message if connection fails
            System.err.println("'X' Failed to connect to MongoDB: " + e.getMessage());
        }
    }
}
