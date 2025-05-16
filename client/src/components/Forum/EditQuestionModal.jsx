import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit2, Tag, Check, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function EditQuestionModal({
  isOpen,
  onClose,
  question,
  onUpdate,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with question data when modal opens
  useEffect(() => {
    if (question) {
      setTitle(question.title || "");
      setDescription(question.description || "");
      setTags(question.tags || []);
    }
  }, [question]);

  // Add tag to list
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  // Remove tag from list
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const response = await axios.put(
        `http://localhost:5000/api/questions/${question.id}`,
        {
          title,
          description,
          tags,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Call update handler with updated question
      onUpdate(response.data.question);

      // Show success toast
      toast.success("Question updated successfully");

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("Failed to update question");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press in tag input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="relative w-full max-w-2xl p-6 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center text-2xl font-bold text-gray-800">
                <Edit2 className="w-6 h-6 mr-2 text-orange-500" />
                Edit Question
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 transition-colors hover:text-gray-700"
                disabled={isLoading}
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Title Input */}
              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">
                  Question Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.title
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400"
                  }`}
                  placeholder="Be specific and clear"
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Description Input */}
              <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">
                  Question Details
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.description
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400"
                  }`}
                  placeholder="Include all relevant details..."
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Tags Input */}
              <div className="mb-8">
                <label className="block mb-2 font-medium text-gray-700">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center px-3 py-1 text-orange-700 bg-orange-100 rounded-full"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isLoading}
                        className="ml-2 text-orange-500 hover:text-orange-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 ${
                      errors.tags
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-orange-400"
                    }`}
                    placeholder="Add tags (press Enter)"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={isLoading}
                    className="px-4 text-white transition-colors bg-orange-500 rounded-r-lg hover:bg-orange-600 disabled:bg-orange-300"
                  >
                    Add
                  </button>
                </div>
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-2 text-white transition-all rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 animate-spin" size={20} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2" size={20} />
                      Update Question
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
