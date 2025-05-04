import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, MessageSquare, UserPlus, Clock, MoreHorizontal } from 'lucide-react';

const RecentActivity = ({ isDarkMode }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const activities = [
    { 
      icon: <Heart className="w-4 h-4" />, 
      text: 'Liked your post', 
      user: 'Alex Morgan', 
      time: '5m ago',
      color: 'bg-pink-500' 
    },
    { 
      icon: <MessageSquare className="w-4 h-4" />, 
      text: 'Commented on your photo', 
      user: 'Jamie Wilson',
      time: '2h ago',
      color: 'bg-blue-500' 
    },
    { 
      icon: <UserPlus className="w-4 h-4" />, 
      text: 'Started following you', 
      user: 'Taylor Reed',
      time: '1d ago',
      color: 'bg-indigo-500' 
    },
    { 
      icon: <Heart className="w-4 h-4" />, 
      text: 'Liked your comment', 
      user: 'Casey Parker',
      time: '2d ago',
      color: 'bg-purple-500' 
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center">
          <Activity className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Recent Activity
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <MoreHorizontal className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </motion.button>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        className="space-y-4"
      >
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`flex items-start p-3 rounded-lg transition-colors duration-300 ${
              hoveredItem === index 
                ? (isDarkMode ? 'bg-gray-700' : 'bg-indigo-50') 
                : (isDarkMode ? 'bg-gray-800' : 'bg-white')
            } cursor-pointer`}
          >
            <div className={`flex items-center justify-center p-2 mr-3 text-white rounded-full ${activity.color}`}>
              {activity.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {activity.text}
                </p>
                <motion.div 
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: hoveredItem === index ? 1 : 0.5 }}
                  className="flex items-center"
                >
                  <Clock className={`w-3 h-3 mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activity.time}
                  </span>
                </motion.div>
              </div>
              
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {activity.user}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center justify-center w-full py-2 mt-4 text-sm font-medium transition-colors rounded-lg ${
          isDarkMode 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        View All Activity
      </motion.button>
    </motion.div>
  );
};

export default RecentActivity;