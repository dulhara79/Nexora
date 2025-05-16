import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, User, MessageCircle, Eye, Award, Bookmark, BookmarkCheck } from "lucide-react";
import LikeDislikeButtons from "./LikeDislikeButtons";
import { formatDistanceToNow } from "date-fns";

export default function QuestionCard({
  question,
  delay = 0,
  isSaved,
  onSaveToggle,
  isAuthenticated,
  token,
}) {
  const handleUpvote = () => console.log("Upvoted", question.id);
  const handleDownvote = () => console.log("Downvoted", question.id);

  const handleSave = () => {
    if (!isAuthenticated) return; // onSaveToggle handles the toast notification
    console.log(`Toggling save for question ${question.id}, currently saved: ${isSaved}`);
    onSaveToggle(question.id, isSaved);
  };

  console.log("QuestionCard question", question);

  const commentCount = question.commentCount || 0;
  const viewCount = question.viewCount || 0;

  const timeAgo = question.createdAt
    ? formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })
    : "";

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(249, 115, 22, 0.1)" }}
      className="relative p-6 mb-6 overflow-hidden transition-all duration-300 bg-white shadow-md rounded-xl"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 opacity-60"></div>

      <Link to={`/forum/question/${question.id}`} className="block">
        <h2 className="mb-2 text-xl font-semibold text-gray-800 transition-colors hover:text-orange-500">
          {question.title}
        </h2>

        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-gray-500">
          <span className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            {question.authorUsername || "Anonymous"}
          </span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {timeAgo}
          </span>
          <span className="flex items-center">
            <MessageCircle className="w-3 h-3 mr-1" />
            {commentCount} {commentCount === 1 ? "answer" : "answers"}
          </span>
          <span className="flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {viewCount} {viewCount === 1 ? "view" : "views"}
          </span>
        </div>

        <p className="mb-4 text-gray-700 line-clamp-2">{question.description}</p>
      </Link>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags?.map((tag, i) => (
          <motion.span
            key={i}
            whileHover={{ scale: 1.05 }}
            className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full"
          >
            #{tag}
          </motion.span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <LikeDislikeButtons
          upvotes={question.upvoteUserIds?.length || 0}
          downvotes={question.downvoteUserIds?.length || 0}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
        />

        <div className="flex items-center gap-3">
          {question.isFeatured && (
            <span className="flex items-center text-xs text-yellow-600">
              <Award className="w-4 h-4 mr-1" />
              Featured
            </span>
          )}

          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center ${
              isSaved ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
            } ${!isAuthenticated ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={!isAuthenticated}
            title={isAuthenticated ? "" : "Please log in to save questions"}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}