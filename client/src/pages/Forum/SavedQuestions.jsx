import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "../../index.css";
import Header from "../../components/Forum/Header";

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
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600">
            Something went wrong while rendering questions.
          </p>
          <Link
            to="/forum"
            className="inline-block mt-4 font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Forum
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
        console.log("Saved questions response:", response.data); // Log API response for debugging
        setSavedQuestions(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load saved questions");
        setIsLoading(false);
      }
    };

    fetchSavedQuestions();
  }, [user]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="loader"
              className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
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
              className="max-w-4xl p-4 mx-auto md:p-6"
            >
              <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
                Saved Questions
              </h1>

              {error ? (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-red-600">{error}</p>
                  <Link
                    to="/forum"
                    className="inline-block mt-4 font-medium text-blue-600 hover:text-blue-700"
                  >
                    ← Back to Forum
                  </Link>
                </div>
              ) : savedQuestions.length === 0 ? (
                <div className="p-6 text-center rounded-lg bg-gray-50 dark:bg-slate-800">
                  <p className="text-gray-600 dark:text-gray-300">
                    No saved questions yet. Save questions from the forum to see
                    them here!
                  </p>
                  <Link
                    to="/forum"
                    className="inline-block mt-4 font-medium text-blue-600 hover:text-blue-700"
                  >
                    Browse Forum
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedQuestions.map((question) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 overflow-hidden bg-white rounded-lg shadow-sm dark:bg-slate-800"
                    >
                      <Link to={`/forum/question/${question.id}`}>
                        <h3 className="mb-2 text-lg font-bold text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                          {question.title}
                        </h3>
                      </Link>
                      <p className="mb-3 text-gray-600 dark:text-gray-300">
                        {(question.description || "").length > 120
                          ? `${question.description.substring(0, 120)}...`
                          : question.description || "No description available"}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(question.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <img
                            src={
                              question.author?.avatar || "/default-avatar.png"
                            }
                            alt={question.author?.username || "Anonymous"}
                            className="w-6 h-6 mr-2 rounded-full"
                          />
                          <span>
                            {question.author?.username || "Anonymous"}
                          </span>
                        </div>
                        <span>
                          Posted on{" "}
                          {new Date(question.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

export default SavedQuestions;
