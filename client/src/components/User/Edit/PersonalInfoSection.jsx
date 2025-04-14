import React from 'react';
import { User, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const PersonalInfoSection = ({ userData, handleInputChange, isDarkMode }) => {
  const textClasses = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const inputClasses = isDarkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500';

  const inputVariants = {
    hover: { scale: 1.01, transition: { type: "spring", stiffness: 400, damping: 10 } }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Personal Information
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={inputVariants} whileHover="hover">
          <label className={`block mb-2 ${textClasses}`}>Name</label>
          <div className="relative">
            <User className={`absolute ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} left-3 top-3`} />
            <input
              type="text"
              name="name"
              value={userData.name || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 pl-10 border-2 rounded-lg focus:outline-none transition-all duration-300 ${inputClasses}`}
              placeholder="Your full name"
            />
          </div>
        </motion.div>
        
        <motion.div variants={inputVariants} whileHover="hover">
          <label className={`block mb-2 ${textClasses}`}>Username</label>
          <div className="relative">
            <User className={`absolute ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} left-3 top-3`} />
            <input
              type="text"
              name="username"
              value={userData.username || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 pl-10 border-2 rounded-lg focus:outline-none transition-all duration-300 ${inputClasses}`}
              placeholder="Choose a username"
            />
          </div>
        </motion.div>
      </div>
      
      <motion.div variants={inputVariants} whileHover="hover">
        <label className={`block mb-2 ${textClasses}`}>Email</label>
        <div className="relative">
          <Mail className={`absolute ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} left-3 top-3`} />
          <input
            type="email"
            name="email"
            value={userData.email || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 pl-10 border-2 rounded-lg focus:outline-none transition-all duration-300 ${inputClasses}`}
            placeholder="Your email address"
          />
        </div>
      </motion.div>
      
      <motion.div variants={inputVariants} whileHover="hover">
        <label className={`block mb-2 ${textClasses}`}>About Me</label>
        <textarea
          name="about"
          value={userData.about || ''}
          onChange={handleInputChange}
          rows="4"
          className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition-all duration-300 ${inputClasses}`}
          placeholder="Tell us about yourself"
        />
      </motion.div>
    </motion.div>
  );
};

export default PersonalInfoSection;