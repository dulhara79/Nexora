import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Header from "../../common/NewPageHeader";

console.log("QuizStats component loaded");

const QuizStats = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsResponse, quizResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/quizzes/${id}/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/quizzes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setStats(statsResponse.data.stats);
        setQuiz(quizResponse.data.quiz);
      } catch (err) {
        setError(
          err.response?.data?.error || "Failed to fetch quiz statistics"
        );
      }
    };
    fetchStats();
  }, [id, token]);

  if (!stats || !quiz) return <div className="p-4 text-center">Loading...</div>;

  return (
    <>
      <Header />
      <h1>Inside quiz stat return</h1>
      <div className="container max-w-2xl p-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          {quiz.question}
        </h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <p className="text-gray-600">
          By {quiz.authorUsername} |{" "}
          {quiz.isActive
            ? `Ends: ${new Date(quiz.deadline).toLocaleString()}`
            : `Ended: ${new Date(quiz.deadline).toLocaleString()}`}
        </p>
        <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Quiz Statistics
          </h2>
          <p className="text-gray-700">
            Total Participants: {stats.totalParticipants}
          </p>
          <p className="text-gray-700">
            Correct Answers: {stats.correctAnswers}
          </p>
          <p className="text-gray-700">
            Percentage Correct: {stats.percentageCorrect}%
          </p>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">
            Answer Distribution
          </h3>
          {Object.entries(stats.answerDistribution).map(
            ([option, count], index) => (
              <p key={index} className="text-gray-700">
                {option}: {count} votes
              </p>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default QuizStats;
