package com.nexora.server.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nexora.server.model.FileMetadata;
import com.nexora.server.repository.FileMetadataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorageService {

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    // Upload File
    public FileMetadata uploadFile(MultipartFile file, String skillType) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String folder = file.getContentType() != null && file.getContentType().startsWith("image") ? "images/" : "pdfs/";

        // Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", folder, "public_id", fileName));

        // Get the Cloudinary URL
        String fileUrl = (String) uploadResult.get("secure_url");

        // Save metadata in MongoDB
        FileMetadata metadata = new FileMetadata();
        metadata.setFileName(fileName);
        metadata.setFileUrl(fileUrl);
        metadata.setFileType(file.getContentType());
        metadata.setSkillType(skillType);
        metadata.setUploadedAt(LocalDateTime.now());

        return fileMetadataRepository.save(metadata);
    }

    // Get All Files
    public List<FileMetadata> getFiles() {
        return fileMetadataRepository.findAll();
    }

    // Get File by ID
    public Optional<FileMetadata> getFileById(String fileId) {
        return fileMetadataRepository.findById(fileId);
    }

    // Update File (Replaces File)
    public FileMetadata updateFile(String fileId, MultipartFile newFile, String skillType) throws IOException {
        Optional<FileMetadata> fileMetadataOptional = fileMetadataRepository.findById(fileId);

        if (fileMetadataOptional.isPresent()) {
            FileMetadata existingFile = fileMetadataOptional.get();
            String oldFileUrl = existingFile.getFileUrl();
            String oldPublicId = extractPublicId(oldFileUrl);

            // Delete old file from Cloudinary
            cloudinary.uploader().destroy(oldPublicId, ObjectUtils.emptyMap());

            // Upload new file
            String newFileName = UUID.randomUUID().toString() + "_" + newFile.getOriginalFilename();
            String folder = newFile.getContentType() != null && newFile.getContentType().startsWith("image") ? "images/" : "pdfs/";

            Map uploadResult = cloudinary.uploader().upload(newFile.getBytes(),
                    ObjectUtils.asMap("folder", folder, "public_id", newFileName));

            // Get new file URL
            String newFileUrl = (String) uploadResult.get("secure_url");

            // Update metadata
            existingFile.setFileName(newFileName);
            existingFile.setFileUrl(newFileUrl);
            existingFile.setFileType(newFile.getContentType());
            existingFile.setSkillType(skillType);
            existingFile.setUploadedAt(LocalDateTime.now());

            return fileMetadataRepository.save(existingFile);
        } else {
            throw new RuntimeException("File not found.");
        }
    }

    // Delete File (Removes from Cloudinary and MongoDB)
    public boolean deleteFile(String fileId) {
        Optional<FileMetadata> fileMetadataOptional = fileMetadataRepository.findById(fileId);

        if (fileMetadataOptional.isPresent()) {
            FileMetadata fileMetadata = fileMetadataOptional.get();
            try {
                String fileUrl = fileMetadata.getFileUrl();
                String publicId = extractPublicId(fileUrl);

                // Delete from Cloudinary
                Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

                if ("ok".equals(result.get("result"))) {
                    fileMetadataRepository.deleteById(fileId);
                    System.out.println("File deleted successfully from Cloudinary and MongoDB.");
                    return true;
                } else {
                    System.err.println("Failed to delete file from Cloudinary.");
                    return false;
                }
            } catch (Exception e) {
                System.err.println("Error deleting file: " + e.getMessage());
                return false;
            }
        } else {
            System.err.println("File not found in MongoDB.");
            return false;
        }
    }

    // Extract Public ID from Cloudinary URL
    private String extractPublicId(String fileUrl) {
        String[] parts = fileUrl.split("/");
        String fileNameWithExtension = parts[parts.length - 1];
        return fileNameWithExtension.split("\\.")[0];
    }
}
