package com.nexora.server.service.forum;

import com.nexora.server.model.forum.ForumTag;
import com.nexora.server.repository.forum.ForumQuestionRepository;
import com.nexora.server.repository.forum.ForumTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.logging.Logger;

/**
 * Service class for managing forum tags.
 */
@Service
public class ForumTagService {

    private static final Logger LOGGER = Logger.getLogger(ForumTagService.class.getName());

    @Autowired
    private ForumTagRepository tagRepository;

    @Autowired
    private ForumQuestionRepository questionRepository;

    /**
     * Saves a list of tag names to the repository.
     * Ignores empty or null tag names and avoids duplicates.
     *
     * @param tagNames List of tag names to save.
     */
    public void saveTags(List<String> tagNames) {
        for (String tagName : tagNames) {
            if (tagName != null && !tagName.trim().isEmpty()) {
                String normalizedTag = tagName.trim().toLowerCase();
                ForumTag existingTag = tagRepository.findByName(normalizedTag);
                if (existingTag == null) {
                    ForumTag newTag = new ForumTag();
                    newTag.setName(normalizedTag);
                    tagRepository.save(newTag);
                    LOGGER.info("Saved new tag: " + normalizedTag);
                }
            }
        }
    }

    /**
     * Deletes a tag by name if it exists and is not used by any questions.
     *
     * @param tagName The name of the tag to delete.
     * @throws Exception if the tag does not exist or is used by questions.
     */
    public void deleteTag(String tagName) throws Exception {
        ForumTag tag = tagRepository.findByName(tagName.trim().toLowerCase());
        if (tag == null) {
            throw new Exception("Tag not found");
        }
        // Check if any questions are using this tag
        long questionCount = questionRepository.findByTagsIn(List.of(tagName.trim().toLowerCase())).size();
        if (questionCount > 0) {
            throw new Exception("Cannot delete tag used by existing questions");
        }
        tagRepository.delete(tag);
        LOGGER.info("Deleted tag: " + tagName);
    }

    /**
     * Retrieves all tags from the repository.
     *
     * @return List of all ForumTag objects.
     */
    public List<ForumTag> getAllTags() {
        return tagRepository.findAll();
    }
}