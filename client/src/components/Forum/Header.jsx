import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMenu,
  HiX,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineBell,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // To highlight active link
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/check-session",
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
        console.log("User session data:", response.data);
      } catch (err) {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    window.location.href = "/login";
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Define navigation links
  const navLinks = [
    { name: "Home", path: "/forum/home" },
    { name: "Forums", path: "/forum" },
    { name: "Saved", path: "/forum/saved" },
    { name: "Community", path: "/community" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm dark:bg-slate-800 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/forum" className="flex items-center">
                <motion.div
                  className="flex items-center justify-center w-8 h-8 mr-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </motion.div>
                <span className="text-xl font-bold text-slate-800 dark:text-white">
                  Nexora Forum
                </span>
              </Link>
            </motion.div>

            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 font-medium transition-colors rounded-md ${
                    location.pathname === link.path
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-slate-500 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="items-center hidden space-x-4 md:flex">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="p-2 transition-colors rounded-full text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-700/50">
                <HiOutlineSearch className="w-5 h-5" />
              </button>
            </motion.div>

            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="p-2 transition-colors rounded-full text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-700/50">
                <HiOutlineBell className="w-5 h-5" />
              </button>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.div>

            <motion.button
              onClick={toggleDarkMode}
              className="p-2 transition-colors rounded-full text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-700/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? (
                <HiOutlineSun className="w-5 h-5" />
              ) : (
                <HiOutlineMoon className="w-5 h-5" />
              )}
            </motion.button>

            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="flex items-center p-1 space-x-2 border rounded-full border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700">
                <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                  <HiOutlineUser className="w-4 h-4" />
                </div>
              </button>
            </motion.div>
          </div>

          <div className="flex md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 transition-colors rounded-md text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-700/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <HiX className="block w-6 h-6" />
              ) : (
                <HiOutlineMenu className="block w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-b-lg shadow-lg dark:bg-slate-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block px-3 py-2 text-base font-medium transition-colors rounded-md ${
                location.pathname === link.path
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-slate-500 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-700/50"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center justify-between px-3 py-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center text-slate-500 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-400"
            >
              {isDarkMode ? (
                <HiOutlineSun className="w-5 h-5 mr-2" />
              ) : (
                <HiOutlineMoon className="w-5 h-5 mr-2" />
              )}
              <span>{isDarkMode ? "Light mode" : "Dark mode"}</span>
            </button>

            <div className="flex space-x-4">
              <button className="p-2 transition-colors rounded-full text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-700/50">
                <HiOutlineSearch className="w-5 h-5" />
              </button>
              <button className="p-2 transition-colors rounded-full text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-700/50">
                <HiOutlineBell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
