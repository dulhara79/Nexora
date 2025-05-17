import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit, Share2, Camera } from 'lucide-react';

const ProfileHeader = ({ profileUser, userId, isDarkMode }) => {
  const bannerImage = profileUser?.bannerUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
  const profilePhoto = profileUser?.profilePhotoUrl || "/placeholder.jpg";

  if (!profileUser) {
    return <div className="p-4 text-center text-gray-500">Loading profile header...</div>;
  }

  return (
    <div className="relative w-full h-64">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 overflow-hidden rounded-t-2xl"
        style={{
          background: `url(${bannerImage}) center/cover no-repeat`,
          filter: 'blur(8px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 bg-orange-500/20"
        />
      </motion.div>
      <div className="absolute flex items-center justify-end w-full px-6 top-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex space-x-2"
        >
          <Link
            to={`/edit/${userId}`}
            className="flex items-center px-4 py-2 space-x-2 text-white transition-all bg-orange-500 rounded-full hover:bg-orange-600"
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium">Edit Profile</span>
          </Link>
          <button className="p-3 text-white transition-all bg-orange-500 rounded-full hover:bg-orange-600">
            <Share2 className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
      <div className="absolute left-6 -bottom-16">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
          className="relative"
        >
          <motion.img
            src={profilePhoto}
            alt="Profile"
            className="object-cover w-32 h-32 border-4 border-white rounded-full shadow-xl sm:w-36 sm:h-36"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="absolute bottom-0 right-0 p-2 text-white bg-orange-500 rounded-full shadow-lg cursor-pointer hover:bg-orange-600"
          >
            <Camera className="w-4 h-4" />
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute px-2 py-1 text-xs font-bold text-white bg-yellow-500 rounded-full shadow-lg -top-2 -right-2"
          >
            PRO
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileHeader;