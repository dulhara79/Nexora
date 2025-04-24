import { useState, useEffect, useContext } from "react";
import axios from "axios";
import PostCard from "../../components/post/PostCard";
import CreatePost from "../../pages/post/CreatePost";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import Navbar from "../../components/post/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns"; // Add this import

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/posts", {
        withCredentials: true,
      });
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notifications", {
        withCredentials: true,
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      const errorMessage = error.response?.data || "Failed to load notifications.";
      toast.error(errorMessage, { position: "top-right" });
    }
  };

  // Fetch updated post after returning from EditPost
  const updatePostAfterEdit = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts(prev =>
        prev.map(p => (p.id === postId ? response.data : p))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (error) {
      console.error("Error updating post after edit:", error);
      toast.error("Failed to update post.", { position: "top-right" });
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Check if returning from EditPost and update the specific post
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editedPostId = params.get("editedPostId");
    if (editedPostId) {
      updatePostAfterEdit(editedPostId);
    }
  }, [location]);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(prev =>
      prev.map(p => (p.id === updatedPost.id ? updatedPost : p))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  };

  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl p-6 mx-auto"
      >
        {/* Create Post Section */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="p-4 mb-6 rounded-lg shadow-md bg-orange-50">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Notifications</h3>
            <div className="space-y-2">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-white border-l-4 border-orange-500 rounded-lg shadow-sm"
                >
                  <p className="text-gray-700">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Post Feed */}
        <h2 className="mt-6 mb-8 text-3xl font-bold text-gray-800">Community Posts</h2>
        {loading ? (
          <motion.div
            className="text-center text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading posts...
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            className="text-center text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No posts yet. Be the first to share!
          </motion.div>
        ) : (
          <motion.div
            className="space-y-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ staggerChildren: 0.2 }}
          >
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                user={user?.id}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
                onNewNotification={fetchNotifications}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default Home;