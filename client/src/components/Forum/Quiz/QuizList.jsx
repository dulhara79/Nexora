import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Header from "../../common/NewPageHeader";

const QuizList = () => {
  const { token, user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/quizzes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizzes(response.data.quizzes);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch quizzes");
      }
    };
    fetchQuizzes();
  }, [token]);

  return (
    <>
      <Header />
      <div className="container max-w-4xl p-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Cooking Trivia Quizzes
        </h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <Link
          to="/forum/quizzes/create"
          className="inline-block px-6 py-3 mb-6 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Create Quiz
        </Link>
        <div className="grid gap-6 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-6 transition bg-white border rounded-lg shadow-md hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-700">
                {quiz.question}
              </h2>
              <p className="text-gray-600">
                By {quiz.authorUsername} | Ends:{" "}
                {new Date(quiz.deadline).toLocaleString()}
              </p>
              <p className="text-gray-600">
                Upvotes: {quiz.upvoteUserIds?.length || 0}
              </p>
              <div className="flex mt-4 space-x-4">
                <Link
                  to={`/forum/quizzes/${quiz.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Quiz
                </Link>
                {quiz.authorId === user?.id && (
                  <Link
                    to={`/forum/quizzes/${quiz.id}/stats`}
                    className="text-green-600 hover:underline"
                  >
                    View Stats
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuizList;