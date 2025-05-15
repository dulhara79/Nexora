import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import QuizResult from "./QuizResult";
import Header from "../../common/NewPageHeader";
import { parseISO, isBefore } from "date-fns";

const QuizDetail = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
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
        const fetchedQuiz = response.data.quiz;
        console.log("Fetched Quiz:", {
          id: fetchedQuiz.id,
          question: fetchedQuiz.question,
          isActive: fetchedQuiz.isActive,
          deadline: fetchedQuiz.deadline,
          options: fetchedQuiz.options,
          participantAnswers: fetchedQuiz.participantAnswers,
          hasAnswered: !!fetchedQuiz.participantAnswers[userId],
          currentTime: new Date().toISOString(),
          timezoneOffset: new Date().getTimezoneOffset(),
        });
        setQuiz(fetchedQuiz);
        setHasAnswered(!!fetchedQuiz.participantAnswers[userId]);
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to fetch quiz";
        setError(errorMessage);
        console.error("Fetch Quiz Error:", {
          message: errorMessage,
          status: err.response?.status,
          data: err.response?.data,
        });
      }
    };
    if (token) {
      fetchQuiz();
    } else {
      setError("User not authenticated");
      console.error("Authentication Error: Token or userId missing", {
        token,
        userId,
      });
    }
  }, [id, token, userId]);

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
      setError(err.response?.data?.error || "Failed to upvote quiz");
      console.error("Upvote Error:", err);
    }
  };

  const handleAnswerSubmit = async () => {
    try {
      console.log("Submitting answer:", {
        quizId: id,
        answer: selectedAnswer,
        userId,
      });
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
      console.log("Answer submitted successfully:", response.data.quiz);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit answer");
      console.error("Submit Answer Error:", {
        message: err.response?.data?.error,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  const handleClearAttempt = async () => {
    try {
      console.log("Clearing attempt for quiz:", { quizId: id, userId });
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
      console.log("Attempt cleared successfully:", response.data.quiz);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to clear attempt");
      console.error("Clear Attempt Error:", err);
    }
  };

  if (!quiz) return <div className="p-4 text-center">Loading...</div>;

  const deadline = parseISO(quiz.deadline);
  const now = new Date();
  const isQuizActive = quiz.isActive && !isBefore(deadline, now);
  console.log("Quiz Status Check:", {
    isActive: quiz.isActive,
    deadline: quiz.deadline,
    parsedDeadline: deadline,
    currentTime: now,
    isQuizActive,
  });

  if (!isQuizActive) {
    console.log(
      "Rendering QuizResult because quiz is inactive or deadline passed"
    );
    return <QuizResult quiz={quiz} />;
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
          {new Date(quiz.deadline).toLocaleString("en-US", {
            timeZone: "Asia/Colombo",
          })}
        </p>
        <p className="text-gray-600">
          Upvotes: {quiz.upvoteUserIds?.length || 0}
        </p>
        <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
          {!hasAnswered ? (
            <>
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
            </>
          ) : (
            <div>
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
        <div className="flex mt-4 space-x-4">
          <button
            onClick={handleUpvote}
            className={`px-6 py-3 rounded-lg text-white ${
              quiz.upvoteUserIds.includes(userId)
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {quiz.upvoteUserIds.includes(userId) ? "Remove Upvote" : "Upvote"}
          </button>
          {quiz.authorId === user?.id && (
            <Link
              to={`/forum/quizzes/${quiz.id}/stats`}
              className="px-6 py-3 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              View Stats
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizDetail;
