import React, { useState, useEffect } from 'react';
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

const CommunityPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const response = await api.get('/communities');
        setCommunities(response?.communities || []);
      } catch (err) {
        setError('Failed to load communities.');
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  const getRandomGradient = () => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-pink-600',
      'from-amber-500 to-orange-600',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

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
          Communities
        </h1>
        {communities.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-300">
            No communities available.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {communities.map((community) => (
              <div
                key={community.id}
                className="p-4 bg-white rounded-lg shadow dark:bg-slate-800"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${getRandomGradient()}`}
                  >
                    <span className="text-xl">{community.icon || '🌟'}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                      {community.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {community.members?.toLocaleString()} members
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {community.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  );
};

export default CommunityPage;