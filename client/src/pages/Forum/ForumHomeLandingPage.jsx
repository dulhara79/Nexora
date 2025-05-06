// Dashboard page for the new forum, including trending topics, communities, and a question list with filters and search functionality.
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, PlusCircle, ChevronDown, X, MessageSquare, Users } from "lucide-react";
import QuestionCard from "../../components/newForum/QuestionCard";
import CreateQuestionModal from "../../components/newForum/CreateQuestionModal";
import SkeletonLoader from "../../components/newForum/SkeletonLoader";
import CommunityCard from "../../components/newForum/CommunityCard";
import Header from "../../components/common/NewPageHeader";

const BASE_URL = "http://localhost:5000";

export default function ForumHomePage() {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [trending, setTrending] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    tags: [],
    time: "all",
    answers: "any",
  });
  const [availableTags, setAvailableTags] = useState([
    "baking", "vegetarian", "dessert", "breakfast", "dinner", "quick", "italian", "asian", "healthy"
  ]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
    fetchTrending();
    fetchCommunities();
  }, [activeFilter, filterOptions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/questions?sortBy=${activeFilter}`);
      setQuestions(res.data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    // Mocked trending data
    setTrending([
      { id: 1, title: "How to properly season a cast iron pan?", commentCount: 24 },
      { id: 2, title: "Best way to make crispy pizza at home?", commentCount: 18 },
      { id: 3, title: "Kneading techniques for beginners", commentCount: 12 },
    ]);
  };

  const fetchCommunities = async () => {
    // Mocked communities data
    setCommunities([
      { id: 1, name: "Baking Enthusiasts", icon: "🥖", members: 4523, description: "A community for baking lovers to share recipes and techniques." },
      { id: 2, name: "Vegetarian Cooking", icon: "🥗", members: 3218, description: "Plant-based recipes and cooking tips." },
    ]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log("Searching for:", searchQuery);
  };

  const handleTagSelect = (tag) => {
    if (filterOptions.tags.includes(tag)) {
      setFilterOptions({
        ...filterOptions,
        tags: filterOptions.tags.filter(t => t !== tag)
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        tags: [...filterOptions.tags, tag]
      });
    }
  };

  const clearFilters = () => {
    setFilterOptions({
      tags: [],
      time: "all",
      answers: "any",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const filterVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 }
  };

  return (<>
  
      <Header />
    <div className="min-h-screen mt-0 bg-gradient-to-b from-orange-50 to-white">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="absolute top-0 right-0 w-64 h-64 translate-x-1/2 -translate-y-1/2 bg-orange-400 rounded-full opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 -translate-x-1/2 translate-y-1/2 bg-orange-400 rounded-full opacity-30"></div>
        
        <div className="container px-4 py-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">Nexora Cooking Community</h1>
            <p className="mb-8 text-lg">Share recipes, ask questions, and connect with cooking enthusiasts from around the world</p>
            
            <div className="relative w-full max-w-xl mx-auto">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recipes, questions, or techniques..."
                  className="w-full px-4 py-3 pr-12 text-gray-700 bg-white border-2 border-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 text-orange-500 transition-colors bg-white rounded-r-lg hover:text-orange-600 focus:outline-none"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="container px-4 py-10 mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Cooking Q&A</h2>
              
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-white transition-colors bg-orange-500 rounded-lg shadow-md hover:bg-orange-600"
                >
                  <PlusCircle className="w-4 h-4" />
                  Ask Question
                </motion.button>
              </div>
            </div>
            
            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="p-4 mb-6 overflow-hidden bg-white rounded-lg shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-700">Filter Questions</h3>
                    <button 
                      onClick={clearFilters}
                      className="text-sm text-orange-500 hover:text-orange-600"
                    >
                      Clear all filters
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-2 text-sm text-gray-600">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagSelect(tag)}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                            filterOptions.tags.includes(tag)
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm text-gray-600">Time</p>
                      <select
                        value={filterOptions.time}
                        onChange={(e) => setFilterOptions({...filterOptions, time: e.target.value})}
                        className="w-full p-2 text-sm border border-gray-200 rounded"
                      >
                        <option value="all">All time</option>
                        <option value="today">Today</option>
                        <option value="week">This week</option>
                        <option value="month">This month</option>
                      </select>
                    </div>
                    
                    <div>
                      <p className="mb-2 text-sm text-gray-600">Answers</p>
                      <select
                        value={filterOptions.answers}
                        onChange={(e) => setFilterOptions({...filterOptions, answers: e.target.value})}
                        className="w-full p-2 text-sm border border-gray-200 rounded"
                      >
                        <option value="any">Any</option>
                        <option value="answered">Answered</option>
                        <option value="unanswered">Unanswered</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Sort Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["newest", "popular", "unanswered"].map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </motion.button>
              ))}
            </div>
            
            {/* Questions List */}
            {loading ? (
              <SkeletonLoader />
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <motion.div key={question.id} variants={itemVariants}>
                      <QuestionCard question={question} delay={index * 0.1} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    variants={itemVariants}
                    className="p-10 text-center text-gray-500 bg-white rounded-lg shadow"
                  >
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg">No questions found</p>
                    <p className="mt-2">Be the first to ask a question</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowModal(true)}
                      className="px-4 py-2 mt-4 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                    >
                      Ask Question
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="w-full mt-8 lg:mt-0 lg:w-80">
            {/* Top Communities */}
            <div className="p-5 mb-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Top Communities</h3>
                <Link to="/forum/communities" className="text-sm text-orange-500 hover:text-orange-600">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {communities.map((community) => (
                  <motion.div 
                    key={community.id}
                    whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    className="p-3 transition-all rounded-lg bg-orange-50"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 text-xl bg-white rounded-full shadow-sm">
                        {community.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{community.name}</h4>
                        <p className="text-xs text-gray-500">{community.members.toLocaleString()} members</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center justify-center p-3 text-orange-500 transition-colors border-2 border-orange-200 border-dashed rounded-lg hover:bg-orange-50"
                >
                  <Link to="/forum/communities/create" className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Create Community
                  </Link>
                </motion.div>
              </div>
            </div>
            
            {/* Trending Topics */}
            <div className="p-5 mb-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Trending Topics</h3>
              <div className="space-y-3">
                {trending.map((topic) => (
                  <motion.div 
                    key={topic.id}
                    whileHover={{ x: 3 }}
                    className="flex items-start"
                  >
                    <div className="flex items-center justify-center w-6 h-6 mr-3 text-xs text-white bg-orange-500 rounded-full">
                      {topic.id}
                    </div>
                    <div>
                      <Link 
                        to={`/forum/questions/${topic.id}`}
                        className="text-gray-700 transition-colors hover:text-orange-500"
                      >
                        {topic.title}
                      </Link>
                      <p className="text-xs text-gray-500">{topic.commentCount} answers</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Help Box */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-5 text-white rounded-lg shadow bg-gradient-to-br from-orange-500 to-amber-500"
            >
              <h3 className="mb-2 text-lg font-semibold">Need Help?</h3>
              <p className="mb-4 text-sm">Check out our guidelines on how to ask good questions and get quality answers.</p>
              <Link 
                to="/forum/guidelines"
                className="inline-block px-4 py-2 text-orange-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
              >
                View Guidelines
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <CreateQuestionModal onClose={() => setShowModal(false)} onSubmit={fetchQuestions} />
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
