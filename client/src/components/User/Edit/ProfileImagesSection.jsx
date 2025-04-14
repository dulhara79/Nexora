import React from 'react';
import ImageUpload from './ImageUpload';
import { motion } from 'framer-motion';

const ProfileImagesSection = ({ userData, handleImageChange, isDarkMode }) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Profile Images
      </h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label className={`block mb-4 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Profile Picture
          </label>
          <ImageUpload
            currentImage={userData.profileImage}
            onImageChange={handleImageChange}
            type="profile"
            isDarkMode={isDarkMode}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className={`block mb-4 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Profile Banner
          </label>
          <ImageUpload
            currentImage={userData.bannerImage}
            onImageChange={handleImageChange}
            type="banner"
            isDarkMode={isDarkMode}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileImagesSection;