import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Forum/Header";
import axios from "axios";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch question
        const questionResponse = await axios.get(
          `http://localhost:5000/api/questions/${id}`,
          { withCredentials: true }
        );

        // Fetch comments
        const commentsResponse = await axios.get(
          `http://localhost:5000/api/forum/comments/question/${id}`,
          { withCredentials: true }
        );

        // Process comments to build the nested structure
        const processedComments = buildCommentTree(commentsResponse.data);

        setQuestion(questionResponse.data);
        setComments(processedComments);
      } catch (err) {
        setError(err.message || "Failed to load question");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [id]);

  // Function to build comment tree structure
  const buildCommentTree = (flatComments) => {
    const commentMap = {};
    const rootComments = [];

    // First pass: create a map of comments by id
    flatComments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    // Second pass: build the tree structure
    flatComments.forEach((comment) => {
      if (comment.parentCommentId) {
        // This is a child comment
        if (commentMap[comment.parentCommentId]) {
          commentMap[comment.parentCommentId].replies.push(comment);
        }
      } else {
        // This is a root comment
        rootComments.push(comment);
      }
    });

    return rootComments;
  };

  const handleVote = async (voteType) => {
    if (!user) {
      toast.info("Please log in to vote", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/questions/${id}/${voteType}`,
        {},
        { withCredentials: true }
      );

      setQuestion(response.data);
    } catch (error) {
      console.error(`Error ${voteType}ing question:`, error);
      toast.error("Failed to register vote", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSaveToggle = async () => {
  const handleSaveToggle = async () => {
    if (!user) {
      toast.info("Please log in to save questions", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const isSaved = question.savedQuestionIds?.includes(user.id);
      const endpoint = isSaved
        ? `/api/questions/${id}/unsave`
        : `/api/questions/${id}/save`;
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        {},
        { withCredentials: true }
      );

      setQuestion((prev) => ({
        ...prev,
        savedQuestionIds: isSaved
          ? prev.savedQuestionIds.filter((userId) => userId !== user.id)
          : [...(prev.savedQuestionIds || []), user.id],
      }));

      toast.success(isSaved ? "Question unsaved" : "Question saved", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to save/unsave question", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    if (
      window.confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/questions/${id}`, {
          withCredentials: true,
        await axios.delete(`http://localhost:5000/api/questions/${id}`, {
          withCredentials: true,
        });
        toast.success("Question deleted successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/forum");
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error("Failed to delete question", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please log in to comment", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forum/comments`,
        {
          questionId: id,
          content: newComment,
          authorName: user.username,
        },
        { withCredentials: true }
      );

      const newCommentData = response.data;
      setComments((prevComments) => [
        ...prevComments,
        { ...newCommentData, replies: [] },
      ]);
      setNewComment("");

      toast.success("Comment added", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please log in to reply", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!replyContent.trim() || !replyTo) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forum/comments`,
        {
          questionId: id,
          parentCommentId: replyTo,
          content: replyContent,
        },
        { withCredentials: true }
      );

      const newReply = response.data;

      const updateRepliesRecursively = (comments, parentId, newReply) => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [
                ...(comment.replies || []),
                { ...newReply, replies: [] },
              ],
            };
          } else if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateRepliesRecursively(
                comment.replies,
                parentId,
                newReply
              ),
            };
          }
          return comment;
        });
      };

      setComments((prevComments) =>
        updateRepliesRecursively(prevComments, replyTo, newReply)
      );
      setReplyTo(null);
      setReplyContent("");

      toast.success("Reply added", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEditComment = async (commentId, e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please log in to edit comments", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!editContent.trim()) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/forum/comments/${commentId}`,
        {
          content: editContent,
        },
        { withCredentials: true }
      );

      const updatedComment = response.data;

      const updateCommentRecursively = (
        comments,
        commentId,
        updatedComment
      ) => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, ...updatedComment, replies: comment.replies };
          } else if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentRecursively(
                comment.replies,
                commentId,
                updatedComment
              ),
            };
          }
          return comment;
        });
      };

      setComments((prevComments) =>
        updateCommentRecursively(prevComments, commentId, updatedComment)
      );
      setEditingCommentId(null);
      setEditContent("");

      toast.success("Comment updated", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error(error.response?.data || "Failed to update comment", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      toast.info("Please log in to delete comments", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/forum/comments/${commentId}`, {
          withCredentials: true,
        });

        const removeCommentRecursively = (comments, commentId) => {
          return comments.filter((comment) => {
            if (comment.id === commentId) return false;
            if (comment.replies && comment.replies.length > 0) {
              comment.replies = removeCommentRecursively(
                comment.replies,
                commentId
              );
            }
            return true;
          });
        };

        setComments((prevComments) =>
          removeCommentRecursively(prevComments, commentId)
        );

        toast.success("Comment deleted", {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Error deleting comment:", error);
        toast.error(error.response?.data || "Failed to delete comment", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const canEditOrDelete = (comment) => {
    if (!user) return false;
    const commentDate = new Date(comment.createdAt);
    const now = new Date();
    const hoursDiff = (now - commentDate) / (1000 * 60 * 60);
    return comment.authorId === user.id && hoursDiff <= 24;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffMins > 0) {
      return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
    } else {
      return "just now";
    }
  };

  const renderComments = (commentsToRender, level = 0) => {
    return commentsToRender.map((comment) => (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: level * 0.05 }}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 border-l-4 ${
          level % 3 === 0
            ? "border-blue-500"
            : level % 3 === 1
            ? "border-purple-500"
            : "border-emerald-500"
        }`}
        style={{
          marginLeft: level > 0 ? `${level * 24}px` : 0,
          transition: "all 0.3s ease",
        }}
      >
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={comment.author?.avatar || "/default-avatar.png"}
              alt={comment.authorName || "Anonymous"}
              className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center mb-2">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {comment.authorName || "Anonymous"}
              </span>
              <span className="flex items-center ml-2 text-xs text-gray-500 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="hidden md:inline">
                  {formatDate(comment.createdAt)}
                </span>
                <span className="md:hidden">{timeAgo(comment.createdAt)}</span>
              </span>
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span className="ml-2 text-xs italic text-gray-500 dark:text-gray-400">
                  (edited)
                </span>
              )}
            </div>

            {editingCommentId === comment.id ? (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={(e) => handleEditComment(comment.id, e)}
                className="mt-4 overflow-hidden"
              >
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit your comment..."
                  className="w-full px-3 py-2 text-sm transition-all duration-200 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  rows="3"
                  required
                />
                <div className="flex justify-end gap-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditContent("");
                    }}
                    className="px-3 py-1 text-sm text-gray-600 transition-colors bg-gray-100 rounded-md dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-3 py-1 text-sm text-white transition-colors bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                  >
                    Update Comment
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <p className="mb-3 text-gray-800 dark:text-gray-200">
                {comment.content}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm">
              {user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setReplyTo(comment.id);
                    setReplyContent("");
                  }}
                  className="flex items-center font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  Reply
                </motion.button>
              )}
              {canEditOrDelete(comment) && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="flex items-center font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </motion.button>
                </>
              )}
            </div>

            <AnimatePresence>
              {replyTo === comment.id && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={submitReply}
                  className="mt-4 overflow-hiddenarithm"
                >
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full px-3 py-2 text-sm transition-all duration-200 border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    rows="3"
                    required
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="px-3 py-1 text-sm text-gray-600 transition-colors bg-gray-100 rounded-md dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-3 py-1 text-sm text-white transition-colors bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                    >
                      Post Reply
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-3">
                {renderComments(comment.replies, level + 1)}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 max-w-4xl p-4 mx-auto md:p-6">
        <div className="relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-10 h-10 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"
              style={{ animationDirection: "reverse" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl p-6 mx-auto border border-red-200 rounded-lg shadow-lg md:p-8 bg-red-50 dark:bg-red-900/20 dark:border-red-800"
      >
        <div className="flex items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="ml-2 text-xl font-bold text-red-700 dark:text-red-400">
            Error Loading Question
          </h2>
        </div>
        <p className="mb-4 text-red-600 dark:text-red-300">{error}</p>
        <Link
          to="/forum"
          className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Forum
        </Link>
      </motion.div>
    );
  }

  if (!question) return null;

  const isSaved = user && question.savedQuestionIds?.includes(user.id);
  const voteCount =
    (question.upvoteUserIds?.length || 0) -
    (question.downvoteUserIds?.length || 0);

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        variants={containerVariants}
        className="max-w-4xl p-4 mx-auto md:p-6"
      >
        {/* Breadcrumb navigation */}
        <motion.div
          variants={itemVariants}
          className="flex items-center p-3 mb-6 text-sm text-gray-600 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800"
        >
          <Link
            to="/forum"
            className="flex items-center transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6"
              />
            </svg>
            Forum
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mx-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="max-w-xs font-medium text-gray-800 truncate dark:text-gray-200">
            {question.title}
          </span>
        </motion.div>

        {/* Question card */}
        <motion.div
          variants={itemVariants}
          className="mb-8 overflow-hidden bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <div className="p-6 md:p-8">
            <div className="flex items-start">
              {/* Vote controls */}
              <div className="flex flex-col items-center mr-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleVote("upvote")}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    user && question.upvoteUserIds?.includes(user.id)
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                  disabled={!user}
                  aria-label="Upvote"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </motion.button>

                <motion.span
                  key={voteCount}
                  initial={{ scale: 1.2, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="my-2 text-xl font-bold text-gray-800 dark:text-gray-200"
                >
                  {voteCount}
                </motion.span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleVote("downvote")}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    user && question.downvoteUserIds?.includes(user.id)
                      ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 ring-2 ring-red-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                  disabled={!user}
                  aria-label="Downvote"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Question content */}
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100 md:text-3xl"
                >
                  {question.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {question.tags?.map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                      className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/40"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mb-6 prose prose-blue dark:prose-invert max-w-none"
                >
                  {question.description}
                </motion.div>

                <div className="flex flex-col justify-between gap-4 pt-4 border-t border-gray-200 sm:flex-row sm:items-center dark:border-gray-700">
                  <div className="flex items-center">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={question.author?.avatar || "/default-avatar.png"}
                      alt={question.author?.username || "Anonymous"}
                      className="w-10 h-10 mr-3 rounded-full ring-2 ring-offset-2 ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {question.author?.username || "Anonymous"}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Posted {formatDate(question.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex self-end gap-3 sm:self-auto">
                    {user && user.id === question.authorId && (
                      <>
                        <Link
                          to={`/forum/edit/${question.id}`}
                          className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={handleDelete}
                          className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 transition-colors bg-red-50 dark:bg-red-900/30 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveToggle}
                      className={`flex items-center px-3 py-1.5 text-sm font-medium transition-colors rounded-md ${
                        isSaved
                          ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50"
                          : "text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                      disabled={!user}
                    >
                      {isSaved ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                          Saved
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5=5z"
                            />
                          </svg>
                          Save
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comments section */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center text-xl font-semibold text-gray-800 dark:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2 text-blue-500"
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
              Comments{" "}
              <span className="ml-2 px-2 py-0.5 text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
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

          {/* Add comment form */}
          {user ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-5 mb-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
              onSubmit={submitComment}
            >
              <div className="flex items-center mb-4">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.username}
                  className="w-8 h-8 mr-3 rounded-full"
                />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Comment as {user.username}
                </span>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 mb-3 text-gray-800 transition-all duration-200 border border-gray-300 rounded-lg dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                rows="4"
                required
              />
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="flex items-center px-5 py-2 font-medium text-white transition-all bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg"
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
              className="p-5 mb-6 border border-blue-200 rounded-lg shadow-sm dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
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
                <p className="text-blue-700 dark:text-blue-300">
                  <Link
                    to="/login"
                    className="font-medium underline hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    Log in
                  </Link>{" "}
                  to join the discussion
                </p>
              </div>
            </motion.div>
          )}

          {/* Comments list */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {comments.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="p-8 text-center border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
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
                {renderComments(
                  comments.filter((comment) => !comment.parentCommentId)
                )}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Toast notification container */}
        <div id="toast-container" className="fixed z-50 bottom-4 right-4"></div>
      </motion.div>
    </>
  );
};

// Toast notification functionality
const toast = {
  success: (message, options) => {
    showToast(message, "success", options);
  },
  error: (message, options) => {
    showToast(message, "error", options);
  },
  info: (message, options) => {
    showToast(message, "info", options);
  },
  warning: (message, options) => {
    showToast(message, "warning", options);
  },
};

const showToast = (message, type, options = {}) => {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toastElement = document.createElement("div");
  const id = `toast-${Date.now()}`;
  toastElement.id = id;

  // Set background and icon based on type
  let bgColor = "bg-gray-800";
  let icon = "";

  switch (type) {
    case "success":
      bgColor = "bg-green-600";
      icon = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
      break;
    case "error":
      bgColor = "bg-red-600";
      icon = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
      break;
    case "info":
      bgColor = "bg-blue-600";
      icon = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      break;
    case "warning":
      bgColor = "bg-yellow-500";
      icon = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
      break;
  }

  toastElement.className = `flex items-center w-full max-w-xs p-4 mb-3 text-white ${bgColor} rounded-lg shadow opacity-0 transform translate-y-2 transition-all duration-300`;
  toastElement.innerHTML = `
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
      ${icon}
    </div>
    <div class="ml-3 text-sm font-normal">${message}</div>
    <button type="button" class="ml-auto -mx-1.5 -my-1.5 text-white hover:text-gray-200 rounded-lg p-1.5 inline-flex h-8 w-8" onclick="document.getElementById('${id}').remove()">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;

  container.appendChild(toastElement);

  // Use setTimeout to trigger the animation
  setTimeout(() => {
    toastElement.classList.remove("opacity-0", "translate-y-2");
  }, 10);

  // Auto-remove the toast after duration
  const autoClose = options.autoClose !== undefined ? options.autoClose : 3000;
  if (autoClose) {
    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.classList.add("opacity-0", "translate-y-2");
        setTimeout(() => {
          if (toastElement.parentNode) {
            toastElement.remove();
          }
        }, 300);
      }
    }, autoClose);
  }
};

export default QuestionDetailPage;
