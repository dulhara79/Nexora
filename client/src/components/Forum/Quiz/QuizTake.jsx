import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Header from "../../common/NewPageHeader";

console.log("QuizTake component loaded");

const QuizTake = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [error, setError] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const userId = user?.id;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuiz(response.data.quiz);
        setHasAnswered(!!response.data.quiz.participantAnswers[userId]);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch quiz");
      }
    };
    fetchQuiz();
  }, [id, token, userId]);

  const handleAnswerSubmit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/quizzes/${id}/answer`,
        { answer: selectedAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasAnswered(true);
      setFeedback(
        selectedAnswer === response.data.quiz.correctAnswer
          ? "Correct! Well done!"
          : `Incorrect. The correct answer is: ${response.data.quiz.correctAnswer}`
      );
      setQuiz(response.data.quiz);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit answer");
    }
  };

  const handleClearAttempt = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/quizzes/${id}/clear-attempt`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasAnswered(false);
      setSelectedAnswer("");
      setFeedback("Attempt cleared! You can retake the quiz.");
      const response = await axios.get(
        `http://localhost:5000/api/quizzes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuiz(response.data.quiz);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to clear attempt");
    }
  };

  if (!quiz) return <div className="p-4 text-center">Loading...</div>;
  if (!quiz.isActive || new Date(quiz.deadline) < new Date()) {
    navigate(`/forum/quizzes/${id}`);
    return null;
  }

  return (
    <>
      <Header />
      <div className="container max-w-2xl p-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          {quiz.question}
        </h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {feedback && (
          <p
            className={`mb-4 ${
              feedback.includes("Correct") ? "text-green-500" : "text-red-500"
            }`}
          >
            {feedback}
          </p>
        )}
        <p className="text-gray-600">
          By {quiz.authorUsername} | Ends:{" "}
          {new Date(quiz.deadline).toLocaleString()}
        </p>
        {!hasAnswered ? (
          <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Select an Answer
            </h2>
            {quiz.options.map((option, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={`option-${index}`}
                  className="ml-2 text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
            <button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
              className="px-6 py-3 mt-4 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
            <p className="text-gray-700">
              Your Answer: {quiz.participantAnswers[userId]}
            </p>
            <button
              onClick={handleClearAttempt}
              className="px-6 py-3 mt-4 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
            >
              Clear Attempt and Retake
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizTake;
