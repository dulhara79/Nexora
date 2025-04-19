import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  HiOutlineThumbUp,
  HiOutlineChat,
  HiOutlineEye,
  HiOutlineBookmark,
} from "react-icons/hi";
import Header from "../../components/Forum/Header";

const TagPage = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/questions/tag/${tag}`, {
          withCredentials: true,
        });

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
          isSaved: post.isSaved || false,
          isLiked: post.isLiked || false,
        }));

        setPosts(transformedPosts);
      } catch (err) {
        console.error("Fetch posts by tag error:", err);
        setError("Failed to load posts for this tag. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByTag();
  }, [tag]);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="max-w-6xl px-4 pt-6 pb-16 mx-auto">
        <h2 className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">
          Questions tagged with #{tag}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-4 text-gray-600">
            No posts found for this tag.
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
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
                          to={`/forum/tags/${tag}`}
                          className="flex items-center px-2 py-1 text-xs font-medium transition-colors rounded-md text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        >
                          <HiOutlineTag className="w-3 h-3 mr-1" />
                          {tag}
                        </Link>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No tags</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.button
                        className={`flex items-center text-sm ${
                          post.isLiked
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        // Implement handleUpvote if needed
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
                      className={`text-sm ${
                        post.isSaved
                          ? "text-yellow-500 dark:text-yellow-400"
                          : "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      // Implement handleSave if needed
                    >
                      <HiOutlineBookmark className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default TagPage;