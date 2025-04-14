import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "./Navbar";
import TabButton from "./TabButton";
import LoadingSpinner from "./LoadingSpinner";
import FeedPost from "./FeedPost";
import AuthButton from "./AuthButton";
import { LogIn, UserPlus } from "lucide-react";

const API_URL = "http://localhost:5000/api";

function NexoraUserFeed() {
  const [activeTab, setActiveTab] = useState("feed");
  const [feed, setFeed] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    fetchFeed();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/check-session`, {
        withCredentials: true,
      });
      setCurrentUser({
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      await axios.post(`${API_URL}/auth/login`, { email, password });
      const otp = prompt("Enter OTP");
      const response = await axios.post(
        `${API_URL}/auth/login/verify`,
        { email, otp },
        { withCredentials: true }
      );
      setCurrentUser({
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
      });
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + error.response?.data?.error);
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setCurrentUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchFeed = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/posts`, {
        withCredentials: true,
      });
      setFeed(response.data);
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "text-white bg-gray-900" : "text-gray-900 bg-gray-100"
      }`}
    >
      
      <Navbar 
        currentUser={currentUser} 
        onSignOut={handleSignOut} 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      
      <motion.div
        className="max-w-4xl px-4 pt-24 pb-20 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {currentUser ? (
          <motion.div variants={itemVariants}>
            <div
              className={`flex gap-6 mb-8 border-b ${
                isDarkMode ? "border-gray-800" : "border-gray-200"
              }`}
            >
              {["feed", "discover", "bookmarks"].map((tab) => (
                <TabButton
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  NTA
                  isDarkMode={isDarkMode}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabButton>
              ))}
            </div>

            {isLoading ? (
              <LoadingSpinner isDarkMode={isDarkMode} />
            ) : (
              <AnimatePresence>
                {(activeTab === "feed" || activeTab === "bookmarks") && (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {feed
                      .filter(
                        (post) =>
                          activeTab === "feed" ||
                          currentUser?.bookmarkedPosts?.includes(post.id)
                      )
                      .map((post) => (
                        <FeedPost
                          key={post.id}
                          post={post}
                          currentUser={currentUser}
                          isDarkMode={isDarkMode}
                        />
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        ) : (
          <motion.div className="py-20 text-center" variants={itemVariants}>
            <motion.h2
              className="mb-6 text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Welcome to Nexora
            </motion.h2>
            <p
              className={`mb-8 text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Join our community to explore amazing content
            </p>
            <div className="flex justify-center gap-4">
              <AuthButton href="/login" Icon={LogIn} isDarkMode={isDarkMode}>
                Login
              </AuthButton>
              <AuthButton
                href="/signup"
                Icon={UserPlus}
                primary
                isDarkMode={isDarkMode}
              >
                Sign Up
              </AuthButton>
            </div>
          </motion.div>
        )}
      </motion.div>

      {!currentUser && (
        <motion.div
          className={`fixed bottom-0 left-0 right-0 p-4 border-t ${
            isDarkMode
              ? "border-gray-700 bg-gray-800/90"
              : "border-gray-200 bg-gray-100/90"
          } backdrop-blur-md`}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <p
            className={`text-center ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Have an account?{" "}
            <a
              href="/login"
              className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Login to continue
            </a>
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default NexoraUserFeed;
