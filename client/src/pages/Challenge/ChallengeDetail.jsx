import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  
  // Fetch challenge details
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/challenges/${challengeId}`, {
          withCredentials: true,
        });
        setChallenge(response.data);
      } catch (err) {
        setError(err.response?.data || 'Failed to load challenge details');
        console.error(err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [challengeId]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        onClick={() => navigate('/challenges')}
        className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center transition-colors duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Challenges
      </motion.button>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500 mb-4 text-center"
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
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading challenge details...
        </motion.div>
      ) : !challenge ? (
        <motion.div
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Challenge not found
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {challenge.photoUrl && (
            <motion.img
              src={`http://localhost:5000/${challenge.photoUrl}`}
              alt={challenge.title}
              className="w-full h-64 object-cover"
              variants={itemVariants}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          <div className="p-6">
            <motion.h1
              className="text-3xl font-bold text-gray-800 mb-2"
              variants={itemVariants}
            >
              {challenge.title}
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg mb-4"
              variants={itemVariants}
            >
              Theme: {challenge.theme}
            </motion.p>
            <motion.p
              className="text-gray-700 mb-4"
              variants={itemVariants}
            >
              {challenge.description}
            </motion.p>
            <motion.div
              className="text-gray-600 mb-6"
              variants={itemVariants}
            >
              <p>Start Date: {new Date(challenge.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(challenge.endDate).toLocaleDateString()}</p>
            </motion.div>
            <motion.button
              onClick={() => navigate(`/edit-challenge/${challenge.challengeId}`)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Challenge
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChallengeDetail;