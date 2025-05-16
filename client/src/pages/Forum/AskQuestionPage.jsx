import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Tag as TagIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import Header from "../../components/common/NewPageHeader";

const BASE_URL = "http://localhost:5000";

export default function AskQuestionPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
  });
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

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
    // fetchCommunities();
  }, []);

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
      return name === 'tag' 
        ? 'Tags can only contain lowercase letters, numbers, and hyphens'
        : `${name.charAt(0).toUpperCase() + name.slice(1)} contains invalid characters`;
    }
    return "";
  };

  const validateTag = (tag) => {
    const rules = VALIDATION_RULES.tag;
    if (tag.length < rules.minLength) {
      return `Tag must be at least ${rules.minLength} characters`;
    }
    if (tag.length > rules.maxLength) {
      return `Tag must be less than ${rules.maxLength} characters`;
    }
    if (!rules.pattern.test(tag)) {
      return 'Tags can only contain lowercase letters, numbers, and hyphens';
    }
    if (formData.tags.includes(tag)) {
      return 'Tag already added';
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
      [name]: validateField(name, value),
    });
    setError("");
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (!trimmedTag) {
      setFormErrors({ ...formErrors, tags: "Tag cannot be empty" });
      return;
    }
    
    if (formData.tags.length >= VALIDATION_RULES.tag.maxCount) {
      setFormErrors({ ...formErrors, tags: `Maximum ${VALIDATION_RULES.tag.maxCount} tags allowed` });
      return;
    }

    const tagError = validateTag(trimmedTag);
    if (tagError) {
      setFormErrors({ ...formErrors, tags: tagError });
      return;
    }

    setFormData({
      ...formData,
      tags: [...formData.tags, trimmedTag],
    });
    setTagInput("");
    setFormErrors({ ...formErrors, tags: "" });
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
    setFormErrors({ ...formErrors, tags: "" });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const titleError = validateField("title", formData.title);
    const descriptionError = validateField("description", formData.description);
    
    if (titleError || descriptionError) {
      setFormErrors({
        title: titleError,
        description: descriptionError,
        tags: formErrors.tags,
      });
      setError("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const postData = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
      };

      const res = await axios.post(`${BASE_URL}/api/questions`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/forum/question/${res.data.question.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error submitting question:", error);
      setError(
        error.response?.data?.error ||
          "Failed to post your question. Please try again."
      );
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 12 } },
  };

  return (
    <>
      <Header />
      <div className="min-h-screen py-8 bg-gradient-to-b from-orange-50 to-white">
        <motion.div
          className="container max-w-3xl px-4 mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="mb-12 text-center" variants={itemVariants}>
            <h1 className="mb-3 text-4xl font-bold text-gray-800">
              Ask a Question
            </h1>
            <p className="text-gray-600">
              Share your cooking questions with our community of experts
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="p-8 bg-white shadow-xl rounded-xl"
            variants={containerVariants}
          >
            {/* Title Input */}
            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block mb-2 text-lg font-medium text-gray-700">
                Question Title
              </label>
              <motion.div
                className={`relative border-2 rounded-lg transition-all duration-300 ${
                  focusedField === "title"
                    ? "border-orange-400 shadow-md shadow-orange-100"
                    : formErrors.title
                    ? "border-red-400"
                    : "border-gray-200"
                }`}
                whileTap={{ scale: 0.995 }}
              >
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 bg-transparent rounded-lg focus:outline-none"
                  placeholder="What's your cooking question?"
                  maxLength={VALIDATION_RULES.title.maxLength}
                />
              </motion.div>
              <div className="flex justify-between mt-1">
                <p className={`text-sm ${formErrors.title ? 'text-red-500' : 'text-gray-500'}`}>
                  {formErrors.title || 
                    `Be specific and imagine you're asking another person (${formData.title.length}/${VALIDATION_RULES.title.maxLength})`}
                </p>
              </div>
            </motion.div>

            {/* Description Input */}
            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block mb-2 text-lg font-medium text-gray-700">
                Description
              </label>
              <motion.div
                className={`relative border-2 rounded-lg transition-all duration-300 ${
                  focusedField === "description"
                    ? "border-orange-400 shadow-md shadow-orange-100"
                    : formErrors.description
                    ? "border-red-400"
                    : "border-gray-200"
                }`}
                whileTap={{ scale: 0.995 }}
              >
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("description")}
                  onBlur={() => setFocusedField(null)}
                  rows={8}
                  className="w-full px-4 py-3 bg-transparent rounded-lg focus:outline-none"
                  placeholder="Describe your question in detail... Include any steps you've already tried, ingredients you're using, and specific techniques you're asking about."
                  maxLength={VALIDATION_RULES.description.maxLength}
                />
              </motion.div>
              <div className="flex justify-between mt-1">
                <p className={`text-sm ${formErrors.description ? 'text-red-500' : 'text-gray-500'}`}>
                  {formErrors.description ||
                    `Include all the information someone would need to answer your question (${formData.description.length}/${VALIDATION_RULES.description.maxLength})`}
                </p>
              </div>
            </motion.div>

            {/* Tags Input */}
            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block mb-2 text-lg font-medium text-gray-700">
                Tags
              </label>
              <div className="mb-2">
                <motion.div
                  className={`flex items-center border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                    focusedField === "tags"
                      ? "border-orange-400 shadow-md shadow-orange-100"
                      : formErrors.tags
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                  whileTap={{ scale: 0.995 }}
                >
                  <div className="flex flex-wrap items-center gap-2 px-2 py-1">
                    <AnimatePresence>
                      {formData.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-orange-700 bg-orange-100 rounded-full group"
                        >
                          <TagIcon size={14} />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="p-1 text-orange-500 rounded-full hover:bg-orange-200 hover:text-orange-800"
                          >
                            <X size={12} />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setFormErrors({ ...formErrors, tags: "" });
                      }}
                      onKeyDown={handleTagInputKeyDown}
                      onFocus={() => setFocusedField("tags")}
                      onBlur={() => {
                        setFocusedField(null);
                        if (tagInput.trim()) handleAddTag();
                      }}
                      className="flex-1 min-w-[150px] px-2 py-2 bg-transparent focus:outline-none"
                      placeholder="Add tags (press Enter or comma)"
                      maxLength={VALIDATION_RULES.tag.maxLength}
                    />
                  </div>
                  <motion.button
                    type="button"
                    onClick={handleAddTag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-orange-500 hover:bg-orange-50"
                  >
                    <Plus size={20} />
                  </motion.button>
                </motion.div>
              </div>
              <div className="flex justify-between mt-1">
                <p className={`text-sm ${formErrors.tags ? 'text-red-500' : 'text-gray-500'}`}>
                  {formErrors.tags ||
                    `Add up to ${VALIDATION_RULES.tag.maxCount} tags to describe what your question is about (${formData.tags.length}/${VALIDATION_RULES.tag.maxCount})`}
                </p>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="p-4 mb-6 text-red-800 bg-red-100 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading || success || Object.values(formErrors).some(err => err)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative w-full px-6 py-4 text-lg font-medium text-white transition-all rounded-lg shadow-lg 
                ${
                  loading || success || Object.values(formErrors).some(err => err)
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-200 hover:shadow-orange-300"
                }`}
              >
                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <svg
                        className="w-6 h-6 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", damping: 12 }}
                    >
                      <Check size={24} className="text-white" />
                    </motion.div>
                  )}

                  <span
                    className={loading || success ? "opacity-0" : "opacity-100"}
                  >
                    Post Your Question
                  </span>
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Success Animation Overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="flex flex-col items-center p-10 text-center bg-white rounded-xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                >
                  <motion.div
                    className="flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", damping: 8 }}
                  >
                    <Check size={40} className="text-green-600" />
                  </motion.div>
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">
                    Question Posted!
                  </h2>
                  <p className="text-gray-600">
                    Redirecting you to your question...
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}