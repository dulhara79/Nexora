import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const ChallengeList = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/challenges', {
          withCredentials: true,
        });
        setChallenges(response.data);
      } catch (err) {
        setError('Failed to load challenges');
        console.error(err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const handleDelete = async (challengeId) => {
    if (!window.confirm('Are you sure you want to delete this challenge?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/challenges/${challengeId}`, {
        withCredentials: true,
      });
      setChallenges(challenges.filter((c) => c.challengeId !== challengeId));
    } catch (err) {
      setError('Failed to delete challenge');
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
    <motion.div
      className="container mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Cooking Challenges
        </motion.h1>
        <motion.button
          onClick={() => navigate('/create-challenge')}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Create New Challenge</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500 mb-6 text-center font-medium bg-red-50 py-3 px-4 rounded-lg shadow-sm"
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
          className="text-center text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading challenges...
        </motion.div>
      ) : challenges.length === 0 ? (
        <motion.div
          className="text-center text-gray-600 font-medium bg-white py-6 px-4 rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No challenges found. Create one to get started!
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          <AnimatePresence>
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.challengeId}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100"
                variants={cardVariants}
                whileHover={{ y: -5 }}
                layout
              >
                {challenge.photoUrl ? (
                  <div className="relative">
                    <img
                      src={challenge.photoUrl}
                      alt={challenge.title}
                      className="w-full h-56 object-cover rounded-t-xl"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-xl"></div>
                    <p className="absolute bottom-2 left-3 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                      {challenge.theme}
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src="https://via.placeholder.com/150?text=No+Image"
                      alt="No image available"
                      className="w-full h-56 object-cover rounded-t-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-xl"></div>
                    <p className="absolute bottom-2 left-3 text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                      {challenge.theme}
                    </p>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{challenge.title}</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{challenge.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>
                      <span className="font-medium">Start:</span>{' '}
                      {new Date(challenge.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">End:</span>{' '}
                      {new Date(challenge.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      onClick={() => navigate(`/challenge/${challenge.challengeId}`)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Challenge
                    </motion.button>
                    {challenge.createdBy === user?.id && (
                      <div className="flex gap-3">
                        <motion.button
                          onClick={() => navigate(`/edit-challenge/${challenge.challengeId}`)}
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(challenge.challengeId)}
                          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
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
    </motion.div>
  );
};

export default ChallengeList;