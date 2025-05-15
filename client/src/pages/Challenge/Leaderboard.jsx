import React from 'react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const leaders = [
    { name: 'ChefMaster', score: 100 },
    { name: 'FoodNinja', score: 85 },
    { name: 'TasteBot', score: 70 },
  ];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto bg-gradient-to-b from-white to-gray-100 min-h-screen"
    >
      <h1 className="text-3xl font-bold text-blue-400 mb-4 font-orbitron">Leaderboard</h1>
      <div className="space-y-4">
        {leaders.map((leader, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg border border-blue-300 flex justify-between items-center"
          >
            <div className="flex items-center">
              <span className="text-blue-500 font-bold mr-4">{index + 1}</span>
              <span className="text-lg text-gray-800">{leader.name}</span>
            </div>
            <span className="text-blue-500 font-semibold">Score: {leader.score}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-gray-600">Leaderboard updates weekly!</p>
      </motion.div>
    </motion.div>
  );
};

export default Leaderboard;