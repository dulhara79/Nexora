import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function CreateQuestionModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/questions",
        {
          title,
          description: content,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Success - call parent onSubmit and close modal
      onSubmit(response.data.question);
      onClose();
    } catch (err) {
      // Error handling
      const errorMessage = 
        err.response?.data?.error || 
        "Failed to create question. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-2xl p-8 mx-4 bg-white shadow-2xl rounded-xl"
      >
        <h2 className="mb-4 text-2xl font-bold">Ask a Question</h2>
        
        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Question Title"
            className="w-full p-3 mb-4 border rounded"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your question..."
            className="w-full p-3 mb-4 border rounded"
            rows={5}
            required
          />
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="w-full p-3 mb-4 border rounded"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post Question"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}