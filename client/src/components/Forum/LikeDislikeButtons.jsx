import React, { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function LikeDislikeButtons({
  upvotes = 0,
  downvotes = 0,
  onUpvote,
  onDownvote,
}) {
  const [userVote, setUserVote] = useState(null); // null, "up", or "down"
  const [upvoteCount, setUpvoteCount] = useState(upvotes);
  const [downvoteCount, setDownvoteCount] = useState(downvotes);

  const handleUpvote = () => {
    if (userVote === "up") {
      setUserVote(null);
      setUpvoteCount((prev) => prev - 1);
    } else {
      if (userVote === "down") {
        setDownvoteCount((prev) => prev - 1);
      }
      setUserVote("up");
      setUpvoteCount((prev) => prev + 1);
    }
    onUpvote?.();
  };

  const handleDownvote = () => {
    if (userVote === "down") {
      setUserVote(null);
      setDownvoteCount((prev) => prev - 1);
    } else {
      if (userVote === "up") {
        setUpvoteCount((prev) => prev - 1);
      }
      setUserVote("down");
      setDownvoteCount((prev) => prev + 1);
    }
    onDownvote?.();
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={handleUpvote}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`flex items-center gap-1 text-sm transition-colors ${
          userVote === "up"
            ? "text-green-600 font-medium"
            : "text-gray-500 hover:text-green-600"
        }`}
      >
        <ThumbsUp
          className={`w-4 h-4 ${
            userVote === "up" ? "fill-green-600 stroke-green-600" : ""
          }`}
        />
        <span className="min-w-[20px]">{upvoteCount}</span>
      </motion.button>

      <motion.button
        onClick={handleDownvote}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`flex items-center gap-1 text-sm transition-colors ${
          userVote === "down"
            ? "text-red-600 font-medium"
            : "text-gray-500 hover:text-red-600"
        }`}
      >
        <ThumbsDown
          className={`w-4 h-4 ${
            userVote === "down" ? "fill-red-600 stroke-red-600" : ""
          }`}
        />
        <span className="min-w-[20px]">{downvoteCount}</span>
      </motion.button>
    </div>
  );
}
