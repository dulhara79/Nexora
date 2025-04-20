import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const AskQuestionPage = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Changed from content to description
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: `/forum/ask${id ? `/${id}` : ""}` },
      });
      return;
    }

    if (id) {
      setIsEditMode(true);
      fetchQuestionData(id);
    }
  }, [user, id, navigate]);

  const fetchQuestionData = async (questionId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/questions/${questionId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Question not found or unauthorized");
      }

      const questionData = await response.json();

      // Check if current user is the author
      if (questionData.authorId !== user.id) {
        setFetchError("You are not authorized to edit this question");
        navigate("/forum");
        return;
      }

      setTitle(questionData.title || "");
      setDescription(questionData.description || "");
      setTags(questionData.tags || []);
    } catch (error) {
      console.error("Error fetching question:", error);
      setFetchError(error.message || "Failed to load question");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length < 30) {
      newErrors.description = "Description must be at least 30 characters";
    }

    if (tags.length === 0) {
      newErrors.tags = "At least one tag is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const questionData = {
      title,
      description,
      tags,
    };

    try {
      const url = isEditMode
        ? `http://localhost:5000/api/questions/${id}`
        : "http://localhost:5000/api/questions/add";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(questionData),
      });

      console.log("questionData:", questionData); // Debugging line
    
      if (!response.ok) {
        let errorMessage = "Failed to save question";
        try {
          const errorData = await response.json();
          errorMessage = errorData || errorData.error || errorMessage;
        } catch (jsonError) {
          errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
      }
    
      const savedQuestion = await response.json();
      navigate(`/forum/question/${savedQuestion.id}`);
    } catch (error) {
      console.error("Error saving question:", error);
      setErrors({
        submit: error.message || "Failed to save question. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();

    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 max-w-4xl p-4 mx-auto md:p-6">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-4xl p-4 mx-auto md:p-6">
        <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg">
          {fetchError}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl p-4 mx-auto md:p-6"
    >
      <div className="flex items-center mb-6 text-sm text-gray-600">
        <Link to="/forum" className="transition-colors hover:text-blue-600">
          Forum
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 mx-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-gray-800">
          {isEditMode ? "Edit Question" : "Ask a Question"}
        </span>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="overflow-hidden bg-white rounded-lg shadow-md"
      >
        <div className="p-6">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Your Question" : "Ask a Question"}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block mb-2 font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question? Be specific."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.title
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Your title should summarize the problem you're facing
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block mb-2 font-medium text-gray-700"
              >
                Details
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your question in detail. Include any relevant information that might help others provide a solution."
                rows="10"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.description
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Provide background, what you've tried, error messages, and any
                relevant code
              </p>
            </div>

            <div className="mb-8">
              <label
                htmlFor="tags"
                className="block mb-2 font-medium text-gray-700"
              >
                Tags
              </label>
              <div
                className={`flex flex-wrap gap-2 p-2 border rounded-lg mb-2 ${
                  errors.tags ? "border-red-500" : "border-gray-300"
                }`}
              >
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-700 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  id="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={addTag}
                  placeholder={
                    tags.length === 0
                      ? "Add tags (press Enter after each tag)"
                      : ""
                  }
                  className="flex-grow text-gray-700 border-none outline-none min-w-20"
                  disabled={tags.length >= 5}
                />
              </div>
              {errors.tags && (
                <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
              )}
              <p className="text-sm text-gray-500">
                Add up to 5 tags to describe what your question is about
              </p>
              {tags.length >= 5 && (
                <p className="text-sm text-amber-600">
                  Maximum of 5 tags reached
                </p>
              )}
            </div>

            {errors.submit && (
              <div className="px-4 py-3 mb-6 text-red-700 border border-red-200 rounded bg-red-50">
                {errors.submit}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Link
                to="/forum"
                className="px-5 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-5 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  <>{isEditMode ? "Update Question" : "Post Question"}</>
                )}
              </motion.button>
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 mt-8 border-t"
          >
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Guidelines for asking questions
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Be specific and clear about your problem</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>
                  Include what you've already tried to solve the issue
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Add relevant code snippets if applicable</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✓</span>
                <span>Use appropriate tags to categorize your question</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✗</span>
                <span>Avoid asking multiple questions in one post</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AskQuestionPage;
