import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/common/NewPageHeader';
import ProfileHeader from '../../components/User/Profile/ProfileHeader';
import ProfileInfo from '../../components/User/Profile/ProfileInfo';
import ProfileStats from '../../components/User/Profile/ProfileStats';
import ProfileAbout from '../../components/User/Profile/ProfileAbout';
import RecentActivity from '../../components/User/Profile/RecentActivity';
import QuickActions from '../../components/User/Profile/QuickActions';

const UserProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, { withCredentials: true });
        setProfileUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
        if (error.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchUser();
    } else if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [userId, isAuthenticated, authLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await axios.post(`http://localhost:5000/api/auth/logout`, {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-100">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' }, scale: { duration: 1, repeat: Infinity, repeatType: 'reverse' } }}
          className="w-20 h-20 border-4 border-transparent rounded-full shadow-2xl border-t-orange-500 border-r-orange-600"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div className="p-4 text-center text-gray-500">Please log in to view this page.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-cream-100">
      <Navbar
        currentUser={user}
        onSignOut={handleSignOut}
        isDarkMode={false}
        setIsDarkMode={() => {}}
      />
      <div className="px-4 py-8 pt-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]"
        >
          <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
            <ProfileHeader profileUser={profileUser} userId={userId} isDarkMode={false} />
            <div className="px-6 pb-6">
              <ProfileInfo profileUser={profileUser} isDarkMode={false} />
              <ProfileStats profileUser={profileUser} isDarkMode={false} />
              <ProfileAbout profileUser={profileUser} isDarkMode={false} />
            </div>
          </div>
          <div className="space-y-6">
            <RecentActivity isDarkMode={false} />
            <QuickActions userId={userId} isDarkMode={false} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;