import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { debounce } from "lodash";
import LoadingSpinner from "../../User/LoadingSpinner";

const API_URL = "http://localhost:5000/api";

const SuggestedUsers = ({ isDarkMode, currentUser }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestedUsers = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/users/suggested/${currentUser.id}`,
        {
          withCredentials: true,
          params: { limit: 5 },
        }
      );
      const users = response.data || [];
      setSuggestedUsers(
        users.map((user) => ({
          ...user,
          isFollowing: currentUser.following.includes(user.id),
        }))
      );
    } catch (err) {
      console.error("Error fetching suggested users:", err);
      setError("Failed to load suggested users");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  const handleFollowToggle = debounce(async (targetUserId) => {
    const user = suggestedUsers.find((u) => u.id === targetUserId);
    if (!user) return;

    const prevIsFollowing = user.isFollowing;
    setSuggestedUsers((prev) =>
      prev.map((u) =>
        u.id === targetUserId ? { ...u, isFollowing: !prevIsFollowing } : u
      )
    );
    setError(null);

    try {
      const endpoint = prevIsFollowing
        ? `/users/${currentUser.id}/unfollow/${targetUserId}`
        : `/users/${currentUser.id}/follow/${targetUserId}`;
      await axios.post(`${API_URL}${endpoint}`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Error toggling follow:", err);
      setSuggestedUsers((prev) =>
        prev.map((u) =>
          u.id === targetUserId ? { ...u, isFollowing: prevIsFollowing } : u
        )
      );
      setError(err.response?.data || "Failed to update follow status");
    }
  }, 300);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className={`p-6 rounded-2xl shadow-xl ${
        isDarkMode
          ? "bg-gray-800/90 backdrop-blur-sm"
          : "bg-white/90 backdrop-blur-sm"
      } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3
        className={`text-xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        } bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Connect with Others
      </motion.h3>
      {isLoading && <LoadingSpinner isDarkMode={isDarkMode} />}
      {error && (
        <motion.p
          className={`text-sm mb-4 ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
      {!isLoading && suggestedUsers.length === 0 && !error && (
        <motion.p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No new users to suggest
        </motion.p>
      )}
      <AnimatePresence>
        {suggestedUsers.map((user) => (
          <motion.div
            key={user.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
            } transition-colors duration-200`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <motion.img
                src={user.profilePhotoUrl || "/placeholder.jpg"}
                alt={user.name}
                className="object-cover w-12 h-12 border-2 border-indigo-500 rounded-full"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
              <div className="ml-4">
                <p
                  className={`font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.name}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  @{user.username}
                </p>
                {user.likeSkill && (
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  >
                    Interested in {user.likeSkill}
                  </p>
                )}
              </div>
            </div>
            <motion.button
              className={`px-4 py-1.5 rounded-full text-sm font-medium text-white ${
                user.isFollowing
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              } transition-all duration-200`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleFollowToggle(user.id)}
            >
              {user.isFollowing ? "Unfollow" : "Follow"}
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default SuggestedUsers;
