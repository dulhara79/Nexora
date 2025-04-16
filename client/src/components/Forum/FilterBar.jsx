// src/components/FilterBar.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiAdjustments, HiOutlineX, HiChevronDown, HiBookmark, HiStar, HiClock } from 'react-icons/hi';

const FilterBar = ({ filter, onFilterChange, searchTerm, onSearchChange, sortBy, onSortChange }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const searchInputRef = useRef(null);
  const sortDropdownRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div 
      className="p-4 bg-white border rounded-lg shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div className="flex space-x-2">
          <button 
            onClick={() => onFilterChange('all')} 
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
          >
            <span className="flex items-center">
              <HiBookmark className="w-4 h-4 mr-1.5" />
              All Saved
            </span>
          </button>
          
          <button 
            onClick={() => onFilterChange('pinned')} 
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'pinned' 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
          >
            <span className="flex items-center">
              <HiStar className="w-4 h-4 mr-1.5" />
              Pinned
            </span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-700/50">
              <div className="flex items-center pl-3 pointer-events-none">
                <HiSearch className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                className="w-full py-2 pl-2 pr-8 text-sm bg-transparent border-0 text-slate-800 dark:text-slate-200 focus:ring-0 focus:outline-none"
                placeholder="Search saved questions..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute transform -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <HiOutlineX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="relative" ref={sortDropdownRef}>
            <motion.button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-1">Sort</span>
              <HiChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'transform rotate-180' : ''}`} />
            </motion.button>
            
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  className="absolute right-0 z-10 w-48 mt-2 bg-white border rounded-lg shadow-lg dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onSortChange('newest');
                        setIsSortOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                        sortBy === 'newest'
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <HiClock className="w-4 h-4 mr-2" />
                      Newest First
                    </button>
                    <button
                      onClick={() => {
                        onSortChange('popular');
                        setIsSortOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                        sortBy === 'popular'
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                      Most Upvoted
                    </button>
                    <button
                      onClick={() => {
                        onSortChange('mostAnswers');
                        setIsSortOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                        sortBy === 'mostAnswers'
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Most Answers
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 md:grid-cols-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Advanced filters would go here */}
            <div className="col-span-3 text-sm text-center text-slate-500 dark:text-slate-400">
              Advanced filters coming soon
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilterBar;