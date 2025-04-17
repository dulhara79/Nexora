import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
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

  /*
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/questions/${id}`, {
          credentials: "include",
        });

        const resComments = axios.get(`http://localhost:5000/api/comments/question/${id}`);

        if (!response.ok) {
          throw new Error("Question not found");
        }

        const data = await response.json();
        setQuestion(data);
        // Assuming comments are included in the question data
        setComments(data.comments || []);
        console.log("res comments: " , resComments);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [id]);
  */

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch question
        const response = await fetch(`http://localhost:5000/api/questions/${id}`, {
          credentials: "include",
        });
  
        // Await comments fetch
        const resComments = await axios.get(`http://localhost:5000/api/comments/question/${id}`);
  
        if (!response.ok) {
          throw new Error("Question not found");
        }
  
        // Parse question data
        const data = await response.json();
        setQuestion(data);
  
        // Set comments from axios response
        setComments(resComments.data); // resComments.data is the array of commentsactual comment array
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchQuestionDetails();
  }, [id]);
  

  const handleVote = async (voteType) => {
    if (!user) {
      alert("Please log in to vote");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}/${voteType}`, {
        method: "POST",
        credentials: "include",
      });
      console.log("Response: ", response); // Log the response object
      console.log("Vote Type: ", voteType); // Log the vote type
      if (response.ok) {
        const updatedQuestion = await response.json();
        setQuestion(updatedQuestion);
      }
    } catch (error) {
      console.error(`Error ${voteType}ing question:`, error);
    }
  };

  const handleFlag = async () => {
    if (!user) {
      alert("Please log in to flag content");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to flag this question as inappropriate?"
      )
    ) {
      try {
        const response = await fetch(`http://localhost:5000/api/comments/${id}/flag`, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          alert("Question has been flagged for review");
        }
      } catch (error) {
        console.error("Error flagging question:", error);
      }
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
        const response = await fetch(`http://localhost:5000/api/questions/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          navigate("/forum");
        } else {
          const error = await response.text();
          alert(`Failed to delete: ${error}`);
        }
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to comment");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          questionId: id,
          content: newComment,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([...comments, newCommentData]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to reply");
      return;
    }

    if (!replyContent.trim() || !replyTo) return;

    try {
      const response = await fetch(`http://localhost:5000/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          questionId: id,
          parentId: replyTo,
          content: replyContent,
        }),
      });

      if (response.ok) {
        const newReply = await response.json();

        // Find and update the parent comment with the new reply
        const updatedComments = comments.map((comment) => {
          if (comment.id === replyTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            };
          }
          return comment;
        });

        setComments(updatedComments);
        setReplyTo(null);
        setReplyContent("");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Recursive function to render comments and their replies
  const renderComments = (commentsToRender, level = 0) => {
    return commentsToRender.map((comment) => (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-lg shadow-sm p-4 mb-3`}
        style={{ marginLeft: level > 0 ? `${level * 20}px` : 0 }}
      >
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            <img
              src={comment.author?.avatar || "/default-avatar.png"}
              alt={comment.author?.username || "Anonymous"}
              className="w-8 h-8 rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="font-medium text-gray-700">
                {comment.author?.username || "Anonymous"}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mb-2 text-gray-800">{comment.content}</p>

            {user && (
              <button
                onClick={() => {
                  setReplyTo(comment.id);
                  setReplyContent("");
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Reply
              </button>
            )}

            {/* Reply form */}
            <AnimatePresence>
              {replyTo === comment.id && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={submitReply}
                  className="mt-3 overflow-hidden"
                >
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="px-3 py-1 text-sm text-gray-600 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Post Reply
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
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
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl p-4 mx-auto border border-red-200 rounded-lg md:p-6 bg-red-50">
        <h2 className="mb-2 text-xl font-semibold text-red-700">Error</h2>
        <p className="text-red-600">{error}</p>
        <Link
          to="/forum"
          className="inline-block mt-4 font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Forum
        </Link>
      </div>
    );
  }

  if (!question) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl p-4 mx-auto md:p-6"
    >
      {/* Breadcrumb navigation */}
      <div className="flex items-center mb-6 text-sm text-gray-600">
        <Link to="/forum" className="transition-colors hover:text-blue-600">
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
        <span className="max-w-xs text-gray-800 truncate">
          {question.title}
        </span>
      </div>

      {/* Question card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 overflow-hidden bg-white rounded-lg shadow-md"
      >
        <div className="p-6">
          <div className="flex items-start">
            {/* Vote controls */}
            <div className="flex flex-col items-center mr-6">
              <button
                onClick={() => handleVote("upvote")}
                className={`p-2 rounded-full ${
                  user && question.upvoteUserIds?.includes(user.id)
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
                disabled={!user}
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
              </button>
              <span className="my-1 text-xl font-bold">
                {question.upvoteUserIds?.length - question.downvoteUserIds?.length || 0}
              </span>
              <button
                onClick={() => handleVote("downvote")}
                className={`p-2 rounded-full ${
                  user && question.downvoteUserIds?.includes(user.id)
                    ? "bg-red-100 text-red-600"
                    : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                }`}
                disabled={!user}
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
              </button>
            </div>

            {/* Question content */}
            <div className="flex-1">
              <h1 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl">
                {question.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-6 prose prose-blue max-w-none">
                {question.description}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <img
                    src={question.author?.avatar || "/default-avatar.png"}
                    alt={question.author?.username || "Anonymous"}
                    className="w-8 h-8 mr-2 rounded-full"
                  />
                  <div>
                    <p className="font-medium">
                      {question.author?.username || "Anonymous"}
                    </p>
                    <p className="text-xs">
                      Posted on{" "}
                      {new Date(question.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {user && user.id === question.authorId && (
                    <>
                      <Link
                        to={`/forum/edit/${question.id}`}
                        className="text-blue-600 transition-colors hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={handleDelete}
                        className="text-red-600 transition-colors hover:text-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleFlag}
                    className="text-gray-600 transition-colors hover:text-gray-700"
                    title="Flag as inappropriate"
                  >
                    Flag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comments section */}
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Comments ({comments.length})
        </h2>

        {/* Add comment form */}
        {user ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-6 bg-white rounded-lg shadow-sm"
            onSubmit={submitComment}
          >
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              required
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                className="px-4 py-2 font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Post Comment
              </button>
            </div>
          </motion.form>
        ) : (
          <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-blue-700">
              <Link to="/login" className="font-medium underline">
                Log in
              </Link>{" "}
              to join the discussion
            </p>
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="p-6 text-center rounded-lg bg-gray-50">
              <p className="text-gray-600">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            // Only render top-level comments (those without parentId)
            renderComments(comments.filter((comment) => !comment.parentId))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionDetailPage;
