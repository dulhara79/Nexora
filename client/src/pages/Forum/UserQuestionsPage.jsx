// UserQuestionsPage.jsx
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import SkeletonLoader from "../../components/Forum/SkeletonLoader";
import {
  FaRegLightbulb,
  FaRegCommentAlt,
  FaRegThumbsUp,
  FaRegTrashAlt,
} from "react-icons/fa";
import Header from "../../components/common/NewPageHeader";

const BASE_URL = "http://localhost:5000";

export default function UserQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("all");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { user, token, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate("/login");
    //   return;
    // }

    console.log("User:", user);

    async function fetchUserQuestions() {
      try {
        const timestamp = Date.now();
        const res = await axios.get(
          `${BASE_URL}/api/questions?authorId=${user.id}&_=${timestamp}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserQuestions();
  }, [user, token, isAuthenticated]);

  // Filter questions by tag
  const filteredQuestions =
    activeTag === "all"
      ? questions
      : questions.filter((q) => q.tags?.includes(activeTag));

  // Get unique tags for filter buttons
  const allTags = [...new Set(questions.flatMap((q) => q.tags || []))];

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            Your Questions
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Track your contributions and engage with the community
          </p>
        </motion.div>

        {/* Tag Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <button
            onClick={() => setActiveTag("all")}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTag === "all"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow"
            }`}
          >
            All Questions
          </button>

          {allTags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                activeTag === tag
                  ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              #{tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Questions Grid */}
        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            <AnimatePresence>
              {filteredQuestions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredQuestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 text-center bg-white shadow-lg rounded-xl"
          >
            <FaRegLightbulb className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-xl font-medium text-gray-700">
              No questions found
            </h3>
            <p className="mb-6 text-gray-500">
              You haven't asked any questions yet
            </p>
            <Link
              to="/forum/ask"
              className="inline-flex items-center px-4 py-2 text-white transition-all rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg"
            >
              Ask Your First Question
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// QuestionCard.jsx
function QuestionCard({ question, index, hoveredIndex, setHoveredIndex }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useContext(AuthContext);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/questions/${question.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optimistically remove from UI (not shown here)
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={() => navigate(`/forum/question/${question.id}`)} // 🔥 Entire card clickable
      className="relative cursor-pointer group"
    >
      <motion.div
        className="flex flex-col h-full overflow-hidden transition-all bg-white shadow-md rounded-xl"
        whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
        style={{
          perspective: "1000px",
        }}
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-orange-200 to-amber-200 group-hover:opacity-100"></div>

        <div className="flex flex-col h-full p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {question.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="mb-3 text-lg font-semibold text-gray-800 line-clamp-2">
            {question.title}
          </h3>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 mt-auto">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-sm text-gray-600">
                <FaRegThumbsUp className="mr-1" size={14} />
                {question.upvoteUserIds?.length || 0}
              </span>
              <span className="flex items-center text-sm text-gray-600">
                <FaRegCommentAlt className="mr-1" size={14} />
                {question.commentCount || 0}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                handleDelete();
              }}
              disabled={isDeleting}
              className="p-1 text-red-500 transition-colors rounded-full hover:text-red-700 hover:bg-red-50"
            >
              <FaRegTrashAlt size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Floating badge */}
      {hoveredIndex === index && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 right-0 px-3 py-1 text-white rounded-tl-lg shadow-lg bg-gradient-to-r from-orange-500 to-amber-500"
        >
          View Details
        </motion.div>
      )}
    </motion.div>
  );
}
