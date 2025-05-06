import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Import all the components
// import Navbar from '../../components/User/Navbar';
import ProfileImagesSection from '../../components/User/Edit/ProfileImagesSection';
import PersonalInfoSection from '../../components/User/Edit/PersonalInfoSection';
import SocialMediaSection from '../../components/User/Edit/SocialMediaSection';
import ChangePasswordSection from '../../components/User/Edit/ChangePasswordSection';
import FormActions from '../../components/User/Edit/FormActions';

import Header from "../../components/common/NewPageHeader";

const EditProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL params
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [error, setError] = useState(null);

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

      const response = await axios.put(`http://localhost:5000/api/users/edit/${userId}`, updatedUserData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      toast.success('Profile updated successfully!');
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} pt-24 pb-12 transition-colors duration-300`}>
      <div className="container max-w-4xl px-4 mx-auto">
        <motion.div 
          className={`p-8 rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="flex items-center justify-between mb-8" variants={itemVariants}>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-full transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-indigo-600'
              }`}
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
            </button>
          </motion.div>

          {error && (
            <div className="p-4 mb-4 text-red-500 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <motion.div className="space-y-12" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <ProfileImagesSection 
                  userData={userData} 
                  handleImageChange={handleImageChange} 
                />
              </motion.div>

              <motion.hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} variants={itemVariants} />

              <motion.div variants={itemVariants}>
                <PersonalInfoSection 
                  userData={userData} 
                  handleInputChange={handleInputChange} 
                />
              </motion.div>

              <motion.hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} variants={itemVariants} />

              <motion.div variants={itemVariants}>
                <SocialMediaSection 
                  userData={userData} 
                  handleSocialMediaChange={handleSocialMediaChange} 
                />
              </motion.div>

              <motion.hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} variants={itemVariants} />

              <motion.div variants={itemVariants}>
                <ChangePasswordSection 
                  userData={userData} 
                  handleInputChange={handleInputChange} 
                  passwordError={passwordError} 
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormActions 
                  loading={loading} 
                  navigate={navigate} 
                />
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;