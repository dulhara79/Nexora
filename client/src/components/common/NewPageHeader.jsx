import { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import FallbackAvatar from "./FallbackAvatar";
import {
  House,
  ChefHat,
  BookOpen,
  Trophy,
  MessageSquareMore,
  User,
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";

// Page-specific color schemes
const PAGE_THEMES = {
  home: {
    primary: "from-orange-500 to-pink-500",
    nav: "bg-gradient-to-r from-orange-500 to-pink-500",
    text: "text-white",
    active: "bg-white/20",
    hover: "hover:bg-white/10",
    submenuBg: "bg-gradient-to-r from-orange-400/95 to-pink-400/95",
    submenuText: "text-white",
    submenuHover: "hover:bg-white/20",
    submenuActive: "bg-white/30",
  },
  post: {
    primary: "from-amber-600 to-yellow-300",
    nav: "bg-gradient-to-r from-amber-600 to-yellow-300",
    text: "text-white",
    active: "bg-white/20",
    hover: "hover:bg-white/10",
    submenuBg: "bg-gradient-to-r from-amber-400/95 to-yellow-300/95",
    submenuText: "text-white",
    submenuHover: "hover:bg-white/20",
    submenuActive: "bg-white/30",
  },
  learn: {
    primary: "from-red-500 to-yellow-500",
    nav: "bg-gradient-to-r from-red-500 to-yellow-500",
    text: "text-white",
    active: "bg-white/20",
    hover: "hover:bg-white/10",
    submenuBg: "bg-gradient-to-r from-red-400/95 to-yellow-400/95",
    submenuText: "text-white",
    submenuHover: "hover:bg-white/20",
    submenuActive: "bg-white/30",
  },
  challenges: {
    primary: "from-pink-400 to-orange-500",
    nav: "bg-gradient-to-r from-pink-400 to-orange-500",
    text: "text-white",
    active: "bg-white/20",
    hover: "hover:bg-white/10",
    submenuBg: "bg-gradient-to-r from-pink-400/95 to-orange-400/95",
    submenuText: "text-white",
    submenuHover: "hover:bg-white/20",
    submenuActive: "bg-white/30",
  },
  forum: {
    primary: "from-orange-500 to-amber-500",
    nav: "bg-gradient-to-r from-orange-500 to-amber-500",
    text: "text-white",
    active: "bg-white/20",
    hover: "hover:bg-white/10",
    submenuBg: "bg-gradient-to-r from-orange-400/95 to-amber-400/95",
    submenuText: "text-white",
    submenuHover: "hover:bg-white/20",
    submenuActive: "bg-white/30",
  },
  default: {
    primary: "from-gray-800 to-gray-900",
    nav: "bg-gradient-to-r from-gray-800 to-gray-900",
    text: "text-white",
    active: "bg-white/20",
    hover: "hover:bg-white/10",
    submenuBg: "bg-gradient-to-r from-gray-700/95 to-gray-800/95",
    submenuText: "text-white",
    submenuHover: "hover:bg-white/20",
    submenuActive: "bg-white/30",
  },
};

export default function EnhancedHeader() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [headerState, setHeaderState] = useState({
    bgColor: "bg-gradient-to-r from-orange-500 to-pink-500",
    textColor: "text-white",
    shadow: "shadow-none",
    border: "",
    backdrop: "",
  });

  const headerRef = useRef(null);
  const submenuRef = useRef(null);
  const lastClickedTabRef = useRef(null);

  // Navigation structure with submenus
  const NAV_STRUCTURE = {
    home: {
      path: "/feed",
      label: "Home",
      icon: <House className="w-5 h-5" />,
      theme: "home",
      submenu: [
        { path: "/feed", label: "For You" },
        { path: "/feed/trending", label: "Trending" },
        { path: "/feed/following", label: "Following" },
      ],
    },
    post: {
      path: "/post",
      label: "Posts",
      icon: <ChefHat className="w-5 h-5" />,
      theme: "post",
      submenu: [
        { path: "/post", label: "Discover" },
        { path: "/create-post", label: "Create" },
        { path: "/post-notifications", label: "Notifications" },
        { path: "/saved-posts", label: "Saved" },
      ],
    },
    learn: {
      path: "/learninghome",
      label: "Learning",
      icon: <BookOpen className="w-5 h-5" />,
      theme: "learn",
      submenu: [
        { path: "/learninghome", label: "Courses" },
        { path: "/learninghome/my-progress", label: "My Progress" },
        { path: "/learninghome/create", label: "Create" },
      ],
    },
    challenges: {
      path: "/challenges",
      label: "Challenges",
      icon: <Trophy className="w-5 h-5" />,
      theme: "challenges",
      submenu: [
        { path: "/challenges", label: "All Challenges" },
        { path: "/challenges/completed", label: "Completed" },
        { path: "/challenges/create", label: "Create" },
      ],
    },
    forum: {
      path: "/forum",
      label: "Forum",
      icon: <MessageSquareMore className="w-5 h-5" />,
      theme: "forum",
      submenu: [
        { path: "/forum", label: "All Topics" },
        { path: "/forum/ask", label: "Q&A" },
        { path: "/forum/saved", label: "Saved" },
        { path: "/forum/my-questions", label: "My Questions" },
        { path: "/forum/quizzes", label: "Quizzes" },
        { path: "/forum/notifications", label: "Notifications" },
      ],
    },
  };

  // Update active section based on route
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    let matchedSection = "default";
    Object.entries(NAV_STRUCTURE).forEach(([key, config]) => {
      if (path.startsWith(config.path)) {
        matchedSection = key;
      }
    });

    setActiveSection(matchedSection);
    updateHeaderTheme(matchedSection);

    if (window.scrollY > 10) {
      handleScrollUpdate(true);
    }
  }, [location.pathname]);

  // Update header theme based on active section
  const updateHeaderTheme = (section) => {
    const theme = PAGE_THEMES[section] || PAGE_THEMES.default;
    setHeaderState((prev) => ({
      ...prev,
      bgColor: theme.nav,
      textColor: theme.text,
      activeClass: theme.active,
      hoverClass: theme.hover,
    }));
  };

  // Handle scroll events
  useEffect(() => {
    let ticking = false;
    let lastScrollTop = 0;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          handleScrollUpdate(currentScroll > 10, currentScroll > lastScrollTop);
          lastScrollTop = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update header state based on scroll
  const handleScrollUpdate = (isScrolled) => {
    setHeaderState((prev) => ({
      ...prev,
      bgColor: isScrolled ? "bg-white shadow-md" : PAGE_THEMES[activeSection].nav,
      textColor: isScrolled ? "text-gray-800" : PAGE_THEMES[activeSection].text,
      border: isScrolled ? "border-b border-gray-200" : "",
      backdrop: isScrolled ? "backdrop-blur-md" : "",
    }));
  };

  // Handle tab click to toggle submenu
  const handleTabClick = (sectionKey) => {
    if (lastClickedTabRef.current === sectionKey && submenuOpen) {
      setSubmenuOpen(false);
    } else {
      setActiveSection(sectionKey);
      updateHeaderTheme(sectionKey);
      setSubmenuOpen(true);
      lastClickedTabRef.current = sectionKey;
    }
  };

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target) &&
        !event.target.closest('[data-nav-tab="true"]')
      ) {
        setSubmenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Background Gradient */}
        <div
          ref={headerRef}
          className={`fixed inset-x-0 top-0 h-16 transition-all duration-500 ${headerState.bgColor} ${headerState.border} ${headerState.backdrop}`}
        />

        {/* Main Navigation */}
        <nav className="relative z-10">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`p-2 rounded-full ${
                    headerState.bgColor.includes("bg-white") ? "bg-orange-100" : "bg-white/10"
                  }`}
                >
                  <ChefHat className={`w-6 h-6 ${headerState.textColor}`} />
                </motion.div>
                <span className={`font-bold text-xl ${headerState.textColor}`}>
                  Nexora
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="items-center hidden space-x-1 md:flex">
                {Object.entries(NAV_STRUCTURE).map(([key, item]) => {
                  const isActive = activeSection === key;
                  return (
                    <button
                      key={item.path}
                      data-nav-tab="true"
                      onClick={() => handleTabClick(key)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? `${PAGE_THEMES[item.theme].active} ${PAGE_THEMES[item.theme].text}`
                          : `${headerState.textColor} ${PAGE_THEMES[item.theme].hover}`
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                      {submenuOpen && activeSection === key ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </button>
                  );
                })}

                {/* Search Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2 rounded-full transition-colors ${headerState.textColor} ${headerState.hoverClass}`}
                >
                  <Search className="w-5 h-5" />
                </motion.button>

                {/* User Menu */}
                {isAuthenticated ? (
                  <div className="relative group">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex items-center space-x-2 p-1 rounded-full border-2 ${
                        headerState.bgColor.includes("bg-white")
                          ? "border-orange-500"
                          : "border-white/30"
                      }`}
                    >
                      <FallbackAvatar
                        src={user?.profilePhotoUrl}
                        name={user?.name || "User"}
                        size={8}
                      />
                    </motion.button>

                    {/* Dropdown */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 hidden w-48 py-2 mt-2 bg-white rounded-lg shadow-xl group-hover:block"
                    >
                      <Link
                        to={`/profile/${user?.id}`}
                        className="block px-4 py-2 text-gray-800 hover:bg-orange-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to={`/edit/${user?.id}`}
                        className="block px-4 py-2 text-gray-800 hover:bg-orange-50"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-800 hover:bg-orange-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/login")}
                      className="px-4 py-2 text-orange-500 bg-white rounded-lg hover:bg-orange-50"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/signup")}
                      className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                    >
                      Sign Up
                    </motion.button>
                  </div>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <div className="flex items-center space-x-4 md:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-2 rounded-full transition-colors ${headerState.textColor} ${headerState.hoverClass}`}
                >
                  <Search className="w-5 h-5" />
                </motion.button>
                {isAuthenticated && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-1 rounded-full border-2 ${
                      headerState.bgColor.includes("bg-white")
                        ? "border-orange-500"
                        : "border-white/30"
                    }`}
                  >
                    <FallbackAvatar
                      src={user?.profilePhotoUrl}
                      name={user?.name || "User"}
                      size={8}
                    />
                  </motion.div>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`p-2 rounded-full transition-colors ${headerState.textColor} ${headerState.hoverClass}`}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
              </div>
            </div>
          </div>
        </nav>

        {/* Submenu */}
        <AnimatePresence>
          {submenuOpen && NAV_STRUCTURE[activeSection]?.submenu && (
            <motion.div
              ref={submenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`absolute left-0 right-0 z-40 ${PAGE_THEMES[activeSection].submenuBg} backdrop-blur-md shadow-md`}
            >
              <div className="container px-4 mx-auto">
                <div className="flex items-center justify-center py-2">
                  {NAV_STRUCTURE[activeSection].submenu.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-1.5 mx-1 rounded-lg transition-all duration-200 ${
                          PAGE_THEMES[activeSection].submenuText
                        } ${
                          isActive
                            ? PAGE_THEMES[activeSection].submenuActive
                            : PAGE_THEMES[activeSection].submenuHover
                        }`}
                      >
                        {item.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 56, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-0 z-40 shadow-md top-16 bg-white/90 backdrop-blur-md"
            >
              <div className="container px-4 py-3 mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search recipes, users, or cuisines..."
                    className="w-full px-4 py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute bottom-0 right-0 w-64 px-4 py-6 overflow-y-auto bg-white shadow-xl top-16"
              >
                <div className="flex flex-col space-y-1">
                  {Object.entries(NAV_STRUCTURE).map(([key, item]) => (
                    <div key={item.path} className="mb-2">
                      <div className="flex items-center">
                        <button
                          onClick={() => navigate(item.path)}
                          className={`flex-1 flex items-center px-4 py-3 rounded-lg ${
                            activeSection === key
                              ? "bg-orange-100 text-orange-600"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.label}
                        </button>
                        <button
                          onClick={() => setSubmenuOpen(!submenuOpen)}
                          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100"
                        >
                          {submenuOpen && activeSection === key ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <AnimatePresence>
                        {submenuOpen && activeSection === key && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-6 mt-1 space-y-1">
                              {item.submenu.map((subitem) => (
                                <button
                                  key={subitem.path}
                                  onClick={() => {
                                    navigate(subitem.path);
                                    setMobileMenuOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                    location.pathname === subitem.path
                                      ? "bg-orange-50 text-orange-600"
                                      : "text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  {subitem.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  {isAuthenticated ? (
                    <div className="pt-4 mt-2 border-t border-gray-200">
                      <Link
                        to={`/profile/${user?.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-orange-50"
                      >
                        <User className="w-5 h-5 mr-3" /> Profile
                      </Link>
                      <Link
                        to={`/edit/${user?.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-orange-50"
                      >
                        <svg
                          className="w-5 h-5 mr-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1658 17.2551 20.3747 17.7642 20.3747 18.295C20.3747 18.8258 20.1658 19.3349 19.79 19.71C19.4249 20.0858 18.9158 20.2947 18.385 20.2947C17.8542 20.2947 17.3451 20.0858 16.98 19.71L16.92 19.65C16.4378 19.1783 15.7171 19.0477 15.1 19.32C14.4951 19.5791 14.1 20.1619 14.1 20.8V21C14.1 22.1046 13.2046 23 12.1 23C10.9954 23 10.1 22.1046 10.1 21V20.91C10.0853 20.2496 9.66549 19.6568 9.04 19.4C8.42286 19.1277 7.70218 19.2583 7.22 19.73L7.16 19.79C6.78495 20.1658 6.27583 20.3747 5.745 20.3747C5.21417 20.3747 4.70505 20.1658 4.33 19.79C3.95422 19.4249 3.7453 18.9158 3.7453 18.385C3.7453 17.8542 3.95422 17.3451 4.33 16.98L4.39 16.92C4.86173 16.4378 4.99229 15.7171 4.72 15.1C4.46092 14.4951 3.87805 14.1 3.14 14.1H3C1.89543 14.1 1 13.2046 1 12.1C1 10.9954 1.89543 10.1 3 10.1H3.09C3.750435 10.0853 4.34318 9.66549 4.6 9.04C4.87229 8.42286 4.74173 7.70218 4.27 7.22L4.21 7.16C3.83422 6.78495 3.6253 6.27583 3.6253 5.745C3.6253 5.21417 3.83422 4.70505 4.21 4.33C4.57505 3.95422 5.08417 3.7453 5.615 3.7453C6.14583 3.7453 6.65495 3.95422 7.02 4.33L7.08 4.39C7.56218 4.86173 8.28286 4.99229 8.9 4.72H9C9.60494 4.46092 10 3.87805 10 3.14V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14 3.82805 14.3951 4.41092 15 4.67C15.6171 4.94229 16.3378 4.81173 16.82 4.34L16.88 4.28C17.2551 3.90422 17.7642 3.6953 18.295 3.6953C18.8258 3.6953 19.3349 3.90422 19.71 4.28C20.0858 4.64505 20.2947 5.15417 20.2947 5.685C20.2947 6.21583 20.0858 6.72495 19.71 7.09L19.65 7.15C19.1783 7.63218 19.0477 8.35286 19.32 8.97V9C19.5791 9.60494 20.1619 10 20.84 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.1819 14 19.6091 14.3951 19.35 15L19.4 15Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-orange-50"
                      >
                        <LogOut className="w-5 h-5 mr-3" /> Logout
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 mt-2 space-y-3 border-t border-gray-200">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigate("/login");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-3 text-orange-500 bg-white border border-orange-200 rounded-lg shadow-sm"
                      >
                        Login
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigate("/signup");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-3 text-white bg-orange-500 rounded-lg shadow-sm"
                      >
                        Create Account
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer to prevent content from hiding under the header + submenu */}
      <div
        className={`${
          submenuOpen ? "h-24" : "h-16"
        } transition-all duration-300`}
      ></div>
    </>
  );
}