import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from '../../components/User/Navbar';
import ProfileHeader from '../../components/User/Profile/ProfileHeader';
import ProfileInfo from '../../components/User/Profile/ProfileInfo';
import ProfileStats from '../../components/User/Profile/ProfileStats';
import ProfileAbout from '../../components/User/Profile/ProfileAbout';
import RecentActivity from '../../components/User/Profile/RecentActivity';
import QuickActions from '../../components/User/Profile/QuickActions';

function UserProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, { withCredentials: true });
        setProfileUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        if (error.response?.status === 401) {
          navigate("/login");
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity, repeatType: "reverse" } }}
          className="w-20 h-20 border-4 border-transparent rounded-full shadow-2xl border-t-blue-600 border-r-blue-500"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <Navbar 
        currentUser={user} 
        onSignOut={handleSignOut} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />
      <div className="max-w-full px-4 py-8 pt-24 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_1fr_380px]">
          <div className="overflow-hidden bg-white shadow-2xl md:col-span-2 rounded-2xl">
            <ProfileHeader profileUser={profileUser} userId={userId} />
            <div className="px-6 pb-6">
              <ProfileInfo profileUser={profileUser} />
              <ProfileStats profileUser={profileUser} />
              <ProfileAbout profileUser={profileUser} />
            </div>
          </div>
          <div className="hidden space-y-6 md:block">
            <RecentActivity />
            <QuickActions userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;