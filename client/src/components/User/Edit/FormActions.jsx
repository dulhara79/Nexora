import React from 'react';
import { Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

const FormActions = ({ loading, navigate, isDarkMode }) => {
  const cancelButtonClasses = isDarkMode
    ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
    : 'text-gray-800 bg-gray-200 hover:bg-gray-300';

  return (
    <motion.div 
      className="flex justify-end mt-8 space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.button
        type="button"
        onClick={() => navigate(-1)}
        className={`flex items-center px-6 py-2.5 rounded-lg transition-colors duration-300 ${cancelButtonClasses}`}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-5 h-5 mr-2" /> Cancel
      </motion.button>
      
      <motion.button
        type="submit"
        className={`flex items-center px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        disabled={loading}
        whileHover={!loading ? { scale: 1.05 } : {}}
        whileTap={!loading ? { scale: 0.95 } : {}}
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" /> Save Changes
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default FormActions;