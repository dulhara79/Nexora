import React from 'react';
import { motion } from 'framer-motion';

const PersonalInfoSection = ({ userData, handleInputChange, isDarkMode }) => {
  const inputVariants = {
    focus: { 
      scale: 1.01,
      boxShadow: isDarkMode 
        ? '0 4px 12px rgba(79, 70, 229, 0.2)' 
        : '0 4px 12px rgba(99, 102, 241, 0.15)' 
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg transition-all duration-300 outline-none ${
    isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-500' 
      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-indigo-500'
  } border`;

  const labelClasses = "block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300";

  return (
    <div>
      <motion.h2 
        className="mb-6 text-xl font-bold"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Personal Information
      </motion.h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <label htmlFor="name" className={labelClasses}>Full Name</label>
          <motion.input
            whileFocus="focus"
            variants={inputVariants}
            type="text"
            id="name"
            name="name"
            value={userData.name || ''}
            onChange={handleInputChange}
            placeholder="Your full name"
            className={inputClasses}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label htmlFor="username" className={labelClasses}>Username</label>
          <motion.input
            whileFocus="focus"
            variants={inputVariants}
            type="text"
            id="username"
            name="username"
            value={userData.username || ''}
            onChange={handleInputChange}
            placeholder="Your username"
            className={inputClasses}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <label htmlFor="email" className={labelClasses}>Email Address</label>
          <motion.input
            whileFocus="focus"
            variants={inputVariants}
            type="email"
            id="email"
            name="email"
            value={userData.email || ''}
            onChange={handleInputChange}
            placeholder="Your email address"
            className={inputClasses}
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <label htmlFor="about" className={labelClasses}>About</label>
          <motion.textarea
            whileFocus="focus"
            variants={inputVariants}
            id="about"
            name="about"
            value={userData.about || ''}
            onChange={handleInputChange}
            placeholder="Tell people a little about yourself..."
            rows="5"
            className={inputClasses}
          />
          <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Brief description for your profile. This will be displayed publicly.
          </p>
        </motion.div>
      </div>

      <motion.div 
        className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className={`ml-3 text-sm ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
            Your profile information helps others recognize you and connect with you on the platform.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalInfoSection;