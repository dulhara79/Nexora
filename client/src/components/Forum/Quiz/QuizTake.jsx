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
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [feedback, setFeedback] = useState([]);
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
        if (response.data.quiz.participantAnswers[userId]) {
          setAnswers(response.data.quiz.participantAnswers[userId]);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch quiz");
      }
    };
    fetchQuiz();
  }, [id, token, userId]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleAnswerSubmit = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/quizzes/${id}/answer`,
        answers,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasAnswered(true);
      const newFeedback = quiz.questions.map((q, index) => ({
        questionIndex: index,
        isCorrect: answers[index] === q.correctAnswer,
        message:
          answers[index] === q.correctAnswer
            ? "Correct! Well done!"
            : `Incorrect. The correct answer is: ${
                q.correctAnswer
              }. Explanation: ${q.explanation || "No explanation provided."}`,
      }));
      setFeedback(newFeedback);
      setQuiz(response.data.quiz);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit answers");
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
      setAnswers({});
      setFeedback([]);
      setError(null);
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
      <div className="container max-w-4xl p-4 mx-auto">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">{quiz.title}</h1>
        <p className="mb-4 text-gray-600">{quiz.description}</p>
        <p className="text-gray-600">
          By {quiz.authorUsername} | Category: {quiz.category} | Difficulty:{" "}
          {quiz.difficulty} | Ends: {new Date(quiz.deadline).toLocaleString()}
        </p>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {feedback.length > 0 && hasAnswered && (
          <div className="mb-6">
            {feedback.map((fb) => (
              <p
                key={fb.questionIndex}
                className={`mb-2 ${
                  fb.isCorrect ? "text-green-500" : "text-red-500"
                }`}
              >
                Question {fb.questionIndex + 1}: {fb.message}
              </p>
            ))}
          </div>
        )}
        {!hasAnswered ? (
          <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Answer the Questions
            </h2>
            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="mb-6">
                <h3 className="mb-2 text-lg font-medium text-gray-800">
                  {qIndex + 1}. {question.question}
                </h3>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center mt-2">
                    <input
                      type="radio"
                      id={`option-${qIndex}-${oIndex}`}
                      name={`answer-${qIndex}`}
                      value={option}
                      checked={answers[qIndex] === option}
                      onChange={(e) =>
                        handleAnswerChange(qIndex, e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`option-${qIndex}-${oIndex}`}
                      className="ml-2 text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={handleAnswerSubmit}
              disabled={Object.keys(answers).length !== quiz.questions.length}
              className="px-6 py-3 mt-4 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Submit Answers
            </button>
          </div>
        ) : (
          <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Your Answers
            </h2>
            {quiz.questions.map((question, qIndex) => (
              <p key={qIndex} className="mb-2 text-gray-700">
                Question {qIndex + 1}: {question.question} <br />
                Your Answer:{" "}
                {quiz.participantAnswers[userId][qIndex] || "Not answered"}
              </p>
            ))}
            <p className="text-gray-700">
              Your Score: {quiz.participantScores[userId] || 0}/
              {quiz.questions.length}
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
