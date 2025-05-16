import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, MessageCircle, Edit, Share2, Bookmark, UserPlus, Settings, Search } from 'lucide-react';

const QuickActions = ({ userId, isDarkMode }) => {
  const actions = [
    { icon: <Search />, label: "Search", link: "/search", color: "from-blue-400 to-blue-600" },
    { icon: <Camera />, label: "New Post", color: "from-blue-400 to-blue-600" },
    { icon: <MessageCircle />, label: "Message", color: "from-purple-400 to-purple-600" },
    { icon: <Edit />, label: "Edit", link: `/edit/${userId}`, color: "from-indigo-400 to-indigo-600" },
    { icon: <Bookmark />, label: "Save", color: "from-green-400 to-green-600" },
    { icon: <UserPlus />, label: "Invite", color: "from-pink-400 to-pink-600" },
    { icon: <Settings />, label: "Settings", color: "from-gray-400 to-gray-600" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`p-6 shadow-xl rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <motion.h3 
        variants={itemVariants}
        className={`mb-4 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
      >
        Quick Actions
      </motion.h3>
      
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-3 gap-3"
      >
        {actions.map((action, index) => {
          const ActionButton = (
            <motion.button
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center justify-center p-4 overflow-hidden transition-all duration-300 rounded-xl ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-blue-50'
              }`}
            >
              <motion.div
                className={`absolute inset-0 opacity-0 bg-gradient-to-br ${action.color} group-hover:opacity-10 group-hover:bg-opacity-20`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
              />
              
              <motion.div
                className={`flex items-center justify-center p-3 mb-2 rounded-full ${
                  isDarkMode ? 'bg-gray-800 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                }`}
                whileHover={{ 
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {action.icon}
              </motion.div>
              
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {action.label}
              </span>
            </motion.button>
          );
          
          return action.link ? (
            <Link key={index} to={action.link}>
              {ActionButton}
            </Link>
          ) : (
            ActionButton
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default QuickActions;