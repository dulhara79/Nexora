package com.nexora.server.model.forum;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "communities")
public class Community {
    @Id
    private String id;
    private String name;
    private String description;
    private int members;
    private String icon;
    private String color;
}