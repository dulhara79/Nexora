import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch the post data when the component mounts
  useEffect(() => {
    const fetchPost = async () => {
      console.log("Fetching post with ID:", postId); // Debug log
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
          withCredentials: true,
        });
        setDescription(response.data.description);
        setInitialLoad(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Post not found. It may have been deleted.");
          toast.error("Post not found.", { position: "top-right" });
          setTimeout(() => navigate("/post"), 2000); // Redirect after 2 seconds
        } else {
          setError("Failed to load post data.");
          toast.error("Failed to load post data.", { position: "top-right" });
        }
      }
    };
    fetchPost();
  }, [postId, navigate]);

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
    if (!description.trim() || loading) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("description", description);
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Post updated successfully!", { position: "top-right" });
      navigate(`/post?editedPostId=${postId}`); // Include postId in the redirect
    } catch (error) {
      if (error.response?.status === 404) {
        setError("Post not found. It may have been deleted.");
        toast.error("Post not found.", { position: "top-right" });
        setTimeout(() => navigate("/post"), 2000);
      } else if (error.response?.status === 403) {
        setError("You are not authorized to edit this post.");
        toast.error("Unauthorized to edit this post.", { position: "top-right" });
        setTimeout(() => navigate("/post"), 2000);
      } else {
        setError(error.response?.data || "Error updating post.");
        toast.error(error.response?.data || "Error updating post.", { position: "top-right" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl p-6 mx-auto text-center text-gray-600"
      >
        Loading post...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl p-6 mx-auto text-center text-red-500"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl p-6 mx-auto bg-white shadow-lg rounded-xl"
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Your Post</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Edit your recipe or cooking tip..."
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
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="flex-1 py-3 text-white transition-colors bg-orange-500 rounded-lg disabled:opacity-50 hover:bg-orange-600"
          >
            {loading ? "Saving..." : "Save Changes"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => navigate("/post")}
            className="flex-1 py-3 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditPost;