import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Github, MessageCircle, UserCheck, UserPlus, Share2 } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileInfo = ({ profileUser, isDarkMode }) => {
  const { user } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(profileUser?.followers?.includes(user?.id));
  const navigate = useNavigate();

  if (!profileUser) {
    return <div className="p-4 text-center text-gray-500">Loading profile info...</div>;
  }

  const socialLinks = [
    { icon: <Instagram />, color: "hover:text-pink-600", name: "Instagram" },
    { icon: <Twitter />, color: "hover:text-blue-400", name: "Twitter" },
    { icon: <Linkedin />, color: "hover:text-blue-700", name: "LinkedIn" },
    { icon: <Github />, color: "hover:text-gray-800", name: "GitHub" }
  ];

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isFollowing) {
        await axios.post(
          `http://localhost:5000/api/users/${user.id}/unfollow/${profileUser.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        setIsFollowing(false);
      } else {
        await axios.post(
          `http://localhost:5000/api/users/${user.id}/follow/${profileUser.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {profileUser.name || "John Doe"}
          </h1>
          <div className="flex items-center">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-medium text-indigo-500"
            >
              @{profileUser.username || "username"}
            </motion.p>
            {profileUser.emailVerified && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="flex items-center justify-center w-5 h-5 ml-2 text-white bg-blue-500 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </div>
          {profileUser.location && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {profileUser.location}
            </motion.p>
          )}
          {profileUser.likeSkill && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Favorite Skill: {profileUser.likeSkill}
            </motion.p>
          )}
        </motion.div>
        
        {user?.id !== profileUser.id && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFollowToggle}
              className={`px-6 py-2 font-medium transition-all duration-300 rounded-full shadow-md ${
                isFollowing 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-500' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <motion.div
                initial={false}
                animate={{ width: 'auto' }}
                className="flex items-center"
              >
                {isFollowing ? <UserCheck className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                {isFollowing ? 'Following' : 'Follow'}
              </motion.div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 font-medium transition-all duration-300 border rounded-full shadow-md ${
                isDarkMode 
                  ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 transition-all duration-300 rounded-full shadow-md ${
                isDarkMode 
                  ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center mt-6 space-x-4"
      >
        {profileUser.socialMedia?.map((social, index) => (
          <motion.a
            key={index}
            href={social.url}
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.5 + index * 0.1 } 
            }}
            className={`flex items-center justify-center w-10 h-10 transition-colors rounded-full ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-400 hover:text-white' 
                : 'bg-gray-100 text-gray-500'
            } ${socialLinks.find(s => s.name.toLowerCase() === social.platform.toLowerCase())?.color || 'hover:text-indigo-600'}`}
          >
            {socialLinks.find(s => s.name.toLowerCase() === social.platform.toLowerCase())?.icon || <UserPlus />}
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ProfileInfo;