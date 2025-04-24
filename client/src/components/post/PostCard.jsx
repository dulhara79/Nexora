import { useState, useCallback, memo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FaHeart, FaComment, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const PostCard = memo(({ post, user, onUpdatePost, onDeletePost, onNewNotification }) => {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editDescription, setEditDescription] = useState(post.description);
  const [editFiles, setEditFiles] = useState([]);
  const [loading, setLoading] = useState({ like: false, comment: false, edit: false, delete: false });
  const [mediaError, setMediaError] = useState({});

  const isOwner = user === post.userId;
  const formattedDate = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "Unknown date";

  const handleLike = async () => {
    if (loading.like) return;
    setLoading(prev => ({ ...prev, like: true }));

    const optimisticPost = { ...post, likes: post.likes.includes(user) ? post.likes.filter(id => id !== user) : [...post.likes, user] };
    onUpdatePost(optimisticPost);

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${post.id}/like`, {}, { withCredentials: true });
      onUpdatePost(response.data);
      if (onNewNotification) onNewNotification();
    } catch (error) {
      console.error("Error liking post:", error);
      onUpdatePost(post); // Revert on error
      toast.error("Failed to like the post.", { position: "top-right" });
    } finally {
      setLoading(prev => ({ ...prev, like: false }));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || loading.comment) return;
    setLoading(prev => ({ ...prev, comment: true }));

    const newComment = {
      id: `temp-${Date.now()}`,
      userId: user,
      name: "You",
      text: commentText,
      createdAt: new Date().toISOString(),
    };
    const optimisticPost = { ...post, comments: [...post.comments, newComment] };
    onUpdatePost(optimisticPost);
    setCommentText("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${post.id}/comment`,
        { comment: commentText },
        { withCredentials: true }
      );
      onUpdatePost(response.data);
      if (onNewNotification) onNewNotification();
    } catch (error) {
      console.error("Error adding comment:", error);
      onUpdatePost(post); // Revert on error
      toast.error("Failed to add comment.", { position: "top-right" });
    } finally {
      setLoading(prev => ({ ...prev, comment: false }));
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editedCommentText.trim() || loading.comment) return;
    setLoading(prev => ({ ...prev, comment: true }));

    const updatedComments = post.comments.map(c =>
      c.id === commentId ? { ...c, text: editedCommentText } : c
    );
    const optimisticPost = { ...post, comments: updatedComments };
    onUpdatePost(optimisticPost);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${post.id}/comment/${commentId}`,
        { comment: editedCommentText },
        { withCredentials: true }
      );
      onUpdatePost(response.data);
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (error) {
      console.error("Error updating comment:", error);
      onUpdatePost(post); // Revert on error
      toast.error("Failed to update comment.", { position: "top-right" });
    } finally {
      setLoading(prev => ({ ...prev, comment: false }));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (loading.comment) return;
    setLoading(prev => ({ ...prev, comment: true }));

    const updatedComments = post.comments.filter(c => c.id !== commentId);
    const optimisticPost = { ...post, comments: updatedComments };
    onUpdatePost(optimisticPost);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${post.id}/comment/${commentId}`,
        { withCredentials: true }
      );
      onUpdatePost(response.data);
    } catch (error) {
      console.error("Error deleting comment:", error);
      onUpdatePost(post); // Revert on error
      toast.error("Failed to delete comment.", { position: "top-right" });
    } finally {
      setLoading(prev => ({ ...prev, comment: false }));
    }
  };

  const handleEditPostSubmit = async (e) => {
    e.preventDefault();
    if (loading.edit) return;
    setLoading(prev => ({ ...prev, edit: true }));

    const formData = new FormData();
    formData.append("description", editDescription);
    editFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${post.id}`,
        formData,
        { withCredentials: true }
      );
      onUpdatePost(response.data);
      setIsEditingPost(false);
      toast.success("Post updated successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error updating post:", error);
      if (error.response?.status === 404) {
        toast.error("Post not found.", { position: "top-right" });
      } else if (error.response?.status === 403) {
        toast.error("You are not authorized to edit this post.", { position: "top-right" });
      } else {
        toast.error("Failed to update post.", { position: "top-right" });
      }
    } finally {
      setLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?") || loading.delete) return;
    setLoading(prev => ({ ...prev, delete: true }));

    try {
      await axios.delete(`http://localhost:5000/api/posts/${post.id}`, { withCredentials: true });
      onDeletePost(post.id);
      toast.success("Post deleted successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error deleting post:", error);
      if (error.response?.status === 404) {
        toast.error("Post not found.", { position: "top-right" });
        onDeletePost(post.id); // Remove from UI anyway
      } else if (error.response?.status === 403) {
        toast.error("You are not authorized to delete this post.", { position: "top-right" });
      } else {
        toast.error("Failed to delete post.", { position: "top-right" });
      }
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleMediaError = (index) => {
    setMediaError((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-6 overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <motion.div
            className="flex items-center justify-center w-10 h-10 font-semibold text-orange-600 bg-orange-100 rounded-full"
            whileHover={{ scale: 1.1 }}
          >
            {post.userName?.charAt(0) || "U"}
          </motion.div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{post.userName || "Unknown User"}</p>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
        {isOwner && !isEditingPost && (
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditingPost(true)}
              className="text-orange-500 hover:text-orange-600"
            >
              <FaEdit />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDeletePost}
              disabled={loading.delete}
              className="text-red-500 hover:text-red-600"
            >
              {loading.delete ? <FaSpinner className="animate-spin" /> : <FaTrash />}
            </motion.button>
          </div>
        )}
      </div>

      {/* Edit Post Form */}
      {isEditingPost ? (
        <form onSubmit={handleEditPostSubmit} className="p-6">
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Edit your recipe or tip..."
            className="w-full p-4 mb-4 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows="4"
            required
          />
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => setEditFiles(Array.from(e.target.files))}
            className="mb-4 text-gray-600"
          />
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading.edit}
              className="px-5 py-2 text-white transition-colors bg-orange-500 rounded-lg disabled:opacity-50 hover:bg-orange-600"
            >
              {loading.edit ? "Saving..." : "Save Changes"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsEditingPost(false)}
              className="px-5 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      ) : (
        <>
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
              disabled={loading.like}
              className={`flex items-center space-x-2 text-lg ${
                post.likes.includes(user) ? "text-red-500" : "text-gray-500"
              } hover:text-red-500 transition-colors duration-200`}
            >
              {loading.like ? <FaSpinner className="animate-spin" /> : <FaHeart />}
              <span>{post.likes.length}</span>
            </motion.button>
          </div>

          {/* Comments */}
          <div className="p-6 pt-0">
            <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-800">
              <FaComment className="mr-2 text-orange-500" /> Comments
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
                            className="flex-1 p-2 transition-all duration-200 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={loading.comment}
                            className="text-green-500 hover:text-green-700"
                          >
                            {loading.comment ? <FaSpinner className="animate-spin" /> : "Save"}
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
                              {comment.name}
                            </p>
                            <p className="text-gray-700">{comment.text}</p>
                            <p className="text-sm text-gray-500">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          {(comment.userId === user || post.userId === user) && (
                            <div className="flex space-x-2">
                              {comment.userId === user && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditComment(comment)}
                                  className="text-orange-500 hover:text-orange-600"
                                >
                                  <FaEdit />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={loading.comment}
                                className="text-red-500 hover:text-red-600"
                              >
                                {loading.comment ? <FaSpinner className="animate-spin" /> : <FaTrash />}
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
              className="flex-1 p-3 transition-all duration-200 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading.comment}
              className="flex items-center px-5 py-2 space-x-2 text-white transition-colors bg-orange-500 rounded-lg disabled:opacity-50 hover:bg-orange-600"
            >
              {loading.comment ? (
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
        </>
      )}
    </motion.div>
  );
});

export default PostCard;