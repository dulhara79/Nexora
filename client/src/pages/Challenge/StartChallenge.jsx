import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/NewPageHeader';

const StartChallenge = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);

  // Fetch challenge details
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/challenges/${challengeId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setChallenge(response.data.challenge);
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

  // Check if challenge has started (using current date: May 17, 2025, 01:49 AM +0530)
  const currentDate = new Date('2025-05-17T01:49:00+0530');
  const isChallengeStarted = challenge && new Date(challenge.startDate) <= currentDate;
  console.log('Start Date:', new Date(challenge?.startDate), 'Current Date:', currentDate, 'Is Started:', isChallengeStarted);

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

  const handleJoinClick = () => {
    if (!isChallengeStarted) {
      setShowJoinPopup(true);
    } else {
      navigate(`/submit/${challenge.challengeId}`);
    }
  };

  const handleViewClick = () => {
    setShowViewPopup(true);
  };

  const closePopup = (type) => {
    if (type === 'join') setShowJoinPopup(false);
    if (type === 'view') setShowViewPopup(false);
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
              <div className="relative h-64">
                <motion.img
                  src={challenge.photoUrl}
                  alt={challenge.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                  variants={itemVariants}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 to-transparent">
                  <motion.h1 className="text-4xl font-bold text-center text-white" variants={itemVariants}>
                    {challenge.title}
                  </motion.h1>
                </div>
              </div>
            )}

            <div className="p-6">
              <motion.div className="mb-6" variants={itemVariants}>
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">Challenge Theme</h2>
                <p className="text-gray-600">{challenge.theme}</p>
              </motion.div>
              <motion.div className="mb-6" variants={itemVariants}>
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">Description</h2>
                <p className="text-gray-700">{challenge.description}</p>
              </motion.div>
              <motion.div className="mb-6" variants={itemVariants}>
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">Dates</h2>
                <p className="text-gray-600">
                  Start: {new Date(challenge.startDate).toLocaleDateString()} <br />
                  End: {new Date(challenge.endDate).toLocaleDateString()}
                </p>
              </motion.div>
              <motion.div className="mb-6" variants={itemVariants}>
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">Venue</h2>
                <p className="text-gray-600">Online Event</p>
              </motion.div>
              <motion.div className="mb-6" variants={itemVariants}>
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">Participant Limit</h2>
                <p className="text-gray-600">Unlimited</p>
              </motion.div>
              <motion.div className="mb-6" variants={itemVariants}>
                <h2 className="mb-2 text-2xl font-semibold text-gray-800">Guidelines</h2>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Use at least one grain and one protein.</li>
                  <li>Include a homemade dressing.</li>
                  <li>Submit a photo of your salad with a brief description.</li>
                </ul>
              </motion.div>
              <motion.div className="flex gap-4" variants={itemVariants}>
                <motion.button
                  onClick={handleJoinClick}
                  className="flex-1 px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Challenge
                </motion.button>
                <motion.button
                  onClick={handleViewClick}
                  className="flex-1 px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Submissions
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Join Challenge Popup */}
      <AnimatePresence>
        {showJoinPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              style={{
                background: '#ffffff',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
                textAlign: 'center',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <h2 style={{ color: '#3b82f6', fontSize: '1.5rem', marginBottom: '16px' }}>
                Notice
              </h2>
              <p style={{ color: '#1f2937', marginBottom: '24px' }}>
                Challenge not started yet. Please wait until the start date: {new Date(challenge.startDate).toLocaleDateString()}.
              </p>
              <motion.button
                onClick={() => closePopup('join')}
                style={{
                  background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: 'none',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Submissions Popup */}
      <AnimatePresence>
        {showViewPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              style={{
                background: '#ffffff',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
                textAlign: 'center',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <h2 style={{ color: '#3b82f6', fontSize: '1.5rem', marginBottom: '16px' }}>
                Notice
              </h2>
              <p style={{ color: '#1f2937', marginBottom: '24px' }}>
                There are no submissions yet.
              </p>
              <motion.button
                onClick={() => closePopup('view')}
                style={{
                  background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: 'none',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StartChallenge;