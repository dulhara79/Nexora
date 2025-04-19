import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="flex items-center justify-between p-4 bg-white shadow-md"
    >
      <h1 className="text-2xl font-bold text-gray-800">
        <Link to="/">Nexora</Link>
      </h1>
      <div className="flex items-center space-x-4">
        <Link to="/create-post" className="text-blue-500 hover:text-blue-700">
          Create Post
        </Link>
        <Link
          to="/post-notifications"
          className="text-blue-500 hover:text-blue-700"
        >
          Notifications
        </Link>
        {user && (
          <span className="font-semibold text-gray-800">
            Welcome, {user.name}
          </span>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;