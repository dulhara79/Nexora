import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Added for programmatic navigation

  // Check if dark mode was previously enabled
  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    
    // Apply dark mode to the entire document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900");
      document.body.classList.add("text-white");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-gray-900");
      document.body.classList.remove("text-white");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    
    // Apply dark mode to the entire document
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900");
      document.body.classList.add("text-white");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-gray-900");
      document.body.classList.remove("text-white");
    }
  };

  // Check if a nav link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle Explore button click with reload
  const handleExploreClick = () => {
    navigate("/post"); // Navigate to /post
    setTimeout(() => {
      window.location.reload(); // Force reload after navigation
    }, 100); // Small delay to ensure navigation completes
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className={`sticky top-0 z-50 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      } shadow-md transition-colors duration-300`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-8 w-8 ${darkMode ? "text-amber-400" : "text-amber-500"}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className={`ml-2 text-2xl font-bold ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
                Nexora
              </span>
            </Link>
            <div className="items-center hidden ml-10 space-x-4 md:flex">
              <NavLink to="/" active={isActive("/")} darkMode={darkMode}>
                Home
              </NavLink>
              <button
                onClick={handleExploreClick}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/post") // Highlight if on /post
                    ? darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-amber-100 text-amber-700"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Explore
              </button>
              <NavLink to="/create-post" active={isActive("/create-post")} darkMode={darkMode}>
                Create a post
              </NavLink>
            </div>
          </div>

          {/* Right side navigation items */}
          <div className="items-center hidden space-x-4 md:flex">
            {/* Notifications */}
            <Link 
              to="/post-notifications" 
              className={`relative p-2 rounded-full ${
                isActive("/post-notifications")
                  ? darkMode ? "bg-gray-700" : "bg-amber-100"
                  : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } transition-colors`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 ${darkMode ? "text-amber-400" : "text-amber-500"}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className={`absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full ${darkMode ? "border border-gray-800" : ""}`}></span>
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode ? "bg-gray-700 text-amber-400" : "bg-gray-100 text-gray-800"
              } transition-colors`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* User profile/menu */}
            {user && (
              <div className="relative ml-3">
                <div 
                  className={`flex items-center text-sm font-medium px-4 py-2 rounded-full ${
                    darkMode ? "bg-gray-700 text-white" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 mr-2 text-white rounded-full bg-amber-500">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-md ${
                darkMode ? "text-white hover:bg-gray-700" : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink to="/" active={isActive("/")} darkMode={darkMode} onClick={() => setMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <button
                onClick={() => {
                  handleExploreClick();
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                  isActive("/post") // Highlight if on /post
                    ? darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-amber-100 text-amber-700"
                    : darkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Explore
              </button>
              <MobileNavLink to="/create-post" active={isActive("/create-post")} darkMode={darkMode} onClick={() => setMobileMenuOpen(false)}>
                Create a post
              </MobileNavLink>
              <MobileNavLink to="/post-notifications" active={isActive("/post-notifications")} darkMode={darkMode} onClick={() => setMobileMenuOpen(false)}>
                Notifications
              </MobileNavLink>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {user && (
                <div className="flex items-center px-5">
                  <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-amber-500">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div 
                      className={`text-base font-medium ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {user.name}
                    </div>
                  </div>
                </div>
              )}
              <div className="px-2 mt-3 space-y-1">
                <button
                  onClick={toggleDarkMode}
                  className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-md ${
                    darkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Desktop navigation link component
const NavLink = ({ children, to, active, darkMode }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? darkMode
          ? "bg-gray-700 text-white"
          : "bg-amber-100 text-amber-700"
        : darkMode
          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {children}
  </Link>
);

// Mobile navigation link component
const MobileNavLink = ({ children, to, active, darkMode, onClick }) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      active
        ? darkMode
          ? "bg-gray-700 text-white"
          : "bg-amber-100 text-amber-700"
        : darkMode
          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;