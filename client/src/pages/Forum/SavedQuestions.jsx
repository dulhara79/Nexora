import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/NewPageHeader";
import {
  BookmarkIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  MessageSquareIcon,
  SearchIcon,
  GridIcon,
  ListIcon,
} from "lucide-react";
import ToastNotification from "../../components/common/ToastNotification";

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
            Something went wrong while rendering your saved questions.
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
  const { user, isAuthenticated, loading: authLoading, token } = useContext(AuthContext);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayMode, setDisplayMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchSavedQuestions = async () => {
     
      console.log("Auth Loading:", authLoading);  
      console.log("Is Authenticated:", isAuthenticated);
      console.log("User:", user);
      console.log("User Token:", user?.token);
      console.log("Is Loading:", isLoading);
      console.log("Error:", error);
      console.log("Display Mode:", displayMode); 
      console.log("Search Term:", searchTerm);
      console.log("Toast:", toast);
      console.log("Saved Questions:", savedQuestions);
      console.log("Display token:", token);
      
        if (!token) {
          setError("Please log in to view saved questions");
        }
        if (isMounted) {
          setIsLoading(false);
        }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/questions/saved-questions",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (isMounted) {
          setSavedQuestions(response.data.questions || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching saved questions:", err);
        if (isMounted) {
          if (err.response?.status === 401) {
            setError("Session expired. Please log in again.");
          } else {
            setError(
              err.response?.data?.message ||
                "Failed to load saved questions. Please try again later."
            );
          }
          setIsLoading(false);
        }
      }
    };

    fetchSavedQuestions();

    return () => {
      isMounted = false;
    };
  }, [user, isAuthenticated, authLoading]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  
  const removeSavedQuestion = async (questionId) => {
    console.log("Saved questionId:", questionId);
    try {
      await axios.delete(
        `http://localhost:5000/api/questions/saved-questions/${questionId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSavedQuestions(savedQuestions.filter((q) => q.id !== questionId));
      showToast("Removed from saved questions", "info");
    } catch (err) {
      console.error("Error removing saved question:", err);
      showToast("Failed to remove question", "error");
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    hover: {
      y: -5,
      boxShadow:
        "0 12px 20px -4px rgba(0, 0, 0, 0.15), 0 6px 10px -3px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 18,
      },
    },
  };

  const filteredQuestions = savedQuestions.filter(
    (q) =>
      q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <ErrorBoundary>
      <Header />
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
      />
      <div className="min-h-screen mt-16 bg-gradient-to-br from-amber-50 via-white to-slate-100 dark:from-amber-950 dark:via-slate-900 dark:to-slate-950">
        <AnimatePresence>
          {authLoading || isLoading ? (
            <motion.div
              key="loader"
              className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="relative w-24 h-24"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 border-4 rounded-full border-amber-300 border-t-amber-500"></div>
                <div className="absolute inset-0 border-2 rounded-full border-amber-200 border-t-amber-400 animate-spin-slow"></div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl p-4 mx-auto md:p-6"
            >
              <div className="flex flex-col gap-4 mb-10">
                <motion.h1
                  className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Your Culinary Collection
                </motion.h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  All the cooking questions you've saved for later inspiration
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                  <SearchIcon className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search saved questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pr-4 border rounded-lg pl-9 border-slate-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:text-slate-200"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setDisplayMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      displayMode === "grid"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 scale-105"
                        : "bg-white/70 text-slate-600 dark:bg-slate-800/70 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700"
                    }`}
                    title="Grid View"
                  >
                    <GridIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDisplayMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      displayMode === "list"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 scale-105"
                        : "bg-white/70 text-slate-600 dark:bg-slate-800/70 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700"
                    }`}
                    title="List View"
                  >
                    <ListIcon className="w-5 h-5" />
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
                    to="/login"
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
                    <span className="ml-1">Go to Login</span>
                  </Link>
                </motion.div>
              ) : filteredQuestions.length === 0 ? (
                <motion.div
                  className="p-10 text-center bg-white shadow-lg rounded-xl dark:bg-slate-800 backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <BookmarkIcon className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                  <p className="text-xl text-slate-600 dark:text-slate-300">
                    No saved questions yet.
                  </p>
                  <p className="mb-6 text-slate-500 dark:text-slate-400">
                    Save cooking questions from the forum to see them here!
                  </p>
                  <Link
                    to="/forum"
                    className="inline-flex items-center px-5 py-3 font-medium text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-amber-600 to-orange-500 hover:shadow-xl hover:from-amber-700 hover:to-orange-600"
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
                  {filteredQuestions.map((question) => {
                    const { date, time } = formatDateTime(question.createdAt);
                    return (
                      <motion.div
                        key={question.id}
                        variants={itemVariants}
                        whileHover="hover"
                        className={`overflow-hidden bg-white/90 rounded-xl shadow-md dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700 backdrop-blur-sm ${
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
                            <h3 className="text-xl font-bold transition-colors text-slate-800 hover:text-amber-600 dark:text-slate-100 dark:hover:text-amber-400">
                              {question.title}
                            </h3>
                          </Link>
                          <div className="flex items-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeSavedQuestion(question.id)}
                              className="p-2 transition-colors text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
                              title="Remove from saved"
                            >
                              <BookmarkIcon className="w-5 h-5 fill-current" />
                            </motion.button>
                          </div>
                        </div>
                        <p className="flex-grow mb-4 text-slate-600 dark:text-slate-300">
                          {(question.description || "").length > 120
                            ? `${question.description.substring(0, 120)}...`
                            : question.description ||
                              "No description available"}
                        </p>
                        {(question.tags || []).length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            <TagIcon className="w-4 h-4 mr-1 text-slate-400" />
                            {(question.tags || []).map((tag) => (
                              <motion.span
                                key={tag}
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-1 text-xs font-medium rounded-full text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between pt-3 mt-auto text-sm border-t text-slate-500 border-slate-100 gap-y-3 dark:text-slate-400 dark:border-slate-700">
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
                                className="absolute inset-0 border-2 rounded-full border-amber-400"
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
                              <span className="mx-1 text-slate-400">·</span>
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

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="p-6 mt-16 border shadow-lg bg-white/80 rounded-xl dark:bg-slate-800/80 backdrop-blur-sm border-slate-100 dark:border-slate-700"
              >
                <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
                  Explore Popular Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    "baking",
                    "knife-skills",
                    "sauces",
                    "grilling",
                    "pastry",
                    "knife-sharpening",
                    "presentation",
                  ].map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 text-sm transition-colors rounded-full text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                    >
                      #{tag}
                    </motion.button>
                  ))}
                </div>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

export default SavedQuestions;