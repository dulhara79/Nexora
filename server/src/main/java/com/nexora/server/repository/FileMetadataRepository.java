package com.nexora.server.repository;

import com.nexora.server.model.FileMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileMetadataRepository extends MongoRepository<FileMetadata, String> {
}
