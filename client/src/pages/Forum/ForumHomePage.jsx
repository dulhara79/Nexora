import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
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
} from 'react-icons/hi';
import axios from 'axios';
import Header from '../../components/Forum/Header';
import { AuthContext } from '../../context/AuthContext';

// Configure Axios instance
const API_BASE_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const etag = localStorage.getItem(`etag-${config.url}`);
    if (etag) {
      config.headers['If-None-Match'] = etag;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (response.headers.etag) {
      localStorage.setItem(`etag-${response.config.url}`, response.headers.etag);
    }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 304) {
      return Promise.resolve(null);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.error || 'An error occurred');
  }
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
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
  const { isAuthenticated, loading, userId } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('trending');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const [posts, setPosts] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [communitySpotlight, setCommunitySpotlight] = useState([]);
  const [dataLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setIsLoaded(true);
      const timer = setTimeout(() => {
        setShowWelcomeCard(false);
      }, 5000);
      fetchInitialData();
      fetchSavedStatus();
      fetchLikedStatus();
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
      const [tagsResponse, communitiesResponse] = await Promise.all([
        api.get('/tags'),
        api.get('/communities'),
      ]);
      setTrendingTags(tagsResponse?.tags?.map((tag) => tag.name) || []);
      setCommunitySpotlight(
        communitiesResponse?.communities?.map((community) => ({
          id: community.id || 'unknown',
          name: community.name || 'Unnamed Community',
          members: community.members || 0,
          description: community.description || 'No description available',
          color: getRandomGradient(),
          icon: community.icon || '🌟',
        })) || []
      );
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
      setError('Failed to load tags or communities.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let sortBy = '';
      if (activeTab === 'trending') sortBy = 'mostCommented';
      if (activeTab === 'latest') sortBy = 'newest';
      if (activeTab === 'popular') sortBy = 'mostCommented';
      if (activeTab === 'following') {
        await fetchSavedPosts();
        return;
      }

      const response = await api.get('/questions', {
        params: { sortBy },
      });

      if (!response) return; // Cached response

      const transformedPosts = response.questions?.map((post) => ({
        id: post.id || 'unknown',
        title: post.title || 'Untitled',
        author: post.authorUsername || 'Anonymous',
        authorAvatar: post.authorUsername?.[0]?.toUpperCase() || 'A',
        authorColor: getRandomGradient(),
        content: post.description || '',
        tags: Array.isArray(post.tags) ? post.tags : [],
        likes: post.upvoteUserIds?.length || 0,
        comments: post.commentIds?.length || 0,
        views: post.views || 0,
        timeAgo: calculateTimeAgo(post.createdAt || new Date()),
        isPinned: post.isPinned || false,
        isHot: (post.commentIds?.length || 0) > 10,
      })) || [];

      setPosts(transformedPosts);
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/questions/saved-questions');
      if (!response) return; // Cached response
      const transformedPosts = response.questions?.map((post) => ({
        id: post.id || 'unknown',
        title: post.title || 'Untitled',
        author: post.authorUsername || 'Anonymous',
        authorAvatar: post.authorUsername?.[0]?.toUpperCase() || 'A',
        authorColor: getRandomGradient(),
        content: post.description || '',
        tags: Array.isArray(post.tags) ? post.tags : [],
        likes: post.upvoteUserIds?.length || 0,
        comments: post.commentIds?.length || 0,
        views: post.views || 0,
        timeAgo: calculateTimeAgo(post.createdAt || new Date()),
        isPinned: post.isPinned || false,
        isHot: (post.commentIds?.length || 0) > 10,
      })) || [];
      setPosts(transformedPosts);
    } catch (err) {
      console.error('Fetch saved posts error:', err);
      setError('Failed to load saved posts.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedStatus = async () => {
    try {
      const response = await api.get('/questions/saved-questions');
      if (response) {
        setSavedPosts(new Set(response.questions?.map((post) => post.id) || []));
      }
    } catch (err) {
      console.error('Failed to fetch saved status:', err);
    }
  };

  const fetchLikedStatus = async () => {
    try {
      const response = await api.get('/questions/saved-questions');
      if (response) {
        setLikedPosts(
          new Set(
            response.questions
              ?.filter((post) => post.upvoteUserIds?.includes(userId))
              ?.map((post) => post.id) || []
          )
        );
      }
    } catch (err) {
      console.error('Failed to fetch liked status:', err);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const response = await api.patch(`/questions/${postId}/vote`, {
        voteType: 'upvote',
      });
      if (response) {
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: response.question?.upvoteUserIds?.length || 0,
                }
              : post
          )
        );
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(postId)) {
            newSet.delete(postId);
          } else {
            newSet.add(postId);
          }
          return newSet;
        });
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
      setError('Failed to upvote post.');
    }
  };

  const handleSave = async (postId) => {
    try {
      await api.post('/questions/saved-questions', { questionId: postId });
      setSavedPosts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
    } catch (err) {
      console.error('Failed to save:', err);
      setError('Failed to save post.');
    }
  };

  const getRandomGradient = () => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-pink-600',
      'from-amber-500 to-orange-600',
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
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const tabItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15 } },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 },
    },
  };

  const sidebarItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 },
    },
  };

  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <Header />
        <main className="px-4 pt-8 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <AnimatePresence>
            {showWelcomeCard && (
              <motion.div
                className="relative mb-8 overflow-hidden shadow-xl rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600"
                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
              >
                <div className="relative z-10 flex flex-col items-start justify-between p-8 md:flex-row md:items-center">
                  <div className="mb-6 md:mb-0">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                      Welcome to Nexora Forum
                    </h2>
                    <p className="mt-2 text-lg text-blue-100">
                      Connect, share, and learn with global developers
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <motion.button
                      className="px-6 py-3 font-semibold text-indigo-700 transition-colors bg-white shadow-lg rounded-xl hover:bg-blue-50"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Join the Community
                    </motion.button>
                    <motion.button
                      className="px-6 py-3 font-semibold text-white transition-colors bg-transparent border-2 border-white rounded-xl hover:bg-white/10"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowWelcomeCard(false)}
                    >
                      Dismiss
                    </motion.button>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="white"
                      d="M41.3,-51.2C54.4,-42.9,66.6,-30.9,71.7,-16.2C76.7,-1.5,74.7,15.9,67.1,30.8C59.5,45.6,46.3,58,31,64.4C15.8,70.8,-1.5,71.2,-16.9,65.8C-32.4,60.5,-45.9,49.3,-56,35.5C-66,21.6,-72.5,5.2,-71.7,-11.4C-70.9,-28,-62.7,-44.8,-49.5,-53.3C-36.4,-61.8,-18.2,-62,-1.3,-60.4C15.5,-58.9,31.1,-55.6,41.3,-51.2Z"
                      transform="translate(100 100)"
                    />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <motion.div
                className="sticky z-10 flex p-2 mb-8 space-x-2 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl top-4"
                variants={tabContainerVariants}
                initial="hidden"
                animate={isLoaded ? 'visible' : 'hidden'}
              >
                {['trending', 'latest', 'popular', 'following'].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                    variants={tabItemVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab === 'trending' && (
                      <HiOutlineFire className="w-5 h-5 mr-2" />
                    )}
                    {tab === 'latest' && (
                      <HiOutlineClock className="w-5 h-5 mr-2" />
                    )}
                    {tab === 'popular' && (
                      <HiOutlineStar className="w-5 h-5 mr-2" />
                    )}
                    {tab === 'following' && (
                      <HiOutlineBookmark className="w-5 h-5 mr-2" />
                    )}
                    {tab}
                  </motion.button>
                ))}
              </motion.div>

              {dataLoading ? (
                <div className="flex items-center justify-center h-64">
                  <motion.div
                    className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>
              ) : error ? (
                <div className="p-6 text-red-700 bg-red-100 border border-red-200 rounded-xl">
                  {error}
                </div>
              ) : posts.length === 0 ? (
                <div className="p-6 text-gray-600 bg-white shadow-sm dark:text-gray-300 dark:bg-slate-800 rounded-xl">
                  No posts found. Be the first to ask a question!
                </div>
              ) : (
                <motion.div
                  className="space-y-6"
                  variants={cardContainerVariants}
                  initial="hidden"
                  animate={isLoaded ? 'visible' : 'hidden'}
                >
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      className="overflow-hidden transition-all duration-300 bg-white border shadow-lg dark:bg-slate-800 rounded-2xl hover:shadow-xl border-slate-100 dark:border-slate-700"
                      variants={cardItemVariants}
                      whileHover={{
                        y: -5,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              className={`flex items-center justify-center w-10 h-10 text-base font-bold text-white rounded-full bg-gradient-to-br ${post.authorColor}`}
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              {post.authorAvatar}
                            </motion.div>
                            <div>
                              <span className="text-base font-semibold text-slate-800 dark:text-white">
                                {post.author}
                              </span>
                              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                                {post.timeAgo} ago
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {post.isPinned && (
                              <span className="flex items-center px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
                                <svg
                                  className="w-4 h-4 mr-1"
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
                              <span className="flex items-center px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-100 rounded-full dark:bg-orange-900/30 dark:text-orange-400">
                                <HiOutlineFire className="w-4 h-4 mr-1" />
                                Hot
                              </span>
                            )}
                            {savedPosts.has(post.id) && (
                              <span className="flex items-center px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                                <HiOutlineBookmark className="w-4 h-4 mr-1" />
                                Saved
                              </span>
                            )}
                          </div>
                        </div>

                        <Link to={`/forum/question/${post.id}`}>
                          <h3 className="mb-3 text-xl font-bold transition-colors text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                          {post.content.length > 120
                            ? `${post.content.substring(0, 120)}...`
                            : post.content}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {Array.isArray(post.tags) && post.tags.length > 0 ? (
                            post.tags.map((tag, index) => (
                              <Link
                                key={index}
                                to={`/forum/tag/${tag}`}
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-full hover:bg-indigo-100 hover:text-indigo-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-400 transition-colors"
                              >
                                <HiOutlineTag className="w-4 h-4 mr-1" />
                                {tag}
                              </Link>
                            ))
                          ) : (
                            <span className="text-sm text-slate-500">
                              No tags
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <motion.button
                              className={`flex items-center text-sm font-medium ${
                                likedPosts.has(post.id)
                                  ? 'text-indigo-600 dark:text-indigo-400'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUpvote(post.id)}
                            >
                              <HiOutlineThumbUp className="w-5 h-5 mr-2" />
                              {post.likes}
                            </motion.button>
                            <Link
                              to={`/forum/question/${post.id}`}
                              className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                            >
                              <HiOutlineChat className="w-5 h-5 mr-2" />
                              {post.comments}
                            </Link>
                            <span className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                              <HiOutlineEye className="w-5 h-5 mr-2" />
                              {post.views}
                            </span>
                          </div>
                          <motion.button
                            className={`text-sm font-medium ${
                              savedPosts.has(post.id)
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSave(post.id)}
                          >
                            <HiOutlineBookmark className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <div className="flex justify-center mt-8">
                <motion.button
                  className="px-8 py-4 font-semibold text-white transition-all shadow-lg bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-500 hover:to-blue-500"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.8 } }}
                >
                  Load More Discussions
                </motion.button>
              </div>
            </div>

            <div className="space-y-8">
              <motion.div
                className="p-6 bg-white border shadow-lg dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700"
                variants={sidebarItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-white">
                  Start a Discussion
                </h3>
                <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
                  Share your questions or ideas with the community.
                </p>
                <Link to="/forum/ask">
                  <motion.button
                    className="w-full px-6 py-3 font-semibold text-white transition-all shadow-md bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-500 hover:to-blue-500"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Create New Post
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                className="p-6 bg-white border shadow-lg dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700"
                variants={sidebarItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    Community Spotlight
                  </h3>
                  <Link
                    to="/community"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {communitySpotlight.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      No communities available.
                    </p>
                  ) : (
                    communitySpotlight.map((community) => (
                      <motion.div
                        key={community.id}
                        className="p-4 transition-all bg-white border dark:bg-slate-900 rounded-xl border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900"
                        whileHover={{
                          y: -3,
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div
                            className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${community.color}`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <span className="text-xl">{community.icon}</span>
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 dark:text-white">
                              {community.name}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {community.members.toLocaleString()} members
                            </p>
                          </div>
                          <motion.button
                            className="p-2 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <HiChevronRight className="w-6 h-6" />
                          </motion.button>
                        </div>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                          {community.description}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              <motion.div
                className="p-6 bg-white border shadow-lg dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700"
                variants={sidebarItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              >
                <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-white">
                  Trending Topics
                </h3>
                <div className="flex flex-wrap gap-3">
                  {trendingTags.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      No trending topics available.
                    </p>
                  ) : (
                    trendingTags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/forum/tag/${tag}`}
                        className="px-4 py-2 text-sm font-semibold transition-all rounded-full text-slate-700 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-400"
                      >
                        #{tag}
                      </Link>
                    ))
                  )}
                </div>
              </motion.div>

              <motion.div
                className="p-6 bg-white border shadow-lg dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700"
                variants={sidebarItemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    Upcoming Events
                  </h3>
                  <Link
                    to="/events"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  <motion.div
                    className="p-5 rounded-xl bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40"
                    whileHover={{
                      y: -3,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full dark:text-purple-400 dark:bg-purple-900/40">
                        VIRTUAL
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Apr 20, 2025
                      </span>
                    </div>
                    <h4 className="mb-2 font-semibold text-slate-800 dark:text-white">
                      Advanced React Patterns Workshop
                    </h4>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                      Learn component composition, render props, and more
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        120 attending
                      </span>
                      <motion.button
                        className="px-4 py-2 text-sm font-semibold text-indigo-700 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        RSVP
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-5 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40"
                    whileHover={{
                      y: -3,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full dark:text-orange-400 dark:bg-orange-900/40">
                        IN-PERSON
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        May 5, 2025
                      </span>
                    </div>
                    <h4 className="mb-2 font-semibold text-slate-800 dark:text-white">
                      Nexora Community Meetup
                    </h4>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                      Join us for networking, talks, and code sessions
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        72 attending
                      </span>
                      <motion.button
                        className="px-4 py-2 text-sm font-semibold text-orange-700 rounded-lg bg-orange-50 hover:bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20 dark:hover:bg-orange-900/40"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        RSVP
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <motion.div
          className="fixed z-30 right-6 bottom-6 md:hidden"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
        >
          <Link to="/forum/ask">
            <motion.button
              className="flex items-center justify-center w-16 h-16 text-white rounded-full shadow-xl bg-gradient-to-r from-indigo-600 to-blue-600"
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-8 h-8"
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