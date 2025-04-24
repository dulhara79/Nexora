import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Forum/Header";

const ForumHomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [savedQuestions, setSavedQuestions] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchQuestions();
    if (user) {
      fetchSavedQuestions();
    } else {
      setSavedQuestions([]); // Clear saved questions if no user is logged in
    }
  }, [selectedTag, searchQuery, sortBy, user]);

  const fetchQuestions = async () => {
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

  const fetchSavedQuestions = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/questions/saved",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSavedQuestions(data.map((q) => q.id));
      }
    } catch (error) {
      console.error("Error fetching saved questions:", error);
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
      const response = await fetch(
        `http://localhost:5000/api/questions/${questionId}/${voteType}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchQuestions();
      }
    } catch (error) {
      console.error(`Error ${voteType}ing question:`, error);
    }
  };

  const toggleSaveQuestion = async (questionId) => {
    if (!user) {
      alert("Please log in to save questions");
      return;
    }
  
    const isSaved = savedQuestions.includes(questionId);
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/questions/${questionId}/${
          isSaved ? "unsave" : "save"
        }`,
        {
          method: isSaved ? "DELETE" : "POST",
          credentials: "include",
        }
      );
  
      if (response.ok) {
        if (isSaved) {
          setSavedQuestions(savedQuestions.filter((id) => id !== questionId));
        } else {
          setSavedQuestions([...savedQuestions, questionId]);
        }
      } else {
        console.error(`Failed to ${isSaved ? "unsave" : "save"} question`);
      }
    } catch (error) {
      console.error(`Error ${isSaved ? "unsaving" : "saving"} question:`, error);
    }
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Extract all unique tags from questions
  const allTags = [...new Set(questions.flatMap((q) => q.tags || []))];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl p-4 pt-20 mx-auto md:p-6"
      >
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-3xl font-bold text-gray-800"
          >
            Community Forum
          </motion.h1>

          {user && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/forum/ask"
                className="flex items-center gap-2 px-5 py-2 font-medium text-white transition-all bg-blue-600 rounded-lg shadow hover:bg-blue-700 hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Ask Question
              </Link>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          {/* Left sidebar with tags */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="md:w-1/4"
          >
            <div className="sticky p-4 bg-white rounded-lg shadow top-20">
              <h3 className="flex items-center gap-2 mb-3 text-lg font-medium text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Tags
              </h3>
              <motion.div
                className="flex flex-wrap gap-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {allTags.map((tag) => (
                  <motion.button
                    key={tag}
                    variants={itemVariants}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedTag === tag
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag}
                  </motion.button>
                ))}
                {selectedTag && (
                  <motion.button
                    variants={itemVariants}
                    onClick={() => setSelectedTag("")}
                    className="px-3 py-1 text-sm text-gray-700 transition-all bg-gray-200 rounded-full hover:bg-gray-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear
                  </motion.button>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Main content area */}
          <div className="md:w-3/4">
            {/* Search and Sort controls */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="p-4 mb-6 bg-white rounded-lg shadow"
            >
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..."
                    className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute transform -translate-y-1/2 right-3 top-1/2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <motion.button
                  type="submit"
                  className="px-4 py-2 text-white transition-all bg-blue-600 rounded-lg shadow hover:bg-blue-700 hover:shadow-md"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Search
                </motion.button>
              </form>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    onClick={() => setSortBy("newest")}
                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                      sortBy === "newest"
                        ? "bg-blue-600 text-white shadow"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Newest
                  </motion.button>
                  <motion.button
                    onClick={() => setSortBy("mostCommented")}
                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                      sortBy === "mostCommented"
                        ? "bg-blue-600 text-white shadow"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                    Most Commented
                  </motion.button>
                </div>
                <span className="px-3 py-1 text-sm font-medium text-blue-600 rounded-full bg-blue-50">
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="p-8 text-center bg-white rounded-lg shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="mb-2 text-xl font-medium text-gray-700">
                  No questions found
                </h3>
                <p className="text-gray-500">
                  {selectedTag || searchQuery
                    ? "Try changing your search criteria or create the first question for this topic!"
                    : "Be the first to ask a question!"}
                </p>
                {user && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block mt-4"
                  >
                    <Link
                      to="/forum/ask"
                      className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-white transition-all bg-blue-600 rounded-lg shadow hover:bg-blue-700 hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Ask Question
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {questions.map((question, index) => {
                    const dateTime = formatDateTime(question.createdAt);
                    const isSaved = savedQuestions.includes(question.id);

                    return (
                      <motion.div
                        key={question.id}
                        variants={itemVariants}
                        exit={{ opacity: 0, y: 20 }}
                        layout
                        className="transition-all bg-white rounded-lg shadow hover:shadow-md"
                      >
                        <div className="p-5">
                          <div className="flex">
                            {/* Vote controls */}
                            <div className="flex flex-col items-center mr-4">
                              <motion.button
                                onClick={() =>
                                  handleVote(question.id, "upvote")
                                }
                                className={`p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 ${
                                  user?.votedQuestions?.upvoted?.includes(
                                    question.id
                                  )
                                    ? "text-blue-600 bg-blue-50"
                                    : ""
                                }`}
                                disabled={!user}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5"
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
                              </motion.button>
                              <motion.span
                                className="font-medium text-gray-700"
                                key={
                                  question.upvoteUserIds?.length -
                                    question.downvoteUserIds?.length || 0
                                }
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {question.upvoteUserIds?.length -
                                  question.downvoteUserIds?.length || 0}
                              </motion.span>
                              <motion.button
                                onClick={() =>
                                  handleVote(question.id, "downvote")
                                }
                                className={`p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 ${
                                  user?.votedQuestions?.downvoted?.includes(
                                    question.id
                                  )
                                    ? "text-red-600 bg-red-50"
                                    : ""
                                }`}
                                disabled={!user}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5"
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
                              </motion.button>
                            </div>

                            {/* Question content */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <Link to={`/forum/question/${question.id}`}>
                                  <h3 className="text-xl font-semibold text-gray-800 transition-colors group hover:text-blue-600">
                                    {question.title}
                                    <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
                                      →
                                    </span>
                                  </h3>
                                </Link>
                                <motion.button
  onClick={() => toggleSaveQuestion(question.id)}
  disabled={!user}
  className={`p-1.5 rounded-full ${
    isSaved ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-gray-600"
  }`}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  title={isSaved ? "Unsave question" : "Save question"}
>
  {isSaved ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  )}
</motion.button>
                              </div>

                              <div className="relative mb-4 overflow-hidden text-gray-600 line-clamp-2">
                                <p>
                                  {question.content?.substring(0, 200)}
                                  {question.content?.length > 200 ? "..." : ""}
                                </p>
                                <div className="absolute bottom-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent"></div>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {question.tags?.map((tag) => (
                                  <motion.span
                                    key={tag}
                                    className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-md"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {tag}
                                  </motion.span>
                                ))}
                              </div>

                              {/* Question meta */}
                              <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                      />
                                    </svg>
                                    {question.comments?.length || 0} comments
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                      />
                                    </svg>
                                    {question.author?.username || "Anonymous"}
                                  </span>
                                </div>
                                <div className="flex items-center mt-2 sm:mt-0">
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <span>{dateTime.date}</span>
                                  </div>
                                  <span className="mx-2">•</span>
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span>{dateTime.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForumHomePage;
