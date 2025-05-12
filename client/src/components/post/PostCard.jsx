import { useState, useCallback, memo, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FaHeart, FaComment, FaEdit, FaTrash, FaSpinner, FaTimes, FaShare, FaBookmark } from "react-icons/fa";
import { toast } from "react-toastify";

const PostCard = memo(({ post, user, onUpdatePost, onDeletePost, onNewNotification, onMediaClick, theme }) => {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editDescription, setEditDescription] = useState(post.description || "");
  const [existingMedia, setExistingMedia] = useState(post.media || []);
  const [newMedia, setNewMedia] = useState([]);
  const [loading, setLoading] = useState({ like: false, comment: false, edit: false, delete: false, save: false });
  const [mediaError, setMediaError] = useState({});
  const [zoomedMedia, setZoomedMedia] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const commentInputRef = useRef(null);

  const isOwner = user === post.userId;
  const isSaved = (post.savedBy || []).includes(user);
  const formattedDate = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "Unknown date";
  
  const hasComments = post.comments && post.comments.length > 0;

  const handleLike = async () => {
    if (loading.like) return;
    setLoading(prev => ({ ...prev, like: true }));

    const optimisticPost = { 
      ...post, 
      likes: (post.likes || []).includes(user) 
        ? (post.likes || []).filter(id => id !== user) 
        : [...(post.likes || []), user] 
    };
    onUpdatePost(optimisticPost);

    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${post.id}/like`, {}, { withCredentials: true });
      onUpdatePost(response.data.post);
      if (onNewNotification) onNewNotification();
    } catch (error) {
      console.error("Error liking post:", error);
      onUpdatePost(post);
      toast.error("Failed to like the post.", { position: "top-right" });
    } finally {
      setLoading(prev => ({ ...prev, like: false }));
    }
  };

  const handleSave = async () => {
    if (loading.save) return;
    setLoading(prev => ({ ...prev, save: true }));

    const isCurrentlySaved = (post.savedBy || []).includes(user);
    const optimisticPost = {
      ...post,
      savedBy: isCurrentlySaved
        ? (post.savedBy || []).filter(id => id !== user)
        : [...(post.savedBy || []), user]
    };
    onUpdatePost(optimisticPost);

    try {
      const response = await axios({
        method: isCurrentlySaved ? 'delete' : 'post',
        url: `http://localhost:5000/api/posts/${post.id}/save`,
        withCredentials: true
      });
      onUpdatePost(response.data.post);
      toast.success(isCurrentlySaved ? "Post unsaved!" : "Post saved!", { position: "top-right" });
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      onUpdatePost(post);
      toast.error(`Failed to ${isCurrentlySaved ? 'unsave' : 'save'} the post.`, { position: "top-right" });
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleCommentToggle = () => {
    setShowComments(!showComments);
    if (!showComments && commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current.focus();
      }, 300);
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
    const optimisticPost = { ...post, comments: [...(post.comments || []), newComment] };
    onUpdatePost(optimisticPost);
    setCommentText("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${post.id}/comment`,
        { comment: commentText },
        { withCredentials: true }
      );
      onUpdatePost(response.data.post);
      if (onNewNotification) onNewNotification();
    } catch (error) {
      console.error("Error adding comment:", error);
      onUpdatePost(post);
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

    const updatedComments = (post.comments || []).map(c =>
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
      onUpdatePost(response.data.post);
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (error) {
      console.error("Error updating comment:", error);
      onUpdatePost(post);
      toast.error("Failed to update comment.", { position: "top-right" });
    } finally {
      setLoading(prev => ({ ...prev, comment: false }));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (loading.comment) return;
    setLoading(prev => ({ ...prev, comment: true }));

    const updatedComments = (post.comments || []).filter(c => c.id !== commentId);
    const optimisticPost = { ...post, comments: updatedComments };
    onUpdatePost(optimisticPost);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${post.id}/comment/${commentId}`,
        { withCredentials: true }
      );
      onUpdatePost(response.data.post);
    } catch (error) {
      console.error("Error deleting comment:", error);
      onUpdatePost(post);
      toast.error("Failed to delete comment.", { position: "top-right" });
    } finally {
      setLoading(prev => ({ ...prev, comment: false }));
    }
  };

  const handleRemoveExistingMedia = (mediaId) => {
    setExistingMedia(prev => prev.filter(media => media.id !== mediaId));
  };

  const handleRemoveNewMedia = (index) => {
    setNewMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setNewMedia(prev => [...prev, ...files]);
  };

  const handleRemoveExistingMedia = (mediaId) => {
    setExistingMedia(prev => prev.filter(media => media.id !== mediaId));
  };

  const handleRemoveNewMedia = (index) => {
    setNewMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setNewMedia(prev => [...prev, ...files]);
  };

  const handleEditPostSubmit = async (e) => {
    e.preventDefault();
    if (loading.edit) return;
    setLoading(prev => ({ ...prev, edit: true }));

    const formData = new FormData();
    formData.append("description", editDescription);
    existingMedia.forEach(media => formData.append("existingMediaIds", media.id));
    newMedia.forEach(file => formData.append("files", file));
    existingMedia.forEach(media => formData.append("existingMediaIds", media.id));
    newMedia.forEach(file => formData.append("files", file));

    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${post.id}`,
        formData,
        { withCredentials: true }
      );
      onUpdatePost(response.data.post);
      setIsEditingPost(false);
      setNewMedia([]);
      setNewMedia([]);
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
        onDeletePost(post.id);
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

  const handleMediaClick = (media, index) => {
    if (onMediaClick) {
      onMediaClick(media.fileUrl, media.fileType.startsWith("image") ? "image" : "video");
    } else {
      setZoomedMedia({
        ...media,
        index
      });
    }
  };

  const handleCloseZoom = () => {
    setZoomedMedia(null);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.userName || "Unknown User"}`,
        text: post.description,
        url: window.location.href,
      })
      .then(() => toast.success("Post shared successfully!", { position: "top-right" }))
      .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard!", { position: "top-right" }))
        .catch(() => toast.error("Failed to copy link.", { position: "top-right" }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-8 overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <motion.div
            className="flex items-center justify-center w-12 h-12 text-lg font-semibold text-white rounded-full bg-gradient-to-br from-orange-400 to-red-500"
            whileHover={{ scale: 1.05 }}
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
              className="p-2 text-orange-500 rounded-full bg-orange-50 hover:bg-orange-100"
              aria-label="Edit Post"
            >
              <FaEdit />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDeletePost}
              disabled={loading.delete}
              className="p-2 text-red-500 rounded-full bg-red-50 hover:bg-red-100"
              aria-label="Delete Post"
            >
              {loading.delete ? <FaSpinner className="animate-spin" /> : <FaTrash />}
            </motion.button>
          </div>
        )}
      </div>

      {/* Edit Post Form */}
      {isEditingPost ? (
        <div className="p-5">
          <form onSubmit={handleEditPostSubmit}>
            <div className="mb-4">
              <label htmlFor="post-description" className="block mb-2 text-sm font-medium text-gray-700">Post Description</label>
              <textarea
                id="post-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Share your recipe or cooking skill..."
                className="w-full p-4 text-gray-700 transition-all duration-200 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="4"
                required
              />
            </div>

            {/* Existing Media Preview */}
            {existingMedia.length > 0 && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Current Media</label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {existingMedia.map((media, index) => (
                    <div key={media.id} className="relative">
                      {media.fileType.startsWith("image") ? (
                        <img
                          src={media.fileUrl}
                          alt={media.fileName || `Existing media ${index + 1}`}
                          className="object-cover w-full h-32 rounded-lg"
                        />
                      ) : (
                        <video
                          src={media.fileUrl}
                          className="object-cover w-full h-32 rounded-lg"
                          controls
                        />
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveExistingMedia(media.id)}
                        className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                        aria-label="Remove media"
                      >
                        <FaTimes />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Media Input and Preview */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Add New Photos/Videos</label>

            {/* Existing Media Preview */}
            {existingMedia.length > 0 && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Current Media</label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {existingMedia.map((media, index) => (
                    <div key={media.id} className="relative">
                      {media.fileType.startsWith("image") ? (
                        <img
                          src={media.fileUrl}
                          alt={media.fileName || `Existing media ${index + 1}`}
                          className="object-cover w-full h-32 rounded-lg"
                        />
                      ) : (
                        <video
                          src={media.fileUrl}
                          className="object-cover w-full h-32 rounded-lg"
                          controls
                        />
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveExistingMedia(media.id)}
                        className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                        aria-label="Remove media"
                      >
                        <FaTimes />
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Media Input and Preview */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Add New Photos/Videos</label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleNewMediaChange}
                  onChange={handleNewMediaChange}
                  className="w-full p-3 text-sm transition-colors duration-200 bg-white border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                />
              </div>
              {newMedia.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3">
                  {newMedia.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      {file.type.startsWith("image") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New media ${index + 1}`}
                          className="object-cover w-full h-32 rounded-lg"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(file)}
                          className="object-cover w-full h-32 rounded-lg"
                          controls
                        />
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveNewMedia(index)}
                        className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                        aria-label="Remove new media"
                      >
                        <FaTimes />
                      </motion.button>
                    </div>
                  ))}
                </div>
              {newMedia.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3">
                  {newMedia.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      {file.type.startsWith("image") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New media ${index + 1}`}
                          className="object-cover w-full h-32 rounded-lg"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(file)}
                          className="object-cover w-full h-32 rounded-lg"
                          controls
                        />
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveNewMedia(index)}
                        className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                        aria-label="Remove new media"
                      >
                        <FaTimes />
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}
            </div>


            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading.edit}
                className="flex items-center justify-center w-1/2 px-5 py-3 font-medium text-white transition-colors rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 disabled:opacity-50 hover:from-orange-600 hover:to-orange-700"
              >
                {loading.edit ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setIsEditingPost(false);
                  setNewMedia([]);
                  setExistingMedia(post.media || []);
                  setEditDescription(post.description || "");
                }}
                onClick={() => {
                  setIsEditingPost(false);
                  setNewMedia([]);
                  setExistingMedia(post.media || []);
                  setEditDescription(post.description || "");
                }}
                className="w-1/2 px-5 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Post Description */}
          <div className="p-5">
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-base leading-relaxed text-gray-700"
            >
              {post.description || "No description provided"}
            </motion.p>
          </div>

          {/* Post Media */}
          {post.media && post.media.length > 0 && (
            <div className={`grid gap-2 p-5 pt-0 ${post.media.length === 1 ? 'grid-cols-1' : post.media.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
              {post.media.map((media, index) => (
                <motion.div
                  key={media.id || `media-${index}`}
                  key={media.id || `media-${index}`}
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden transition-transform duration-200 bg-gray-100 rounded-lg cursor-pointer"
                  onClick={() => handleMediaClick(media, index)}
                >
                  {mediaError[index] ? (
                    <div className="flex items-center justify-center w-full h-56 text-gray-500 bg-gray-200">
                      Failed to load media
                    </div>
                  ) : media.fileType.startsWith("image") ? (
                    <div className="overflow-hidden aspect-[4/3]">
                      <img
                        src={media.fileUrl}
                        alt={media.fileName || `Post image ${index + 1}`}
                        className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                        onError={() => handleMediaError(index)}
                      />
                    </div>
                  ) : (
                    <div className="overflow-hidden aspect-[4/3]">
                      <video
                        src={media.fileUrl}
                        controls
                        className="object-cover w-full h-full"
                        onError={() => handleMediaError(index)}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between p-5 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                disabled={loading.like}
                className={`flex items-center space-x-2 ${
                  (post.likes || []).includes(user) ? "text-red-500" : "text-gray-500 hover:text-red-500"
                } transition-colors duration-200`}
                aria-label={(post.likes || []).includes(user) ? "Unlike" : "Like"}
              >
                {loading.like ? (
                  <FaSpinner className="text-lg animate-spin" />
                ) : (
                  <FaHeart className={`text-lg ${(post.likes || []).includes(user) ? "fill-current" : "stroke-current"}`} />
                )}
                <span className="text-sm font-medium">{(post.likes || []).length}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCommentToggle}
                className="flex items-center space-x-2 text-gray-500 transition-colors duration-200 hover:text-blue-500"
                aria-label="Comment"
              >
                <FaComment className="text-lg" />
                <span className="text-sm font-medium">{(post.comments || []).length}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-500 transition-colors duration-200 hover:text-green-500"
                aria-label="Share"
              >
                <FaShare className="text-lg" />
                <span className="text-sm font-medium">Share</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={loading.save}
                className={`flex items-center space-x-2 ${
                  isSaved ? "text-yellow-500" : "text-gray-500 hover:text-yellow-500"
                } transition-colors duration-200`}
                aria-label={isSaved ? "Unsave" : "Save"}
              >
                {loading.save ? (
                  <FaSpinner className="text-lg animate-spin" />
                ) : (
                  <FaBookmark className={`text-lg ${isSaved ? "fill-current" : "stroke-current"}`} />
                )}
                <span className="text-sm font-medium">{(post.savedBy || []).length}</span>
              </motion.button>
            </div>
            
            <div className="text-sm text-gray-500">
              {(post.likes || []).length} {(post.likes || []).length === 1 ? "like" : "likes"} • {(post.comments || []).length} {(post.comments || []).length === 1 ? "comment" : "comments"}
            </div>
          </div>

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-gray-100"
              >
                <div className="p-5 bg-gray-50">
                  {/* Add Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="flex items-center mb-4 space-x-3">
                    <input
                      type="text"
                      ref={commentInputRef}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 p-3 transition-all duration-200 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={loading.comment || !commentText.trim()}
                      className="flex items-center px-4 py-3 space-x-2 text-white transition-colors rounded-full bg-gradient-to-r from-orange-500 to-orange-600 disabled:opacity-50 hover:from-orange-600 hover:to-orange-700"
                    >
                      {loading.comment ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaComment />
                      )}
                    </motion.button>
                  </form>

                  {/* Comments List */}
                  <AnimatePresence>
                    {!hasComments ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-6"
                      >
                        <p className="text-gray-500">Be the first to comment on this post!</p>
                      </motion.div>
                    ) : (
                      <motion.ul className="space-y-3">
                        {(post.comments || []).map((comment) => (
                          <motion.li
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 bg-white shadow-sm rounded-xl"
                          >
                            {editingCommentId === comment.id ? (
                              <div className="flex items-center space-x-3">
                                <input
                                  type="text"
                                  value={editedCommentText}
                                  onChange={(e) => setEditedCommentText(e.target.value)}
                                  className="flex-1 p-2 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  autoFocus
                                />
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleUpdateComment(comment.id)}
                                  disabled={loading.comment}
                                  className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600"
                                >
                                  {loading.comment ? <FaSpinner className="animate-spin" /> : "Save"}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setEditingCommentId(null)}
                                  className="px-3 py-1 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                  Cancel
                                </motion.button>
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-1 space-x-2">
                                      <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-gray-700 to-gray-900">
                                        {comment.name?.charAt(0) || "U"}
                                      </div>
                                      <p className="font-medium text-gray-800">
                                        {comment.name || "Unknown User"}
                                      </p>
                                      <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                      </span>
                                    </div>
                                    <p className="text-gray-700">{comment.text}</p>
                                  </div>
                                  
                                  {(comment.userId === user || post.userId === user) && (
                                    <div className="flex space-x-1">
                                      {comment.userId === user && (
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => handleEditComment(comment)}
                                          className="p-1 text-sm text-gray-500 hover:text-orange-500"
                                          aria-label="Edit comment"
                                        >
                                          <FaEdit />
                                        </motion.button>
                                      )}
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteComment(comment.id)}
                                        disabled={loading.comment}
                                        className="p-1 text-sm text-gray-500 hover:text-red-500"
                                        aria-label="Delete comment"
                                      >
                                        {loading.comment ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                                      </motion.button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Fullscreen Media Viewer */}
      <AnimatePresence>
        {zoomedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={handleCloseZoom}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full top-4 right-4 hover:bg-opacity-70"
              onClick={handleCloseZoom}
            >
              <FaTimes size={24} />
            </motion.button>

            <div className="relative w-full h-full max-w-4xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
              {zoomedMedia.fileType?.startsWith("image") ? (
                <img
                  src={zoomedMedia.fileUrl}
                  alt={zoomedMedia.fileName || "Full screen image"}
                  className="object-contain w-full h-full"
                />
              ) : (
                <video
                  src={zoomedMedia.fileUrl}
                  controls
                  autoPlay
                  className="object-contain w-full h-full"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default PostCard;