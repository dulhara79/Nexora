import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

// Import components
import Navbar from '../../components/common/Navbar';
import ProfileImagesSection from '../../components/User/Edit/ProfileImagesSection';
import PersonalInfoSection from '../../components/User/Edit/PersonalInfoSection';
import SocialMediaSection from '../../components/User/Edit/SocialMediaSection';
import ChangePasswordSection from '../../components/User/Edit/ChangePasswordSection';
import FormActions from '../../components/User/Edit/FormActions';

import { AuthContext } from '../../context/AuthContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [loadingSection, setLoadingSection] = useState(true);
  const [saveAnimation, setSaveAnimation] = useState(false);
  const { user } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    about: '',
    profileImage: null,
    bannerImage: null,
    currentPassword: '',
    password: '',
    confirmPassword: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      linkedin: '',
      website: ''
    }
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError('User ID is required');
        return;
      }

      setLoadingSection(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          withCredentials: true
        });
        console.log('User data fetched in edit page:', response.data);
        const data = response.data.user;
        const socialMediaObj = {};
        data.socialMedia?.forEach(link => {
          socialMediaObj[link.platform] = link.url;
        });

        setUserData({
          name: data.name || '',
          username: data.username || '',
          email: data.email || '',
          about: data.about || '',
          profileImage: data.profilePhotoUrl || null,
          bannerImage: data.bannerPhotoUrl || null,
          currentPassword: '',
          password: '',
          confirmPassword: '',
          socialMedia: {
            instagram: socialMediaObj.instagram || '',
            twitter: socialMediaObj.twitter || '',
            linkedin: socialMediaObj.linkedin || '',
            website: socialMediaObj.website || ''
          }
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setTimeout(() => setLoadingSection(false), 600); // Add slight delay for smoother transition
      }
    };

    fetchUserData();
  }, [userId]);

  // Theme handling
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value || '' }));
    if (['password', 'confirmPassword', 'currentPassword'].includes(name)) {
      setPasswordError(null);
    }
  };

  const handleSocialMediaChange = (platform, value) => {
    setUserData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value || ''
      }
    }));
  };

  const uploadImageToCloudinary = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('skillType', type === 'profile' ? 'profileImage' : 'bannerImage');

    try {
      const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      return response.data.fileUrl;
    } catch (error) {
      throw new Error(`Failed to upload ${type} image`);
    }
  };

  const handleImageChange = (file, type) => {
    setUserData(prev => ({
      ...prev,
      [type === 'profile' ? 'profileImage' : 'bannerImage']: file
    }));
  };

  const validateForm = () => {
    if (userData.password || userData.confirmPassword || userData.currentPassword) {
      if (!userData.currentPassword) {
        setPasswordError('Current password is required to change password');
        return false;
      }
      if (userData.password !== userData.confirmPassword) {
        setPasswordError('New passwords do not match');
        return false;
      }
      if (userData.password.length < 8) {
        setPasswordError('Password must be at least 8 characters');
        return false;
      }
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError('User ID is required');
      return;
    }

    if (!validateForm()) return;
    
    setLoading(true);
    setSaveAnimation(true);
    
    try {
      let profileImageUrl = userData.profileImage;
      let bannerImageUrl = userData.bannerImage;

      if (userData.profileImage instanceof File) {
        profileImageUrl = await uploadImageToCloudinary(userData.profileImage, 'profile');
      }
      if (userData.bannerImage instanceof File) {
        bannerImageUrl = await uploadImageToCloudinary(userData.bannerImage, 'banner');
      }

      const updatedUserData = {
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
        about: userData.about || '',
        profilePhotoUrl: profileImageUrl || '',
        bannerPhotoUrl: bannerImageUrl || '',
        password: userData.password || undefined,
        currentPassword: userData.currentPassword || undefined,
        socialMedia: Object.entries(userData.socialMedia)
          .filter(([_, value]) => value)
          .map(([platform, url]) => ({ platform, url }))
      };

      await axios.put(`http://localhost:5000/api/users/edit/${userId}`, updatedUserData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      toast.success('Profile updated successfully!');
      
      // Delay navigation slightly for better UX
      setTimeout(() => {
        navigate(`/profile/${userId}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      setSaveAnimation(false);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const pageTransition = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      } 
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 70, 
        damping: 15,
        mass: 1
      } 
    }
  };

  const loadingVariants = {
    loading: {
      opacity: 0.7,
      transition: {
        yoyo: Infinity,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const sections = [
    { id: 'profile', label: 'Profile Images' },
    { id: 'personal', label: 'Personal Info' },
    { id: 'social', label: 'Social Media' },
    { id: 'password', label: 'Password' }
  ];

  const renderSection = () => {
    if (loadingSection) {
      return (
        <motion.div 
          className="flex flex-col items-center justify-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className={`w-16 h-16 border-4 rounded-full border-t-transparent ${isDarkMode ? 'border-indigo-400' : 'border-indigo-600'}`}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          <motion.p 
            className="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400"
            animate="loading"
            variants={loadingVariants}
          >
            Loading profile data...
          </motion.p>
        </motion.div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -20 }}
          variants={sectionVariants}
          className="mt-8"
        >
          {activeSection === 'profile' && (
            <ProfileImagesSection 
              userData={userData} 
              handleImageChange={handleImageChange}
              isDarkMode={isDarkMode}
            />
          )}
          
          {activeSection === 'personal' && (
            <PersonalInfoSection 
              userData={userData} 
              handleInputChange={handleInputChange}
              isDarkMode={isDarkMode}
            />
          )}
          
          {activeSection === 'social' && (
            <SocialMediaSection 
              userData={userData} 
              handleSocialMediaChange={handleSocialMediaChange}
              isDarkMode={isDarkMode}
            />
          )}
          
          {activeSection === 'password' && (
            <ChangePasswordSection 
              userData={userData} 
              handleInputChange={handleInputChange} 
              passwordError={passwordError}
              isDarkMode={isDarkMode}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <Navbar />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDarkMode ? '#374151' : '#fff',
            color: isDarkMode ? '#f3f4f6' : '#1f2937',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#ECFDF5',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FEE2E2',
            },
          },
        }}
      />
      
      <motion.div 
        className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800'} pt-24 pb-12`}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
      >
        <div className="container max-w-5xl px-4 mx-auto">
          <motion.div 
            className={`overflow-hidden rounded-2xl shadow-2xl transition-colors duration-500 ${isDarkMode ? 'bg-gray-800 shadow-indigo-900/30' : 'bg-white shadow-blue-200/50'}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: 'spring',
              stiffness: 50,
              damping: 20
            }}
          >
            <div className={`relative overflow-hidden h-28 ${isDarkMode ? 'bg-gradient-to-r from-indigo-800 to-purple-800' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}>
              <motion.div 
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 1 }}
              >
                <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {[...Array(8)].map((_, i) => (
                    <motion.path
                      key={i}
                      d={`M${i * 20},0 Q${i * 20 + 10},${20 + Math.random() * 20} ${i * 20 + 20},0`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0, opacity: 0.4 }}
                      animate={{ 
                        pathLength: 1, 
                        opacity: 0.8,
                        pathOffset: Math.random() * 0.5
                      }}
                      transition={{ 
                        duration: 3 + Math.random() * 2, 
                        repeat: Infinity, 
                        repeatType: 'reverse',
                        ease: "easeInOut" 
                      }}
                    />
                  ))}
                </svg>
              </motion.div>
            </div>
            
            <div className="px-8 pt-6 pb-10">
              <div className="flex items-center justify-between mb-6">
                <motion.h1 
                  className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Customize Your Profile
                </motion.h1>
                
                <motion.button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300 hover:text-yellow-200' 
                      : 'bg-gray-100 hover:bg-gray-200 text-indigo-600 hover:text-indigo-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  )}
                </motion.button>
              </div>

              {error && (
                <motion.div 
                  className={`p-4 mb-6 text-red-500 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </motion.div>
              )}

              <motion.div 
                className={`grid grid-cols-1 md:grid-cols-5 gap-6`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                {/* Sidebar Navigation */}
                <motion.div 
                  className="md:col-span-1"
                  variants={sectionVariants}
                >
                  <nav className={`sticky top-24 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50 backdrop-blur-sm' : 'bg-gray-50'}`}>
                    <ul className="space-y-2">
                      {sections.map((section, index) => (
                        <motion.li key={section.id}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.97 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (index * 0.1) }}
                        >
                          <button
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-300 ${
                              activeSection === section.id
                                ? isDarkMode
                                  ? 'bg-indigo-600 text-white font-medium'
                                  : 'bg-indigo-100 text-indigo-700 font-medium'
                                : isDarkMode
                                  ? 'text-gray-300 hover:bg-gray-600'
                                  : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center">
                              {section.id === 'profile' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              )}
                              {section.id === 'personal' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              )}
                              {section.id === 'social' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                </svg>
                              )}
                              {section.id === 'password' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {section.label}
                              
                              {activeSection === section.id && (
                                <motion.div 
                                  className="ml-auto"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </motion.div>
                              )}
                            </div>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <motion.div 
                      className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="flex items-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Need help?</span>
                        </div>
                        <p>Make your profile stand out by completing all sections and adding high-quality photos.</p>
                      </div>
                    </motion.div>
                  </nav>
                </motion.div>
                
                {/* Main Content Area */}
                <div className="md:col-span-4">
                  <form onSubmit={handleSubmit} className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700/30 backdrop-blur-sm' : 'bg-white border border-gray-100'}`}>
                    {renderSection()}
                    
                    <motion.div 
                      className="pt-6 mt-10 border-t border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <FormActions 
                        loading={loading} 
                        navigate={navigate}
                        isDarkMode={isDarkMode}
                        saveAnimation={saveAnimation}
                      />
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-8 text-sm text-center text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            All changes will be saved to your public profile.
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default EditProfile;