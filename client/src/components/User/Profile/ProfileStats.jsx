import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, UserPlus } from 'lucide-react';

const ProfileStats = ({ profileUser, isDarkMode }) => {
  if (!profileUser) {
    return <div className="p-4 text-center text-gray-500">Loading profile stats...</div>;
  }

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5
      }
    })
  };
  
  const stats = [
    {
      icon: <FileText className="w-5 h-5" />,
      count: profileUser.posts?.length || 0,
      label: "Posts",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Users className="w-5 h-5" />,
      count: profileUser.followers?.length || 0,
      label: "Followers",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      count: profileUser.following?.length || 0,
      label: "Following",
      color: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-3 gap-4 p-6 mt-8 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          custom={index}
          variants={statsVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="relative flex flex-col items-center justify-center p-4 overflow-hidden transition-all duration-300 rounded-lg cursor-pointer group"
        >
          <motion.div
            className={`absolute inset-0 opacity-0 bg-gradient-to-br ${stat.color} group-hover:opacity-10 rounded-lg transition-opacity duration-300`}
          />
          
          <div className={`flex items-center justify-center p-3 mb-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <motion.div
              className={`text-${stat.color.split('-')[1]}-500`}
            >
              {stat.icon}
            </motion.div>
          </div>
          
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              delay: 0.2 + index * 0.1 
            }}
            className={`block text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
          >
            {stat.count}
          </motion.span>
          
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProfileStats;