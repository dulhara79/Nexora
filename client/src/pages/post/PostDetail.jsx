import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Navbar from "../../components/post/Navbar";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${postId}`, {
          withCredentials: true,
        });
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Post not found. It may have been deleted.");
          toast.error("Post not found.", { position: "top-right" });
          setTimeout(() => navigate("/post"), 2000);
        } else {
          setError("Failed to load post.");
          toast.error("Failed to load post.", { position: "top-right" });
        }
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, navigate]);

  if (loading) {
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
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl p-6 mx-auto bg-white shadow-lg rounded-xl"
      >
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          {post.userName}'s Post
        </h2>
        <p className="mb-4 text-gray-700">{post.description}</p>
        {post.media && post.media.length > 0 && (
          <div className="mb-4">
            {post.media.map((media, index) => (
              <div key={index} className="my-2">
                {media.fileType.startsWith("video") ? (
                  <video
                    src={media.fileUrl}
                    controls
                    className="w-full rounded-lg"
                  />
                ) : (
                  <img
                    src={media.fileUrl}
                    alt={media.fileName}
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <p className="text-sm text-gray-500">
          Posted on {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/post")}
          className="px-4 py-2 mt-4 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Back to Feed
        </motion.button>
      </motion.div>
    </>
  );
};

export default PostDetail;