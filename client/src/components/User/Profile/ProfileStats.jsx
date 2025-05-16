import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileStats = ({ profileUser, isDarkMode }) => {
  const navigate = useNavigate();

  console.log('ProfileStats: Rendering component', { profileUser, isDarkMode });

  if (!profileUser) {
    console.error('ProfileStats: profileUser is null or undefined');
    return <div className="p-4 text-center text-gray-500">Loading profile stats...</div>;
  }

  if (!profileUser.id) {
    console.error('ProfileStats: profileUser.id is missing', profileUser);
    return <div className="p-4 text-center text-red-500">Invalid user data</div>;
  }

  console.log('ProfileStats: profileUser.id', profileUser.id);

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      onClick={(e) => console.log('Root motion.div clicked', e.target)}
      className={`grid grid-cols-3 gap-4 p-6 mt-8 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      {/* Posts Stat */}
      <div
        custom={0}
        className="relative flex flex-col items-center justify-center p-4 rounded-lg group"
      >
        <div
          className={`absolute inset-0 opacity-0 bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:opacity-10 rounded-lg transition-opacity duration-300`}
        />
        <div className={`flex items-center justify-center p-3 mb-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="text-blue-500">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <motion.span 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            delay: 0.2
          }}
          className={`block text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link 
              to={`/profile/${profileUser.id}/posts`} 
              className="hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Link clicked for posts:', `/profile/${profileUser.id}/posts`);
                navigate(`/profile/${profileUser.id}/posts`);
              }}
            >
              {profileUser.posts?.length || 0}
            </Link>
          </motion.div>
        </motion.span>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Posts
        </span>
      </div>

      {/* Followers Stat */}
      <div
        custom={1}
        className="relative flex flex-col items-center justify-center p-4 rounded-lg group"
      >
        <div
          className={`absolute inset-0 opacity-0 bg-gradient-to-br from-purple-500 to-pink-600 group-hover:opacity-10 rounded-lg transition-opacity duration-300`}
        />
        <div className={`flex items-center justify-center p-3 mb-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="text-purple-500">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <motion.span 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            delay: 0.3
          }}
          className={`block text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link 
              to={`/profile/${profileUser.id}/followers`} 
              className="hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Link clicked for followers:', `/profile/${profileUser.id}/followers`);
                navigate(`/profile/${profileUser.id}/followers`);
              }}
            >
              {profileUser.followers?.length || 0}
            </Link>
          </motion.div>
        </motion.span>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Followers
        </span>
      </div>

      {/* Following Stat */}
      <div
        custom={2}
        className="relative flex flex-col items-center justify-center p-4 rounded-lg group"
      >
        <div
          className={`absolute inset-0 opacity-0 bg-gradient-to-br from-indigo-500 to-blue-600 group-hover:opacity-10 rounded-lg transition-opacity duration-300`}
        />
        <div className={`flex items-center justify-center p-3 mb-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="text-indigo-500">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>
        <motion.span 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            delay: 0.4
          }}
          className={`block text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link 
              to={`/profile/${profileUser.id}/following`} 
              className="hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Link clicked for following:', `/profile/${profileUser.id}/following`);
                navigate(`/profile/${profileUser.id}/following`);
              }}
            >
              {profileUser.following?.length || 0}
            </Link>
          </motion.div>
        </motion.span>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Following
        </span>
      </div>
    </motion.div>
  );
};

export default ProfileStats;