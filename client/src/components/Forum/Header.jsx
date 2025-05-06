import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMenu,
  HiX,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineChevronDown,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Check if page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check system dark mode preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const checkSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/check-session",
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (err) {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     // Force a full reload to ensure all state is cleared
  //     window.location.href = '/login';
  //   } catch (error) {
  //     console.error('Failed to log out', error);
  //   }
  // };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Define navigation links with icons
  const navLinks = [
    { name: "Home", path: "/forum/home", icon: "🏠" },
    { name: "Forums", path: "/forum/questions", icon: "📰" },
    { name: "Saved", path: "/forum/saved", icon: "📌" },
    { name: "Community", path: "/forum/community", icon: "👥" },
  ];

  // Animation variants
  const headerVariants = {
    scrolled: {
      height: 64,
      backgroundColor: isDarkMode
        ? "rgba(15, 23, 42, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
    },
    top: {
      height: 72,
      backgroundColor: isDarkMode
        ? "rgba(15, 23, 42, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      backdropFilter: "blur(7px)",
    },
  };

  const logoVariants = {
    normal: { rotate: 0 },
    hover: { rotate: -10, scale: 1.1 },
  };

  const linkVariants = {
    initial: { y: -5, opacity: 0 },
    animate: (index) => ({
      y: 0,
      opacity: 1,
      transition: { delay: index * 0.05, duration: 0.2 },
    }),
    hover: { y: -2, scale: 1.05 },
  };

  const searchVariants = {
    closed: { width: 40, borderRadius: 30 },
    open: { width: 240, borderRadius: 20 },
  };

  const mobileMenuVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  };

  const userMenuVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95, transformOrigin: "top right" },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.header
      className="sticky top-0 z-30 w-full transition-all"
      variants={headerVariants}
      animate={isScrolled ? "scrolled" : "top"}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div
              whileHover="hover"
              initial="normal"
              variants={logoVariants}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link to="/forum/home" className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-2 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                  <motion.svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </motion.svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-slate-800 dark:text-white">
                    Nexora
                  </span>
                  <span className="text-xs font-medium text-blue-500">
                    Forum Community
                  </span>
                </div>
              </Link>
            </motion.div>

            <nav className="hidden md:ml-8 md:flex md:space-x-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  custom={index}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  variants={linkVariants}
                >
                  <Link
                    to={link.path}
                    className={`px-3 py-2 font-medium transition-all rounded-md flex items-center gap-1 ${
                      location.pathname === link.path
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-slate-600 hover:text-blue-500 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span className="hidden text-lg sm:inline-block sm:text-sm">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          <div className="items-center hidden space-x-3 md:flex">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 40 }}
                  animate={{ opacity: 1, width: 240 }}
                  exit={{ opacity: 0, width: 40 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-10 px-10 text-sm transition-all bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-blue-300 dark:bg-slate-700/50 dark:text-slate-200 dark:focus:ring-blue-600"
                    autoFocus
                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  />
                  <HiOutlineSearch className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 transition-colors rounded-full ${
                isSearchOpen
                  ? "bg-gray-200 dark:bg-slate-700"
                  : "bg-gray-100 dark:bg-slate-700/50"
              } text-slate-500 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-300`}
            >
              <HiOutlineSearch className="w-5 h-5" />
            </motion.button>

            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link to={"/forum/notifications"}>
              <button className="p-2 transition-colors bg-gray-100 rounded-full text-slate-500 hover:text-blue-500 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:text-blue-300">
                <div className="relative">
                  <HiOutlineBell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 flex w-2 h-2">
                    <motion.span
                      className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      ></motion.span>
                    <span className="relative inline-flex w-2 h-2 bg-red-500 rounded-full"></span>
                  </span>
                </div>
              </button>
                      </Link>
            </motion.div>

            <motion.button
              onClick={toggleDarkMode}
              className="p-2 transition-colors bg-gray-100 rounded-full text-slate-500 hover:text-blue-500 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:text-blue-300"
              whileHover={{ scale: 1.1, rotate: isDarkMode ? -30 : 30 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiOutlineSun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiOutlineMoon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="relative">
              <motion.button
                className="flex items-center p-0.5 space-x-2 transition-all border rounded-full border-slate-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
              >
                <motion.div
                  className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-gradient-to-br from-purple-500 to-blue-500"
                  whileHover={{
                    backgroundImage: [
                      "linear-gradient(to bottom right, #8B5CF6, #3B82F6)",
                      "linear-gradient(to bottom right, #3B82F6, #8B5CF6)",
                    ],
                    transition: {
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                >
                  <HiOutlineUser className="w-4 h-4" />
                </motion.div>
                <div className="flex items-center pr-2">
                  <HiOutlineChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                      isUserMenuOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="absolute right-0 z-40 w-48 mt-2 overflow-hidden bg-white rounded-lg shadow-lg dark:bg-slate-800"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={userMenuVariants}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-slate-200">
                        {user ? user.name : "Guest User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate dark:text-slate-400">
                        {user ? user.email : "Sign in to continue"}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to={`/profile/${user.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        <span className="mr-2">👤</span> Profile
                      </Link>
                      <Link
                        to={`/edit/${user.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        <span className="mr-2">⚙️</span> Settings
                      </Link>
                      {user ? (
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <span className="mr-2">🚪</span> Sign out
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <span className="mr-2">🔑</span> Sign in
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 transition-colors rounded-md text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-slate-700/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiX className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiOutlineMenu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-b-lg shadow-lg dark:bg-slate-800">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.2 }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center px-3 py-2 text-base font-medium transition-colors rounded-md ${
                      location.pathname === link.path
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300"
                        : "text-slate-600 hover:text-blue-500 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center text-slate-600 hover:text-blue-500 dark:text-slate-200 dark:hover:text-blue-300"
                  >
                    {isDarkMode ? (
                      <HiOutlineSun className="w-5 h-5 mr-2" />
                    ) : (
                      <HiOutlineMoon className="w-5 h-5 mr-2" />
                    )}
                    <span>{isDarkMode ? "Light mode" : "Dark mode"}</span>
                  </button>
                </div>

                <div className="px-3 py-2">
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlineSearch className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border-0 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="px-3 py-2">
                  {user ? (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center px-3 py-2 space-x-3 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                        <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                          <HiOutlineUser className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center justify-center w-full py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
