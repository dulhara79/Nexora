// src/components/SavedQuestionsPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import QuestionCard from './QuestionCard';
import FilterBar from './FilterBar';
import { HiStar, HiBookmark, HiCheckCircle } from 'react-icons/hi';

// Mock data
const SAVED_QUESTIONS = [
  {
    id: 1,
    title: "Best practices for state management in React?",
    description: "I'm building a large-scale application and need advice on managing complex state efficiently.",
    tags: ["react", "state", "frontend"],
    author: "alex_dev",
    datePosted: "2025-03-29T14:32:00Z",
    upvotes: 42,
    answers: 8,
    views: 1024,
    isPinned: true,
  },
  {
    id: 2,
    title: "How to implement authentication with NextAuth.js?",
    description: "Looking for a comprehensive guide or examples of implementing OAuth and email authentication.",
    tags: ["nextjs", "authentication", "oauth"],
    author: "security_ninja",
    datePosted: "2025-04-02T09:18:00Z",
    upvotes: 38,
    answers: 5,
    views: 876,
    isPinned: false,
  },
  {
    id: 3,
    title: "Optimizing Tailwind CSS bundle size",
    description: "My project's CSS bundle has grown significantly. What strategies can I use to keep Tailwind optimized?",
    tags: ["tailwind", "optimization", "css"],
    author: "performance_guru",
    datePosted: "2025-04-10T16:45:00Z",
    upvotes: 29,
    answers: 12,
    views: 654,
    isPinned: false,
  },
  {
    id: 4,
    title: "Deploying a Vite app to Vercel",
    description: "Having issues with environment variables and build configurations when deploying my Vite app.",
    tags: ["vite", "vercel", "deployment"],
    author: "deploy_master",
    datePosted: "2025-04-12T11:22:00Z",
    upvotes: 16,
    answers: 3,
    views: 423,
    isPinned: true,
  },
  {
    id: 5,
    title: "Implementing dark mode with Tailwind and React",
    description: "What's the most efficient way to toggle between light and dark themes while ensuring persistence?",
    tags: ["react", "tailwind", "darkmode"],
    author: "ui_enthusiast",
    datePosted: "2025-04-14T08:59:00Z",
    upvotes: 27,
    answers: 6,
    views: 512,
    isPinned: false,
  }
];

const SavedQuestionsPage = () => {
  const [questions, setQuestions] = useState(SAVED_QUESTIONS); // Initialize with SAVED_QUESTIONS
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Derive filteredQuestions using useMemo
  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    // Apply filter
    if (filter === 'pinned') {
      result = result.filter(q => q.isPinned);
    }

    // Apply search
    if (searchTerm) {
      result = result.filter(q =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'mostAnswers') {
      result.sort((a, b) => b.answers - a.answers);
    }

    return result;
  }, [questions, filter, searchTerm, sortBy]);

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleTogglePin = (id) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, isPinned: !q.isPinned } : q
    ));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100">
      <Header />
      
      <main className="max-w-6xl px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            className="text-3xl font-bold text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Saved Questions
          </motion.h1>
          
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-slate-500 dark:text-slate-400">
              {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'} saved
            </span>
          </motion.div>
        </div>
        
        <FilterBar
          filter={filter}
          onFilterChange={handleFilter}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          sortBy={sortBy}
          onSortChange={handleSort}
        />
        
        <div className="mt-6 space-y-6">
          {filteredQuestions.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <HiBookmark className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-xl font-medium text-slate-600 dark:text-slate-300">No saved questions found</h3>
              <p className="max-w-md mt-2 text-slate-500 dark:text-slate-400">
                {searchTerm ?
                  "No questions match your search criteria." :
                  "Start saving questions to build your collection."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onRemove={() => handleRemoveQuestion(question.id)}
                  onTogglePin={() => handleTogglePin(question.id)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedQuestionsPage;