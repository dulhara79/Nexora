import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import PostCard from "../../components/post/PostCard";
import Navbar from "../../components/common/NewPageHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  const fetchSavedPosts = async () => {
    console.log("Fetching saved posts with token:", token);
    try {
      const response = await axios.get("http://localhost:5000/api/posts/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      console.log("Saved posts response:", response.data);
      const postsData = response.data.map((item) => item.post);
      const sortedPosts = postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching saved posts:", error.response?.status, error.response?.data);
      toast.error("Failed to load saved posts. Please try logging in again.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchSavedPosts();
    } else {
      console.log("No user or token, skipping fetch");
      setLoading(false);
    }
  }, [user, token]);

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

  const handleNewNotification = () => {
    // Optionally fetch notifications
  };

  const handleMediaClick = (mediaUrl, mediaType) => {
    // Optionally handle media zoom
  };

  return (
    <div className="min-h-screen text-gray-900 bg-amber-50">
      <Navbar />
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl p-6 mx-auto"
      >
        <div className="p-6 bg-white shadow-md rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amber-800">Saved Posts</h2>
            {!loading && posts.length > 0 && (
              <p className="text-gray-500">
                {posts.length} {posts.length === 1 ? "post" : "posts"} saved
              </p>
            )}
          </div>
          {loading ? (
            <div className="py-12">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-amber-500"></div>
              </div>
              <p className="mt-4 text-center text-gray-600">Loading saved posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              className="py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mb-2 text-xl text-gray-600">No saved posts yet</p>
              <p className="text-gray-500">Save posts to view them here!</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
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
                    className="p-6 rounded-lg shadow-md bg-amber-50"
                  >
                    <PostCard
                      post={post}
                      user={user?.id}
                      onUpdatePost={handleUpdatePost}
                      onDeletePost={handleDeletePost}
                      onNewNotification={handleNewNotification}
                      onMediaClick={handleMediaClick}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SavedPosts;