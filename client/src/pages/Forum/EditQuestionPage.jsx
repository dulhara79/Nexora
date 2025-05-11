import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/NewPageHeader";
import axios from "axios";
import { toast as toastify, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const question = response.data.question;
        if (!question) {
          throw new Error("Question not found");
        }
        setTitle(question.title);
        setDescription(question.description);
        setTags(question.tags?.join(", ") || "");
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to load question");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toastify.info("Please log in to edit questions", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Client-side validation
    if (!title.trim() || title.length < 5) {
      toastify.warn("Title must be at least 5 characters long", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!description.trim() || description.length < 10) {
      toastify.warn("Description must be at least 10 characters long", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Prepare tags array
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag)
      .filter((tag) => tag.length >= 2); // Ensure tags are at least 2 chars
    if (tagsArray.length > 10) {
      toastify.warn("Maximum 10 tags allowed", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const updatedQuestion = {
      title: title.trim(),
      description: description.trim(),
      tags: tagsArray,
    };

    try {
      console.log("Sending PUT request with payload:", updatedQuestion); // Debug log
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

      console.log("Response from server:", response.data); // Debug log
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
        error.response?.data?.error || "Failed to update question. Please check your input and try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 max-w-4xl p-4 mx-auto md:p-6">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-10 h-10 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"
              style={{ animationDirection: "reverse" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl p-6 mx-auto border border-red-200 rounded-lg shadow-lg md:p-8 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
      >
        <div className="flex items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="ml-2 text-xl font-bold text-red-700 dark:text-red-400">
            Error
          </h2>
        </div>
        <p className="mb-4 text-red-600 dark:text-red-300">{error}</p>
      </motion.div>
    );
  }

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl p-4 mx-auto md:p-6 from-orange-50 to-amber-50"
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100 md:text-3xl">
          Edit Question
        </h1>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-5 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 from-orange-50 to-amber-50"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter question title (min 5 characters)"
              className="w-full px-4 py-2 text-gray-800 transition-all duration-200 border border-gray-300 rounded-lg dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your question (min 10 characters)..."
              className="w-full px-4 py-3 text-gray-800 transition-all duration-200 border border-gray-300 rounded-lg dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              rows="6"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags (comma-separated, min 2 characters each)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., javascript, react, node (max 10 tags)"
              className="w-full px-4 py-2 text-gray-800 transition-all duration-200 border border-gray-300 rounded-lg dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
            />
          </div>
          <div className="flex justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => navigate(`/forum/question/${id}`)}
              className="px-5 py-2 font-medium text-gray-600 transition-all bg-gray-100 rounded-lg dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-5 py-2 font-medium text-white transition-all bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg"
            >
              Update Question
            </motion.button>
          </div>
        </motion.form>
        <ToastContainer position="top-right" autoClose={3000} />
      </motion.div>
    </>
  );
};

export default EditQuestionPage;