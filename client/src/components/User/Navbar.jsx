import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, LogOut, LogIn, UserPlus, Settings } from 'lucide-react';
import AuthButton from './AuthButton';

function Navbar({ currentUser, onSignOut, isDarkMode, setIsDarkMode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? (isDarkMode ? 'bg-gray-800/95 shadow-gray-900' : 'bg-gray-100/95 shadow-gray-200') : 'bg-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="px-4 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <motion.a 
            href="/" 
            className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text"
            whileHover={{ scale: 1.05 }}
          >
            Nexora
          </motion.a>

          <div className="flex items-center gap-4">
            <motion.button
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            <div className="items-center hidden gap-6 md:flex">
              {currentUser ? (
                <motion.div 
                  className="flex items-center gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Hello, {currentUser.name}
                  </span>
                  <AuthButton 
                    href={`/profile/${currentUser.id}`} 
                    Icon={Settings} 
                    isDarkMode={isDarkMode}
                  >
                    Settings
                  </AuthButton>
                  <AuthButton 
                    Icon={LogOut} 
                    onClick={onSignOut} 
                    isDarkMode={isDarkMode}
                  >
                    Sign Out
                  </AuthButton>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex gap-4" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                >
                  <AuthButton href="/login" Icon={LogIn} isDarkMode={isDarkMode}>Login</AuthButton>
                  <AuthButton href="/signup" Icon={UserPlus} primary isDarkMode={isDarkMode}>Sign Up</AuthButton>
                </motion.div>
              )}
            </div>

            <motion.button 
              className="p-2 md:hidden"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className={`p-4 mt-2 md:hidden rounded-b-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {currentUser ? (
                <div className="space-y-3">
                  <AuthButton 
                    href={`/profile/${currentUser.id}`} 
                    Icon={Settings} 
                    fullWidth 
                    isDarkMode={isDarkMode}
                  >
                    Settings
                  </AuthButton>
                  <AuthButton 
                    Icon={LogOut} 
                    onClick={onSignOut} 
                    fullWidth 
                    isDarkMode={isDarkMode}
                  >
                    Sign Out
                  </AuthButton>
                </div>
              ) : (
                <div className="space-y-3">
                  <AuthButton href="/login" Icon={LogIn} fullWidth isDarkMode={isDarkMode}>Login</AuthButton>
                  <AuthButton href="/signup" Icon={UserPlus} primary fullWidth isDarkMode={isDarkMode}>Sign Up</AuthButton>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;