import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, CheckCircle2 } from 'lucide-react';

const SocialMediaInput = ({ platform, icon: Icon, label, value, onChange, isDarkMode, onFocus, onBlur }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(null);
  
  const validateUrl = (url, platform) => {
    if (!url) return null;
    
    const patterns = {
      instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_\.]+\/?$/,
      twitter: /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/,
      linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_\-]+\/?$/,
      website: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}$/
    };
    
    return patterns[platform] ? patterns[platform].test(url) : true;
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(platform, newValue);
    setIsValid(newValue ? validateUrl(newValue, platform) : null);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };
  
  const getPlaceholder = () => {
    switch(platform) {
      case 'instagram': return 'instagram.com/yourprofile';
      case 'twitter': return 'twitter.com/yourhandle';
      case 'linkedin': return 'linkedin.com/in/yourprofile';
      case 'website': return 'yourwebsite.com';
      default: return '';
    }
  };
  
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputText = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const inputPlaceholder = isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400';
  const labelColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const iconColor = isFocused 
    ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
    : isDarkMode ? 'text-gray-400' : 'text-gray-500';
  
  const prefixBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';
  const prefixText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isValid === false
    ? 'border-red-500'
    : isValid === true
      ? 'border-green-500'
      : isFocused
        ? isDarkMode ? 'border-blue-500' : 'border-blue-500'
        : isDarkMode ? 'border-gray-700' : 'border-gray-300';

  const getPrefix = () => {
    switch(platform) {
      case 'instagram': return 'instagram.com/';
      case 'twitter': return 'twitter.com/';
      case 'linkedin': return 'linkedin.com/in/';
      case 'website': return 'https://';
      default: return '';
    }
  };
  
  const getPlatformName = () => {
    switch(platform) {
      case 'instagram': return 'Instagram';
      case 'twitter': return 'Twitter';
      case 'linkedin': return 'LinkedIn';
      case 'website': return 'Website';
      default: return platform;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-2">
        <Icon className={iconColor} size={18} />
        <label className={`ml-2 text-sm font-medium ${labelColor}`}>
          {label || getPlatformName()}
        </label>
      </div>
      
      <div className={`flex rounded-lg border ${borderColor} transition-all duration-300 overflow-hidden`}>
        {platform !== 'website' && (
          <div className={`${prefixBg} ${prefixText} px-3 py-2.5 text-sm flex items-center border-r ${borderColor}`}>
            {getPrefix()}
          </div>
        )}
        
        <input
          type="text"
          value={value || ''}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={platform === 'website' ? getPlaceholder() : 'yourusername'}
          className={`w-full px-3 py-2.5 ${inputBg} ${inputText} ${inputPlaceholder} outline-none transition-all duration-300`}
        />
        
        {isValid && (
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            className="flex items-center px-3 text-green-500"
          >
            <CheckCircle2 size={18} />
          </motion.div>
        )}
      </div>
      
      {isValid === false && (
        <motion.p 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-1 text-xs text-red-500"
        >
          Please enter a valid {getPlatformName()} URL
        </motion.p>
      )}
    </div>
  );
};

export default SocialMediaInput;