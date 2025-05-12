import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const QuestionCard = ({ question, delay, setQuestions }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/questions/${question.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Replace with your auth token
      });
      // Optimistically update state
      setQuestions((prev) => prev.filter((q) => q.id !== question.id));
      // Trigger refetch event
      window.dispatchEvent(new Event("questionDeleted"));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 bg-white rounded-lg shadow"
    >
      <Link to={`/forum/questions/${question.id}`}>
        <h3 className="text-lg font-medium text-gray-800">{question.title}</h3>
      </Link>
      <p className="text-sm text-gray-500">{question.content}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {question.tags?.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
      {question.isOwner && ( // Assuming isOwner is part of the question model
        <button
          onClick={handleDelete}
          className="px-2 py-1 mt-2 text-sm text-red-500 hover:text-red-600"
        >
          Delete
        </button>
      )}
    </motion.div>
  );
};

export default QuestionCard;