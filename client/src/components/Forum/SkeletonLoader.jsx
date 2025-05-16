import React from "react";
import { motion } from "framer-motion";

export default function SkeletonLoader() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((item) => (
        <motion.div
          key={item}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: item * 0.1 }}
          className="p-6 bg-white shadow-md rounded-xl"
        >
          <div className="w-3/4 h-6 mb-4 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="flex gap-3 mb-4">
            <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="w-full h-16 mb-4 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="flex gap-2 mb-4">
            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between">
            <div className="w-20 h-6 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-20 h-6 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
