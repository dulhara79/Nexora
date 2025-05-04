// import { useState, useEffect, useContext } from "react";
// import { AuthContext } from '../../context/AuthContext';
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { useParams, useNavigate } from "react-router-dom";
// import ProfileHeader from '../../components/User/Profile/ProfileHeader';
// import ProfileInfo from '../../components/User/Profile/ProfileInfo';
// import ProfileStats from '../../components/User/Profile/ProfileStats';
// import ProfileAbout from '../../components/User/Profile/ProfileAbout';
// import RecentActivity from '../../components/User/Profile/RecentActivity';
// import QuickActions from '../../components/User/Profile/QuickActions';

// function UserProfilePage() {
//   const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
//   const { userId } = useParams(); // Get userId from URL
//   const [profileUser, setProfileUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // Add error state
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!userId) {
//         console.error("No userId provided in URL");
//         setError("Invalid user ID");
//         navigate("/not-found");
//         return;
//       }

//       try {
//         console.log("Fetching user data for userId:", userId);
//         const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
//           withCredentials: true,
//         });
//         console.log("API response:", response.data.user);
//         // Adjust based on actual API response structure
//         const userData = response.data.user; // Handle both { user: {...} } and {...} cases
//         if (!userData) {
//           throw new Error("No user data in response");
//         }
//         setProfileUser(userData);
//       } catch (error) {
//         console.error('Error fetching user:', error);
//         setError(error.response?.data?.message || "Failed to load user profile");
//         if (error.response?.status === 401) {
//           navigate("/login");
//         } else if (error.response?.status === 404) {
//           navigate("/not-found");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!authLoading && isAuthenticated) {
//       fetchUser();
//     } else if (!authLoading && !isAuthenticated) {
//       navigate("/login");
//     }
//   }, [userId, isAuthenticated, authLoading, navigate]);

//   const handleSignOut = async () => {
//     try {
//       await axios.post(`http://localhost:5000/api/auth/logout`, {}, { withCredentials: true });
//       navigate('/login');
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex flex-col items-center"
//         >
//           <motion.div
//             animate={{
//               rotate: 360,
//               boxShadow: [
//                 "0px 0px 0px rgba(79, 70, 229, 0.2)",
//                 "0px 0px 20px rgba(79, 70, 229, 0.7)",
//                 "0px 0px 0px rgba(79, 70, 229, 0.2)",
//               ],
//             }}
//             transition={{
//               rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
//               boxShadow: { duration: 1.5, repeat: Infinity },
//             }}
//             className="w-16 h-16 border-4 border-transparent rounded-full border-t-indigo-600 border-r-indigo-500"
//           />
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="mt-4 font-medium text-indigo-600"
//           >
//             Loading profile...
//           </motion.p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200"
//       >
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.3 }}
//           className="p-8 bg-white shadow-xl rounded-2xl"
//         >
//           <h2 className="mb-4 text-2xl font-bold text-center text-indigo-700">
//             Authentication Required
//           </h2>
//           <p className="mb-6 text-gray-600">Please log in to view this profile page.</p>
//           <button
//             onClick={() => navigate('/login')}
//             className="w-full py-3 font-medium text-white transition-all bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg"
//           >
//             Login Now
//           </button>
//         </motion.div>
//       </motion.div>
//     );
//   }

//   if (error || !profileUser) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200"
//       >
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.3 }}
//           className="p-8 bg-white shadow-xl rounded-2xl"
//         >
//           <h2 className="mb-4 text-2xl font-bold text-center text-red-700">
//             Error
//           </h2>
//           <p className="mb-6 text-gray-600">{error || "Failed to load user profile."}</p>
//           <button
//             onClick={() => navigate('/feed')}
//             className="w-full py-3 font-medium text-white transition-all bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg"
//           >
//             Back to Feed
//           </button>
//         </motion.div>
//       </motion.div>
//     );
//   }

//   const mainContainerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   };

