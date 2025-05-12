import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import PostCard from "../../components/post/PostCard";
import CreatePost from "../../pages/post/CreatePost";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/common/NewPageHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

// Create Theme Context
export const ThemeContext = createContext();

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [zoomedMedia, setZoomedMedia] = useState(null);
  const { user, token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      const postsData = response.data.map((item) => item.post);
      const sortedPosts = postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error.response?.status, error.response?.data);
      toast.error("Failed to load posts.", { position: "top-right" });
    }
  };

  const fetchNotifications = async () => {
    try {
      console.log("Token:", token); // Debug token
      const response = await axios.get("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      const notificationsData = response.data.map((item) => item.notification);
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error.response?.status, error.response?.data);
      toast.error("Failed to load notifications. Please try logging in again.", { position: "top-right" });
    }
  };

  const updatePostAfterEdit = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setPosts((prev) =>
        prev
          .map((p) => (p.id === postId ? response.data.post : p))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (error) {
      console.error("Error updating post after edit:", error.response?.status, error.response?.data);
      toast.error("Failed to update post.", { position: "top-right" });
    }
  };

  useEffect(() => {
    if (user && token) {
      setLoading(true);
      Promise.all([fetchPosts(), fetchNotifications()]).finally(() => setLoading(false));

      // Polling for updates every 15 seconds
      const interval = setInterval(() => {
        Promise.all([fetchPosts(), fetchNotifications()]).catch((error) =>
          console.error("Polling error:", error)
        );
      }, 15000);

      return () => clearInterval(interval); // Cleanup polling on unmount
    }
  }, [user, token]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editedPostId = params.get("editedPostId");
    if (editedPostId) {
      updatePostAfterEdit(editedPostId);
    }
  }, [location]);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark bg-gray-900" : "bg-amber-50";
  }, [theme]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost.post, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    toast.success("Your post has been shared with the community!", { position: "top-right" });
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) =>
      prev
        .map((p) => (p.id === updatedPost.id ? updatedPost : p))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    toast.info("Post deleted successfully", { position: "top-right" });
  };

  const handleMediaClick = (mediaUrl, mediaType) => {
    setZoomedMedia({ url: mediaUrl, type: mediaType });
  };

  const closeZoomedMedia = () => {
    setZoomedMedia(null);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-amber-50 text-gray-900"}`}>
        <Navbar />
        <ToastContainer theme={theme} />
        
        <div className="fixed z-10 space-y-4 bottom-5 right-6">
          <button 
            onClick={() => navigate("/post-notifications")}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
              theme === "dark" 
                ? "bg-gray-800 text-amber-300 hover:bg-gray-700" 
                : "bg-white text-amber-600 hover:bg-amber-50"
            }`}
            aria-label="View notifications"
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {notifications.length}
                </span>
              )}
            </div>
          </button>
          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
              theme === "dark" 
                ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" 
                : "bg-white text-amber-500 hover:bg-amber-50"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl p-6 mx-auto"
        >
          <div className={`p-6 mb-8 shadow-md rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`mb-4 text-2xl font-bold ${theme === "dark" ? "text-amber-300" : "text-amber-800"}`}>Share Your Post</h2>
            <CreatePost onPostCreated={handlePostCreated} />
          </div>

          <div className={`p-6 shadow-md rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-amber-300" : "text-amber-800"}`}>Community Posts</h2>
              {!loading && posts.length > 0 && (
                <p className={theme === "dark" ? "text-gray-300" : "text-gray-500"}>
                  {posts.length} {posts.length === 1 ? "post" : "posts"} found
                </p>
              )}
            </div>
            
            {loading ? (
              <div className="py-12">
                <div className="flex items-center justify-center">
                  <div className={`w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin ${theme === "dark" ? "border-amber-300" : "border-amber-500"}`}></div>
                </div>
                <p className={`mt-4 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <motion.div
                className="py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-16 h-16 mx-auto mb-4 ${theme === "dark" ? "text-amber-400" : "text-amber-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className={`mb-2 text-xl ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>No posts yet</p>
                <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Be the first to share your culinary masterpiece!</p>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }} // Fixed Becker issue
                transition={{ staggerChildren: 0.2 }}
              >
                <AnimatePresence>
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-700" : "bg-amber-50"}`}
                    >
                      <PostCard
                        post={post}
                        user={user?.id}
                        onUpdatePost={handleUpdatePost}
                        onDeletePost={handleDeletePost}
                        onNewNotification={fetchNotifications}
                        onMediaClick={handleMediaClick}
                        theme={theme}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        <AnimatePresence>
          {zoomedMedia && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
              onClick={closeZoomedMedia}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full top-4 right-4 hover:bg-opacity-70"
                  onClick={closeZoomedMedia}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {zoomedMedia.type === "image" ? (
                  <img 
                    src={zoomedMedia.url} 
                    alt="Zoomed content" 
                    className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                  />
                ) : (
                  <video 
                    src={zoomedMedia.url} 
                    controls 
                    autoPlay 
                    className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
};

export default Home;