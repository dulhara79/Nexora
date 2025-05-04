import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const QuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        setLoading(true);
        const [questionResponse, commentsResponse] = await Promise.all([
          api.get(`/questions/${id}`),
          api.get(`/forum/comments/question/${id}`),
        ]);
        setQuestion(questionResponse?.question || null);
        setComments(commentsResponse?.comments || []);
      } catch (err) {
        setError('Failed to load question or comments.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await api.post('/forum/comments', {
        content: newComment,
        questionId: id,
      });
      setComments([...comments, response?.comment || {}]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!question) return <div className="p-8">Question not found.</div>;

  return (
    <motion.div
      className="min-h-screen bg-gray-100 dark:bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="max-w-4xl p-8 mx-auto">
        <h1 className="mb-4 text-3xl font-bold text-slate-800 dark:text-white">
          {question.title}
        </h1>
        <p className="mb-6 text-slate-600 dark:text-slate-300">
          {question.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {question.tags?.map((tag, index) => (
            <Link
              key={index}
              to={`/forum/tag/${tag}`}
              className="px-3 py-1 text-sm font-medium rounded-full text-slate-600 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-400"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <h2 className="mb-4 text-2xl font-semibold text-slate-800 dark:text-white">
          Comments
        </h2>
        {comments.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-300">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 mb-4 bg-white rounded-lg shadow dark:bg-slate-800"
            >
              <p className="text-slate-600 dark:text-slate-300">
                {comment.content}
              </p>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                By {comment.authorUsername || 'Anonymous'} •{' '}
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
        <form onSubmit={handleAddComment} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600"
            placeholder="Add a comment..."
            rows="4"
          />
          <button
            type="submit"
            className="px-4 py-2 mt-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Post Comment
          </button>
        </form>
      </main>
    </motion.div>
  );
};

export default QuestionPage;