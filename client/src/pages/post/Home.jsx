import { useState, useEffect, useContext } from "react";
import axios from "axios";
import PostCard from "../../components/post/PostCard";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import Navbar from "../../components/post/Navbar";  

const Home = ({ onNewNotification }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/posts", {
        withCredentials: true,
      });
      setPosts(response.data);
      console.log("posts: ", response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <   Navbar />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl p-6 mx-auto"
    >
      <h2 className="mb-8 text-3xl font-bold text-gray-800">Post Feed</h2>
      {loading ? (
        <motion.div
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading posts...
        </motion.div>
      ) : posts.length === 0 ? (
        <motion.div
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No posts yet.
        </motion.div>
      ) : (
        <motion.div
          className="space-y-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              user={user?.id}
              fetchPosts={fetchPosts}
              onNewNotification={onNewNotification}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
    </>
  );
};

export default Home;