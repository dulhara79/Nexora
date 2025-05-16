// ToastNotification.jsx
import React from "react";
import { motion } from "framer-motion";

const ToastNotification = ({ show, message, type }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-blue-500"
      }`}
    >
      {message}
    </motion.div>
  );
};

export default ToastNotification;
