import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, Clock, User, Send, Loader, MoreHorizontal,
  ChevronDown, ChevronUp, Edit2, Trash2, AlertTriangle
} from "lucide-react";
import LikeDislikeButtons from "./LikeDislikeButtons";
import { formatDistanceToNow } from "date-fns";

const BASE_URL = "http://localhost:5000";

export default function EnhancedCommentThread({ 
  comment, 
  depth = 0, 
  currentUserId = "user123", // Pass the current user's ID from auth
  onDelete,
  isQuestion = false,
  questionOwnerId = null  // Pass the question owner's ID for permission checks
}) {
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(depth === 0);
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);
  const menuRef = useRef(null);

  // Check if current user is the author or question owner (for moderating comments)
  const isAuthor = comment.authorId === currentUserId;
  const isQuestionOwner = questionOwnerId === currentUserId;
  const canModerate = isAuthor || isQuestionOwner;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Initialize edit text when editing starts
    if (isEditing) {
      setEditText(comment.content);
      setTimeout(() => {
        editInputRef.current?.focus();
      }, 100);
    }
  }, [isEditing, comment.content]);

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) {
      setTimeout(() => {
        replyInputRef.current?.focus();
      }, 100);
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleUpvote = async () => {
    try {
      await axios.post(`${BASE_URL}/api/forum/comments/${comment.id}/upvote`);
      // Refresh comment or update state
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  const handleDownvote = async () => {
    try {
      await axios.post(`${BASE_URL}/api/forum/comments/${comment.id}/downvote`);
    } catch (error) {
      console.error("Error downvoting comment:", error);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    
    try {
      setIsReplying(true);
      const res = await axios.post(`${BASE_URL}/api/forum/comments/${comment.id}/reply`, {
        text: replyText,
        questionId: comment.questionId,
        parentCommentId: comment.id,
      });
      
      setReplies([...replies, res.data.reply]);
      setReplyText("");
      setShowReplyForm(false);
      setShowReplies(true);
      
    } catch (err) {
      console.error("Error submitting reply:", err);
    } finally {
      setIsReplying(false);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim() || editText === comment.content) {
      setIsEditing(false);
      return;
    }
    
    try {
      await axios.put(`${BASE_URL}/api/forum/comments/${comment.id}`, {
        content: editText
      });
      
      // Update the comment content locally
      comment.content = editText;
      setIsEditing(false);
      
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/forum/comments/${comment.id}`);
      
      // Call the parent's onDelete to remove this comment from the list
      if (onDelete) {
        onDelete(comment.id);
      }
      
    } catch (err) {
      console.error("Error deleting comment:", err);
      setShowDeleteConfirm(false);
    }
  };

  const timeAgo = comment.createdAt 
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
      className={`${depth > 0 ? "border-l-2 border-orange-100 pl-4" : ""} mb-4`}
    >
      <motion.div
        whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        className={`p-4 rounded-lg ${depth === 0 ? "bg-white shadow" : "bg-gray-50"} ${isEditing ? "border border-orange-300" : ""}`}
      >
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
              <User className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="mb-2">
                <textarea
                  ref={editInputRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleEdit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 text-sm text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                  >
                    Save
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="mb-2">
                <p className="text-gray-800">{comment.content}</p>
              </div>
            )}
            
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {comment.authorName || "User"}
                </span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {timeAgo}
                </span>
              </div>
              
              {canModerate && !isEditing && (
                <div className="relative" ref={menuRef}>
                  <motion.button
                    onClick={toggleMenu}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className="absolute right-0 z-10 w-32 py-1 mt-1 bg-white rounded-lg shadow-lg"
                      >
                        {isAuthor && (
                          <motion.button
                            onClick={() => {
                              setIsEditing(true);
                              setShowMenu(false);
                            }}
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700"
                          >
                            <Edit2 className="w-3 h-3 mr-2" />
                            Edit
                          </motion.button>
                        )}
                        
                        <motion.button
                          onClick={() => {
                            setShowDeleteConfirm(true);
                            setShowMenu(false);
                          }}
                          whileHover={{ backgroundColor: "#fee2e2" }}
                          className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600"
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {showDeleteConfirm && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 z-20 w-48 p-3 mt-1 bg-white rounded-lg shadow-lg"
                      >
                        <div className="flex items-center mb-2 text-red-600">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Confirm delete?</span>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          <motion.button
                            onClick={() => setShowDeleteConfirm(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            onClick={handleDelete}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-2 py-1 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600"
                          >  
                            Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            
            {!isEditing && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <LikeDislikeButtons 
                  upvotes={comment.upvoteUserIds?.length || 0} 
                  downvotes={comment.downvoteUserIds?.length || 0}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                />
                
                <motion.button 
                  onClick={toggleReplyForm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center text-sm text-orange-500 hover:text-orange-600"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Reply
                </motion.button>
                
                {replies.length > 0 && (
                  <motion.button 
                    onClick={() => setShowReplies(!showReplies)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-sm text-blue-500 hover:text-blue-600"
                  >
                    {showReplies ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Hide Replies
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Show {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Reply Form */}
      <AnimatePresence>
        {showReplyForm && !isEditing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 ml-8"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <input
                  ref={replyInputRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              
              <motion.button
                onClick={handleReply}
                disabled={isReplying || !replyText.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-3 py-2 text-sm text-white rounded-lg ${
                  isReplying || !replyText.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isReplying ? (
                  <motion.span 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Nested Replies */}
      <AnimatePresence>
        {showReplies && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 ml-4 space-y-2"
          >
            {replies.map((reply) => (
              <EnhancedCommentThread 
                key={reply.id} 
                comment={reply} 
                depth={depth + 1}
                currentUserId={currentUserId}
                questionOwnerId={questionOwnerId}
                onDelete={(deleteId) => {
                  // Filter out the deleted reply
                  setReplies(replies.filter(r => r.id !== deleteId));
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
