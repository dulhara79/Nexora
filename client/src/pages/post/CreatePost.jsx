import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      setError("Cannot upload more than 3 files.");
      return;
    }
    setFiles(selectedFiles);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("description", description);
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setDescription("");
      setFiles([]);
      navigate("/post");
    } catch (error) {
      setError(error.response?.data || "Error creating post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl p-4 mx-auto"
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Create a Post</h2>
      <div className="p-6 bg-white rounded-lg shadow-md">
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share your cooking skills..."
            className="w-full p-3 mb-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="mb-4"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePost;