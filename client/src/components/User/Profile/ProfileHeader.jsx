import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit, Share2, Moon, Sun, Camera } from 'lucide-react';

// const ProfileHeader = ({ profileUser, userId, isDarkMode, setIsDarkMode }) => {
//   const bannerImage = profileUser?.bannerUrl || "https://images.unsplash.com/photo-1579547945413-497e1b99dac0";

//   console.log("profileUser in ProfileHeader:", profileUser);
//   console.log("userId in ProfileHeader:", userId);
  
//   return (
//     <div className="relative w-full h-64">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="absolute inset-0 overflow-hidden rounded-t-2xl"
//         style={{
//           background: `url(${bannerImage}) center/cover no-repeat`,
//         }}
//       >
//         <h1>banner</h1>
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"
//         />
//       </motion.div>
      
//       <div className="absolute flex items-center justify-between w-full px-6 top-4">
//         <motion.button
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.5 }}
//           onClick={() => setIsDarkMode(!isDarkMode)}
//           className="p-3 transition-all rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40"
//         >
//           {isDarkMode ? 
//             <Sun className="w-5 h-5 text-white" /> : 
//             <Moon className="w-5 h-5 text-white" />
//           }
//         </motion.button>
        
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="flex space-x-2"
//         >
//           <Link 
//             to={`/edit/${userId}`} 
//             className="flex items-center px-4 py-2 space-x-2 transition-all rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40"
//           >
//             <Edit className="w-4 h-4 text-white" />
//             <span className="text-sm font-medium text-white">Edit Profile</span>
//           </Link>
//           <button className="p-3 transition-all rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40">
//             <Share2 className="w-5 h-5 text-white" />
//           </button>
//         </motion.div>
//       </div>
      
//       <div className="absolute left-6 -bottom-16">
//         <motion.div
//           initial={{ scale: 0, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ 
//             type: "spring",
//             stiffness: 200,
//             delay: 0.3,
//             duration: 0.6 
//           }}
//           className="relative"
//         >
//           <img
//             src={profileUser?.profilePhotoUrl || "https://res.cloudinary.com/ddwgayqfm/image/upload/v1743163900/images/fb9d49a8-7174-4841-95d7-2fe82d1fcecc_def_img.jpg.jpg"}
//             alt="Profile"
//             className="object-cover w-32 h-32 border-4 border-white rounded-full shadow-xl sm:w-36 sm:h-36"
//           />
//           <motion.div
//             whileHover={{ scale: 1.1 }}
//             className="absolute bottom-0 right-0 p-2 text-white transition-all bg-indigo-600 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700"
//           >
//             <Camera className="w-4 h-4" />
//           </motion.div>
          
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: [0, 1.2, 1], opacity: 1 }}
//             transition={{ delay: 0.8, duration: 0.5 }}
//             className="absolute px-2 py-1 text-xs font-bold text-white rounded-full shadow-lg -top-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600"
//           >
//             PRO
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

const ProfileHeader = ({ profileUser, userId, isDarkMode, setIsDarkMode }) => {
  const bannerImage = profileUser?.bannerUrl || "https://images.unsplash.com/photo-1579547945413-497e1b99dac0";
  const profilePhoto = profileUser?.profilePhotoUrl || "https://res.cloudinary.com/ddwgayqfm/image/upload/v1743163900/images/fb9d49a8-7174-4841-95d7-2fe82d1fcecc_def_img.jpg.jpg";

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
        }}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"
        />
      </motion.div>
      {/* Rest of the component remains unchanged */}
      <div className="absolute flex items-center justify-between w-full px-6 top-4">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 transition-all rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40"
        >
          {isDarkMode ? 
            <Sun className="w-5 h-5 text-white" /> : 
            <Moon className="w-5 h-5 text-white" />
          }
        </motion.button>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex space-x-2"
        >
          <Link 
            to={`/edit/${userId}`} 
            className="flex items-center px-4 py-2 space-x-2 transition-all rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40"
          >
            <Edit className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Edit Profile</span>
          </Link>
          <button className="p-3 transition-all rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </div>
      <div className="absolute left-6 -bottom-16">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            delay: 0.3,
            duration: 0.6 
          }}
          className="relative"
        >
          <img
            src={profilePhoto}
            alt="Profile"
            className="object-cover w-32 h-32 border-4 border-white rounded-full shadow-xl sm:w-36 sm:h-36"
          />
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="absolute bottom-0 right-0 p-2 text-white transition-all bg-indigo-600 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700"
          >
            <Camera className="w-4 h-4" />
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute px-2 py-1 text-xs font-bold text-white rounded-full shadow-lg -top-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600"
          >
            PRO
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileHeader;
