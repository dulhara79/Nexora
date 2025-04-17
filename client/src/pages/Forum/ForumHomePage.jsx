import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

const ForumHomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchQuestions();
  }, [selectedTag, searchQuery, sortBy]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      let url = `http://localhost:5000/api/questions?sortBy=${sortBy}`;
      if (selectedTag) url += `&tag=${selectedTag}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        console.error("Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleVote = async (questionId, voteType) => {
    if (!user) {
      alert("Please log in to vote");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/questions/${questionId}/${voteType}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        fetchQuestions();
      }
    } catch (error) {
      console.error(`Error ${voteType}ing question:`, error);
    }
  };

  // Extract all unique tags from questions
  const allTags = [...new Set(questions.flatMap((q) => q.tags || []))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl p-4 mx-auto md:p-6"
    >
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          Community Forum
        </motion.h1>

        {user && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/forum/ask"
              className="px-5 py-2 font-medium text-white transition-all bg-blue-600 rounded-lg shadow hover:bg-blue-700 hover:shadow-lg"
            >
              Ask Question
            </Link>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left sidebar with tags */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="md:w-1/4"
        >
          <div className="sticky p-4 bg-white rounded-lg shadow-sm top-20">
            <h3 className="mb-3 text-lg font-medium text-gray-700">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag("")}
                  className="px-3 py-1 text-sm text-gray-700 transition-all bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="md:w-3/4">
          {/* Search and Sort controls */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 mb-6 bg-white rounded-lg shadow-sm"
          >
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === "newest"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy("mostCommented")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === "mostCommented"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Most Commented
                </button>
                {/* <button
                  onClick={() => setSortBy("active")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === "active"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Most Active
                </button> */}
              </div>
              <span className="text-sm text-gray-500">
                {questions.length} questions
              </span>
            </div>
          </motion.div>

          {/* Questions list */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : questions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-8 text-center bg-white rounded-lg shadow-sm"
            >
              <h3 className="mb-2 text-xl font-medium text-gray-700">
                No questions found
              </h3>
              <p className="text-gray-500">
                {selectedTag || searchQuery
                  ? "Try changing your search criteria or create the first question for this topic!"
                  : "Be the first to ask a question!"}
              </p>
              {user && (
                <Link
                  to="/forum/ask"
                  className="inline-block px-4 py-2 mt-4 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Ask Question
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="transition-all bg-white rounded-lg shadow-sm hover:shadow"
                >
                  <div className="p-5">
                    <div className="flex">
                      {/* Vote controls */}
                      <div className="flex flex-col items-center mr-4">
                        <button
                          onClick={() => handleVote(question.id, "upvote")}
                          className="p-1 text-gray-500 hover:text-blue-600"
                          disabled={!user}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <span className="font-medium text-gray-700">
                          {question.upvoteUserIds?.length -
                            question.downvoteUserIds?.length || 0}
                        </span>
                        <button
                          onClick={() => handleVote(question.id, "downvote")}
                          className="p-1 text-gray-500 hover:text-red-600"
                          disabled={!user}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Question content */}
                      <div className="flex-1">
                        <Link to={`/forum/question/${question.id}`}>
                          <h3 className="mb-2 text-xl font-semibold text-gray-800 transition-colors hover:text-blue-600">
                            {question.title}
                          </h3>
                        </Link>
                        <p className="mb-4 text-gray-600 line-clamp-2">
                          {question.content?.substring(0, 200)}
                          {question.content?.length > 200 ? "..." : ""}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {question.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Question meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div>
                            <span>
                              {question.comments?.length || 0} comments
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              Posted by{" "}
                              {question.author?.username || "Anonymous"}
                            </span>
                          </div>
                          <span>
                            {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ForumHomePage;
