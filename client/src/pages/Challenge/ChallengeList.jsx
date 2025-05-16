import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/common/NewPageHeader";
import Chatbot from './Chatbot';

const ChallengeList = () => {
  const { user, isAuthenticated, token } = useContext(AuthContext);
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/challenges",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setChallenges(response.data.challenges); // Backend returns { challenges, _links }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load challenges");
        console.error(err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchChallenges();
    } else {
      setError("Please log in to view challenges");
      setIsLoading(false);
    }
  }, [token]);

  const handleDelete = async (challengeId) => {
    if (!window.confirm("Are you sure you want to delete this challenge?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/challenges/${challengeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setChallenges(challenges.filter((c) => c.challengeId !== challengeId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete challenge");
      console.error(err.response?.data || err.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <>
      <Header />
      <motion.div
        className="container relative min-h-screen px-4 py-12 mx-auto overflow-hidden bg-gradient-to-b from-white to-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/light-wool.png')] opacity-10 animate-pulse"></div>
        <div className="relative z-10 flex items-center justify-between mb-8">
          <motion.h1
            className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400"
            style={{ textShadow: "0 0 10px rgba(0, 0, 255, 0.2)" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Cooking Challenges
          </motion.h1>
          {isAuthenticated && (
            <motion.button
              onClick={() => navigate("/create-challenge")}
              className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
              style={{ boxShadow: "0 0 10px rgba(0, 0, 255, 0.2)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Create New Challenge</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              className="relative z-10 px-4 py-3 mb-6 font-medium text-center text-red-500 border border-red-300 rounded-lg bg-red-100/50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {isLoading ? (
          <motion.div
            className="relative z-10 flex items-center justify-center text-center text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              className="w-8 h-8 mr-3 text-blue-500 animate-spin"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
              />
            </svg>
            Loading challenges...
          </motion.div>
        ) : challenges.length === 0 ? (
          <motion.div
            className="relative z-10 px-4 py-6 font-medium text-center text-gray-600 bg-white border border-gray-200 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No challenges found. Create one to get started!
          </motion.div>
        ) : (
          <motion.div
            className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            <AnimatePresence>
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.challengeId}
                  className="overflow-hidden transition-all duration-300 bg-white border-2 border-blue-300 rounded-xl hover:border-blue-500"
                  variants={cardVariants}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 0 15px rgba(0,0,255,0.2)",
                  }}
                  layout
                >
                  {challenge.photoUrl ? (
                    <div className="relative">
                      <img
                        src={challenge.photoUrl}
                        alt={challenge.title}
                        className="object-cover w-full h-56"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                      <p className="absolute px-2 py-1 text-sm font-medium text-white rounded bottom-2 left-3 bg-black/50">
                        {challenge.theme}
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src="https://via.placeholder.com/150?text=No+Image"
                        alt="No image available"
                        className="object-cover w-full h-56"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                      <p className="absolute px-2 py-1 text-sm font-medium text-white rounded bottom-2 left-3 bg-black/50">
                        {challenge.theme}
                      </p>
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">
                      {challenge.title}
                    </h2>
                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                      {challenge.description}
                    </p>
                    <div className="mb-4 text-sm text-gray-500">
                      <p>
                        <span className="font-medium text-gray-700">
                          Start:
                        </span>{" "}
                        {new Date(challenge.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">End:</span>{" "}
                        {new Date(challenge.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <motion.button
                        onClick={() =>
                          navigate(`/start-challenge/${challenge.challengeId}`)
                        }
                        className="flex-1 px-4 py-2 font-semibold text-white transition-all duration-300 rounded-full shadow-md bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 10px rgba(0, 0, 255, 0.2)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Start Challenge
                      </motion.button>
                      {isAuthenticated && challenge.createdBy === user?.id && (
                        <div className="flex gap-3">
                          <motion.button
                            onClick={() =>
                              navigate(
                                `/edit-challenge/${challenge.challengeId}`
                              )
                            }
                            className="px-4 py-2 font-semibold text-white transition-all duration-300 rounded-full shadow-md bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 0 10px rgba(255, 165, 0, 0.2)",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(challenge.challengeId)}
                            className="px-4 py-2 font-semibold text-white transition-all duration-300 rounded-full shadow-md bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500"
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 0 10px rgba(255, 0, 0, 0.2)",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Delete
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        <Chatbot />
      </motion.div>
    </>
  );
};

export default ChallengeList;
