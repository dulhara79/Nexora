import React from "react";
import { motion } from "framer-motion";

function FeedPost({ post, currentUser, isDarkMode }) {
  return (
    <motion.div 
      className={`p-5 shadow-lg rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={post.user.profilePhotoUrl || '/api/placeholder/40/40'} 
            alt={post.user.name} 
            className="w-10 h-10 rounded-full" 
          />
          <div className="ml-3">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{post.user.name}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>@{post.user.username}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default FeedPost;