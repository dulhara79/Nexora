import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, ChevronDown, ChevronUp } from 'lucide-react';

// const ProfileAbout = ({ profileUser, isDarkMode }) => {
//   const [expanded, setExpanded] = useState(false);
//   const bioText = profileUser?.about || "No bio available";
//   const shortBio = bioText.length > 150 && !expanded ? bioText.substring(0, 150) + "..." : bioText;
  
//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay: 0.2 }}
//       className={`mt-8 p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//     >
//       <div className="flex items-center mb-4">
//         <Book className={`w-5 h-5 mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//         <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>About</h3>
//       </div>
      
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4 }}
//       >
//         <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
//           {shortBio}
//         </p>
        
//         {bioText.length > 150 && (
//           <motion.button
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//             onClick={() => setExpanded(!expanded)}
//             className={`flex items-center mt-3 text-sm font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} hover:underline`}
//           >
//             {expanded ? (
//               <>
//                 Show less <ChevronUp className="w-4 h-4 ml-1" />
//               </>
//             ) : (
//               <>
//                 Read more <ChevronDown className="w-4 h-4 ml-1" />
//               </>
//             )}
//           </motion.button>
//         )}
//       </motion.div>
      
//       {profileUser?.tags && profileUser.tags.length > 0 && (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="flex flex-wrap gap-2 mt-4"
//         >
//           {profileUser.tags.map((tag, index) => (
//             <motion.span
//               key={index}
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.6 + index * 0.1 }}
//               className={`px-3 py-1 text-xs font-medium rounded-full ${
//                 isDarkMode 
//                   ? 'bg-gray-700 text-gray-300' 
//                   : 'bg-indigo-100 text-indigo-800'
//               }`}
//             >
//               {tag}
//             </motion.span>
//           ))}
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

const ProfileAbout = ({ profileUser, isDarkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const bioText = profileUser?.about || "No bio available";
  const shortBio = bioText.length > 150 && !expanded ? bioText.substring(0, 150) + "..." : bioText;

  if (!profileUser) {
    return <div className="p-4 text-center text-gray-500">Loading profile about...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`mt-8 p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      {/* Rest of the component remains unchanged */}
    </motion.div>
  );
};

export default ProfileAbout;