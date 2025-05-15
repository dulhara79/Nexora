import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/NewPageHeader'

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch challenge details
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/challenges/${challengeId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setChallenge(response.data.challenge); // Backend returns { challenge, _links }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load challenge details');
        console.error(err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchChallenge();
    } else {
      setError('Please log in to view challenge details');
      setIsLoading(false);
    }
  }, [challengeId, token]);

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
    <>
    <Header />
    <motion.div
      className="container relative max-w-4xl min-h-screen px-4 py-8 mx-auto overflow-hidden bg-gradient-to-b from-white to-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/light-wool.png')] opacity-10 animate-pulse"></div>
      </div>

      <motion.button
        onClick={() => navigate('/challenges')}
        className="relative z-10 flex items-center mb-6 font-semibold text-blue-500 transition-colors duration-300 hover:text-blue-600"
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
          <svg className="w-8 h-8 mr-3 text-blue-500 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          </svg>
          Loading challenge details...
        </motion.div>
      ) : !challenge ? (
        <motion.div
          className="relative z-10 px-4 py-6 font-medium text-center text-gray-600 bg-white border border-gray-200 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Challenge not found
        </motion.div>
      ) : (
        <div className="relative z-10 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md">
          {challenge.photoUrl && (
            <motion.img
              src={challenge.photoUrl}
              alt={challenge.title}
              className="object-cover w-full h-64"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
              }}
              variants={itemVariants}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          <div className="p-6">
            <motion.h1 className="mb-2 text-3xl font-bold text-gray-800" variants={itemVariants}>
              {challenge.title}
            </motion.h1>
            <motion.p className="mb-4 text-lg text-gray-600" variants={itemVariants}>
              Theme: {challenge.theme}
            </motion.p>
            <motion.p className="mb-4 text-gray-700" variants={itemVariants}>
              {challenge.description}
            </motion.p>
            <motion.div className="mb-6 text-gray-600" variants={itemVariants}>
              <p>Start Date: {new Date(challenge.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(challenge.endDate).toLocaleDateString()}</p>
            </motion.div>
            <motion.button
              onClick={() => navigate(`/start-challenge/${challenge.challengeId}`)}
              className="px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 0, 255, 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              Start Challenge
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
    </>
  );
};

export default ChallengeDetail;