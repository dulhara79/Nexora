import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Clock, Bookmark, Share2, Flag, ArrowLeft, Award, 
  MessageCircle, Eye, Tag, ChevronDown, ChevronUp, 
  MoreHorizontal, Edit, Trash2, Check, X, AlertTriangle
} from "lucide-react";
import AnswerForm from "../../components/newForum/AnswerForm";
import CommentThread from "../../components/newForum/CommentThread";
import LikeDislikeButtons from "../../components/newForum/LikeDislikeButtons";
import SkeletonLoader from "../../components/newForum/SkeletonLoader";
import Header from "../../components/common/NewPageHeader";
import { formatDistanceToNow } from "date-fns";
// import ConfirmationModal from "../../components/common/ConfirmationModal";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:5000";

export default function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [activeSort, setActiveSort] = useState("newest");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedTags, setEditedTags] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  const actionsRef = useRef(null);
  const shareMenuRef = useRef(null);
  const moreOptionsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the current user from your auth system
        const mockCurrentUser = { id: "123", username: "ChefGordon" };
        setCurrentUser(mockCurrentUser);
        
        const [qRes, cRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/questions/${id}`),
          axios.get(`${BASE_URL}/api/forum/comments/question/${id}`),
        ]);
        
        const questionData = qRes.data.question;
        setQuestion(questionData);
        setEditedTitle(questionData.title);
        setEditedDescription(questionData.description);
        setEditedTags(questionData.tags || []);
        
        setComments(cRes.data.comments || []);
        fetchRelatedQuestions(questionData?.tags);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load question details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
        setShowMoreOptions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchRelatedQuestions = async (tags) => {
    // Mock related questions based on tags
    if (!tags || !tags.length) return;
    
    setRelatedQuestions([
      { id: 101, title: "How to prevent pasta from sticking together?", commentCount: 8, tag: tags[0] },
      { id: 102, title: "Best knife sharpening techniques", commentCount: 12, tag: tags[0] },
      { id: 103, title: "Tips for perfect sourdough bread", commentCount: 15, tag: tags[0] },
    ]);
  };

  const isOwner = () => {
    return currentUser && question && question.authorId === currentUser.id;
  };

  const handleSaveQuestion = () => {
    setSaved(!saved);
    toast.success(saved ? "Question removed from saved items" : "Question saved successfully");
    // API call would go here
  };

  const handleShareQuestion = (platform) => {
    console.log(`Sharing to ${platform}`);
    setShowShareMenu(false);
    
    // Mock implementation
    const message = `Shared to ${platform} successfully!`;
    toast.success(message);
    // API call would go here
  };

  const handleReport = () => {
    console.log("Reporting question");
    setShowActions(false);
    toast.success("Report submitted. Thank you for helping keep our community safe.");
    // API call would go here
  };

  const handleSaveEdit = async () => {
    try {
      // API call to update question
      await axios.put(`${BASE_URL}/api/questions/${id}`, {
        title: editedTitle,
        description: editedDescription,
        tags: editedTags
      });
      
      // Update local state
      setQuestion({
        ...question,
        title: editedTitle,
        description: editedDescription,
        tags: editedTags
      });
      
      setIsEditMode(false);
      toast.success("Question updated successfully");
    } catch (error) {
      console.error("Failed to update question:", error);
      toast.error("Failed to update question");
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setEditedTitle(question.title);
    setEditedDescription(question.description);
    setEditedTags(question.tags || []);
    setIsEditMode(false);
  };

  const handleDeleteQuestion = async () => {
    try {
      // API call to delete question
      await axios.delete(`${BASE_URL}/api/questions/${id}`);
      
      toast.success("Question deleted successfully");
      navigate("/forum"); // Redirect to forum page
    } catch (error) {
      console.error("Failed to delete question:", error);
      toast.error("Failed to delete question");
    }
  };

  const handleAddTag = (tagName) => {
    if (tagName && !editedTags.includes(tagName)) {
      setEditedTags([...editedTags, tagName]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const handleNewAnswer = (answer) => {
    // Add the new answer to the comments array
    setComments([...comments, answer]);
    toast.success("Your answer has been posted!");
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // API call to delete comment
      await axios.delete(`${BASE_URL}/api/forum/comments/${commentId}`);
      
      // Update local state
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const timeAgo = question?.createdAt 
    ? formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })
    : "";

  if (loading) {
    return (
      <div className="container max-w-5xl px-4 py-8 mx-auto">
        <Header />
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />
      
      <div className="container max-w-5xl px-4 py-8 mx-auto">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-6 text-sm"
        >
          <Link to="/forum" className="flex items-center text-gray-500 hover:text-orange-500">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Questions
          </Link>
        </motion.div>
        
        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 mb-8 bg-white rounded-lg shadow-lg"
        >
          <div className="mb-4">
            {question?.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 mb-3 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                <Award className="w-3 h-3 mr-1" />
                Featured Question
              </span>
            )}
            
            {isEditMode ? (
              <div className="mb-6 space-y-4">
                <div>
                  <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input 
                    type="text" 
                    id="title"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea 
                    id="description"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editedTags.map((tag, i) => (
                      <div key={i} className="flex items-center px-3 py-1 text-sm text-orange-700 bg-orange-100 rounded-full">
                        <span>{tag}</span>
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-orange-700 hover:text-orange-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input 
                      type="text" 
                      id="new-tag"
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTag(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('new-tag');
                        handleAddTag(input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 text-white bg-orange-500 rounded-r-md hover:bg-orange-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </motion.button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <h1 className="mb-4 text-3xl font-bold text-gray-800">{question?.title}</h1>
                  
                  {isOwner() && (
                    <div className="relative" ref={moreOptionsRef}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMoreOptions(!showMoreOptions)}
                        className="flex items-center gap-1 px-2 py-2 text-gray-500 rounded-full hover:bg-gray-100"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </motion.button>
                      
                      <AnimatePresence>
                        {showMoreOptions && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-lg shadow-lg"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setIsEditMode(true);
                                  setShowMoreOptions(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Question
                              </button>
                              <button
                                onClick={() => {
                                  setShowDeleteConfirmation(true);
                                  setShowMoreOptions(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Question
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-2 text-white rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
                      <User className="w-4 h-4" />
                    </div>
                    {question?.authorUsername || "Anonymous"}
                  </div>
                  
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {timeAgo}
                  </span>
                  
                  <span className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {comments.length} {comments.length === 1 ? 'answer' : 'answers'}
                  </span>
                  
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {question?.viewCount || 0} {question?.viewCount === 1 ? 'view' : 'views'}
                  </span>
                </div>
              </>
            )}
          </div>
          
          {!isEditMode && (
            <div className="p-5 mb-6 text-lg leading-relaxed text-gray-700 rounded-lg bg-gray-50">
              {question?.description}
            </div>
          )}
          
          {/* Tags */}
          {!isEditMode && question?.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag, i) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center px-3 py-1 text-sm text-orange-700 bg-orange-100 rounded-full"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </motion.span>
              ))}
            </div>
          )}
          
          {!isEditMode && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <LikeDislikeButtons
                upvotes={question?.upvoteUserIds?.length || 0}
                downvotes={question?.downvoteUserIds?.length || 0}
                onUpvote={() => console.log("Upvoted question")}
                onDownvote={() => console.log("Downvoted question")}
              />
              
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveQuestion}
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg ${
                    saved
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? "fill-blue-700" : ""}`} />
                  {saved ? "Saved" : "Save"}
                </motion.button>
                
                <div className="relative" ref={shareMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </motion.button>
                  
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-lg shadow-lg"
                      >
                        <div className="py-1">
                          {["Twitter", "Facebook", "LinkedIn", "Email", "Copy link"].map((platform) => (
                            <button
                              key={platform}
                              onClick={() => handleShareQuestion(platform)}
                              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                            >
                              {platform}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="relative" ref={actionsRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowActions(!showActions)}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Flag className="w-4 h-4" />
                    Report
                  </motion.button>
                  
                  <AnimatePresence>
                    {showActions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-lg shadow-lg"
                      >
                        <div className="py-1">
                          <button
                            onClick={handleReport}
                            className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                          >
                            Report inappropriate content
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {comments.length} {comments.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Sort by:</span>
            <div className="relative">
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="py-2 pl-3 pr-8 text-sm bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="newest">Newest</option>
                <option value="votes">Most votes</option>
                <option value="oldest">Oldest</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Comments/Answers Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 space-y-6"
        >
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentThread 
                key={comment.id} 
                comment={comment} 
                currentUser={currentUser}
                onDelete={handleDeleteComment}
                isQuestionOwner={isOwner()}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="mb-2 text-lg">No answers yet</p>
              <p>Be the first to answer this question</p>
            </div>
          )}
        </motion.div>
        
        {/* Answer Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-white rounded-lg shadow-lg"
        >
          <h3 className="mb-4 text-xl font-bold text-gray-800">Your Answer</h3>
          <AnswerForm questionId={id} onSubmit={handleNewAnswer} />
        </motion.div>
        
        {/* Related Questions */}
        {relatedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10"
          >
            <h3 className="mb-4 text-xl font-bold text-gray-800">Related Questions</h3>
            <div className="bg-white rounded-lg shadow">
              {relatedQuestions.map((q, index) => (
                <Link
                  key={q.id}
                  to={`/forum/questions/${q.id}`}
                  className={`block p-4 hover:bg-orange-50 transition-colors ${
                    index !== relatedQuestions.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <h4 className="mb-1 font-medium text-gray-800 hover:text-orange-500">{q.title}</h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center mr-3">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {q.commentCount} answers
                    </span>
                    <span className="px-2 py-1 bg-orange-100 rounded-full">{q.tag}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {/* {showDeleteConfirmation && (
          <ConfirmationModal
            title="Delete Question"
            message="Are you sure you want to delete this question? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
            onConfirm={handleDeleteQuestion}
            onCancel={() => setShowDeleteConfirmation(false)}
          />
        )} */}
      </AnimatePresence>
    </div>
  );
}