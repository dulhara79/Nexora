// src/pages/newForum/AskQuestionPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Tag as TagIcon, Users, Check, AlertCircle } from "lucide-react";
import Header from "../../components/common/NewPageHeader";

const BASE_URL = "http://localhost:5000";

export default function AskQuestionPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    communityId: "",
    authorId: "user123" // From auth context
  });
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/communities`);
      setCommunities(res.data || []);
    } catch (error) {
      console.error("Error fetching communities:", error);
      setError("Failed to load communities. Please try again later.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear any previous errors when user starts typing
    setError("");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError("Please provide a title for your question");
      return;
    }
    
    if (!formData.description.trim()) {
      setError("Please provide a description for your question");
      return;
    }
    
    if (!formData.communityId) {
      setError("Please select a community for your question");
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/questions`, formData);
      setSuccess(true);
      
      // Redirect after a short delay to show success animation
      setTimeout(() => {
        navigate(`/forum/questions/${res.data.question.id}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting question:", error);
      setError(error.response?.data?.message || "Failed to post your question. Please try again.");
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren" 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 12 } }
  };

  return (
    <>
      <Header />
    <div className="min-h-screen py-8 mt-10 bg-gradient-to-b from-orange-50 to-white">
      
      <motion.div 
        className="container max-w-3xl px-4 mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="mb-12 text-center"
          variants={itemVariants}
        >
          <h1 className="mb-3 text-4xl font-bold text-gray-800">Ask a Question</h1>
          <p className="text-gray-600">Share your cooking questions with our community of experts</p>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit}
          className="p-8 bg-white shadow-xl rounded-xl"
          variants={containerVariants}
        >
          {/* Title Input */}
          <motion.div className="mb-6" variants={itemVariants}>
            <label className="block mb-2 text-lg font-medium text-gray-700">Question Title</label>
            <motion.div 
              className={`relative border-2 rounded-lg transition-all duration-300 ${
                focusedField === 'title' 
                  ? 'border-orange-400 shadow-md shadow-orange-100' 
                  : 'border-gray-200'
              }`}
              whileTap={{ scale: 0.995 }}
            >
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onFocus={() => setFocusedField('title')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 bg-transparent rounded-lg focus:outline-none"
                placeholder="What's your cooking question?"
              />
            </motion.div>
            <p className="mt-1 text-sm text-gray-500">
              Be specific and imagine you're asking another person
            </p>
          </motion.div>

          {/* Description Input */}
          <motion.div className="mb-6" variants={itemVariants}>
            <label className="block mb-2 text-lg font-medium text-gray-700">Description</label>
            <motion.div 
              className={`relative border-2 rounded-lg transition-all duration-300 ${
                focusedField === 'description' 
                  ? 'border-orange-400 shadow-md shadow-orange-100' 
                  : 'border-gray-200'
              }`}
              whileTap={{ scale: 0.995 }}
            >
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
                rows={8}
                className="w-full px-4 py-3 bg-transparent rounded-lg focus:outline-none"
                placeholder="Describe your question in detail... Include any steps you've already tried, ingredients you're using, and specific techniques you're asking about."
              />
            </motion.div>
            <p className="mt-1 text-sm text-gray-500">
              Include all the information someone would need to answer your question
            </p>
          </motion.div>

          {/* Tags Input */}
          <motion.div className="mb-6" variants={itemVariants}>
            <label className="block mb-2 text-lg font-medium text-gray-700">Tags</label>
            <div className="mb-2">
              <motion.div 
                className={`flex items-center border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                  focusedField === 'tags' 
                    ? 'border-orange-400 shadow-md shadow-orange-100' 
                    : 'border-gray-200'
                }`}
                whileTap={{ scale: 0.995 }}
              >
                <div className="flex flex-wrap items-center gap-2 px-2 py-1">
                  {formData.tags.map((tag, index) => (
                    <motion.span 
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-orange-700 bg-orange-100 rounded-full group"
                    >
                      <TagIcon size={14} />
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="p-1 text-orange-500 rounded-full hover:bg-orange-200 hover:text-orange-800"
                      >
                        <X size={12} />
                      </button>
                    </motion.span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    onFocus={() => setFocusedField('tags')}
                    onBlur={() => {
                      setFocusedField(null);
                      if (tagInput.trim()) handleAddTag();
                    }}
                    className="flex-1 min-w-[150px] px-2 py-2 bg-transparent focus:outline-none"
                    placeholder="Add tags (press Enter or comma)"
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={handleAddTag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-orange-500 hover:bg-orange-50"
                >
                  <Plus size={20} />
                </motion.button>
              </motion.div>
            </div>
            <p className="text-sm text-gray-500">
              Add up to 5 tags to describe what your question is about
            </p>
          </motion.div>

          {/* Community Select */}
          <motion.div className="mb-8" variants={itemVariants}>
            <label className="block mb-2 text-lg font-medium text-gray-700">Community</label>
            <motion.div 
              className={`relative border-2 rounded-lg transition-all duration-300 ${
                focusedField === 'community' 
                  ? 'border-orange-400 shadow-md shadow-orange-100' 
                  : 'border-gray-200'
              }`}
              whileTap={{ scale: 0.995 }}
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Users size={20} className="text-gray-400" />
              </div>
              <select
                name="communityId"
                value={formData.communityId}
                onChange={handleChange}
                onFocus={() => setFocusedField('community')}
                onBlur={() => setFocusedField(null)}
                className="w-full py-3 pl-10 pr-4 bg-transparent rounded-lg appearance-none focus:outline-none"
              >
                <option value="">Select a cooking community</option>
                {/* ({communities.map(community => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}) */}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </motion.div>
            <p className="mt-1 text-sm text-gray-500">
              Choose the most relevant community for your question
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="p-4 mb-6 text-red-800 bg-red-100 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} />
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading || success}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full px-6 py-4 text-lg font-medium text-white transition-all rounded-lg shadow-lg 
                ${loading || success 
                  ? 'bg-orange-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-200 hover:shadow-orange-300'
                }`}
            >
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <svg className="w-6 h-6 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </motion.div>
                )}
                
                {success && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                  >
                    <Check size={24} className="text-white" />
                  </motion.div>
                )}
                
                <span className={loading || success ? 'opacity-0' : 'opacity-100'}>
                  Post Your Question
                </span>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.form>
        
        {/* Success Animation Overlay */}
        <AnimatePresence>
          {success && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="flex flex-col items-center p-10 text-center bg-white rounded-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <motion.div 
                  className="flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 8 }}
                >
                  <Check size={40} className="text-green-600" />
                </motion.div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">Question Posted!</h2>
                <p className="text-gray-600">Redirecting you to your question...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </>
  );
}
