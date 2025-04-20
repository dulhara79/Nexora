import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "../../index.css";
import Header from "../../components/Forum/Header";
import {
  BookmarkIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  MessageSquareIcon,
} from "lucide-react";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <p className="font-medium text-red-600 dark:text-red-400">
            Something went wrong while rendering questions.
          </p>
          <Link
            to="/forum"
            className="inline-flex items-center mt-4 font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <motion.span
              initial={{ x: 0 }}
              animate={{ x: -3 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.6,
              }}
            >
              ←
            </motion.span>
            <span className="ml-1">Back to Forum</span>
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}

const SavedQuestions = () => {
  const { user } = useContext(AuthContext);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayMode, setDisplayMode] = useState("grid"); // grid or list

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      if (!user) {
        setError("Please log in to view saved questions");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/questions/saved",
          {
            withCredentials: true,
          }
        );
        console.log("Saved questions response:", response.data);
        setSavedQuestions(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load saved questions");
        setIsLoading(false);
      }
    };

    fetchSavedQuestions();
  }, [user]);

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: formattedDate, time: formattedTime };
  };

  const removeSavedQuestion = async (questionId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/questions/${questionId}/unsave`,
        {
          withCredentials: true,
        }
      );
      setSavedQuestions(savedQuestions.filter((q) => q.id !== questionId));
    } catch (err) {
      console.error("Error removing saved question:", err);
    }
  };

  // Card container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Card item variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    hover: {
      y: -5,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Header />
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="loader"
              className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl p-4 mx-auto md:p-6"
            >
              <div className="flex flex-col justify-between mb-8 md:flex-row md:items-center">
                <motion.h1
                  className="text-3xl font-bold text-gray-800 dark:text-white"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="relative">
                    Saved Questions
                    <motion.span
                      className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    />
                  </span>
                </motion.h1>

                <div className="flex items-center mt-4 space-x-3 md:mt-0">
                  <button
                    onClick={() => setDisplayMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      displayMode === "grid"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDisplayMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      displayMode === "list"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {error ? (
                <motion.div
                  className="p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <Link
                    to="/forum"
                    className="inline-flex items-center mt-4 font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: -3 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 0.6,
                      }}
                    >
                      ←
                    </motion.span>
                    <span className="ml-1">Back to Forum</span>
                  </Link>
                </motion.div>
              ) : savedQuestions.length === 0 ? (
                <motion.div
                  className="p-10 text-center bg-white rounded-lg shadow-lg dark:bg-slate-800 backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BookmarkIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    No saved questions yet.
                  </p>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">
                    Save questions from the forum to see them here!
                  </p>
                  <Link
                    to="/forum"
                    className="inline-flex items-center px-5 py-3 font-medium text-white transition-colors bg-blue-600 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg"
                  >
                    Browse Forum
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2"
                      initial={{ x: 0 }}
                      animate={{ x: 3 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 0.6,
                      }}
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </motion.svg>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={
                    displayMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {savedQuestions.map((question) => {
                    const { date, time } = formatDateTime(question.createdAt);

                    return (
                      <motion.div
                        key={question.id}
                        variants={itemVariants}
                        whileHover="hover"
                        className={`overflow-hidden bg-white rounded-xl shadow-md dark:bg-slate-800 border border-gray-100 dark:border-slate-700 ${
                          displayMode === "list"
                            ? "p-5"
                            : "p-5 flex flex-col h-full"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Link
                            to={`/forum/question/${question.id}`}
                            className="flex-1"
                          >
                            <h3 className="text-xl font-bold text-gray-800 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                              {question.title}
                            </h3>
                          </Link>
                          <div className="flex items-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeSavedQuestion(question.id)}
                              className="p-2 text-yellow-500 transition-colors hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300"
                              title="Remove from saved"
                            >
                              <BookmarkIcon className="w-5 h-5 fill-current" />
                            </motion.button>
                          </div>
                        </div>

                        <p className="flex-grow mb-4 text-gray-600 dark:text-gray-300">
                          {(question.description || "").length > 120
                            ? `${question.description.substring(0, 120)}...`
                            : question.description ||
                              "No description available"}
                        </p>

                        {(question.tags || []).length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            <TagIcon className="w-4 h-4 mr-1 text-gray-400" />
                            {(question.tags || []).map((tag) => (
                              <motion.span
                                key={tag}
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between pt-3 mt-auto text-sm text-gray-500 border-t border-gray-100 gap-y-3 dark:text-gray-400 dark:border-slate-700">
                          <div className="flex items-center">
                            <div className="relative">
                              <img
                                src={
                                  question.author?.avatar ||
                                  "/default-avatar.png"
                                }
                                alt={question.author?.username || "Anonymous"}
                                className="w-8 h-8 border-2 border-white rounded-full dark:border-slate-700"
                              />
                              <motion.div
                                className="absolute inset-0 border-2 border-blue-400 rounded-full"
                                initial={{ opacity: 0, scale: 1.5 }}
                                animate={{ opacity: 0, scale: 1.5 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 2,
                                  repeatType: "loop",
                                }}
                              />
                            </div>
                            <span className="ml-2 font-medium">
                              {question.author?.username || "Anonymous"}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div
                              className="flex items-center"
                              title={`Posted on ${date} at ${time}`}
                            >
                              <ClockIcon className="w-4 h-4 mr-1" />
                              <span>{date}</span>
                              <span className="mx-1 text-gray-400">·</span>
                              <span>{time}</span>
                            </div>

                            {question.answerCount && (
                              <div className="flex items-center">
                                <MessageSquareIcon className="w-4 h-4 mr-1" />
                                <span>{question.answerCount}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

export default SavedQuestions;
