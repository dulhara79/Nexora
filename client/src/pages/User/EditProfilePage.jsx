import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  Moon, Sun, ChevronUp, ChevronDown, Loader2, 
  Camera, Upload, Check, AlertTriangle
} from 'lucide-react';

// Import all the components
import ProfileImagesSection from '../../components/User/Edit/ProfileImagesSection';
import PersonalInfoSection from '../../components/User/Edit/PersonalInfoSection';
import SocialMediaSection from '../../components/User/Edit/SocialMediaSection';
import ChangePasswordSection from '../../components/User/Edit/ChangePasswordSection';
import FormActions from '../../components/User/Edit/FormActions';
import Header from "../../components/common/NewPageHeader"

const EditProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL params
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [error, setError] = useState(null);
  const [activeSections, setActiveSections] = useState({
    profile: true,
    personal: true,
    social: true,
    password: false
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [originalData, setOriginalData] = useState(null);

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

  // Check for changes
  useEffect(() => {
    if (originalData) {
      // Simple comparison to detect changes
      const hasDataChanged = 
        userData.name !== originalData.name ||
        userData.username !== originalData.username ||
        userData.email !== originalData.email ||
        userData.about !== originalData.about ||
        userData.profileImage !== originalData.profileImage ||
        userData.bannerImage !== originalData.bannerImage ||
        userData.currentPassword !== originalData.currentPassword ||
        userData.password !== originalData.password ||
        userData.confirmPassword !== originalData.confirmPassword ||
        JSON.stringify(userData.socialMedia) !== JSON.stringify(originalData.socialMedia);
      
      setHasChanges(hasDataChanged);
    }
  }, [userData, originalData]);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError('User ID is required');
        return;
      }
      
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          withCredentials: true
        });
        
        const data = response.data;
        const socialMediaObj = {};
        
        data.socialMedia?.forEach(link => {
          socialMediaObj[link.platform] = link.url;
        });
        
        const formattedData = {
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
        };
        
        setUserData(formattedData);
        setOriginalData(formattedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
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
    
    setUserData(prev => ({
      ...prev,
      [name]: value || ''
    }));
    
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
      const response = await axios.post(
        'http://localhost:5000/api/files/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      
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

  const handleSectionToggle = (section) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setError('User ID is required');
      return;
    }
    
    if (!validateForm()) return;
    
    setLoading(true);
    
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
      
      await axios.put(
        `http://localhost:5000/api/users/edit/${userId}`,
        updatedUserData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      setSaveSuccess(true);
      setTimeout(() => {
        toast.success('Profile updated successfully!');
        navigate(`/profile/${userId}`);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 15 
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const sectionVariants = {
    open: { 
      height: "auto",
      opacity: 1,
      transition: { 
        height: {
          type: "spring", 
          stiffness: 70, 
          damping: 20
        }, 
        opacity: { duration: 0.25 }
      }
    },
    closed: { 
      height: 0,
      opacity: 0,
      transition: { 
        height: {
          type: "spring", 
          stiffness: 70, 
          damping: 20
        },
        opacity: { duration: 0.25 }
      }
    }
  };

  return (
    <>
    <Header />
    <motion.div 
      className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-orange-100 to-amber-100 text-gray-800'} pt-24 pb-12 transition-colors duration-300`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="container max-w-4xl px-4 mx-auto">
        <motion.div 
          className={`p-0 sm:p-6 rounded-3xl shadow-xl backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gray-800/70 border border-gray-700/50' 
              : 'bg-white/80 border border-gray-100'
          } transition-colors duration-300`}
          variants={cardVariants}
        >
          {/* Page Header */}
          <motion.div 
            className={`flex items-center justify-between mb-8 px-6 pt-6 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}
            variants={cardVariants}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-indigo-600' : 'bg-indigo-500'
                }`}
              >
                <Camera size={18} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">Profile Settings</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Update your personal information and preferences
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-full transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-indigo-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </motion.button>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="flex items-center p-4 mx-6 mb-6 text-red-500 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertTriangle size={18} className="mr-2" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {loading && !userData.name ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={40} className="mb-4 text-indigo-500 animate-spin" />
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading your profile...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <LayoutGroup>
                <div className="px-6 space-y-8">
                  {/* Profile Images Section */}
                  <motion.div 
                    className={`rounded-xl overflow-hidden border ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    } transition-all duration-300`}
                    variants={cardVariants}
                    layout
                  >
                    <motion.div 
                      className={`p-4 flex items-center justify-between cursor-pointer ${
                        isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
                      }`}
                      onClick={() => handleSectionToggle('profile')}
                      whileHover={{ backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.7)' }}
                      layout
                    >
                      <h2 className="flex items-center text-xl font-bold">
                        <Camera size={20} className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                        Profile Images
                      </h2>
                      <motion.div
                        animate={{ rotate: activeSections.profile ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {activeSections.profile ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </motion.div>
                    </motion.div>
                    
                    <AnimatePresence>
                      {activeSections.profile && (
                        <motion.div
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={sectionVariants}
                          layout
                        >
                          <div className="p-6">
                            <ProfileImagesSection 
                              userData={userData} 
                              handleImageChange={handleImageChange}
                              isDarkMode={isDarkMode}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Personal Info Section */}
                  <motion.div 
                    className={`rounded-xl overflow-hidden border ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    } transition-all duration-300`}
                    variants={cardVariants}
                    layout
                  >
                    <motion.div 
                      className={`p-4 flex items-center justify-between cursor-pointer ${
                        isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
                      }`}
                      onClick={() => handleSectionToggle('personal')}
                      whileHover={{ backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.7)' }}
                      layout
                    >
                      <h2 className="flex items-center text-xl font-bold">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Personal Information
                      </h2>
                      <motion.div
                        animate={{ rotate: activeSections.personal ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {activeSections.personal ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </motion.div>
                    </motion.div>
                    
                    <AnimatePresence>
                      {activeSections.personal && (
                        <motion.div
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={sectionVariants}
                          layout
                        >
                          <div className="p-6">
                            <PersonalInfoSection 
                              userData={userData} 
                              handleInputChange={handleInputChange}
                              isDarkMode={isDarkMode}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Social Media Section */}
                  <motion.div 
                    className={`rounded-xl overflow-hidden border ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    } transition-all duration-300`}
                    variants={cardVariants}
                    layout
                  >
                    <motion.div 
                      className={`p-4 flex items-center justify-between cursor-pointer ${
                        isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
                      }`}
                      onClick={() => handleSectionToggle('social')}
                      whileHover={{ backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.7)' }}
                      layout
                    >
                      <h2 className="flex items-center text-xl font-bold">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}
                        >
                          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                          <line x1="6" y1="1" x2="6" y2="4"></line>
                          <line x1="10" y1="1" x2="10" y2="4"></line>
                          <line x1="14" y1="1" x2="14" y2="4"></line>
                        </svg>
                        Social Media Links
                      </h2>
                      <motion.div
                        animate={{ rotate: activeSections.social ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {activeSections.social ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </motion.div>
                    </motion.div>
                    
                    <AnimatePresence>
                      {activeSections.social && (
                        <motion.div
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={sectionVariants}
                          layout
                        >
                          <div className="p-6">
                            <SocialMediaSection 
                              userData={userData} 
                              handleSocialMediaChange={handleSocialMediaChange}
                              isDarkMode={isDarkMode}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Change Password Section */}
                  <motion.div 
                    className={`rounded-xl overflow-hidden border ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    } transition-all duration-300`}
                    variants={cardVariants}
                    layout
                  >
                    <motion.div 
                      className={`p-4 flex items-center justify-between cursor-pointer ${
                        isDarkMode ? 'bg-gray-750' : 'bg-gray-50'
                      }`}
                      onClick={() => handleSectionToggle('password')}
                      whileHover={{ backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.7)' }}
                      layout
                    >
                      <h2 className="flex items-center text-xl font-bold">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Security & Password
                      </h2>
                      <motion.div
                        animate={{ rotate: activeSections.password ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {activeSections.password ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </motion.div>
                    </motion.div>
                    
                    <AnimatePresence>
                      {activeSections.password && (
                        <motion.div
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={sectionVariants}
                          layout
                        >
                          <div className="p-6">
                            <ChangePasswordSection 
                              userData={userData} 
                              handleInputChange={handleInputChange}
                              passwordError={passwordError}
                              isDarkMode={isDarkMode}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Form Action Buttons */}
                  <motion.div 
                    variants={cardVariants}
                    className="px-2"
                  >
                    <FormActions 
                      loading={loading}
                      navigate={navigate}
                      isDarkMode={isDarkMode}
                      hasChanges={hasChanges}
                      onSave={handleSubmit}
                    />
                  </motion.div>
                </div>
              </LayoutGroup>
            </form>
          )}
          
          {/* Success overlay */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                className="absolute inset-0 z-10 flex items-center justify-center bg-indigo-600 bg-opacity-90 rounded-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: 0.1
                  }}
                  className="flex flex-col items-center"
                >
                  <motion.div 
                    className="flex items-center justify-center w-20 h-20 mb-4 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2
                    }}
                  >
                    <Check size={40} className="text-indigo-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white">Profile Updated!</h2>
                  <p className="mt-2 text-indigo-100">Redirecting to your profile...</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
};

export default EditProfile;