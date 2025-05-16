import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ProfileImagesSection = ({ userData, handleImageChange, isDarkMode }) => {
  const [dragActive, setDragActive] = useState({ profile: false, banner: false });
  const [previewUrls, setPreviewUrls] = useState({
    profile: null,
    banner: null
  });
  
  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Only JPEG or PNG images are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      if (!file.name) {
        toast.error("Invalid file selected");
        return;
      }
      handleImageChange(file, type);
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [type]: url }));
    }
  };

  // Handle drag events
  const handleDrag = (e, type, active) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (active !== undefined) {
      setDragActive(prev => ({ ...prev, [type]: active }));
    }
  };

  // Handle drop event
  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragActive(prev => ({ ...prev, [type]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Only JPEG or PNG images are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      if (!file.name) {
        toast.error("Invalid file selected");
        return;
      }
      handleImageChange(file, type);
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({ ...prev, [type]: url }));
    }
  };

  // Helper function to get image URL
  const getImageUrl = (type) => {
    if (previewUrls[type]) return previewUrls[type];
    
    if (type === 'profile') {
      return userData.profileImage || 'https://via.placeholder.com/150?text=Profile';
    } else {
      return userData.bannerImage || 'https://via.placeholder.com/1200x300?text=Banner';
    }
  };

  return (
    <div>
      <motion.h2 
        className="mb-6 text-xl font-bold"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Profile Images
      </motion.h2>

      <div className="space-y-10">
        {/* Banner Image Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Banner Image
          </label>
          
          <motion.div
            className={`relative h-48 rounded-xl overflow-hidden ${
              dragActive.banner 
                ? isDarkMode ? 'ring-2 ring-indigo-400 border-indigo-400' : 'ring-2 ring-indigo-600 border-indigo-600' 
                : isDarkMode ? 'border-gray-600' : 'border-gray-300'
            } border-2 border-dashed transition-all duration-300`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
            onDragEnter={(e) => handleDrag(e, 'banner', true)}
            onDragLeave={(e) => handleDrag(e, 'banner', false)}
            onDragOver={(e) => handleDrag(e, 'banner')}
            onDrop={(e) => handleDrop(e, 'banner')}
            onClick={() => bannerInputRef.current.click()}
          >
            <input
              type="file"
              ref={bannerInputRef}
              onChange={(e) => handleFileChange(e, 'banner')}
              accept="image/jpeg,image/png"
              className="hidden"
            />
            
            {getImageUrl('banner') ? (
              <>
                <img 
                  src={getImageUrl('banner')} 
                  alt="Banner preview" 
                  className="object-cover w-full h-full"
                />
                <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300`}>
                  <p className="px-4 text-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Click or drag to change banner image
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Click or drag to upload banner image
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Recommended size: 1500 × 500px
                </p>
              </div>
            )}
          </motion.div>

          <motion.p 
            className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your banner image will appear at the top of your profile page. Choose something that represents you or your work.
          </motion.p>
        </motion.div>

        {/* Profile Image Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Photo
          </label>
          
          <div className="flex items-center">
            <motion.div
              className={`relative w-32 h-32 rounded-full overflow-hidden ${
                dragActive.profile 
                  ? isDarkMode ? 'ring-2 ring-indigo-400 border-indigo-400' : 'ring-2 ring-indigo-600 border-indigo-600' 
                  : isDarkMode ? 'border-gray-600' : 'border-gray-300'
              } border-2 border-dashed`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              onDragEnter={(e) => handleDrag(e, 'profile', true)}
              onDragLeave={(e) => handleDrag(e, 'profile', false)}
              onDragOver={(e) => handleDrag(e, 'profile')}
              onDrop={(e) => handleDrop(e, 'profile')}
              onClick={() => profileInputRef.current.click()}
            >
              <input
                type="file"
                ref={profileInputRef}
                onChange={(e) => handleFileChange(e, 'profile')}
                accept="image/jpeg,image/png"
                className="hidden"
              />
              
              {getImageUrl('profile') ? (
                <>
                  <img 
                    src={getImageUrl('profile')} 
                    alt="Profile preview" 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </motion.div>
            
            <motion.div 
              className="ml-5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Click to upload a profile photo
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Square images work best. JPG or PNG.
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Max size: 5MB
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileImagesSection;