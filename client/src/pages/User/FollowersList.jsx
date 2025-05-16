import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import FallbackAvatar from '../../components/common/FallbackAvatar';
import { UserPlus, UserCheck } from 'lucide-react';
import Navbar from '../../components/common/NewPageHeader';

const FollowersList = () => {
  const { user, isAuthenticated, authLoading, token } = useContext(AuthContext);
  const { userId } = useParams();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}/followers`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setFollowers(response.data.followers || []);
      } catch (error) {
        console.error('Error fetching followers:', error);
        // if (error.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchFollowers();
    } 
    // else if (!authLoading && !isAuthenticated) {
    //   navigate('/login');
    // }
  }, [userId, isAuthenticated, authLoading, navigate]);

  console.log(  'Followers:', followers);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("authLoading:", authLoading); 
  console.log("userId:", userId);
  console.log("token:", token);

  const handleFollowToggle = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      const isFollowing = followers.find(u => u.id === targetUserId)?.isFollowing;
      const endpoint = isFollowing
        ? `/api/users/${user.id}/unfollow/${targetUserId}`
        : `/api/users/${user.id}/follow/${targetUserId}`;
      
      await axios.post(`http://localhost:5000${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      
      setFollowers(prevFollowers =>
        prevFollowers.map(u =>
          u.id === targetUserId ? { ...u, isFollowing: !isFollowing } : u
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
      if (error.response?.status === 401) {
        // navigate('/login');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}`  }, withCredentials: true }
      );
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
          transition={{
            rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity, repeatType: 'reverse' },
          }}
          className="w-20 h-20 border-4 border-transparent rounded-full shadow-2xl border-t-orange-500 border-r-orange-600"
        />
      </div>
    );
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
          className="p-6 bg-white shadow-xl rounded-2xl"
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Followers</h2>
          {followers.length === 0 ? (
            <p className="text-gray-500">No followers yet.</p>
          ) : (
            <div className="space-y-4">
              {followers.map((follower) => (
                <div
                  key={follower.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <a
                    href={`/profile/${follower.id}`}
                    className="flex items-center space-x-3"
                  >
                    <FallbackAvatar
                      src={follower.profilePhotoUrl}
                      name={follower.name || 'User'}
                      size={10}
                    />
                    <div>
                      <p className="font-medium text-gray-800">{follower.name}</p>
                      <p className="text-sm text-gray-500">@{follower.username}</p>
                    </div>
                  </a>
                  {follower.id !== user.id && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFollowToggle(follower.id)}
                      className={`px-4 py-1 font-medium rounded-full ${
                        follower.isFollowing
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-500'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {follower.isFollowing ? (
                        <div className="flex items-center">
                          <UserCheck className="w-4 h-4 mr-2" />
                          Following
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Follow
                        </div>
                      )}
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FollowersList;