//   return (
//     <div
//       className={`w-full min-h-screen overflow-x-hidden transition-colors duration-300 ${
//         isDarkMode
//           ? 'bg-gray-900 text-white'
//           : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100'
//       }`}
//     >
//       <motion.div
//         variants={mainContainerVariants}
//         initial="hidden"
//         animate="visible"
//         className="max-w-full px-4 py-8 pt-24 mx-auto sm:px-6 lg:px-8"
//       >
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr_380px]">
//           <motion.div
//             variants={itemVariants}
//             className="overflow-hidden transition-all duration-300 transform bg-white shadow-2xl md:col-span-2 rounded-2xl dark:bg-gray-800 hover:shadow-indigo-200"
//           >
//             <ProfileHeader
//               profileUser={profileUser}
//               userId={userId}
//               isDarkMode={isDarkMode}
//               setIsDarkMode={setIsDarkMode}
//             />
//             <motion.div variants={itemVariants} className="px-6 pb-6">
//               <ProfileInfo profileUser={profileUser} isDarkMode={isDarkMode} />
//               <ProfileStats profileUser={profileUser} isDarkMode={isDarkMode} />
//               <ProfileAbout profileUser={profileUser} isDarkMode={isDarkMode} />
//             </motion.div>
//           </motion.div>

//           <div className="space-y-6">
//             <motion.div variants={itemVariants}>
//               <RecentActivity isDarkMode={isDarkMode} />
//             </motion.div>
//             <motion.div variants={itemVariants}>
//               <QuickActions userId={userId} isDarkMode={isDarkMode} />
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default UserProfilePage;

import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import ProfileHeader from '../../components/User/Profile/ProfileHeader';
import ProfileInfo from '../../components/User/Profile/ProfileInfo';
import ProfileStats from '../../components/User/Profile/ProfileStats';
import ProfileAbout from '../../components/User/Profile/ProfileAbout';
import RecentActivity from '../../components/User/Profile/RecentActivity';
import QuickActions from '../../components/User/Profile/QuickActions';
import Navbar from "../../components/common/Navbar";

function UserProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        console.error("No userId provided in URL");
        navigate("/not-found");
        return;
      }

      try {
        console.log("Fetching user data for userId:", userId);
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          withCredentials: true,
        });
        console.log("API Response:", response.data);
        if (response.data.user) {
          setProfileUser(response.data.user);
        } else {
          console.error("No user data found in response");
          navigate("/not-found");
        }
      } catch (error) {
        console.error('Error fetching user:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          navigate("/login");
        } else if (error.response?.status === 404) {
          navigate("/not-found");
        } else {
          navigate("/error");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchUser();
    } else if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [userId, isAuthenticated, authLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await axios.post(`http://localhost:5000/api/auth/logout`, {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              boxShadow: [
                "0px 0px 0px rgba(79, 70, 229, 0.2)",
                "0px 0px 20px rgba(79, 70, 229, 0.7)",
                "0px 0px 0px rgba(79, 70, 229, 0.2)",
              ],
            }}
            transition={{
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 1.5, repeat: Infinity },
            }}
            className="w-16 h-16 border-4 border-transparent rounded-full border-t-indigo-600 border-r-indigo-500"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 font-medium text-indigo-600"
          >
            Loading profile...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8 bg-white shadow-xl rounded-2xl"
        >
          <h2 className="mb-4 text-2xl font-bold text-center text-indigo-700">
            Authentication Required
          </h2>
          <p className="mb-6 text-gray-600">Please log in to view this profile page.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 font-medium text-white transition-all bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg"
          >
            Login Now
          </button>
        </motion.div>
      </motion.div>
    );
  }

  if (!profileUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200"
      >
        <h2 className="mb-4 text-2xl font-bold text-center text-indigo-700">
          User Not Found
        </h2>
        <p className="mb-6 text-gray-600">The requested user profile could not be loaded.</p>
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 font-medium text-white transition-all bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg"
        >
          Go to Home
        </button>
      </motion.div>
    );
  }

  const mainContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className={`w-full min-h-screen overflow-x-hidden transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gray-900 text-white'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100'
      }`}
    >
      <Navbar/>
      <motion.div
        variants={mainContainerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-full px-4 py-8 pt-24 mx-auto sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr_380px]">
          <motion.div
            variants={itemVariants}
            className="overflow-hidden transition-all duration-300 transform bg-white shadow-2xl md:col-span-2 rounded-2xl dark:bg-gray-800 hover:shadow-indigo-200"
          >
            <ProfileHeader
              profileUser={profileUser}
              userId={userId}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
            <motion.div variants={itemVariants} className="px-6 pb-6">
              <ProfileInfo profileUser={profileUser} isDarkMode={isDarkMode} />
              <ProfileStats profileUser={profileUser} isDarkMode={isDarkMode} />
              <ProfileAbout profileUser={profileUser} isDarkMode={isDarkMode} />
            </motion.div>
          </motion.div>

          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <RecentActivity isDarkMode={isDarkMode} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <QuickActions userId={userId} isDarkMode={isDarkMode} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default UserProfilePage;
