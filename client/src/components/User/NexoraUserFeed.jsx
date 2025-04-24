import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import PostCard from "../../components/post/PostCard";
import SuggestedUsers from "../../components/User/Profile/SuggestedUsers";
import LoadingSpinner from "../../components/User/LoadingSpinner";
import TabButton from "../../components/common/Button";
import Navbar from "../../components/post/Navbar";
import { LogIn, UserPlus } from "lucide-react";
import { throttle } from "lodash";

const API_URL = "http://localhost:5000/api";

const UserFeedPage = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const observer = useRef(null);

  const fetchPosts = useCallback(
    async (reset = false) => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      try {
        const endpoint =
          activeTab === "feed"
            ? "/feedposts"
            : activeTab === "discover"
            ? "/discoverposts"
            : "/bookmarkposts";
        const response = await axios.get(`${API_URL}${endpoint}`, {
          params: { page, limit: 10 },
          withCredentials: true,
        });
        const newPosts = response.data || [];
        setPosts((prev) => {
          const existingIds = new Set(prev.map((post) => post.id));
          const uniqueNewPosts = newPosts.filter(
            (post) => !existingIds.has(post.id)
          );
          return reset ? uniqueNewPosts : [...prev, ...uniqueNewPosts];
        });
        setHasMore(newPosts.length === 10);
        setPage((prev) => prev + 1);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [activeTab, isLoading, hasMore, page]
  );

  useEffect(() => {
    fetchPosts(true);
  }, [activeTab, fetchPosts]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchPosts]
  );

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? response.data : post))
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/comment`,
        { comment },
        { withCredentials: true }
      );
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? response.data : post))
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const Row = ({ index, style }) => {
    const post = posts[index];
    return (
      <div style={style} className="py-2">
        {index === posts.length - 1 ? (
          <div ref={lastPostElementRef}>
            <PostCard
              post={post}
              currentUser={user}
              isDarkMode={isDarkMode}
              onLike={handleLike}
              onComment={handleComment}
            />
          </div>
        ) : (
          <PostCard
            post={post}
            currentUser={user}
            isDarkMode={isDarkMode}
            onLike={handleLike}
            onComment={handleComment}
          />
        )}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Navbar
        currentUser={user}
        onSignOut={logout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <div className="flex flex-col gap-6 px-4 pt-20 pb-10 mx-auto max-w-7xl lg:flex-row">
        {isAuthenticated ? (
          <div className="lg:w-3/4">
            <motion.div
              className="flex gap-6 mb-6 border-b border-gray-700"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {["feed", "discover", "bookmarks"].map((tab) => (
                <TabButton
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setPosts([]);
                    setPage(1);
                    setHasMore(true);
                    fetchPosts(true);
                  }}
                  isDarkMode={isDarkMode}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabButton>
              ))}
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    width={width}
                    itemCount={posts.length}
                    itemSize={400} // Adjust based on PostCard height
                    className="pb-10"
                  >
                    {Row}
                  </List>
                )}
              </AutoSizer>
              {isLoading && <LoadingSpinner isDarkMode={isDarkMode} />}
              {!hasMore && posts.length > 0 && (
                <motion.p
                  className="mt-6 text-center text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No more posts to load
                </motion.p>
              )}
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="py-20 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="mb-6 text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Welcome to Nexora
            </motion.h2>
            <p
              className={`text-lg mb-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Connect, share, and explore with our vibrant community
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
              >
                <LogIn size={18} />
                Login
              </a>
              <a
                href="/signup"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all"
              >
                <UserPlus size={18} />
                Sign Up
              </a>
            </div>
          </motion.div>
        )}
        {isAuthenticated && (
          <motion.div
            className="lg:w-1/4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SuggestedUsers isDarkMode={isDarkMode} currentUser={user} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserFeedPage;
