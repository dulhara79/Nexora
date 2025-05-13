import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/common/NewPageHeader';
import { UserPlus, UserCheck, Search, Filter, X } from 'lucide-react';

const SearchResultsPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [relatedUsers, setRelatedUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('relevance');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  useEffect(() => {
    setSearchQuery(query);
    const cachedResults = JSON.parse(localStorage.getItem(`search_${query}`));
    if (cachedResults) {
      setSearchResults(cachedResults.searchResults || []);
      setRelatedUsers(cachedResults.relatedUsers || []);
    }
  }, [query]);

  const fetchSearchResults = useCallback(async (q, filt) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/users/search?query=${encodeURIComponent(q)}&limit=10&filter=${filt}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setSearchResults(response.data.searchResults);
      setRelatedUsers(response.data.relatedUsers);
      localStorage.setItem(`search_${q}`, JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching search results:', error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchSuggestions = useCallback(
    debounce(async (q) => {
      if (!q) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/users/suggestions?query=${encodeURIComponent(q)}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (!authLoading && isAuthenticated && query) {
      fetchSearchResults(query, filter);
    } else if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [query, filter, isAuthenticated, authLoading, navigate, fetchSearchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleFollowToggle = useCallback(async (targetUserId, isFollowing) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isFollowing
        ? `/users/${user.id}/unfollow/${targetUserId}`
        : `/users/${user.id}/follow/${targetUserId}`;
      await axios.post(
        `http://localhost:5000/api${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setSearchResults((prev) =>
        prev.map((u) =>
          u.id === targetUserId
            ? {
                ...u,
                followers: isFollowing
                  ? u.followers.filter((id) => id !== user.id)
                  : [...(u.followers || []), user.id],
              }
            : u
        )
      );
      setRelatedUsers((prev) =>
        prev.map((u) =>
          u.id === targetUserId
            ? {
                ...u,
                followers: isFollowing
                  ? u.followers.filter((id) => id !== user.id)
                  : [...(u.followers || []), user.id],
              }
            : u
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
      if (error.response?.status === 401) navigate('/login');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await axios.post(`http://localhost:5000/api/auth/logout`, {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  const skeletonLoader = (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 bg-white shadow-md rounded-xl animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-24 h-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-cream-100">
      <Navbar
        currentUser={user}
        onSignOut={handleSignOut}
        isDarkMode={false}
        setIsDarkMode={() => {}}
      />
      <div className="px-4 py-8 pt-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                placeholder="Search chefs, skills, or recipes..."
                className="w-full py-3 pl-10 pr-4 text-gray-900 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl"
                >
                  {suggestions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSearchQuery(s.name);
                        navigate(`/search?query=${encodeURIComponent(s.name)}`);
                        setShowSuggestions(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-orange-50"
                    >
                      <img
                        src={s.profilePhotoUrl || '/placeholder.jpg'}
                        alt={s.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-gray-700">{s.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="relevance">Relevance</option>
              <option value="followers">Most Followers</option>
              <option value="skill">Cooking Skill</option>
            </select>
          </form>
          {loading && (
            <motion.div
              className="h-1 bg-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            />
          )}
        </motion.div>

        {/* Search Results */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Chefs</h2>
          {loading ? (
            skeletonLoader
          ) : searchResults.length === 0 ? (
            <p className="text-lg text-gray-600">No chefs found for "{query}".</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((result) => (
                <motion.div
                  key={result.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                  className="p-4 bg-white shadow-md cursor-pointer rounded-xl"
                  onClick={() => navigate(`/profile/${result.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <motion.img
                      src={result.profilePhotoUrl || '/placeholder.jpg'}
                      alt={result.name}
                      className="object-cover w-16 h-16 border-2 border-orange-500 rounded-full"
                      whileHover={{ rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>
                      <p className="text-sm text-gray-600">@{result.username}</p>
                      {result.likeSkill && (
                        <p className="text-sm text-green-600">Specialty: {result.likeSkill}</p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowToggle(result.id, result.followers?.includes(user.id));
                      }}
                      className={`px-4 py-2 font-medium rounded-full shadow-md ${
                        result.followers?.includes(user.id)
                          ? 'bg-orange-100 text-orange-700 border border-orange-500'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      <div className="flex items-center">
                        {result.followers?.includes(user.id) ? (
                          <UserCheck className="w-4 h-4 mr-2" />
                        ) : (
                          <UserPlus className="w-4 h-4 mr-2" />
                        )}
                        {result.followers?.includes(user.id) ? 'Following' : 'Follow'}
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Related Users */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Suggested Chefs</h2>
          {loading ? (
            skeletonLoader
          ) : relatedUsers.length === 0 ? (
            <p className="text-lg text-gray-600">No suggested chefs found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedUsers.map((relatedUser) => (
                <motion.div
                  key={relatedUser.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                  className="p-4 bg-white shadow-md cursor-pointer rounded-xl"
                  onClick={() => navigate(`/profile/${relatedUser.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <motion.img
                      src={relatedUser.profilePhotoUrl || '/placeholder.jpg'}
                      alt={relatedUser.name}
                      className="object-cover w-16 h-16 border-2 border-orange-500 rounded-full"
                      whileHover={{ rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{relatedUser.name}</h3>
                      <p className="text-sm text-gray-600">@{relatedUser.username}</p>
                      {relatedUser.likeSkill && (
                        <p className="text-sm text-green-600">Specialty: {relatedUser.likeSkill}</p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowToggle(relatedUser.id, relatedUser.followers?.includes(user.id));
                      }}
                      className={`px-4 py-2 font-medium rounded-full shadow-md ${
                        relatedUser.followers?.includes(user.id)
                          ? 'bg-orange-100 text-orange-700 border border-orange-500'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      <div className="flex items-center">
                        {relatedUser.followers?.includes(user.id) ? (
                          <UserCheck className="w-4 h-4 mr-2" />
                        ) : (
                          <UserPlus className="w-4 h-4 mr-2" />
                        )}
                        {relatedUser.followers?.includes(user.id) ? 'Following' : 'Follow'}
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchResultsPage;