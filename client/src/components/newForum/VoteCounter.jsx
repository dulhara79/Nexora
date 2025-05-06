// src/components/forum/VoteCounter.jsx
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const BASE_URL = "http://localhost:5000";

export default function VoteCounter({ 
  upvotes = 0, 
  downvotes = 0,
  onVote,
  isVoted = false
}) {
  const [currentUpvotes, setUpvotes] = useState(upvotes);
  const [currentDownvotes, setDownvotes] = useState(downvotes);
  const [userVote, setUserVote] = useState(null); // "up" | "down" | null

  const handleVote = async (type) => {
    try {
      // Optimistic update
      const isUp = type === "up";
      
      if (userVote === type) {
        // Remove vote
        setUserVote(null);
        setUpvotes(current => current - 1);
      } else if (userVote) {
        // Toggle vote
        setUserVote(isUp ? "up" : "down");
        setUpvotes(current => isUp ? current + 1 : current - 1);
        setDownvotes(current => isUp ? current - 1 : current + 1);
      } else {
        // Add new vote
        setUserVote(type);
        isUp 
          ? setUpvotes(current => current + 1) 
          : setDownvotes(current => current + 1);
      }

      await axios.patch(`${BASE_URL }/api/forum/vote`, { type });
      onVote?.(type);
    } catch (error) {
      console.error("Vote error:", error);
      // Revert on error
      if (userVote === "up") setUpvotes(current => current - 1);
      if (userVote === "down") setDownvotes(current => current - 1);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote("up")}
        className={`flex items-center space-x-1 ${
          userVote === "up" ? "text-green-500" : "text-gray-500"
        }`}
      >
        <ThumbsUp className="w-5 h-5" />
        <span>{currentUpvotes}</span>
      </motion.button>
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote("down")}
        className={`flex items-center space-x-1 ${
          userVote === "down" ? "text-red-500" : "text-gray-500"
        }`}
      >
        <ThumbsDown className="w-5 h-5" />
        <span>{currentDownvotes}</span>
      </motion.button>
    </div>
  );
}