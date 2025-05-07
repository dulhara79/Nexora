import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Header from "../../components/common/NewPageHeader";

// Configure Axios instance
const API_BASE_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const etag = localStorage.getItem(`etag-${config.url}`);
    if (etag) {
      config.headers['If-None-Match'] = etag;
    }
    console.log('Request Payload:', config.data); // Debug: Log request payload
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (response.headers.etag) {
      localStorage.setItem(`etag-${response.config.url}`, response.headers.etag);
    }
    return response.data;
  },
  (error) => {
    console.error('Response Error:', error.response); // Debug: Log error details
    if (error.response?.status === 304) {
      return Promise.resolve(null);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.error || 'An error occurred');
  }
);

const AskQuestionPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.length < 10) {
      errors.title = 'Title must be at least 10 characters';
    }
    
    if (!description.trim()) {
      errors.description = 'Description is required';
    } else if (description.length < 30) {
      errors.description = 'Description must be at least 30 characters';
    }
    
    if (!tags.trim()) {
      errors.tags = 'At least one tag is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setFormErrors({});
    setIsSubmitting(true);
    
    try {
      const payload = {
        title,
        description,
        tags: tags.split(',').map((tag) => tag.trim()).filter((tag) => tag),
      };
      console.log('Submitting Payload:', payload); // Debug: Log payload
      await api.post('/questions', payload);
      setSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        window.location.href = '/forum/questions';
      }, 2000);
    } catch (err) {
      console.error('Submission Error:', err); // Debug: Log error
      setError(err || 'Failed to create question. Please try again.');
      setIsSubmitting(false);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 8px rgba(79, 70, 229, 0.4)",
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      boxShadow: "none"
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header />
      
      <main className="max-w-4xl px-4 py-12 mx-auto mt-16">
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Share Your Culinary Question
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Need help with a recipe or cooking technique? Our community of chefs and food enthusiasts is here to assist you.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative overflow-hidden bg-white shadow-xl rounded-2xl dark:bg-slate-800"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-400"></div>
          
          <div className="p-8 md:p-10">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 mb-6 text-red-800 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300"
                >
                  {error}
                </motion.div>
              )}
              
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 mb-6 text-green-800 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-300"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Question posted successfully! Redirecting...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Title
                </label>
                <motion.div 
                  variants={inputVariants}
                  whileFocus="focus"
                  whileTap="focus"
                  className="relative"
                >
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      formErrors.title ? 'border-red-500 dark:border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="What's your cooking challenge?"
                  />
                  {formErrors.title && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {formErrors.title}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <motion.div 
                  variants={inputVariants}
                  whileFocus="focus"
                  whileTap="focus"
                  className="relative"
                >
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      formErrors.description ? 'border-red-500 dark:border-red-400' : 'border-slate-300'
                    }`}
                    rows="6"
                    placeholder="Please describe your question in detail..."
                  />
                  {formErrors.description && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {formErrors.description}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              <div className="mb-8">
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tags
                </label>
                <motion.div 
                  variants={inputVariants}
                  whileFocus="focus"
                  whileTap="focus"
                  className="relative"
                >
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className={`w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      formErrors.tags ? 'border-red-500 dark:border-red-400' : 'border-slate-300'
                    }`}
                    placeholder="Add relevant tags (e.g., baking, knife-skills, sauce)"
                  />
                  {formErrors.tags && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-500"
                    >
                      {formErrors.tags}
                    </motion.p>
                  )}
                </motion.div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Separate tags with commas (e.g., baking, knife-skills, sauce)
                </p>
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Question'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        <motion.section 
          variants={itemVariants}
          className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-3"
        >
          <div className="p-6 bg-white shadow-md rounded-xl dark:bg-slate-800">
            <div className="p-2 mb-4 bg-indigo-100 rounded-full dark:bg-indigo-900/30 w-fit">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-white">Quick Responses</h3>
            <p className="text-slate-600 dark:text-slate-300">Our active community ensures you get answers to your questions quickly.</p>
          </div>
          
          <div className="p-6 bg-white shadow-md rounded-xl dark:bg-slate-800">
            <div className="p-2 mb-4 bg-purple-100 rounded-full dark:bg-purple-900/30 w-fit">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-white">Expert Verified</h3>
            <p className="text-slate-600 dark:text-slate-300">Get accurate answers from verified chefs and culinary professionals.</p>
          </div>
          
          <div className="p-6 bg-white shadow-md rounded-xl dark:bg-slate-800">
            <div className="p-2 mb-4 bg-pink-100 rounded-full dark:bg-pink-900/30 w-fit">
              <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-white">Video Support</h3>
            <p className="text-slate-600 dark:text-slate-300">Enhance your questions with video demonstrations for better understanding.</p>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
};

export default AskQuestionPage;