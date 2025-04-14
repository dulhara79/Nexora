import React from 'react';
import SocialMediaInput from './SocialMediaInput';
import { motion } from 'framer-motion';

const SocialMediaSection = ({ userData, handleSocialMediaChange, isDarkMode }) => {
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
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Social Media Links
      </h2>
      
      <motion.div 
        className="grid gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <SocialMediaInput
            platform="instagram"
            value={userData.socialMedia.instagram}
            onChange={handleSocialMediaChange}
            isDarkMode={isDarkMode}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <SocialMediaInput
            platform="twitter"
            value={userData.socialMedia.twitter}
            onChange={handleSocialMediaChange}
            isDarkMode={isDarkMode}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <SocialMediaInput
            platform="linkedin"
            value={userData.socialMedia.linkedin}
            onChange={handleSocialMediaChange}
            isDarkMode={isDarkMode}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <SocialMediaInput
            platform="website"
            value={userData.socialMedia.website}
            onChange={handleSocialMediaChange}
            isDarkMode={isDarkMode}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SocialMediaSection;