import React from "react";
import { motion } from "framer-motion";

function LoadingSpinner({ isDarkMode }) {
  return (
    <motion.div 
      className="flex justify-center py-10"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className={`w-8 h-8 border-4 ${isDarkMode ? 'border-indigo-500' : 'border-indigo-400'} rounded-full border-t-transparent`} />
    </motion.div>
  );
}

export default LoadingSpinner;