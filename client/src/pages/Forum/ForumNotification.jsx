import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
// import Header from '../../components/Forum/Header';
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

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/forum/notifications');
        setNotifications(response || []);
      } catch (err) {
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.post(`/forum/notifications/${id}/read`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      setError('Failed to mark notification as read.');
    }
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
          Notifications
        </h1>
        {notifications.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-300">
            No unread notifications.
          </p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow dark:bg-slate-800"
            >
              <p className="text-slate-600 dark:text-slate-300">
                {notification.message}
              </p>
              <button
                onClick={() => markAsRead(notification.id)}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Mark as Read
              </button>
            </div>
          ))
        )}
      </main>
    </motion.div>
  );
};

export default NotificationsPage;