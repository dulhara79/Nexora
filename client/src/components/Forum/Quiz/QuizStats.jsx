import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Header from "../../common/NewPageHeader";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

console.log("QuizStats component loaded");

const QuizStats = () => {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchStats();
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [id, token, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
        <Header />
        <div className="container max-w-4xl p-4 mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-orange-100 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-64 bg-orange-100 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
        <Header />
        <div className="container max-w-4xl p-4 mx-auto">
          <div className="p-6 border-l-4 border-red-500 rounded-lg bg-red-50">
            <p className="text-red-700">{error}</p>
            <Link
              to="/forum/quizzes"
              className="inline-block px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Back to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || !quiz) {
    return null;
  }

  // Process answer distributions for each question
  const answerDistributionData = stats.answerDistributions.map(
    (dist, index) => {
      return Object.entries(dist).map(([option, count]) => ({
        name: option,
        [`Question ${index + 1}`]: count,
      }));
    }
  );

  // Aggregate data for grouped bar chart
  const groupedDistributionData = [];
  stats.answerDistributions.forEach((dist, qIndex) => {
    Object.entries(dist).forEach(([option, count]) => {
      let existing = groupedDistributionData.find((d) => d.name === option);
      if (!existing) {
        existing = { name: option };
        groupedDistributionData.push(existing);
      }
      existing[`Question ${qIndex + 1}`] = count;
    });
  });

  // Correct vs Incorrect data
  const totalPossibleAnswers = stats.totalParticipants * quiz.questions.length;
  const correctIncorrectData = [
    { name: "Correct", value: stats.totalCorrectAnswers },
    {
      name: "Incorrect",
      value: totalPossibleAnswers - stats.totalCorrectAnswers,
    },
  ];

  const COLORS = ["#FF8811", "#F97316", "#F59E0B", "#FBBF24", "#FCD34D"];
  const QUESTION_COLORS = ["#FF8811", "#F59E0B", "#FBBF24"];

  return (
    <>
      <Header />
      <div className="min-h-screen py-8 bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="container max-w-6xl p-4 mx-auto">
          {/* Quiz Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 overflow-hidden bg-white shadow-lg rounded-xl"
          >
            <div className="p-6">
              <h1 className="text-3xl font-bold text-orange-700">
                {quiz.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                <span>By {quiz.authorUsername}</span>
                <span>•</span>
                <span>Category: {quiz.category}</span>
                <span>•</span>
                <span>Difficulty: {quiz.difficulty}</span>
                <span>•</span>
                <span>
                  {quiz.isActive ? "Active" : "Ended"}:{" "}
                  {new Date(quiz.deadline).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{quiz.description}</p>
              <Link
                to={`/forum/quizzes/${quiz.id}`}
                className="inline-block mt-4 text-blue-600 hover:text-blue-800"
              >
                View Quiz Details
              </Link>
            </div>
          </motion.div>

          {/* Stats Summary Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center p-6 text-center bg-white shadow-md rounded-xl"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-3 bg-orange-100 rounded-full">
                <span className="text-2xl text-orange-600">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">
                Total Participants
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {stats.totalParticipants}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center p-6 text-center bg-white shadow-md rounded-xl"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-3 bg-green-100 rounded-full">
                <span className="text-2xl text-green-600">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">
                Total Correct Answers
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalCorrectAnswers}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center p-6 text-center bg-white shadow-md rounded-xl"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-3 bg-blue-100 rounded-full">
                <span className="text-2xl text-blue-600">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">
                Accuracy Rate
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.percentageCorrect}%
              </p>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Answer Distribution Chart */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white shadow-lg rounded-xl"
            >
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Answer Distribution by Question
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={groupedDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {quiz.questions.map((_, index) => (
                      <Bar
                        key={index}
                        dataKey={`Question ${index + 1}`}
                        fill={QUESTION_COLORS[index % QUESTION_COLORS.length]}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Correct vs Incorrect Chart */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white shadow-lg rounded-xl"
            >
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Correct vs Incorrect Answers
              </h2>
              <div className="flex items-center justify-center h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={correctIncorrectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {correctIncorrectData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Accuracy Gauge */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-6 mt-8 bg-white shadow-lg rounded-xl"
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Overall Accuracy
            </h2>
            <div className="flex items-center justify-center h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="100%"
                  barSize={10}
                  data={[
                    {
                      name: "Accuracy",
                      uv: parseFloat(stats.percentageCorrect),
                    },
                    {
                      name: "Remaining",
                      uv: 100 - parseFloat(stats.percentageCorrect),
                    },
                  ]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    minAngle={15}
                    label={{
                      position: "center",
                      fill: "#FF8811",
                      fontSize: "24px",
                      formatter: (value) => `${value}%`,
                    }}
                    background
                    clockWise
                    dataKey="uv"
                    cornerRadius="50%"
                    fill="#FF8811"
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Question-Specific Distributions */}
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Detailed Answer Distributions
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {quiz.questions.map((question, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * qIndex }}
                  className="p-6 bg-white shadow-lg rounded-xl"
                >
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Question {qIndex + 1}: {question.question}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={answerDistributionData[qIndex]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey={`Question ${qIndex + 1}`}
                          fill={
                            QUESTION_COLORS[qIndex % QUESTION_COLORS.length]
                          }
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizStats;
