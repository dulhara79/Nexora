import { useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
//import Navbar from "../../components/post/Navbar";

const CreatePost = ({ onPostCreated }) => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      setError("Cannot upload more than 3 files.");
      setFiles([]);
      return;
    }

    const isVideo = selectedFiles[0]?.type.startsWith("video");
    const hasMixedTypes = selectedFiles.some(file => file.type.startsWith("video") !== isVideo);
    if (hasMixedTypes) {
      setError("You can upload either photos or videos, but not both in the same post.");
      setFiles([]);
      return;
    }

    if (isVideo) {
      try {
        const durationChecks = await Promise.all(
          selectedFiles.map(file =>
            new Promise((resolve) => {
              const video = document.createElement("video");
              video.preload = "metadata";
              video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration <= 30);
              };
              video.onerror = () => resolve(false);
              video.src = window.URL.createObjectURL(file);
            })
          )
        );

        if (durationChecks.some(check => !check)) {
          setError("All videos must be 30 seconds or shorter.");
          setFiles([]);
          return;
        }
      } catch (err) {
        setError("Error checking video duration.");
        setFiles([]);
        return;
      }
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
      const response = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setDescription("");
      setFiles([]);
      toast.success("Post created successfully!", { position: "top-right" });
      if (onPostCreated) {
        onPostCreated(response.data); // Emit the new post to the parent
      }
    } catch (error) {
      setError(error.response?.data || "Error creating post.");
      toast.error("Failed to create post.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen text-gray-900 bg-amber-50">
    //   <Navbar />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl p-6 mx-auto bg-white shadow-lg rounded-xl"
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Share Your Cooking Skills</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share your recipe or cooking tip..."
          className="w-full p-4 mb-4 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows="4"
          required
        />
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="mb-4 text-gray-600"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white transition-colors bg-orange-500 rounded-lg disabled:opacity-50 hover:bg-orange-600"
        >
          {loading ? "Posting..." : "Share Post"}
        </motion.button>
      </form>
    </motion.div>
    
  );
};

export default CreatePost;