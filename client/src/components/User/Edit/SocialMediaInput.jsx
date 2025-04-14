import React from 'react';
import { Instagram, Twitter, Linkedin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const SocialMediaInput = ({ platform, value, onChange, isDarkMode }) => {
  const platformIcons = {
    instagram: <Instagram className="w-5 h-5 text-pink-500" />,
    twitter: <Twitter className="w-5 h-5 text-blue-400" />,
    linkedin: <Linkedin className="w-5 h-5 text-blue-600" />,
    website: <Globe className="w-5 h-5 text-gray-600" />
  };

  const inputClasses = isDarkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400'
    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-500';

  return (
    <motion.div 
      className="flex items-center mb-4 space-x-3"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {platformIcons[platform]}
      </motion.div>
      
      <input
        type="text"
        placeholder={`Enter ${platform} URL`}
        value={value || ''}
        onChange={(e) => onChange(platform, e.target.value)}
        className={`flex-1 px-4 py-2.5 border-2 rounded-lg focus:outline-none transition-all duration-300 ${inputClasses}`}
      />
    </motion.div>
  );
};

export default SocialMediaInput;