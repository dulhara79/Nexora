import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Clock,
  Award,
  ThumbsUp,
  BarChart3,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { AuthContext } from "../../../context/AuthContext";

const QuizDetail = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const userId = user?.id;

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        if (!token) {
          throw new Error("No authentication token available");
        }
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedQuiz = response.data.quiz;
        console.log("Fetched Quiz:", fetchedQuiz);
        console.log("Quiz Questions:", fetchedQuiz.questions);
        setQuiz(fetchedQuiz);
        setHasAnswered(!!fetchedQuiz.participantAnswers[userId]);

        const deadline = new Date(fetchedQuiz.deadline);
        const now = new Date();
        const differenceMs = deadline.getTime() - now.getTime();
        setTimeLeft(differenceMs > 0 ? differenceMs : 0);
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || err.message || "Failed to fetch quiz";
        setError(errorMessage);
        if (err.response?.status === 401) {
          console.warn("Unauthorized access, redirecting to login...");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchQuiz();
    } else {
      setError("User not authenticated");
    }
  }, [id, token, userId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1000;
        if (newTime <= 0) {
          clearInterval(intervalId);
          if (!isQuizActive()) {
            console.log("Quiz time is up, reloading...");
            window.location.reload();
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTimeLeft = (ms) => {
    if (!ms) return "Time's up!";

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  const handleUpvote = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/quizzes/${id}/vote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuiz((prev) => ({
        ...prev,
        upvoteUserIds: prev.upvoteUserIds.includes(userId)
          ? prev.upvoteUserIds.filter((uid) => uid !== userId)
          : [...prev.upvoteUserIds, userId],
      }));
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to upvote quiz";
      setError(errorMessage);
      if (err.response?.status === 401) {
        console.warn("Unauthorized upvote, redirecting to login...");
        navigate("/login");
      }
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    if (quiz?.questions[questionIndex]?.options.includes(answer)) {
      setAnswers((prev) => ({
        ...prev,
        [questionIndex]: answer,
      }));
    } else {
      console.warn(`Invalid answer for question ${questionIndex}: ${answer}`);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!quiz || !quiz.questions) {
      setError("Quiz data not loaded");
      return;
    }
    if (Object.keys(answers).length !== quiz.questions.length) {
      setError("Please answer all questions before submitting");
      return;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const answer = answers[i];
      if (!answer) {
        setError(`No answer provided for question ${i + 1}`);
        return;
      }
      if (!quiz.questions[i].options.includes(answer)) {
        setError(
          `Invalid answer for question ${
            i + 1
          }: ${answer}. Valid options: ${quiz.questions[i].options.join(", ")}`
        );
        return;
      }
    }

    try {
      setSubmitting(true);
      console.log("Submitting answers:", answers);
      console.log("Quiz questions:", quiz.questions);
      console.log("PATCH headers:", { Authorization: `Bearer ${token}` });
      const response = await axios.patch(
        `http://localhost:5000/api/quizzes/${id}/answer`,
        answers,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasAnswered(true);

      const newFeedback = quiz.questions.map((q, index) => {
        const isCorrect = answers[index] === q.correctAnswer;
        if (isCorrect) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        return {
          isCorrect,
          message: isCorrect
            ? "Correct! Well done!"
            : `Incorrect. The correct answer is: ${q.correctAnswer}. ${q.explanation}`,
        };
      });
      setFeedback(newFeedback);
      setQuiz(response.data.quiz);
    } catch (err) {
      console.error("Answer submission error:", err.response?.data, err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to submit answers. Please try again.";
      setError(errorMessage);
      if (err.response?.status === 401) {
        console.warn("Unauthorized submission, redirecting to login...");
        navigate("/login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearAttempt = async () => {
    try {
      setSubmitting(true);
      await axios.patch(
        `http://localhost:5000/api/quizzes/${id}/clear-attempt`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasAnswered(false);
      setAnswers({});
      setFeedback([]);
      setCurrentQuestionIndex(0);
      const response = await axios.get(
        `http://localhost:5000/api/quizzes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuiz(response.data.quiz);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to clear attempt";
      setError(errorMessage);
      if (err.response?.status === 401) {
        console.warn("Unauthorized clear attempt, redirecting to login...");
        navigate("/login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this quiz? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      setSubmitting(true);
      await axios.delete(`http://localhost:5000/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/forum/quizzes", {
        state: { message: "Quiz deleted successfully" },
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to delete quiz";
      setError(errorMessage);
      if (err.response?.status === 401) {
        console.warn("Unauthorized delete attempt, redirecting to login...");
        navigate("/login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isQuizActive = () => {
    if (!quiz) {
      console.log("isQuizActive: Quiz is null");
      return false;
    }

    const now = new Date();
    let deadline;
    try {
      deadline = new Date(quiz.deadline);
      if (isNaN(deadline.getTime())) {
        console.error("Invalid deadline:", quiz.deadline);
        return false;
      }
    } catch (e) {
      console.error("Error parsing deadline:", e);
      return false;
    }

    const isActive = quiz.isActive !== false;
    const isDeadlineFuture = deadline.getTime() > now.getTime();

    console.log("isQuizActive Debug:");
    console.log("  isActive:", isActive);
    console.log("  Deadline:", deadline);
    console.log("  Now:", now);
    console.log("  isDeadlineFuture:", isDeadlineFuture);
    console.log("  Result:", isActive && isDeadlineFuture);

    return isActive && isDeadlineFuture;
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
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
            Error
          </h2>
          <p className="mb-6 text-center text-red-500">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/forum/quizzes")}
              className="px-5 py-2 text-white transition-colors bg-blue-600 rounded-lg shadow hover:bg-blue-700"
            >
              Return to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  if (!isQuizActive()) {
    return (
      <div className="min-h-screen px-4 py-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Link
              to="/forum/quizzes"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Quizzes
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden bg-white shadow-lg rounded-2xl"
          >
            <div className="px-6 py-4 text-white bg-gradient-to-r from-purple-600 to-blue-600">
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <div className="flex flex-wrap items-center mt-2 text-sm">
                <span className="flex items-center mr-4">
                  <Award className="w-4 h-4 mr-1" /> By {quiz.authorUsername}
                </span>
                <span className="flex items-center opacity-90">
                  <Clock className="w-4 h-4 mr-1" /> Quiz Ended
                </span>
              </div>
              <p className="mt-2 opacity-90">{quiz.description}</p>
            </div>

            <div className="p-6">
              <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                Quiz Results
              </h2>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-6 mb-6 rounded-lg shadow-sm bg-blue-50"
              >
                <p className="text-lg font-medium text-gray-800">Your Score:</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {quiz.participantScores[userId] || 0} /{" "}
                  {quiz.questions?.length || 0}
                </p>
                <p className="mt-2 text-gray-600">
                  {quiz.participantScores[userId] > 0
                    ? "Great job! Check your answers below."
                    : "You didn't score any points this time."}
                </p>
              </motion.div>

              {!quiz.participantAnswers[userId] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 mb-6 text-center bg-gray-100 rounded-lg"
                >
                  <p className="text-lg text-gray-700">
                    You haven't taken this quiz yet.
                  </p>
                  <Link
                    to="/forum/quizzes"
                    className="inline-flex items-center px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Explore More Quizzes
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Link>
                </motion.div>
              )}

              {quiz.participantAnswers[userId] &&
                quiz.questions?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="space-y-6"
                  >
                    {quiz.questions.map((q, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-lg shadow-sm bg-gray-50"
                      >
                        <p className="text-lg font-medium text-gray-800">
                          Question {index + 1}: {q.question}
                        </p>
                        <p className="mt-2 text-gray-700">
                          Correct Answer:{" "}
                          <span className="font-semibold text-green-600">
                            {q.correctAnswer}
                          </span>
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-gray-700">Your Answer: </span>
                          <span
                            className={`ml-2 text-lg font-medium ${
                              quiz.participantAnswers[userId][index] ===
                              q.correctAnswer
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {quiz.participantAnswers[userId][index] ||
                              "Not answered"}
                          </span>
                          {quiz.participantAnswers[userId][index] ===
                          q.correctAnswer ? (
                            <CheckCircle className="w-5 h-5 ml-2 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 ml-2 text-red-500" />
                          )}
                        </div>
                        <p className="mt-2 text-gray-600">{q.explanation}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

              <div className="flex flex-wrap justify-between gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpvote}
                  className={`px-4 py-2 rounded-lg flex items-center transition ${
                    quiz.upvoteUserIds.includes(userId)
                      ? "bg-gray-200 text-gray-700"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  {quiz.upvoteUserIds.includes(userId) ? "Upvoted" : "Upvote"}
                  <span className="px-2 py-1 ml-2 text-sm bg-white rounded-full">
                    {quiz.upvoteUserIds?.length || 0}
                  </span>
                </motion.button>

                <div className="flex gap-4">
                  {quiz.authorId === user?.id && (
                    <>
                      <Link
                        to={`/forum/quizzes/${quiz.id}/stats`}
                        className="flex items-center px-4 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
                      >
                        <BarChart3 className="w-5 h-5 mr-2" />
                        View Detailed Stats
                      </Link>
                      <Link
                        to={`/forum/quizzes/${quiz.id}/edit`}
                        className="flex items-center px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        <Edit className="w-5 h-5 mr-2" />
                        Edit Quiz
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleDeleteQuiz}
                        disabled={submitting}
                        className={`flex items-center px-4 py-2 text-white transition rounded-lg ${
                          submitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Delete Quiz
                      </motion.button>
                    </>
                  )}
                  <Link
                    to="/forum/quizzes"
                    className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Back to Quizzes
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Link
            to="/forum/quizzes"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Quizzes
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden bg-white shadow-lg rounded-2xl"
        >
          <div className="px-6 py-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <div className="flex flex-wrap items-center mt-2 text-sm">
              <span className="flex items-center mr-4">
                <Award className="w-4 h-4 mr-1" /> By {quiz.authorUsername}
              </span>
              <span className="flex items-center mr-4">
                <Clock className="w-4 h-4 mr-1" /> {formatTimeLeft(timeLeft)}
              </span>
              <span className="flex items-center mr-4">
                Difficulty:{" "}
                {quiz.difficulty.charAt(0).toUpperCase() +
                  quiz.difficulty.slice(1)}
              </span>
              <span className="flex items-center ml-auto">
                <ThumbsUp className="w-4 h-4 mr-1" />{" "}
                {quiz.upvoteUserIds?.length || 0} upvotes
              </span>
            </div>
            <p className="mt-2 opacity-90">{quiz.description}</p>
          </div>

          {feedback.length > 0 && hasAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`px-6 py-3 text-center font-medium ${
                feedback[currentQuestionIndex].isCorrect
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <div className="flex items-center justify-center">
                {feedback[currentQuestionIndex].isCorrect ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 mr-2" />
                )}
                {feedback[currentQuestionIndex].message}
              </div>
            </motion.div>
          )}

          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </h2>
              <p className="mt-2 text-gray-700">{currentQuestion.question}</p>
            </div>

            <AnimatePresence mode="wait">
              {!hasAnswered ? (
                <motion.div
                  key="quiz-options"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-6 space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <label
                          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            answers[currentQuestionIndex] === option
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-200"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                                answers[currentQuestionIndex] === option
                                  ? "bg-blue-500 text-white"
                                  : "border-2 border-gray-300"
                              }`}
                            >
                              {answers[currentQuestionIndex] === option && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-3 h-3 bg-white rounded-full"
                                />
                              )}
                            </div>
                            <div className="font-medium text-gray-800">
                              {option}
                            </div>
                          </div>
                          <input
                            type="radio"
                            className="hidden"
                            name={`answer-${currentQuestionIndex}`}
                            value={option}
                            checked={answers[currentQuestionIndex] === option}
                            onChange={() =>
                              handleAnswerChange(currentQuestionIndex, option)
                            }
                          />
                        </label>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mb-6">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentQuestionIndex === 0}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        currentQuestionIndex === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Previous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          Math.min(quiz.questions.length - 1, prev + 1)
                        )
                      }
                      disabled={
                        currentQuestionIndex === quiz.questions.length - 1
                      }
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        currentQuestionIndex === quiz.questions.length - 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  </div>
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAnswerSubmit}
                      disabled={
                        Object.keys(answers).length !== quiz.questions.length ||
                        submitting
                      }
                      className={`px-8 py-3 rounded-full font-medium text-white ${
                        Object.keys(answers).length === quiz.questions.length &&
                        !submitting
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-lg"
                          : "bg-gray-400 cursor-not-allowed"
                      } transition-all flex items-center`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Answers
                          <ChevronRight className="w-5 h-5 ml-1" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="quiz-answered"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 bg-gray-50 rounded-xl"
                >
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Your Submission
                  </h2>
                  <p className="mb-6 text-gray-700">
                    Your Score:{" "}
                    <span className="font-semibold">
                      {quiz.participantScores[userId] || 0} /{" "}
                      {quiz.questions.length}
                    </span>
                  </p>
                  <div className="space-y-4">
                    {quiz.questions.map((q, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-lg shadow-sm"
                      >
                        <p className="font-medium text-gray-800">
                          Question {index + 1}: {q.question}
                        </p>
                        <p className="mt-1">
                          Your Answer:{" "}
                          <span
                            className={
                              quiz.participantAnswers[userId][index] ===
                              q.correctAnswer
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          >
                            {quiz.participantAnswers[userId][index] ||
                              "Not answered"}
                          </span>
                        </p>
                        <p className="mt-1">
                          Correct Answer:{" "}
                          <span className="text-green-600">
                            {q.correctAnswer}
                          </span>
                        </p>
                        <p className="mt-2 text-gray-600">{q.explanation}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-6">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleClearAttempt}
                      disabled={submitting}
                      className={`px-6 py-3 rounded-full font-medium text-white 
                        ${
                          submitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-red-500 shadow-md hover:shadow-lg"
                        } transition-all flex items-center`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Clear Attempt & Retake
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleUpvote}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  quiz.upvoteUserIds.includes(userId)
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } transition-all`}
              >
                <ThumbsUp className="w-5 h-5 mr-2" />
                {quiz.upvoteUserIds.includes(userId) ? "Upvoted" : "Upvote"}
                <span className="ml-2 bg-white px-2 py-0.5 rounded-full text-sm">
                  {quiz.upvoteUserIds?.length || 0}
                </span>
              </motion.button>

              <div className="flex gap-4">
                {quiz.authorId === user?.id && (
                  <>
                    <Link
                      to={`/forum/quizzes/${quiz.id}/stats`}
                      className="flex items-center px-4 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
                    >
                      <BarChart3 className="w-5 h-5 mr-2" />
                      View Stats
                    </Link>
                    <Link
                      to={`/forum/quizzes/${quiz.id}/edit`}
                      className="flex items-center px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      <Edit className="w-5 h-5 mr-2" />
                      Edit Quiz
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDeleteQuiz}
                      disabled={submitting}
                      className={`flex items-center px-4 py-2 text-white transition rounded-lg ${
                        submitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete Quiz
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizDetail;
