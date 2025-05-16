import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/NewPageHeader";
import axios from "axios";
import { toast as toastify, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Edit3Icon,
  SaveIcon,
  XIcon,
  AlertCircleIcon,
  Loader2Icon,
  TagIcon,
  FileTextIcon,
} from "lucide-react";

const EditQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  // Validation rules
  const VALIDATION_RULES = {
    title: {
      maxLength: 150,
      minLength: 10,
      required: true,
      pattern: /^[A-Za-z0-9\s.,!?'-]*$/,
    },
    description: {
      maxLength: 2000,
      minLength: 30,
      required: true,
      pattern: /^[A-Za-z0-9\s.,!?'-]*$/,
    },
    tag: {
      maxLength: 30,
      minLength: 2,
      pattern: /^[a-z0-9-]+$/,
      maxCount: 5,
    },
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/questions/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const question = response.data.question;
        if (!question) {
          throw new Error("Question not found");
        }
        setFormData({
          title: question.title,
          description: question.description,
          tags: question.tags?.join(", ") || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to load question"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [id, token]);

  const validateField = (name, value) => {
    const rules = VALIDATION_RULES[name];
    if (!rules) return "";

    if (rules.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    if (value.length < rules.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
    }
    if (value.length > rules.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be less than ${rules.maxLength} characters`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} contains invalid characters`;
    }
    return "";
  };

  const validateTags = (tagsString) => {
    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag);
    
    if (tagsArray.length > VALIDATION_RULES.tag.maxCount) {
      return `Maximum ${VALIDATION_RULES.tag.maxCount} tags allowed`;
    }

    for (const tag of tagsArray) {
      if (tag.length < VALIDATION_RULES.tag.minLength) {
        return `Each tag must be at least ${VALIDATION_RULES.tag.minLength} characters`;
      }
      if (tag.length > VALIDATION_RULES.tag.maxLength) {
        return `Each tag must be less than ${VALIDATION_RULES.tag.maxLength} characters`;
      }
      if (!VALIDATION_RULES.tag.pattern.test(tag)) {
        return "Tags can only contain lowercase letters, numbers, and hyphens";
      }
      if (tagsArray.filter((t) => t === tag).length > 1) {
        return "Duplicate tags are not allowed";
      }
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: name === "tags" ? validateTags(value) : validateField(name, value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toastify.info("Please log in to edit questions", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate all fields
    const titleError = validateField("title", formData.title);
    const descriptionError = validateField("description", formData.description);
    const tagsError = validateTags(formData.tags);

    if (titleError || descriptionError || tagsError) {
      setFormErrors({
        title: titleError,
        description: descriptionError,
        tags: tagsError,
      });
      toastify.error("Please fix the errors in the form", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag);

    const updatedQuestion = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags: tagsArray,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/questions/${id}`,
        updatedQuestion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toastify.success("Question updated successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate(`/forum/question/${id}`);
    } catch (error) {
      console.error("Error updating question:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      toastify.error(
        error.response?.data?.error ||
          "Failed to update question. Please check your input and try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-amber-50 to-orange-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="relative w-24 h-24"
        >
          <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 rounded-full border-t-orange-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2Icon className="w-10 h-10 text-orange-500 animate-pulse" />
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, repeat: Infinity, duration: 1.5 }}
          className="mt-6 text-lg font-medium text-orange-700"
        >
          Loading question details...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl p-8 mx-auto mt-12 bg-white shadow-lg rounded-xl backdrop-blur-sm bg-opacity-80"
      >
        <div className="flex items-center p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
          <AlertCircleIcon className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-bold">Error</h2>
        </div>
        <p className="mb-4 text-gray-700">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
        >
          Go Back
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <Header title="Edit Question" />
      <div className="min-h-screen p-4 bg-gradient-to-br from-amber-50 to-orange-100 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-3 mr-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
            >
              <Edit3Icon className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800">
              Edit Your Question
            </h1>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="p-6 bg-white shadow-xl rounded-xl backdrop-blur-sm bg-opacity-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Title Field */}
            <motion.div className="mb-6" whileTap={{ scale: 0.995 }}>
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <FileTextIcon className="w-4 h-4 mr-2" />
                Question Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter a clear and concise title"
                  className={`w-full px-4 py-3 text-gray-800 transition-all duration-200 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    formErrors.title
                      ? "border-red-400"
                      : focusedField === "title"
                      ? "border-orange-400 shadow-md shadow-orange-100"
                      : "border-gray-200"
                  }`}
                  maxLength={VALIDATION_RULES.title.maxLength}
                  required
                />
                <div className="absolute top-0 right-0 flex items-center h-full px-3 text-xs text-gray-400">
                  {formData.title.length}/{VALIDATION_RULES.title.maxLength}
                </div>
              </div>
              <p className={`mt-1 text-sm ${formErrors.title ? "text-red-500" : "text-gray-500"}`}>
                {formErrors.title || "Be specific and concise"}
              </p>
            </motion.div>

            {/* Description Field */}
            <motion.div className="mb-6" whileTap={{ scale: 0.995 }}>
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <Edit3Icon className="w-4 h-4 mr-2" />
                Description
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("description")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Provide detailed context for your question"
                  className={`w-full px-4 py-3 text-gray-800 transition-all duration-200 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    formErrors.description
                      ? "border-red-400"
                      : focusedField === "description"
                      ? "border-orange-400 shadow-md shadow-orange-100"
                      : "border-gray-200"
                  }`}
                  rows="6"
                  maxLength={VALIDATION_RULES.description.maxLength}
                />
                <div className="flex justify-end mt-1 text-xs text-gray-400">
                  {formData.description.length}/{VALIDATION_RULES.description.maxLength} characters
                </div>
              </div>
              <p className={`mt-1 text-sm ${formErrors.description ? "text-red-500" : "text-gray-500"}`}>
                {formErrors.description || "Include all relevant details"}
              </p>
            </motion.div>

            {/* Tags Field */}
            <motion.div className="mb-8" whileTap={{ scale: 0.995 }}>
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <TagIcon className="w-4 h-4 mr-2" />
                Tags (comma-separated)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("tags")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g., javascript, react, node"
                  className={`w-full px-4 py-3 text-gray-800 transition-all duration-200 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    formErrors.tags
                      ? "border-red-400"
                      : focusedField === "tags"
                      ? "border-orange-400 shadow-md shadow-orange-100"
                      : "border-gray-200"
                  }`}
                />
                <div className="flex justify-end mt-1 text-xs text-gray-400">
                  {formData.tags.split(",").filter(tag => tag.trim()).length}/{VALIDATION_RULES.tag.maxCount} tags
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <AnimatePresence>
                  {formData.tags.split(",").map((tag, index) => {
                    const cleanTag = tag.trim();
                    if (!cleanTag) return null;
                    return (
                      <motion.span
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full"
                      >
                        #{cleanTag}
                      </motion.span>
                    );
                  })}
                </AnimatePresence>
              </div>
              <p className={`mt-1 text-sm ${formErrors.tags ? "text-red-500" : "text-gray-500"}`}>
                {formErrors.tags || `Add up to ${VALIDATION_RULES.tag.maxCount} tags (lowercase, numbers, hyphens)`}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate(`/forum/question/${id}`)}
                className="flex items-center justify-center px-6 py-3 font-medium text-gray-700 transition-all bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={Object.values(formErrors).some(err => err) || isLoading}
                className={`flex items-center justify-center px-6 py-3 font-medium text-white transition-all rounded-lg ${
                  Object.values(formErrors).some(err => err) || isLoading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg"
                }`}
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                Update Question
              </motion.button>
            </div>
          </motion.form>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-4xl p-6 mx-auto mt-8 bg-white shadow-lg rounded-xl backdrop-blur-sm bg-opacity-80"
          >
            <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-800">
              <AlertCircleIcon className="w-5 h-5 mr-2 text-blue-500" />
              Tips for Better Engagement
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Use clear and specific titles</li>
              <li>Provide enough context in the description</li>
              <li>Select relevant tags to reach the right audience</li>
              <li>Avoid using vague or overly broad terms</li>
              <li>Check for similar questions before posting</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="text-sm"
        toastClassName="bg-white shadow-lg rounded-xl border border-gray-100"
      />
    </>
  );
};

export default EditQuestionPage;