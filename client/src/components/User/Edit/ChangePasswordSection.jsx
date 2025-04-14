import React from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ChangePasswordSection = ({ userData, handleInputChange, passwordError, isDarkMode }) => {
  const textClasses = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const inputClasses = isDarkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500';

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Change Password
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <label className={`block mb-2 ${textClasses}`}>Current Password</label>
          <div className="relative">
            <Lock className={`absolute ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} left-3 top-3`} />
            <input
              type="password"
              name="currentPassword"
              value={userData.currentPassword || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 pl-10 border-2 rounded-lg focus:outline-none transition-all duration-300 ${inputClasses}`}
              placeholder="Enter current password"
            />
          </div>
        </motion.div>
        <div></div>
        
        <motion.div 
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <label className={`block mb-2 ${textClasses}`}>New Password</label>
          <div className="relative">
            <Lock className={`absolute ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} left-3 top-3`} />
            <input
              type="password"
              name="password"
              value={userData.password || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 pl-10 border-2 rounded-lg focus:outline-none transition-all duration-300 ${inputClasses}`}
              placeholder="Enter new password"
            />
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <label className={`block mb-2 ${textClasses}`}>Confirm New Password</label>
          <div className="relative">
            <Lock className={`absolute ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} left-3 top-3`} />
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 pl-10 border-2 rounded-lg focus:outline-none transition-all duration-300 ${inputClasses}`}
              placeholder="Confirm new password"
            />
          </div>
        </motion.div>
      </div>
      
      {passwordError && (
        <motion.div 
          className="text-sm text-red-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {passwordError}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChangePasswordSection;