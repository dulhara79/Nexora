// src/components/QuestionCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineBookmark, HiBookmark, HiOutlineTrash, HiStar, HiOutlineStar, HiOutlineChat, HiOutlineEye } from 'react-icons/hi';
import { format, formatDistanceToNow } from 'date-fns';

const QuestionCard = ({ question, onRemove, onTogglePin }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      formatted: format(date, 'MMM d, yyyy'),
      relative: formatDistanceToNow(date, { addSuffix: true })
    };
  };
  
  const formattedDate = formatDate(question.datePosted);

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 80,
        damping: 10
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700 overflow-hidden ${question.isPinned ? 'ring-2 ring-blue-400 dark:ring-blue-500 ring-opacity-50' : ''}`}
      variants={item}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              {question.isPinned && (
                <motion.span 
                  className="flex items-center text-xs font-medium text-blue-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <HiStar className="w-4 h-4 mr-1" />
                  Pinned
                </motion.span>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Saved {formattedDate.relative}
              </span>
            </div>
            
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-white">
              <a href="#" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
                {question.title}
              </a>
            </h3>
            
            <p className="mb-3 text-slate-600 dark:text-slate-300 line-clamp-2">
              {question.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center mr-4">
                <HiOutlineChat className="w-4 h-4 mr-1" />
                {question.answers} {question.answers === 1 ? 'answer' : 'answers'}
              </div>
              <div className="flex items-center mr-4">
                <HiOutlineEye className="w-4 h-4 mr-1" />
                {question.views} views
              </div>
              <div className="flex items-center">
                <span className="inline-block w-5 h-5 mr-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></span>
                {question.author}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center ml-4 space-y-2">
            <motion.button
              onClick={onTogglePin}
              className={`p-2 rounded-full ${question.isPinned ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {question.isPinned ? <HiStar className="w-5 h-5" /> : <HiOutlineStar className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              onClick={onRemove}
              className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiOutlineTrash className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
      
      {question.isPinned && (
        <motion.div 
          className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.div>
  );
};

export default QuestionCard;