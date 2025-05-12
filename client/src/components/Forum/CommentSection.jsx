import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { containerVariants, itemVariants } from "./Variants";
import FallbackAvatar from "../../components/common/FallbackAvatar";

const CommentSection = ({ questionId, user, token, isAuthenticated, comments, setComments }) => {
  const [newComment, setNewComment] = useState("");

  const submitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please log in to comment", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (!newComment.trim()) {
      toast.warn("Comment cannot be empty", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forum/comments`,
        {
          questionId,
          content: newComment,
          authorName: user.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newCommentData = response.data.comment;
      setComments((prevComments) => [
        ...prevComments,
        { ...newCommentData, replies: [] },
      ]);
      setNewComment("");
      toast.success("Comment added", { position: "top-right", autoClose: 2000 });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add comment", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.div variants={itemVariants} className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-xl font-semibold text-gray-800 dark:text-gray-100 font-display">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          Comments
          <span className="ml-2 px-2 py-0.5 text-sm bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-full">
            {comments.length}
          </span>
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {comments.length === 0
            ? "No comments yet"
            : comments.length === 1
            ? "1 comment"
            : `${comments.length} comments`}
        </div>
      </div>

      {user ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-5 mb-6 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 dark:border-gray-700 rounded-xl"
          onSubmit={submitComment}
        >
          <div className="flex items-center mb-4">
            <motion.div whileHover={{ scale: 1.1 }}>
              <FallbackAvatar className="w-8 h-8 mr-3 rounded-full ring-2 ring-orange-400" />
            </motion.div>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              Comment as {user.username}
            </span>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 mb-3 text-gray-800 transition-all duration-200 bg-white border border-gray-200 rounded-lg dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            rows="4"
            required
          />
          <div className="flex justify-end">
            <motion.button
              variants={containerVariants.buttonVariants}
              whileHover="hover"
              whileTap="tap"
              type="submit"
              className="flex items-center px-5 py-2 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Post Comment
            </motion.button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 mb-6 border border-orange-200 shadow-sm dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 rounded-xl"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-orange-700 dark:text-orange-300">
              <Link
                to="/login"
                className="font-medium underline hover:text-orange-800 dark:hover:text-orange-200"
              >
                Log in
              </Link>{" "}
              to join the discussion
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {comments.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="p-8 text-center bg-white border border-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800 rounded-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                user={user}
                token={token}
                isAuthenticated={isAuthenticated}
                setComments={setComments}
                level={0}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CommentSection;