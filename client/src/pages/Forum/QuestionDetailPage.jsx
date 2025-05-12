import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/common/NewPageHeader";
import QuestionDetailCard from "../../components/Forum/QuestionDetailCard";
import CommentSection from "../../components/Forum/CommentSection";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      if (authLoading) return;
      setIsLoading(true);
      try {
        const timestamp = Date.now();
        // Fetch question details
        const questionResponse = await axios.get(
          `http://localhost:5000/api/questions/${id}?_=${timestamp}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const commentsResponse = await axios.get(
          `http://localhost:5000/api/forum/comments/question/${id}?_=${timestamp}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!questionResponse.data.question) {
          throw new Error("Question data is missing");
        }

        // Log the response to debug savedQuestionIds
        console.log("Question Response:", questionResponse.data.question);

        // Initialize question state
        let updatedQuestion = {
          ...questionResponse.data.question,
          savedQuestionIds: questionResponse.data.question.savedQuestionIds || [],
        };

        // Fallback: Fetch user's saved questions to verify save state
        if (isAuthenticated && user) {
          try {
            const savedQuestionsResponse = await axios.get(
              `http://localhost:5000/api/questions/saved-questions?_=${timestamp}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Saved Questions Response:", savedQuestionsResponse.data);
            const savedQuestionIds = savedQuestionsResponse.data.questions.map((q) => q.id);
            if (savedQuestionIds.includes(id) && !updatedQuestion.savedQuestionIds.includes(user.id)) {
              updatedQuestion.savedQuestionIds.push(user.id);
            } else if (!savedQuestionIds.includes(id) && updatedQuestion.savedQuestionIds.includes(user.id)) {
              updatedQuestion.savedQuestionIds = updatedQuestion.savedQuestionIds.filter(
                (uid) => uid !== user.id
              );
            }
          } catch (savedError) {
            console.error("Error fetching saved questions:", savedError);
          }
        }

        setQuestion(updatedQuestion);
        const processedComments = buildCommentTree(commentsResponse.data.comments || []);
        setComments(processedComments);
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(err.response?.data?.error || err.message || "Failed to load question");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestionDetails();
  }, [id, token, authLoading, isAuthenticated, user]);

  const buildCommentTree = (flatComments) => {
    const commentMap = {};
    const rootComments = [];

    flatComments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    flatComments.forEach((comment) => {
      if (comment.parentCommentId && commentMap[comment.parentCommentId]) {
        commentMap[comment.parentCommentId].replies.push(comment);
      } else {
        rootComments.push(comment);
      }
    });
    return rootComments;
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] max-w-4xl p-4 mx-auto md:p-6">
        <div className="relative">
          <motion.div
            className="w-16 h-16 border-t-4 border-b-4 border-orange-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 w-10 h-10 border-t-4 border-b-4 rounded-full border-amber-500"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl p-6 mx-auto border border-red-200 shadow-lg rounded-xl md:p-8 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 dark:border-red-800"
      >
        <div className="flex items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="ml-2 text-xl font-bold text-red-700 dark:text-red-400">
            Error Loading Question
          </h2>
        </div>
        <p className="mb-4 text-red-600 dark:text-red-300">{error}</p>
        <a
          href="/forum"
          className="inline-flex items-center px-4 py-2 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg hover:translate-y-[-2px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Forum
        </a>
      </motion.div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <motion.div
        initial="hidden"
        animate="visible"
        className="max-w-4xl px-4 py-8 mx-auto md:px-6"
      >

        <QuestionDetailCard
          question={question}
          user={user}
          token={token}
          isAuthenticated={isAuthenticated}
          setQuestion={setQuestion}
          navigate={navigate}
        />
        <CommentSection
          questionId={id}
          user={user}
          token={token}
          isAuthenticated={isAuthenticated}
          comments={comments}
          setComments={setComments}
        />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          className="toast-container"
          toastClassName="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-lg p-4"
        />
      </motion.div>
    </div>
  );
};

export default QuestionDetailPage;