import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const CreateChallenge = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!challengeId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    startDate: '',
    endDate: '',
    photo: null,
  });
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchChallenge = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`http://localhost:5000/api/challenges/${challengeId}`, {
            withCredentials: true,
          });
          const { title, description, theme, startDate, endDate, photoUrl } = response.data;
          setFormData({
            title,
            description,
            theme,
            startDate: startDate.split('T')[0],
            endDate: endDate.split('T')[0],
            photo: null,
          });
          setCurrentPhotoUrl(photoUrl);
        } catch (err) {
          setError(err.response?.data || 'Failed to load challenge data');
        } finally {
          setIsLoading(false);
        }
      };
      fetchChallenge();
    }
  }, [challengeId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (files && files[0]) {
      setPreviewUrl(URL.createObjectURL(files[0]));
    }
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.theme.trim()) errors.theme = 'Theme is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    else if (formData.startDate < today) errors.startDate = 'Start date cannot be in the past';
    if (!formData.endDate) errors.endDate = 'End date is required';
    else if (formData.endDate <= formData.startDate) errors.endDate = 'End date must be after start date';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in to create or update a challenge');
      return;
    }
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/challenges/${challengeId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      } else {
        await axios.post('http://localhost:5000/api/challenges', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
      }
      navigate('/challenges');
    } catch (err) {
      setError(err.response?.data || `Failed to ${isEditMode ? 'update' : 'create'} challenge`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-6 overflow-hidden relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/light-wool.png')] opacity-10 animate-pulse"></div>
      </div>

      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200 relative z-10">
        <motion.h1
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mb-8"
          style={{ textShadow: '0 0 10px rgba(0, 0, 255, 0.2)' }}
          variants={itemVariants}
        >
          {isEditMode ? 'Edit Challenge' : 'Create Challenge'}
        </motion.h1>

        <AnimatePresence>
          {error && (
            <motion.p
              className="text-red-500 text-center mb-6 bg-red-100/50 p-3 rounded-lg border border-red-300 shadow-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {isLoading ? (
          <motion.div
            className="text-center text-gray-600 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            </svg>
            Loading challenge data...
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400 hover:border-blue-400"
                required
                placeholder="Enter challenge title"
              />
              {formErrors.title && (
                <motion.p className="text-red-500 text-sm mt-1 absolute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {formErrors.title}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400 hover:border-blue-400"
                required
                rows="4"
                placeholder="Describe your challenge"
              />
              {formErrors.description && (
                <motion.p className="text-red-500 text-sm mt-1 absolute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {formErrors.description}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300">Theme</label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400 hover:border-blue-400"
                required
                placeholder="E.g., Italian Cuisine"
              />
              {formErrors.theme && (
                <motion.p className="text-red-500 text-sm mt-1 absolute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {formErrors.theme}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 hover:border-blue-400"
                required
              />
              {formErrors.startDate && (
                <motion.p className="text-red-500 text-sm mt-1 absolute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {formErrors.startDate}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 hover:border-blue-400"
                required
              />
              {formErrors.endDate && (
                <motion.p className="text-red-500 text-sm mt-1 absolute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {formErrors.endDate}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300">Photo</label>
              {isEditMode && currentPhotoUrl && !previewUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Current Image:</p>
                  <img
                    src={currentPhotoUrl}
                    alt="Current challenge"
                    className="w-40 h-40 object-cover rounded-lg mt-2 border border-gray-300 hover:border-blue-500 transition-all duration-300 shadow-lg"
                  />
                </div>
              )}
              {previewUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Preview:</p>
                  <img
                    src={previewUrl}
                    alt="Image preview"
                    className="w-40 h-40 object-cover rounded-lg mt-2 border border-gray-300 hover:border-blue-500 transition-all duration-300 shadow-lg"
                  />
                </div>
              )}
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="mt-1 w-full text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-cyan-400 file:text-white hover:file:from-blue-600 hover:file:to-cyan-500 transition-all duration-300"
                accept="image/*"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0, 0, 255, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Challenge' : 'Create Challenge')}
              </motion.button>
            </motion.div>
          </form>
        )}
      </div>
    </motion.div>
  );
};


export default CreateChallenge;