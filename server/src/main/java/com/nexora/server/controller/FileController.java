package com.nexora.server.controller;

import com.nexora.server.model.FileMetadata;
import com.nexora.server.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileMetadata> uploadFile(@RequestParam("file") MultipartFile file,
                                                   @RequestParam("skillType") String skillType) {
        try {
            FileMetadata metadata = fileStorageService.uploadFile(file, skillType);
            return ResponseEntity.ok(metadata);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<FileMetadata>> getFiles() {
        return ResponseEntity.ok(fileStorageService.getFiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileMetadata> getFile(@PathVariable String id) {
        return fileStorageService.getFileById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FileMetadata> updateFile(
            @PathVariable String id,
            @RequestParam("file") MultipartFile newFile,
            @RequestParam("skillType") String skillType) {
        try {
            FileMetadata updatedFile = fileStorageService.updateFile(id, newFile, skillType);
            return ResponseEntity.ok(updatedFile);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileId) {
        boolean isDeleted = fileStorageService.deleteFile(fileId);

        if (isDeleted) {
            return ResponseEntity.ok("File deleted successfully");
        }
        return ResponseEntity.status(404).body("File not found or could not be deleted");
    }
}