import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/NewPageHeader'

const CreateChallenge = () => {
  const { isAuthenticated, token } = useContext(AuthContext);
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
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          const { title, description, theme, startDate, endDate, photoUrl } = response.data.challenge;
          setFormData({
            title,
            description,
            theme,
            startDate: new Date(startDate).toISOString().split('T')[0],
            endDate: new Date(endDate).toISOString().split('T')[0],
            photo: null,
          });
          setCurrentPhotoUrl(photoUrl);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to load challenge data');
        } finally {
          setIsLoading(false);
        }
      };
      if (token) {
        fetchChallenge();
      } else {
        setError('Please log in to edit a challenge');
        setIsLoading(false);
      }
    }
  }, [challengeId, isEditMode, token]);

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
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      } else {
        await axios.post('http://localhost:5000/api/challenges', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
      }
      navigate('/challenges');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} challenge`);
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
    <>
      <Header />
    <motion.div
      className="relative flex items-center justify-center min-h-screen p-6 overflow-hidden bg-gradient-to-br from-white to-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/light-wool.png')] opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl p-8 bg-white border border-gray-200 shadow-2xl bg-opacity-90 backdrop-filter backdrop-blur-xl rounded-3xl">
        <motion.h1
          className="mb-8 text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500"
          style={{ textShadow: '0 0 10px rgba(255, 0, 0, 0.2)' }}
          variants={itemVariants}
        >
          {isEditMode ? 'Edit Challenge' : 'Create Challenge'}
        </motion.h1>

        <AnimatePresence>
          {error && (
            <motion.p
              className="p-3 mb-6 text-center text-red-500 border border-red-300 rounded-lg shadow-md bg-red-100/50"
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
            className="flex items-center justify-center text-center text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="w-8 h-8 mr-3 text-red-500 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            </svg>
            Loading challenge data...
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700 transition-all duration-300">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 text-gray-800 placeholder-gray-400 transition-all duration-300 border border-gray-300 rounded-lg bg-gray-50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:bg-white hover:border-yellow-400"
                required
                placeholder="Enter challenge title"
              />
              {formErrors.title && (
                <motion.p className="absolute mt-1 text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {formErrors.title}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700 transition-all duration-300">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 text-gray-800 placeholder-gray-400 transition-all duration-300 border border-gray-300 rounded-lg bg-gray-50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:bg-white hover:border-yellow-400"
                required
                rows="4"
                placeholder="Describe your challenge"
              />
              {formErrors.description && (
                <motion.p className="absolute mt-1 text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {formErrors.description}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700 transition-all duration-300">Theme</label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full p-3 text-gray-800 placeholder-gray-400 transition-all duration-300 border border-gray-300 rounded-lg bg-gray-50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:bg-white hover:border-yellow-400"
                required
                placeholder="E.g., Italian Cuisine"
              />
              {formErrors.theme && (
                <motion.p className="absolute mt-1 text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {formErrors.theme}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700 transition-all duration-300">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-3 text-gray-800 transition-all duration-300 border border-gray-300 rounded-lg bg-gray-50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:bg-white hover:border-yellow-400"
                required
              />
              {formErrors.startDate && (
                <motion.p className="absolute mt-1 text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {formErrors.startDate}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700 transition-all duration-300">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-3 text-gray-800 transition-all duration-300 border border-gray-300 rounded-lg bg-gray-50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:bg-white hover:border-yellow-400"
                required
              />
              {formErrors.endDate && (
                <motion.p className="absolute mt-1 text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                  {formErrors.endDate}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700 transition-all duration-300">Photo</label>
              {isEditMode && currentPhotoUrl && !previewUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Current Image:</p>
                  <img
                    src={currentPhotoUrl}
                    alt="Current challenge"
                    className="object-cover w-40 h-40 mt-2 transition-all duration-300 border border-gray-300 rounded-lg shadow-lg hover:border-red-500"
                  />
                </div>
              )}
              {previewUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Preview:</p>
                  <img
                    src={previewUrl}
                    alt="Image preview"
                    className="object-cover w-40 h-40 mt-2 transition-all duration-300 border border-gray-300 rounded-lg shadow-lg hover:border-red-500"
                  />
                </div>
              )}
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="w-full mt-1 text-gray-800 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-amber-500 file:to-yellow-500 file:text-white hover:file:from-amber-600 hover:file:to-red-600"
                accept="image/*"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full px-6 py-3 font-bold text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
};

export default CreateChallenge;