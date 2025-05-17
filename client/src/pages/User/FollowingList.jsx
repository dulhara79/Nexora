import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import FallbackAvatar from '../../components/common/FallbackAvatar';
import { UserPlus, UserCheck } from 'lucide-react';
import Navbar from '../../components/common/NewPageHeader';

const FollowingList = () => {
  const { user, isAuthenticated, authLoading, token } = useContext(AuthContext);
  const { userId } = useParams();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}`  },
          withCredentials: true,
        });
        setFollowing(response.data.following || []);
      } catch (error) {
        console.error('Error fetching following:', error);
        if (error.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchFollowing();
    } 
    // else if (!authLoading && !isAuthenticated) {
    //   navigate('/login');
    // }
  }, [userId, isAuthenticated, authLoading, navigate]);

  // const handleFollowToggle = async (targetUserId) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const isFollowing = following.find(u => u.id === targetUserId)?.isFollowing;
  //     const endpoint = isFollowing
  //       ? `/api/users/${user.id}/unfollow/${targetUserId}`
  //       : `/api/users/${user.id}/follow/${targetUserId}`;
      
  //     await axios.post(`http://localhost:5000${endpoint}`, {
  //       headers: { Authorization: `Bearer ${token}`  },
  //       withCredentials: true,
  //     });
      
  //     setFollowing(prevFollowing =>
  //       prevFollowing.map(u =>
  //         u.id === targetUserId ? { ...u, isFollowing: !isFollowing } : u
  //       )
  //     );
  //   } catch (error) {
  //     console.error('Error toggling follow:', error);
  //     if (error.response?.status === 401) {
  //       navigate('/login');
  //     }
  //   }
  // };

 const handleFollowToggle = async (targetUserId) => {
  try {
    const token = localStorage.getItem('token');
    const isFollowing = following.find(u => u.id === targetUserId)?.isFollowing;

    const endpoint = isFollowing
      ? `/api/users/${user.id}/unfollow/${targetUserId}`
      : `/api/users/${user.id}/follow/${targetUserId}`;

    await axios.post(
      `http://localhost:5000${endpoint}`,
      {}, // empty body
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    setFollowing(prevFollowing =>
      prevFollowing.map(u =>
        u.id === targetUserId ? { ...u, isFollowing: !isFollowing } : u
      )
    );
  } catch (error) {
    console.error('Error toggling follow:', {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      stack: error.stack
    });
    if (error.response?.status === 401) {
      navigate('/login');
    }
  }
};
  
  const handleSignOut = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, withCredentials: true }
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
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Following</h2>
          {following.length === 0 ? (
            <p className="text-gray-500">Not following anyone yet.</p>
          ) : (
            <div className="space-y-4">
              {following.map((followedUser) => (
                <div
                  key={followedUser.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <a
                    href={`/profile/${followedUser.id}`}
                    className="flex items-center space-x-3"
                  >
                    <FallbackAvatar
                      src={followedUser.profilePhotoUrl}
                      name={followedUser.name || 'User'}
                      size={10}
                    />
                    <div>
                      <p className="font-medium text-gray-800">{followedUser.name}</p>
                      <p className="text-sm text-gray-500">@{followedUser.username}</p>
                    </div>
                  </a>
                  {followedUser.id !== user.id && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFollowToggle(followedUser.id)}
                      className={`px-4 py-1 font-medium rounded-full ${
                        followedUser.isFollowing
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-500'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {followedUser.isFollowing ? (
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

export default FollowingList;