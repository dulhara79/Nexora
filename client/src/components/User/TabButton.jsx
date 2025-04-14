import React from "react";
import { motion } from "framer-motion";

function TabButton({ children, active, onClick, isDarkMode }) {
  return (
    <motion.button
      onClick={onClick}
      className={`pb-3 px-1 font-medium relative ${active ? 'text-indigo-400' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
      whileHover={{ y: -2 }}
    >
      {children}
      {active && (
        <motion.div
          className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-400"
          layoutId="activeTab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
}

export default TabButton;