import React, { useState } from "react";
import { Save, X, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FormActions = ({
  loading,
  navigate,
  isDarkMode,
  hasChanges = true,
  onSave,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave(); // Call onSave without passing an event
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Button styles
  const primaryBtnBg = isDarkMode
    ? "bg-blue-600 hover:bg-blue-500 active:bg-blue-700"
    : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700";

  const cancelBtnBg = isDarkMode
    ? "bg-gray-800 hover:bg-gray-700 active:bg-gray-900"
    : "bg-gray-100 hover:bg-gray-200 active:bg-gray-300";

  const cancelBtnText = isDarkMode ? "text-gray-200" : "text-gray-700";
  const btnShadow = isDarkMode
    ? "shadow-lg shadow-blue-900/30"
    : "shadow-lg shadow-blue-500/20";

  return (
    <motion.div
      className="flex items-center justify-between mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.button
        type="button"
        onClick={() => navigate(-1)}
        className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${cancelBtnText} ${cancelBtnBg}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span>Back</span>
      </motion.button>

      <div className="flex items-center space-x-3">
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${cancelBtnText} ${cancelBtnBg}`}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <X className="w-4 h-4 mr-2" />
          <span>Cancel</span>
        </motion.button>

        <motion.button
          type="button" // Changed from type="submit" to type="button"
          onClick={handleSave}
          className={`relative flex items-center px-5 py-2.5 text-white font-medium rounded-lg transition-all duration-300 ${primaryBtnBg} ${btnShadow} ${
            !hasChanges || loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading || !hasChanges}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-4 h-4 mr-2 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving...</span>
              </motion.div>
            ) : saveSuccess ? (
              <motion.div
                key="success"
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-4 h-4 mr-2" />
                <span>Saved!</span>
              </motion.div>
            ) : (
              <motion.div
                key="save"
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Save className="w-4 h-4 mr-2" />
                <span>Save Changes</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex items-center text-white"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  <span>Saved!</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FormActions;
