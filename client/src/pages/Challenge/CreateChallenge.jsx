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
  const [formErrors, setFormErrors] = useState({}); // New state for validation errors
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
    // Clear error for the field being edited
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.theme.trim()) {
      errors.theme = 'Theme is required';
    }
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    } else if (formData.startDate < today) {
      errors.startDate = 'Start date cannot be in the past';
    }
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.endDate <= formData.startDate) {
      errors.endDate = 'End date must be after start date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
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
      if (formData[key]) {
        data.append(key, formData[key]);
      }
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
        variants={itemVariants}
      >
        {isEditMode ? 'Edit Cooking Challenge' : 'Create Cooking Challenge'}
      </motion.h1>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500 mb-4 text-center"
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
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading challenge data...
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
              placeholder="Enter challenge title"
            />
            {formErrors.title && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formErrors.title}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
              rows="4"
              placeholder="Describe your challenge"
            />
            {formErrors.description && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formErrors.description}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <input
              type="text"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
              placeholder="E.g., Italian Cuisine"
            />
            {formErrors.theme && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formErrors.theme}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
            />
            {formErrors.startDate && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formErrors.startDate}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
            />
            {formErrors.endDate && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formErrors.endDate}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            {isEditMode && currentPhotoUrl && !previewUrl && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Current Image:</p>
                <img
                  src={currentPhotoUrl}
                  alt="Current challenge"
                  className="w-32 h-32 object-cover rounded-lg mt-2"
                />
              </div>
            )}
            {previewUrl && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Preview:</p>
                <img
                  src={previewUrl}
                  alt="Image preview"
                  className="w-32 h-32 object-cover rounded-lg mt-2"
                />
              </div>
            )}
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 p-3 rounded-lg shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-300"
              accept="image/*"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-all duration-300"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Challenge' : 'Create Challenge')}
            </motion.button>
          </motion.div>
        </form>
      )}
    </motion.div>
  );
};


export default CreateChallenge;