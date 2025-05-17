import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Users,
  Clock,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Share2,
  MessageSquare,
  BarChart2,
} from "lucide-react";

// Mock Header component - you would use your actual Header
const Header = () => (
  <div className="p-4 text-white bg-gradient-to-r from-blue-600 to-purple-600">
    <h1 className="text-xl font-bold">Nexora</h1>
  </div>
);

const QuizResult = ({ quiz }) => {
  const [showParticipants, setShowParticipants] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [comment, setComment] = useState("");

  // Mock quiz data for demonstration purposes
  const mockQuiz = quiz || {
    id: "123",
    question:
      "What technique is best for cooking a perfect steak to medium-rare?",
    options: ["Boiling", "Sous vide then sear", "Microwave", "Deep frying"],
    correctAnswer: "Sous vide then sear",
    authorUsername: "ChefMaster",
    authorAvatar: "/api/placeholder/40/40",
    deadline: "2025-05-15T18:00:00Z",
    difficulty: "medium",
    category: "techniques",
    participantScores: {
      user1: 1,
      user2: 0,
      user3: 1,
      user4: 1,
      user5: 0,
      user6: 1,
      user7: 0,
      user8: 1,
      user9: 1,
      user10: 1,
      user11: 0,
      user12: 1,
    },
    participantAnswers: {
      user1: "Sous vide then sear",
      user2: "Boiling",
      user3: "Sous vide then sear",
      user4: "Sous vide then sear",
      user5: "Deep frying",
      user6: "Sous vide then sear",
      user7: "Microwave",
      user8: "Sous vide then sear",
      user9: "Sous vide then sear",
      user10: "Sous vide then sear",
      user11: "Deep frying",
      user12: "Sous vide then sear",
    },
    participants: [
      {
        id: "user1",
        username: "SousVideFan",
        avatar: "/api/placeholder/40/40",
        isCorrect: true,
      },
      {
        id: "user2",
        username: "BakingQueen",
        avatar: "/api/placeholder/40/40",
        isCorrect: false,
      },
      {
        id: "user3",
        username: "CulinaryStudent",
        avatar: "/api/placeholder/40/40",
        isCorrect: true,
      },
      {
        id: "user4",
        username: "PastryChef",
        avatar: "/api/placeholder/40/40",
        isCorrect: true,
      },
      {
        id: "user5",
        username: "HomeCook",
        avatar: "/api/placeholder/40/40",
        isCorrect: false,
      },
      {
        id: "user6",
        username: "FoodLover",
        avatar: "/api/placeholder/40/40",
        isCorrect: true,
      },
      {
        id: "user7",
        username: "GourmetTaster",
        avatar: "/api/placeholder/40/40",
        isCorrect: false,
      },
      {
        id: "user8",
        username: "CookbookAuthor",
        avatar: "/api/placeholder/40/40",
        isCorrect: true,
      },
      {
        id: "user9",
        username: "MeatMaster",
        avatar: "/api/placeholder/40/40",
        isCorrect: true,
      },
      {
        id: "user10",
        username: "GrillKing",
        avatar: "/api/placeholder/40/40",
        isCorrect: true,
      },
      {
        id: "user11",
        username: "NoviceCook",
        avatar: "/api/placeholder/40/40",
        isCorrect: false,
      },
      {
        id: "user12",
        username: "CulinaryExpert",
        avatar: "/api/placeholder/40/40",
        isCorrect: true,
      },
    ],
    comments: [
      {
        id: 1,
        user: "ChefMaster",
        avatar: "/api/placeholder/40/40",
        text: "Thanks for participating in my quiz! I hope you all learned something about steak preparation.",
        time: "2 hours ago",
      },
      {
        id: 2,
        user: "SousVideFan",
        avatar: "/api/placeholder/40/40",
        text: "Sous vide is definitely the way to go for consistent results every time.",
        time: "1 hour ago",
      },
      {
        id: 3,
        user: "MeatMaster",
        avatar: "/api/placeholder/40/40",
        text: "I've been cooking steaks professionally for years and completely agree with this result.",
        time: "45 minutes ago",
      },
    ],
    explanation:
      "Sous vide cooking followed by a quick sear provides the most precise temperature control throughout the steak, resulting in perfect edge-to-edge medium-rare cooking with a delicious crust.",
  };

  const calculateResults = () => {
    const totalParticipants = Object.keys(mockQuiz.participantScores).length;
    const correctAnswers = Object.values(mockQuiz.participantScores).filter(
      (score) => score === 1
    ).length;
    const percentageCorrect =
      totalParticipants > 0
        ? ((correctAnswers / totalParticipants) * 100).toFixed(0)
        : 0;
    const answerDistribution = {};
    mockQuiz.options.forEach((option) => {
      answerDistribution[option] = Object.values(
        mockQuiz.participantAnswers
      ).filter((ans) => ans === option).length;
    });
    return {
      totalParticipants,
      correctAnswers,
      incorrectAnswers: totalParticipants - correctAnswers,
      percentageCorrect,
      answerDistribution,
    };
  };

  const {
    totalParticipants,
    correctAnswers,
    incorrectAnswers,
    percentageCorrect,
    answerDistribution,
  } = calculateResults();

  // Find the most popular wrong answer
  const getPopularWrongAnswer = () => {
    const filteredAnswers = { ...answerDistribution };
    delete filteredAnswers[mockQuiz.correctAnswer];

    return Object.entries(filteredAnswers).reduce(
      (max, [answer, count]) => (count > max.count ? { answer, count } : max),
      { answer: "", count: 0 }
    );
  };

  const popularWrongAnswer = getPopularWrongAnswer();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const chartVariants = {
    hidden: { width: 0 },
    visible: (width) => ({
      width: `${width}%`,
      transition: { duration: 1, ease: "easeOut" },
    }),
  };

  // Create a color map for the options
  const getOptionColor = (option) => {
    if (option === mockQuiz.correctAnswer) {
      return "bg-green-500";
    }
    return "bg-blue-400";
  };

  // Sort options by popularity for display
  const sortedOptions = [...mockQuiz.options].sort(
    (a, b) => answerDistribution[b] - answerDistribution[a]
  );

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Handle adding a new comment
  const handleAddComment = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    alert(`Comment submitted: ${comment}`);
    setComment("");
  };

  // Trigger animation complete after initial animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />

      <div className="max-w-4xl p-4 mx-auto md:p-6 lg:p-8">
        {/* Quiz Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Quiz Metadata */}
          <div className="flex items-center mb-2 space-x-2 text-sm text-gray-600">
            <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
              {mockQuiz.category.charAt(0).toUpperCase() +
                mockQuiz.category.slice(1)}
            </span>
            <span className="inline-flex items-center">
              <Clock size={14} className="mr-1" />
              Ended: {formatDate(mockQuiz.deadline)}
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                mockQuiz.difficulty === "easy"
                  ? "bg-green-100 text-green-800"
                  : mockQuiz.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {mockQuiz.difficulty.charAt(0).toUpperCase() +
                mockQuiz.difficulty.slice(1)}
            </span>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl lg:text-4xl">
            {mockQuiz.question}
          </h1>

          <div className="flex items-center space-x-2">
            <img
              src={mockQuiz.authorAvatar}
              alt={mockQuiz.authorUsername}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-gray-700">
              Created by {mockQuiz.authorUsername}
            </span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Stats Summary */}
          <motion.div
            className="md:col-span-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="p-6 bg-white shadow-md rounded-xl"
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Quiz Summary
              </h2>

              <div className="space-y-4">
                {/* Participants Count */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Participants</p>
                    <p className="text-xl font-semibold">{totalParticipants}</p>
                  </div>
                </div>

                {/* Success Rate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-lg font-bold text-gray-800">
                      {percentageCorrect}%
                    </p>
                  </div>
                  <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentageCorrect}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Correct vs Incorrect */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="p-3 text-center rounded-lg bg-green-50">
                    <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 bg-green-100 rounded-full">
                      <Check size={16} className="text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Correct</p>
                    <p className="text-lg font-semibold text-green-600">
                      {correctAnswers}
                    </p>
                  </div>

                  <div className="p-3 text-center rounded-lg bg-red-50">
                    <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 bg-red-100 rounded-full">
                      <X size={16} className="text-red-600" />
                    </div>
                    <p className="text-xs text-gray-600">Incorrect</p>
                    <p className="text-lg font-semibold text-red-600">
                      {incorrectAnswers}
                    </p>
                  </div>
                </div>

                {/* Most Common Mistake */}
                {popularWrongAnswer.count > 0 && (
                  <div className="p-3 mt-4 border border-blue-100 rounded-lg bg-blue-50">
                    <p className="text-sm font-medium text-gray-700">
                      Most Common Wrong Answer:
                    </p>
                    <p className="text-blue-800">{popularWrongAnswer.answer}</p>
                    <p className="text-xs text-gray-600">
                      {popularWrongAnswer.count} participant
                      {popularWrongAnswer.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Share Section */}
            <motion.div
              variants={itemVariants}
              className="p-4 mt-4 bg-white shadow-md rounded-xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700">Share Results</h3>
                <button className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  <Share2 size={14} className="mr-1" /> Share
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Detailed Results */}
          <motion.div
            className="md:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Answer Distribution Chart */}
            <motion.div
              variants={itemVariants}
              className="p-6 mb-6 bg-white shadow-md rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Answer Distribution
                </h2>
                <div className="flex items-center text-sm text-gray-600">
                  <BarChart2 size={16} className="mr-1" /> {totalParticipants}{" "}
                  responses
                </div>
              </div>

              <div className="space-y-4">
                {sortedOptions.map((option) => {
                  const count = answerDistribution[option];
                  const percentage = Math.round(
                    (count / totalParticipants) * 100
                  );
                  const isCorrect = option === mockQuiz.correctAnswer;

                  return (
                    <div key={option} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center max-w-md space-x-2">
                          {isCorrect && (
                            <Check
                              size={16}
                              className="flex-shrink-0 text-green-500"
                            />
                          )}
                          <p
                            className={`text-sm ${
                              isCorrect ? "font-medium" : ""
                            }`}
                          >
                            {option}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {percentage}%
                        </span>
                      </div>

                      <div className="w-full h-5 bg-gray-100 rounded-md">
                        <motion.div
                          custom={percentage}
                          variants={chartVariants}
                          initial="hidden"
                          animate="visible"
                          className={`h-full rounded-md ${
                            isCorrect ? "bg-green-500" : "bg-blue-400"
                          } flex items-center justify-start pl-2`}
                        >
                          {percentage > 15 && (
                            <span className="text-xs font-medium text-white">
                              {count} vote{count !== 1 ? "s" : ""}
                            </span>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Correct Answer Explanation */}
            <motion.div
              variants={itemVariants}
              className="p-6 mb-6 border border-green-200 shadow-md bg-gradient-to-r from-green-50 to-green-100 rounded-xl"
            >
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-200 rounded-full">
                  <Award size={20} className="text-green-700" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-800">
                    Correct Answer: {mockQuiz.correctAnswer}
                  </h3>
                  <p className="mt-2 text-green-700">
                    {mockQuiz.explanation ||
                      "This is the correct answer based on culinary best practices."}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Participants Section */}
            <motion.div
              variants={itemVariants}
              className="overflow-hidden bg-white shadow-md rounded-xl"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <h3 className="flex items-center font-medium text-gray-700">
                  <Users size={18} className="mr-2" />
                  Participants ({totalParticipants})
                </h3>
                {showParticipants ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </div>

              {showParticipants && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 pt-0 border-t border-gray-100"
                >
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {mockQuiz.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className={`flex items-center p-2 rounded-lg ${
                          participant.isCorrect ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        <img
                          src={participant.avatar}
                          alt={participant.username}
                          className="w-8 h-8 mr-2 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium truncate">
                            {participant.username}
                          </p>
                          <p
                            className={`text-xs ${
                              participant.isCorrect
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {participant.isCorrect ? "Correct" : "Incorrect"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Comments Section */}
            <motion.div
              variants={itemVariants}
              className="mt-6 overflow-hidden bg-white shadow-md rounded-xl"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              >
                <h3 className="flex items-center font-medium text-gray-700">
                  <MessageSquare size={18} className="mr-2" />
                  Discussion ({mockQuiz.comments.length})
                </h3>
                {showComments ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </div>

              {showComments && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-4">
                    <form onSubmit={handleAddComment} className="mb-6">
                      <div className="flex items-start gap-3">
                        <img
                          src="/api/placeholder/40/40"
                          alt="Your avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-grow">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add to the discussion..."
                            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                              disabled={!comment.trim()}
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>

                    <div className="space-y-4">
                      {mockQuiz.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <img
                            src={comment.avatar}
                            alt={comment.user}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium">
                                {comment.user}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {comment.time}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-700">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Back to Quizzes
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizResult;
