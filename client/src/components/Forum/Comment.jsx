import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { buttonVariants, itemVariants } from "./Variants";
import FallbackAvatar from "../../components/common/FallbackAvatar";

const Comment = ({
  comment,
  user,
  token,
  isAuthenticated,
  setComments,
  level,
}) => {
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const handleCommentVote = async (commentId, voteType) => {
    if (!isAuthenticated) {
      toast.info("Please log in to vote", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/forum/comments/${commentId}/vote`,
        { voteType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedComment = response.data.comment;

      const updateCommentRecursively = (
        comments,
        commentId,
        updatedComment
      ) => {
        return comments.map((c) => {
          if (c.id === commentId) {
            return { ...c, ...updatedComment, replies: c.replies };
          } else if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: updateCommentRecursively(
                c.replies,
                commentId,
                updatedComment
              ),
            };
          }
          return c;
        });
      };

      setComments((prevComments) =>
        updateCommentRecursively(prevComments, commentId, updatedComment)
      );

      toast.success(`Comment ${voteType}d`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to vote on comment", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please log in to reply", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!replyContent.trim() || !replyTo) {
      toast.warn("Reply cannot be empty", {
        position: "top-right",
        autoClose: 300,
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/forum/comments`,
        {
          questionId: comment.questionId,
          parentCommentId: replyTo,
          content: replyContent,
          authorName: user.username,
          authorAvatarUrl: user.profilePhotoUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newReply = response.data.comment;

      const updateRepliesRecursively = (comments, parentId, newReply) => {
        return comments.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), { ...newReply, replies: [] }],
            };
          } else if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: updateRepliesRecursively(c.replies, parentId, newReply),
            };
          }
          return c;
        });
      };

      setComments((prevComments) =>
        updateRepliesRecursively(prevComments, replyTo, newReply)
      );
      setReplyTo(null);
      setReplyContent("");
      toast.success("Reply added", { position: "top-right", autoClose: 2000 });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add reply", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEditComment = async (commentId, e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please log in to edit comments", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!editContent.trim()) {
      toast.warn("Comment cannot be empty", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/forum/comments/${commentId}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedComment = response.data.comment;

      const updateCommentRecursively = (
        comments,
        commentId,
        updatedComment
      ) => {
        return comments.map((c) => {
          if (c.id === commentId) {
            return { ...c, ...updatedComment, replies: c.replies };
          } else if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: updateCommentRecursively(
                c.replies,
                commentId,
                updatedComment
              ),
            };
          }
          return c;
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
      toast.error(error.response?.data?.error || "Failed to update comment", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) {
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
        await axios.delete(
          `http://localhost:5000/api/forum/comments/${commentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const removeCommentRecursively = (comments, commentId) => {
          return comments.filter((c) => {
            if (c.id === commentId) return false;
            if (c.replies && c.replies.length > 0) {
              c.replies = removeCommentRecursively(c.replies, commentId);
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
        toast.error(error.response?.data?.error || "Failed to delete comment", {
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

  const commentVoteCount =
    (comment.upvoteUserIds?.length || 0) -
    (comment.downvoteUserIds?.length || 0);

  return (
    <motion.div
      variants={itemVariants}
      className={`relative bg-white dark:bg-gray-900 rounded-xl p-5 mb-4 shadow-lg border-l-4 border-gradient-to-r ${
        level % 3 === 0
          ? "from-orange-500 to-amber-500"
          : level % 3 === 1
          ? "from-amber-500 to-orange-500"
          : "from-orange-400 to-amber-400"
      } transition-all duration-300 hover:shadow-xl`}
      style={{ marginLeft: level > 0 ? `${level * 24}px` : 0 }}
    >
      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleCommentVote(comment.id, "upvote")}
            className={`p-2 rounded-full transition-all duration-200 ${
              user && comment.upvoteUserIds?.includes(user.id)
                ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 ring-2 ring-orange-400"
                : "text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            }`}
            disabled={!user}
            aria-label="Upvote comment"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
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
            key={commentVoteCount}
            initial={{ scale: 1.2, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="my-2 text-sm font-semibold text-gray-800 dark:text-gray-200"
          >
            {commentVoteCount}
          </motion.span>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleCommentVote(comment.id, "downvote")}
            className={`p-2 rounded-full transition-all duration-200 ${
              user && comment.downvoteUserIds?.includes(user.id)
                ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 ring-2 ring-red-400"
                : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            }`}
            disabled={!user}
            aria-label="Downvote comment"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
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

        <div className="flex-1">
          <div className="flex flex-wrap items-center mb-3">
            <div className="flex items-center">
              {/* <motion.div whileHover={{ scale: 1.1 }}>
                <FallbackAvatar className="w-8 h-8 mr-2 rounded-full ring-2 ring-orange-400" />
              </motion.div> */}
              <motion.img
                src={comment.authorAvatarUrl || "/default-avatar.png"}
                alt="Comment Author Avatar"
                className="w-10 h-10 mr-3 rounded-full ring-2 ring-offset-2 ring-orange-500"
              ></motion.img>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {comment.authorName || "Anonymous"}
              </span>
            </div>
            <span className="flex items-center ml-3 text-xs text-gray-500 dark:text-gray-400">
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
            {comment.replies && comment.replies.length > 0 && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setCollapsed(!collapsed)}
                className="ml-3 text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline"
              >
                {collapsed ? "Expand" : "Collapse"}
              </motion.button>
            )}
          </div>

          {editingCommentId === comment.id ? (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={(e) => handleEditComment(comment.id, e)}
              className="mt-4"
            >
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Edit your comment..."
                className="w-full px-4 py-3 text-sm text-gray-800 transition-all duration-200 bg-white border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                rows="3"
                required
              />
              <div className="flex justify-end gap-2 mt-3">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="button"
                  onClick={() => {
                    setEditingCommentId(null);
                    setEditContent("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg"
                >
                  Update Comment
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <p className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200">
              {comment.content}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm">
            {user && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  setReplyTo(comment.id);
                  setReplyContent("");
                }}
                className="flex items-center font-medium text-orange-600 transition-colors dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
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
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    setEditingCommentId(comment.id);
                    setEditContent(comment.content);
                  }}
                  className="flex items-center font-medium text-blue-600 transition-colors dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
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
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleDeleteComment(comment.id)}
                  className="flex items-center font-medium text-red-600 transition-colors dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
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
                className="mt-4"
              >
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full px-4 py-3 text-sm text-gray-800 transition-all duration-200 bg-white border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  rows="3"
                  required
                />
                <div className="flex justify-end gap-2 mt-3">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg"
                  >
                    Post Reply
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {comment.replies && comment.replies.length > 0 && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4"
            >
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  user={user}
                  token={token}
                  isAuthenticated={isAuthenticated}
                  setComments={setComments}
                  level={level + 1}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Comment;
