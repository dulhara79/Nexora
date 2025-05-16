package com.nexora.server.model.forum;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a tag used in the forum.
 * This class is mapped to the "tags" collection in MongoDB.
 */
@Data
@Document(collection = "tags")
public class ForumTag {
    /**
     * Unique identifier for the tag.
     */
    @Id
    private String id;

    /**
     * Name of the tag.
     */
    private String name;

    /**
     * Gets the name of the tag.
     * @return the tag name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the name of the tag.
     * @param name the tag name
     */
    public void setName(String name) {
        this.name = name;
    }
}