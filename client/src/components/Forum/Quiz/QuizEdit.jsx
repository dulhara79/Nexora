import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { ChevronLeft, Loader2, Save, Plus, Trash2 } from "lucide-react";

const QuizEdit = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    deadline: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedQuiz = response.data.quiz;
        if (fetchedQuiz.authorId !== user?.id) {
          throw new Error("Only the quiz creator can edit this quiz");
        }
        setQuiz({
          title: fetchedQuiz.title,
          description: fetchedQuiz.description,
          category: fetchedQuiz.category,
          difficulty: fetchedQuiz.difficulty,
          deadline: new Date(fetchedQuiz.deadline).toISOString().slice(0, 16),
          questions: fetchedQuiz.questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "",
          })),
        });
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to fetch quiz"
        );
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    if (token && user) {
      fetchQuiz();
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [id, token, user, navigate]);

  const handleInputChange = (e, index, field, optionIndex) => {
    const { name, value } = e.target;
    setQuiz((prev) => {
      if (index === undefined) {
        return { ...prev, [name]: value };
      }
      const questions = [...prev.questions];
      if (field === "options") {
        questions[index].options[optionIndex] = value;
      } else {
        questions[index][field] = value;
      }
      return { ...prev, questions };
    });
  };

  const handleAddQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          explanation: "",
        },
      ],
    }));
  };

  const handleRemoveQuestion = (index) => {
    if (quiz.questions.length === 1) {
      setError("Quiz must have at least one question");
      return;
    }
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      // Validate form data
      if (!quiz.title.trim()) throw new Error("Quiz title is required");
      if (!quiz.description.trim())
        throw new Error("Quiz description is required");
      if (!quiz.category.trim()) throw new Error("Quiz category is required");
      if (!quiz.difficulty) throw new Error("Quiz difficulty is required");
      if (!quiz.deadline || new Date(quiz.deadline) <= new Date()) {
        throw new Error("Valid future deadline is required");
      }
      quiz.questions.forEach((q, index) => {
        if (!q.question.trim())
          throw new Error(`Question ${index + 1} text is required`);
        if (q.options.some((opt) => !opt.trim())) {
          throw new Error(
            `All options for question ${index + 1} must be filled`
          );
        }
        if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
          throw new Error(
            `Valid correct answer required for question ${index + 1}`
          );
        }
      });

      const quizData = {
        ...quiz,
        deadline: new Date(quiz.deadline).toISOString(),
      };
      await axios.put(`http://localhost:5000/api/quizzes/${id}`, quizData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/forum/quizzes/${id}`, {
        state: { message: "Quiz updated successfully" },
      });
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to update quiz"
      );
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
            Error
          </h2>
          <p className="mb-6 text-center text-red-500">{error}</p>
          <Link
            to="/forum/quizzes"
            className="flex items-center justify-center px-5 py-2 text-white transition-colors bg-blue-600 rounded-lg shadow hover:bg-blue-700"
          >
            Return to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link
            to={`/forum/quizzes/${id}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Quiz
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 overflow-hidden bg-white shadow-lg rounded-2xl"
        >
          <h1 className="mb-6 text-2xl font-bold text-gray-800">Edit Quiz</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={quiz.title}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={quiz.description}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={quiz.category}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={quiz.difficulty}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">
                Deadline
              </label>
              <input
                type="datetime-local"
                name="deadline"
                value={quiz.deadline}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {quiz.questions.map((q, index) => (
              <div
                key={index}
                className="p-4 mb-6 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    Question {index + 1}
                  </h3>
                  {quiz.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="flex items-center px-3 py-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5 mr-1" />
                      Remove
                    </button>
                  )}
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium text-gray-700">
                    Question
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleInputChange(e, index, "question")}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {q.options.map((option, optIndex) => (
                  <div key={optIndex} className="mb-2">
                    <label className="block mb-1 font-medium text-gray-700">
                      Option {optIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleInputChange(e, index, "options", optIndex)
                      }
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
                <div className="mb-2">
                  <label className="block mb-1 font-medium text-gray-700">
                    Correct Answer
                  </label>
                  <select
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleInputChange(e, index, "correctAnswer")
                    }
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select correct answer</option>
                    {q.options.map((opt, optIndex) => (
                      <option key={optIndex} value={opt}>
                        {opt || `Option ${optIndex + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium text-gray-700">
                    Explanation
                  </label>
                  <textarea
                    value={q.explanation}
                    onChange={(e) => handleInputChange(e, index, "explanation")}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>
            ))}

            <div className="mb-6">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Question
              </button>
            </div>

            {error && (
              <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Link
                to={`/forum/quizzes/${id}`}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </Link>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className={`flex items-center px-6 py-2 text-white rounded-lg ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizEdit;
