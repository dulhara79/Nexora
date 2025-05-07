import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader } from "lucide-react";

const BASE_URL = "http://localhost:5000";

export default function AnswerForm({ questionId, onSubmit }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    setAnswer(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!answer.trim()) return;
    
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/forum/comments`, {
        questionId,
        content: answer,
      });
      
      onSubmit(res.data.comment);
      setAnswer("");
      setCharCount(0);
      
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-300 ${focused ? "ring-2 ring-orange-400 shadow-lg" : "shadow"}`}>
          <textarea
            value={answer}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Share your cooking knowledge and expertise..."
            className="w-full p-4 text-gray-700 border-2 border-gray-100 rounded-lg resize-none focus:outline-none"
            rows={5}
          />
          
          <div className="absolute text-xs text-gray-400 bottom-3 right-3">
            {charCount > 0 && `${charCount} characters`}
          </div>
        </div>
        
        <motion.button
          type="submit"
          disabled={loading || !answer.trim()}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center justify-center px-6 py-3 mt-4 text-white transition-all duration-300 rounded-lg shadow-md ${
            loading || !answer.trim() 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg"
          }`}
        >
          {loading ? (
            <motion.span 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex items-center"
            >
              <Loader className="w-5 h-5 mr-2" />
              Posting...
            </motion.span>
          ) : (
            <span className="flex items-center">
              Post Answer
              <Send className="w-4 h-4 ml-2" />
            </span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

