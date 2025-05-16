import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { buttonVariants } from "./Variants";
import FallbackAvatar from "../common/FallbackAvatar";

const QuestionDetailCard = ({ question, user, token, isAuthenticated, setQuestion, navigate }) => {
  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      toast.info("Please log in to vote", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/questions/${question.id}/vote`,
        { voteType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setQuestion(response.data.question);
      toast.success(`Question ${voteType}d`, { position: "top-right", autoClose: 2000 });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to register vote", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to save questions", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const isSaved = question.savedQuestionIds?.includes(user.id);
      const endpoint = isSaved
        ? `/api/questions/saved-questions/${question.id}`
        : `/api/questions/saved-questions`;
      const method = isSaved ? axios.delete : axios.post;
      const data = isSaved ? {} : { questionId: question.id };

      await method(`http://localhost:5000${endpoint}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
      toast.error(error.response?.data?.error || "Failed to save/unsave question", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to delete questions", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/questions/${question.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Question deleted successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/forum");
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete question", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
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

  const isSaved = user && question.savedQuestionIds?.includes(user.id);
  const voteCount =
    (question.upvoteUserIds?.length || 0) - (question.downvoteUserIds?.length || 0);

  return (
    <motion.div
      className="w-full mb-8 overflow-hidden bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-xl dark:border-gray-700"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start">
          <div className="flex flex-col items-center mr-6">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleVote("upvote")}
              className={`p-2 rounded-full transition-all duration-200 ${
                user && question.upvoteUserIds?.includes(user.id)
                  ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 ring-2 ring-orange-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
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
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
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

          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-100 font-display md:text-4xl"
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
                  className="px-3 py-1 text-sm font-medium text-orange-700 bg-orange-100 rounded-full dark:bg-orange-900/40 dark:text-orange-300"
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-6 prose text-gray-700 prose-orange dark:prose-invert max-w-none dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
            <div className="flex flex-col justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 sm:flex-row sm:items-center">
              <div className="flex items-center">
                {/* <motion.div whileHover={{ scale: 1.1 }}>
                  <FallbackAvatar className="w-10 h-10 mr-3 rounded-full ring-2 ring-offset-2 ring-orange-500" />
                </motion.div> */}
                <motion.img
                  src={question.authorAvatarUrl || "/default-avatar.png"}
                  alt="Author Avatar"
                  className="w-10 h-10 mr-3 rounded-full ring-2 ring-offset-2 ring-orange-500">
                  </motion.img>
                <div>
                  <p className="pr-8 font-medium text-gray-800 dark:text-gray-200">
                    {question.authorUsername || "Anonymous"}
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
                      className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 transition-colors rounded-lg dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50"
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
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleDelete}
                      className="flex items-center px-4 py-2 text-sm font-medium text-red-600 transition-colors rounded-lg dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50"
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
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleSaveToggle}
                  className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isSaved
                      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50"
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
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
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
  );
};

export default QuestionDetailCard;