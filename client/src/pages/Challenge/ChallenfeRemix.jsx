import React from 'react';
import { motion } from 'framer-motion';

const RemixGallery = () => {
  const challenges = [
    { title: 'Spicy Taco', id: 1 },
    { title: 'Glow Soup', id: 2 },
    { title: 'Neon Pasta', id: 3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto bg-gradient-to-b from-white to-gray-100 min-h-screen"
    >
      <h1 className="text-3xl font-bold text-blue-400 mb-4 font-orbitron">Remix Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
            className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg border border-blue-300"
          >
            <h3 className="text-lg text-blue-500 mb-2">{challenge.title}</h3>
            <p className="text-gray-600 mb-4">Create your own version of this challenge!</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Remix
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RemixGallery;