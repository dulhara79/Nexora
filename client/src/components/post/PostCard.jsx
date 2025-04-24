import { useState, useCallback, memo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FaHeart, FaComment, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";

// Memoize the PostCard component to prevent unnecessary re-renders
const PostCard = memo(({ post, user, fetchPosts, onNewNotification }) => {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaError, setMediaError] = useState({});

  // Format the creation date using date-fns
  const formattedDate = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "Unknown date";

  const handleLike = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/posts/${post.id}/like`, {}, {
        withCredentials: true,
      });
      fetchPosts();
      if (onNewNotification) {
        onNewNotification();
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/posts/${post.id}/comment`,
        { comment: commentText },
        { withCredentials: true }
      );
      setCommentText("");
      fetchPosts();
      if (onNewNotification) {
        onNewNotification();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editedCommentText.trim()) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/posts/${post.id}/comment/${commentId}`,
        { comment: editedCommentText },
        { withCredentials: true }
      );
      setEditingCommentId(null);
      setEditedCommentText("");
      fetchPosts();
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/posts/${post.id}/comment/${commentId}`,
        { withCredentials: true }
      );
      fetchPosts();
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle media loading errors
  const handleMediaError = (index) => {
    setMediaError((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-6 overflow-hidden transition-shadow duration-300 transform bg-white shadow-lg rounded-2xl hover:shadow-xl"
    >
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="flex items-center justify-center w-10 h-10 font-semibold text-gray-600 bg-gray-200 rounded-full"
              whileHover={{ scale: 1.1 }}
            >
              {post.userName?.charAt(0) || "U"}
            </motion.div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {post.userName || "Unknown User"}
              </p>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Post Description */}
      <div className="p-6">
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-base leading-relaxed text-gray-700"
        >
          {post.description}
        </motion.p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="grid grid-cols-1 gap-4 p-6 pt-0 sm:grid-cols-2 md:grid-cols-3">
          {post.media.map((media, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden rounded-lg shadow-md"
            >
              {mediaError[index] ? (
                <div className="flex items-center justify-center w-full h-48 text-gray-500 bg-gray-200">
                  Failed to load media
                </div>
              ) : media.fileType.startsWith("image") ? (
                <img
                  src={media.fileUrl}
                  alt={media.fileName}
                  className="object-cover w-full h-48"
                  onError={() => handleMediaError(index)}
                />
              ) : (
                <video
                  src={media.fileUrl}
                  controls
                  className="object-cover w-full h-48"
                  onError={() => handleMediaError(index)}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Likes */}
      <div className="flex items-center p-6 pt-0 space-x-4 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center space-x-2 text-lg ${
            post.likes.includes(user) ? "text-red-500" : "text-gray-500"
          } hover:text-red-500 transition-colors duration-200`}
        >
          <FaHeart />
          <span>{post.likes.length}</span>
        </motion.button>
      </div>

      {/* Comments */}
      <div className="p-6 pt-0">
        <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-800">
          <FaComment className="mr-2 text-blue-500" /> Comments
        </h3>
        <AnimatePresence>
          {post.comments.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-600"
            >
              No comments yet.
            </motion.p>
          ) : (
            <ul className="space-y-3">
              {post.comments.map((comment) => (
                <motion.li
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start justify-between p-4 shadow-sm bg-gray-50 rounded-xl"
                >
                  {editingCommentId === comment.id ? (
                    <div className="flex items-center flex-1 space-x-3">
                      <input
                        type="text"
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                        className="flex-1 p-2 transition-all duration-200 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={loading}
                        className="text-green-500 hover:text-green-700"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : "Save"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingCommentId(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          User ID: {comment.name}
                        </p>
                        <p className="text-gray-700">{comment.text}</p>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {(comment.userId === user || post.userId === user) && (
                        <div className="flex space-x-2">
                          {comment.userId === user && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditComment(comment)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaEdit />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={loading}
                            className="text-red-500 hover:text-red-700"
                          >
                            {loading ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                          </motion.button>
                        </div>
                      )}
                    </>
                  )}
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleCommentSubmit} className="flex items-center p-6 pt-0 space-x-3">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-3 transition-all duration-200 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="flex items-center px-5 py-2 space-x-2 text-white bg-blue-500 rounded-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <FaComment />
              <span>Comment</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
});

export default PostCard;