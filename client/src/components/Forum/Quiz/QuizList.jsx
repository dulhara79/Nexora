import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { ChevronRight, Plus, ThumbsUp, Clock, User, Award } from "lucide-react";
import Header from "../../common/NewPageHeader";

// Custom header component with animated underline
const PageHeader = ({ title, subtitle }) => (
  <div className="mb-8 text-center">
    <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
    <div className="flex justify-center mt-2">
      <motion.div
        className="w-24 h-1 rounded-full bg-gradient-to-r from-orange-400 to-red-500"
        initial={{ width: 0 }}
        animate={{ width: "6rem" }}
        transition={{ duration: 0.8 }}
      />
    </div>
    {subtitle && <p className="mt-3 text-gray-600">{subtitle}</p>}
  </div>
);

// Quiz card component with animations
const QuizCard = ({ quiz, isCurrentUser }) => {
  const timeRemaining = new Date(quiz.deadline) - new Date();
  const isExpired = timeRemaining < 0;

  // Calculate days/hours remaining
  let timeRemainingText = "Expired";
  if (!isExpired) {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    timeRemainingText = days > 0 ? `${days}d ${hours}h left` : `${hours}h left`;
  }

  return (
    <>
      {/* <Header /> */}
      <motion.div
        className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
          isExpired ? "bg-gray-100" : "bg-white"
        }`}
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Difficulty indicator */}
        <div
          className={`absolute top-0 right-0 w-16 h-16 ${
            quiz.difficulty === "easy"
              ? "bg-green-500"
              : quiz.difficulty === "medium"
              ? "bg-orange-500"
              : "bg-red-500"
          }`}
        >
          <div className="absolute bottom-0 right-0 flex items-center justify-center w-full h-8 text-xs font-bold text-white transform rotate-45 translate-x-1/2 translate-y-1/2">
            {quiz.difficulty || "Medium"}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-3">
            <Award size={18} className="mr-2 text-orange-500" />
            <span className="text-sm font-medium text-orange-500">
              {quiz.category || "General Cooking"}
            </span>
          </div>

          <h2 className="mb-3 text-xl font-semibold text-gray-800 line-clamp-2">
            {quiz.question}
          </h2>

          <div className="flex items-center mb-4 text-sm text-gray-600">
            <User size={16} className="mr-1" />
            <span className="mr-4">by {quiz.authorUsername}</span>
            <Clock size={16} className="mr-1" />
            <span className={isExpired ? "text-red-500" : "text-green-500"}>
              {timeRemainingText}
            </span>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center">
              <ThumbsUp size={16} className="mr-1 text-blue-500" />
              <span className="text-gray-700">
                {quiz.upvoteUserIds?.length || 0}
              </span>
            </div>

            <div className="flex space-x-3">
              <Link
                to={`/forum/quizzes/${quiz.id}`}
                className="flex items-center px-3 py-1 text-sm font-medium text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
              >
                Take Quiz <ChevronRight size={16} className="ml-1" />
              </Link>

              {isCurrentUser && (
                <Link
                  to={`/forum/quizzes/${quiz.id}/stats`}
                  className="flex items-center px-3 py-1 text-sm font-medium text-white transition-colors bg-green-600 rounded-full hover:bg-green-700"
                >
                  Stats <ChevronRight size={16} className="ml-1" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// QuizList Component
const QuizList = () => {
  const { token, user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Example categories for filters
  const categories = [
    "All",
    "Baking",
    "Grilling",
    "Knife Skills",
    "Seasoning",
    "Desserts",
  ];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/quizzes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Adding mock data for UI demonstration
        const enhancedQuizzes = response.data.quizzes.map((quiz) => ({
          ...quiz,
          difficulty: ["easy", "medium", "hard"][Math.floor(Math.random() * 3)],
          category: categories[Math.floor(Math.random() * categories.length)],
        }));

        setQuizzes(enhancedQuizzes);
        setFilteredQuizzes(enhancedQuizzes);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [token]);

  // Filter and search functionality
  useEffect(() => {
    let result = [...quizzes];

    // Apply category filter
    if (filter !== "all" && filter !== "All") {
      result = result.filter((quiz) => quiz.category === filter);
    }

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (quiz) =>
          quiz.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.authorUsername.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuizzes(result);
  }, [filter, searchTerm, quizzes]);

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with animated background */}
      <Header />
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 to-red-600">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          initial={{ backgroundPosition: "0% 0%" }}
          animate={{ backgroundPosition: "100% 0%" }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 20,
            ease: "linear",
          }}
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")',
            backgroundSize: "400px 400px",
          }}
        />
        <div className="relative py-12 text-center text-white">
          <motion.h1
            className="text-5xl font-bold"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Cooking Trivia Quizzes
          </motion.h1>
          <motion.p
            className="mt-4 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Test your cooking knowledge and challenge the Nexora community
          </motion.p>
        </div>
      </div>

      <div className="container max-w-6xl px-4 py-8 mx-auto">
        {error && (
          <motion.div
            className="p-4 mb-6 text-red-800 bg-red-100 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Filters and search */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  filter === category ||
                  (filter === "all" && category === "All")
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-orange-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(category === "All" ? "all" : category)}
              >
                {category}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search quizzes..."
                className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute w-5 h-5 text-gray-400 left-3 top-2.5"
                xmlns="http://www.w3.org/2000/svg"
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
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/forum/quizzes/create"
                className="flex items-center px-5 py-2 text-white transition rounded-full shadow-md bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-lg"
              >
                <Plus size={18} className="mr-2" /> Create Quiz
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 rounded-full border-t-orange-500 animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Quiz count */}
            <p className="mb-6 text-gray-600">
              Showing {filteredQuizzes.length} quizzes{" "}
              {filter !== "all" && filter !== "All" ? `in ${filter}` : ""}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>

            {/* Quiz grid with staggered animation */}
            {filteredQuizzes.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-lg shadow">
                <p className="text-lg text-gray-700">
                  No quizzes found. Try adjusting your filters or create a new
                  quiz!
                </p>
              </div>
            ) : (
              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    isCurrentUser={quiz.authorId === user?.id}
                  />
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizList;
