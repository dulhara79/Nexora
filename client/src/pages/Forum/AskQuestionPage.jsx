import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from '../../components/Forum/Header';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/questions', {
        title,
        description,
        tags: tags.split(',').map((tag) => tag.trim()).filter((tag) => tag),
      });
      setSuccess(true);
      setTitle('');
      setDescription('');
      setTags('');
      setTimeout(() => (window.location.href = '/'), 2000);
    } catch (err) {
      setError('Failed to create question.');
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 dark:bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="max-w-4xl p-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-slate-800 dark:text-white">
          Ask a Question
        </h1>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && (
          <div className="mb-4 text-green-500">
            Question posted successfully! Redirecting...
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-slate-700 dark:text-slate-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
              rows="6"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-slate-700 dark:text-slate-300">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
              placeholder="e.g., javascript, react, css"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Submit Question
          </button>
        </form>
      </main>
    </motion.div>
  );
};

export default AskQuestionPage;