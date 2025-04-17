import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Navigate } from "react-router-dom"; // Import Navigate
import {
  HiOutlineFire,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineBookmark,
  HiOutlineChat,
  HiOutlineThumbUp,
  HiOutlineEye,
  HiChevronRight,
  HiOutlineTag,
} from "react-icons/hi";
import axios from "axios";
import Header from "../../components/Forum/Header";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

// Error Boundary Component (unchanged)
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500">
          Something went wrong. Please try again.
        </div>
      );
    }
    return this.props.children;
  }
}

const HomePage = () => {
  const { isAuthenticated, loading } = useContext(AuthContext); // Use AuthContext
  const [activeTab, setActiveTab] = useState("trending");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const [posts, setPosts] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [communitySpotlight, setCommunitySpotlight] = useState([]);
  const [dataLoading, setLoading] = useState(true); // Renamed to avoid conflict
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setIsLoaded(true);
      const timer = setTimeout(() => {
        setShowWelcomeCard(false);
      }, 5000);
      fetchInitialData();
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [activeTab, isAuthenticated]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const tagsResponse = await axios.get(`${API_BASE_URL}/tags`, {
        withCredentials: true,
      });
      setTrendingTags(tagsResponse.data.map((tag) => tag.name));

      const communitiesResponse = await axios.get(
        `${API_BASE_URL}/communities`,
        {
          withCredentials: true,
        }
      );

      console.log("Communities response:", communitiesResponse.data); // Debugging

      setCommunitySpotlight(
        communitiesResponse.data.map((community) => ({
          id: community.id || "unknown",
          name: community.name || "Unnamed Community",
          members: community.members || 0,
          description: community.description || "No description available",
          color: getRandomGradient(),
          icon: community.icon || "🌟",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
      setError("Failed to load tags or communities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let sortBy = "";
      if (activeTab === "trending") sortBy = "mostCommented";
      if (activeTab === "latest") sortBy = "newest";
      if (activeTab === "popular") sortBy = "mostCommented";
      if (activeTab === "following") {
        await fetchSavedPosts();
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/questions`, {
        params: { sortBy },
        withCredentials: true,
      });

      console.log("Posts response:", response.data);

      const transformedPosts = response.data.map((post) => ({
        id: post.id || "unknown",
        title: post.title || "Untitled",
        author: post.authorUsername || "Anonymous",
        authorAvatar: post.authorUsername?.[0]?.toUpperCase() || "A",
        authorColor: getRandomGradient(),
        content: post.description || "",
        tags: Array.isArray(post.tags) ? post.tags : [],
        likes: post.upvoteUserIds?.length || 0,
        comments: post.commentIds?.length || 0,
        views: post.views || 0,
        timeAgo: calculateTimeAgo(post.createdAt || new Date()),
        isPinned: post.isPinned || false,
        isHot: (post.commentIds?.length || 0) > 10,
      }));

      setPosts(transformedPosts);
    } catch (err) {
      console.error("Fetch posts error:", err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/questions/saved`, {
        withCredentials: true,
      });

      console.log("Saved posts response:", response.data);

      const transformedPosts = response.data.map((post) => ({
        id: post.id || "unknown",
        title: post.title || "Untitled",
        author: post.authorUsername || "Anonymous",
        authorAvatar: post.authorUsername?.[0]?.toUpperCase() || "A",
        authorColor: getRandomGradient(),
        content: post.description || "",
        tags: Array.isArray(post.tags) ? post.tags : [],
        likes: post.upvoteUserIds?.length || 0,
        comments: post.commentIds?.length || 0,
        views: post.views || 0,
        timeAgo: calculateTimeAgo(post.createdAt || new Date()),
        isPinned: post.isPinned || false,
        isHot: (post.commentIds?.length || 0) > 10,
      }));

      setPosts(transformedPosts);
    } catch (err) {
      console.error("Fetch saved posts error:", err);
      setError("Failed to load saved posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/questions/${postId}/upvote`,
        {},
        { withCredentials: true }
      );
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, likes: response.data.upvoteUserIds?.length || 0 }
            : post
        )
      );
    } catch (err) {
      console.error("Failed to upvote:", err);
      setError("Failed to upvote post. Please try again.");
    }
  };

  const handleSave = async (postId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/questions/${postId}/save`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to save:", err);
      setError("Failed to save post. Please try again.");
    }
  };

  const getRandomGradient = () => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-purple-500 to-pink-600",
      "from-amber-500 to-orange-600",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInSeconds = Math.floor((now - created) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const tabContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const tabItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
      },
    },
  };

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <main className="max-w-6xl px-4 pt-6 pb-16 mx-auto">
          <AnimatePresence>
            {showWelcomeCard && (
              <motion.div
                className="relative mb-6 overflow-hidden shadow-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative z-10 flex flex-col items-start justify-between p-6 md:flex-row md:items-center">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold text-white">
                      Welcome to Nexora Forum
                    </h2>
                    <p className="mt-1 text-blue-100">
                      Join the conversation with developers worldwide
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                    <motion.button
                      className="px-4 py-2 font-medium text-blue-700 bg-white rounded-lg shadow-md hover:bg-blue-50"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Join Now
                    </motion.button>
                    <motion.button
                      className="px-4 py-2 font-medium text-blue-100 border border-blue-400 rounded-lg hover:bg-blue-700"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowWelcomeCard(false)}
                    >
                      Dismiss
                    </motion.button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="white"
                      d="M41.3,-51.2C54.4,-42.9,66.6,-30.9,71.7,-16.2C76.7,-1.5,74.7,15.9,67.1,30.8C59.5,45.6,46.3,58,31,64.4C15.8,70.8,-1.5,71.2,-16.9,65.8C-32.4,60.5,-45.9,49.3,-56,35.5C-66,21.6,-72.5,5.2,-71.7,-11.4C-70.9,-28,-62.7,-44.8,-49.5,-53.3C-36.4,-61.8,-18.2,-62,-1.3,-60.4C15.5,-58.9,31.1,-55.6,41.3,-51.2Z"
                      transform="translate(100 100)"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 w-40 h-40 opacity-10">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="white"
                      d="M47.2,-57.2C59.9,-45.8,68.5,-29.9,70.8,-13.2C73.1,3.6,69.2,21.2,60.5,36.3C51.8,51.4,38.3,64,22.2,69.7C6.1,75.5,-12.5,74.4,-29.6,68C-46.7,61.6,-62.3,50,-71.5,33.8C-80.7,17.7,-83.5,-3,-77.7,-20.4C-71.9,-37.7,-57.5,-51.7,-42,-61.1C-26.5,-70.5,-9.8,-75.4,4,-80C17.9,-84.6,35.9,-69,47.2,-57.2Z"
                      transform="translate(100 100)"
                    />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <motion.div
                className="flex p-1 mb-6 space-x-1 overflow-x-auto bg-white rounded-lg shadow-sm dark:bg-slate-800"
                variants={tabContainerVariants}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
              >
                {["trending", "latest", "popular", "following"].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                      activeTab === tab
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50"
                    }`}
                    variants={tabItemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {tab === "trending" && (
                      <HiOutlineFire className="w-4 h-4 mr-1" />
                    )}
                    {tab === "latest" && (
                      <HiOutlineClock className="w-4 h-4 mr-1" />
                    )}
                    {tab === "popular" && (
                      <HiOutlineStar className="w-4 h-4 mr-1" />
                    )}
                    {tab === "following" && (
                      <HiOutlineBookmark className="w-4 h-4 mr-1" />
                    )}
                    {tab}
                  </motion.button>
                ))}
              </motion.div>

              {dataLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg">
                  {error}
                </div>
              ) : posts.length === 0 ? (
                <div className="p-4 text-gray-600">
                  No posts found. Be the first to ask a question!
                </div>
              ) : (
                <motion.div
                  className="space-y-4"
                  variants={cardContainerVariants}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                >
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      className="overflow-hidden transition-shadow bg-white shadow-sm rounded-xl dark:bg-slate-800 hover:shadow-md"
                      variants={cardItemVariants}
                      whileHover={{ y: -3 }}
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-to-br ${post.authorColor}`}
                            >
                              {post.authorAvatar}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {post.author}
                              </span>
                              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                                {post.timeAgo} ago
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {post.isPinned && (
                              <span className="flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 5h14M5 12h14m-5-7v14"
                                  />
                                </svg>
                                Pinned
                              </span>
                            )}
                            {post.isHot && (
                              <span className="flex items-center px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full dark:bg-orange-900/30 dark:text-orange-400">
                                <HiOutlineFire className="w-3 h-3 mr-1" />
                                Hot
                              </span>
                            )}
                          </div>
                        </div>

                        <Link to={`/forum/question/${post.id}`}>
                          <h3 className="mb-2 text-lg font-bold text-slate-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="mb-4 text-slate-600 dark:text-slate-300">
                          {post.content.length > 120
                            ? `${post.content.substring(0, 120)}...`
                            : post.content}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {Array.isArray(post.tags) && post.tags.length > 0 ? (
                            post.tags.map((tag, index) => (
                              <Link
                                key={index}
                                to={`/forum/tag/${tag}`}
                                className="flex items-center px-2 py-1 text-xs font-medium transition-colors rounded-md text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                              >
                                <HiOutlineTag className="w-3 h-3 mr-1" />
                                {tag}
                              </Link>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500">
                              No tags
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <motion.button
                              className="flex items-center text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleUpvote(post.id)}
                            >
                              <HiOutlineThumbUp className="w-4 h-4 mr-1" />
                              {post.likes}
                            </motion.button>
                            <Link
                              to={`/forum/question/${post.id}`}
                              className="flex items-center text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                            >
                              <HiOutlineChat className="w-4 h-4 mr-1" />
                              {post.comments}
                            </Link>
                            <span className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                              <HiOutlineEye className="w-4 h-4 mr-1" />
                              {post.views}
                            </span>
                          </div>
                          <motion.button
                            className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSave(post.id)}
                          >
                            <HiOutlineBookmark className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <div className="flex justify-center mt-6">
                <motion.button
                  className="px-6 py-3 font-medium text-blue-600 transition-colors bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 dark:bg-slate-800 dark:text-blue-400 dark:border-slate-700 dark:hover:bg-slate-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.8 } }}
                >
                  Load more discussions
                </motion.button>
              </div>
            </div>

            <div className="space-y-6">
              <motion.div
                className="p-5 bg-white shadow-sm rounded-xl dark:bg-slate-800"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-white">
                  Start a discussion
                </h3>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                  Have a question or idea to share with the community?
                </p>
                <Link to="/forum/ask">
                  <motion.button
                    className="w-full px-4 py-3 font-medium text-white transition-colors rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create New Post
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                className="p-5 bg-white shadow-sm rounded-xl dark:bg-slate-800"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    Community Spotlight
                  </h3>
                  <Link
                    to="/community"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {communitySpotlight.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      No communities available.
                    </p>
                  ) : (
                    communitySpotlight.map((community) => (
                      <motion.div
                        key={community.id}
                        className="p-3 transition-colors bg-white border rounded-lg shadow-sm border-slate-100 hover:border-blue-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-900"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${community.color}`}
                          >
                            <span className="text-lg">{community.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800 dark:text-white">
                              {community.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {community.members.toLocaleString()} members
                            </p>
                          </div>
                          <motion.button
                            className="p-1 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <HiChevronRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                          {community.description}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              <motion.div
                className="p-5 bg-white shadow-sm rounded-xl dark:bg-slate-800"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-white">
                  Trending Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      No trending topics available.
                    </p>
                  ) : (
                    trendingTags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/forum/tag/${tag}`}
                        className="px-3 py-1 text-sm font-medium transition-colors rounded-full text-slate-700 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/40 dark:hover:text-blue-400"
                      >
                        #{tag}
                      </Link>
                    ))
                  )}
                </div>
              </motion.div>

              <motion.div
                className="p-5 bg-white shadow-sm rounded-xl dark:bg-slate-800"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    Upcoming Events
                  </h3>
                  <Link
                    to="/events"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full dark:text-purple-400 dark:bg-purple-900/30">
                        VIRTUAL
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        Apr 20, 2025
                      </span>
                    </div>
                    <h4 className="mb-1 font-medium text-slate-800 dark:text-white">
                      Advanced React Patterns Workshop
                    </h4>
                    <p className="mb-3 text-xs text-slate-600 dark:text-slate-300">
                      Learn component composition, render props, and more
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        120 attending
                      </span>
                      <motion.button
                        className="px-3 py-1 text-xs font-medium text-blue-700 rounded-lg bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        RSVP
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full dark:text-orange-400 dark:bg-orange-900/30">
                        IN-PERSON
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        May 5, 2025
                      </span>
                    </div>
                    <h4 className="mb-1 font-medium text-slate-800 dark:text-white">
                      Nexora Community Meetup
                    </h4>
                    <p className="mb-3 text-xs text-slate-600 dark:text-slate-300">
                      Join us for networking, talks, and code sessions
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        72 attending
                      </span>
                      <motion.button
                        className="px-3 py-1 text-xs font-medium text-orange-700 rounded-lg bg-orange-50 hover:bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20 dark:hover:bg-orange-900/40"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        RSVP
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <motion.div
          className="fixed z-20 right-6 bottom-6 md:hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <Link to="/forum/ask">
            <motion.button
              className="flex items-center justify-center text-white rounded-full shadow-lg w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
