import React, { useState, useEffect } from 'react';
import SocialMediaInput from './SocialMediaInput';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Globe } from 'lucide-react';

const SocialMediaSection = ({ userData, handleSocialMediaChange, isDarkMode }) => {
  const [activeInput, setActiveInput] = useState(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  const platforms = [
    { id: 'instagram', icon: Instagram, label: 'Instagram Profile' },
    { id: 'twitter', icon: Twitter, label: 'Twitter Handle' },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn Profile' },
    { id: 'website', icon: Globe, label: 'Personal Website' }
  ];
  
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const headerText = isDarkMode ? 'text-white' : 'text-gray-800';
  const subtitleText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <motion.div
      className="p-6 transition-all duration-300 border shadow-sm rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.7)'
      }}
    >
      <div className="mb-6">
        <motion.h2 
          className={`text-2xl font-bold ${headerText}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Social Media Links
        </motion.h2>
        <motion.p
          className={`mt-1 ${subtitleText}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Connect your social profiles to enhance your presence
        </motion.p>
      </div>
      
      <motion.div
        className="grid gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {platforms.map((platform) => (
          <motion.div 
            key={platform.id}
            variants={itemVariants}
            className={`rounded-lg ${cardBg} ${cardBorder} border overflow-hidden transition-all duration-300`}
            whileHover={{ scale: 1.01, boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            animate={activeInput === platform.id ? { borderColor: isDarkMode ? '#3b82f6' : '#2563eb' } : {}}
          >
            <SocialMediaInput
              platform={platform.id}
              icon={platform.icon}
              label={platform.label}
              value={userData.socialMedia[platform.id]}
              onChange={handleSocialMediaChange}
              isDarkMode={isDarkMode}
              onFocus={() => setActiveInput(platform.id)}
              onBlur={() => setActiveInput(null)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SocialMediaSection;