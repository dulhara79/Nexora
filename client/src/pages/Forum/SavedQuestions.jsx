// src/SavedQuestions.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SavedQuestionsPage from '../../components/Forum/SavedQuestionsPage';
import '../../index.css';

function SavedQuestions() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            key="loader"
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SavedQuestionsPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SavedQuestions;