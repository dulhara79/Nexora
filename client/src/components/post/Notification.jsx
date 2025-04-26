import { useState } from "react";
import { motion } from "framer-motion";

const Notification = ({ message, type, createdAt, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-4 mb-2 rounded-lg shadow-md flex justify-between items-center ${
        type === "like" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
      }`}
    >
      <div>
        <p>{message}</p>
        <p className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
      <button
        onClick={handleClose}
        className="text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </motion.div>
  );
};

export default Notification;