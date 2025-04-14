import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit, Share2 } from 'lucide-react';

const ProfileHeader = ({ profileUser, userId }) => (
  <div
    className="relative w-full h-56"
    style={{
      background: profileUser?.bannerUrl
        ? `url(${profileUser.bannerUrl}) center/cover no-repeat`
        : "linear-gradient(135deg, #3b82f6, #1e40af, #2563eb, #3b82f6)",
      backgroundSize: 'cover'
    }}
  >
    <div className="absolute inset-0 bg-black/30"></div>
    <div className="absolute flex space-x-2 top-4 right-4">
      <Link to={`/edit/${userId}`} className="p-2 transition-colors rounded-full bg-white/20 hover:bg-white/40">
        <Edit className="w-5 h-5 text-white" />
      </Link>
      <button className="p-2 transition-colors rounded-full bg-white/20 hover:bg-white/40">
        <Share2 className="w-5 h-5 text-white" />
      </button>
    </div>
    <motion.img
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      src={profileUser?.profilePhotoUrl || "https://res.cloudinary.com/ddwgayqfm/image/upload/v1743163900/images/fb9d49a8-7174-4841-95d7-2fe82d1fcecc_def_img.jpg.jpg"}
      alt="Profile"
      className="absolute object-cover border-4 border-white rounded-full shadow-2xl w-36 h-36 -bottom-16 left-6"
    />
  </div>
);

export default ProfileHeader;