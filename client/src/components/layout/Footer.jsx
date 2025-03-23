// components/layout/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Footer = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden text-white bg-gradient-to-r from-indigo-900 via-violet-900 to-purple-900">
      {/* Abstract shape decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500"></div>
      <div className="absolute top-0 right-0 opacity-10">
        <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
          <defs>
            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="3" className="fill-white" />
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#pattern-circles)" />
        </svg>
      </div>
      
      <div className="container relative z-10 max-w-full px-6 mx-auto">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-4"
        >
          <motion.div variants={fadeInUp} className="mb-8 md:mb-0">
            <h3 className="mb-6 text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text">SkillShare Platform</h3>
            <p className="mb-6 text-indigo-100">
              Share your skills, learn from others, and build a community of passionate learners.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="flex items-center justify-center w-10 h-10 text-white transition-all duration-300 bg-indigo-700 rounded-full hover:bg-indigo-600 hover:scale-110">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 text-white transition-all duration-300 bg-indigo-700 rounded-full hover:bg-indigo-600 hover:scale-110">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 text-white transition-all duration-300 bg-indigo-700 rounded-full hover:bg-indigo-600 hover:scale-110">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 text-white transition-all duration-300 bg-indigo-700 rounded-full hover:bg-indigo-600 hover:scale-110">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="mb-6 text-lg font-semibold tracking-wider text-indigo-300 uppercase">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center text-indigo-100 transition-all duration-300 group hover:text-white">
                  <span className="inline-block w-0 h-px mr-2 transition-all duration-300 bg-indigo-300 group-hover:w-4"></span> 
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="flex items-center text-indigo-100 transition-all duration-300 group hover:text-white">
                  <span className="inline-block w-0 h-px mr-2 transition-all duration-300 bg-indigo-300 group-hover:w-4"></span> 
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="flex items-center text-indigo-100 transition-all duration-300 group hover:text-white">
                  <span className="inline-block w-0 h-px mr-2 transition-all duration-300 bg-indigo-300 group-hover:w-4"></span> 
                  How It Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="flex items-center text-indigo-100 transition-all duration-300 group hover:text-white">
                  <span className="inline-block w-0 h-px mr-2 transition-all duration-300 bg-indigo-300 group-hover:w-4"></span> 
                  Testimonials
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="mb-6 text-lg font-semibold tracking-wider text-indigo-300 uppercase">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center text-indigo-100 transition-all duration-300 group hover:text-white">
                  <span className="inline-block w-0 h-px mr-2 transition-all duration-300 bg-indigo-300 group-hover:w-4"></span> 
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-indigo-100 transition-all duration-300 group hover:text-white">
                  <span className="inline-block w-0 h-px mr-2 transition-all duration-300 bg-indigo-300 group-hover:w-4"></span> 
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-indigo-100 transition-all duration-300 group hover:text-white">
                  <span className="inline-block w-0 h-px mr-2 transition-all duration-300 bg-indigo-300 group-hover:w-4"></span> 
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-indigo-100 transition-all duration-300 group hover:text-white">
                  <span className="inline-block w-0 h-px mr-2 transition-all duration-300 bg-indigo-300 group-hover:w-4"></span> 
                  Community
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="mb-6 text-lg font-semibold tracking-wider text-indigo-300 uppercase">Newsletter</h3>
            <p className="mb-6 text-indigo-100">
              Stay updated with our latest features and releases.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 text-white placeholder-indigo-300 border border-indigo-700 rounded-lg bg-indigo-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="absolute px-4 py-2 font-medium text-indigo-900 transition-all duration-300 rounded-md right-1 top-1 bg-gradient-to-r from-indigo-300 to-purple-300 hover:opacity-90 hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 mt-8 text-center border-t border-indigo-800"
        >
          <p className="text-indigo-200">© {new Date().getFullYear()} SkillShare Platform. All rights reserved.</p>
          <div className="flex justify-center mt-4 space-x-8 text-sm">
            <a href="#" className="text-indigo-300 transition-all duration-300 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-indigo-300 transition-all duration-300 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-indigo-300 transition-all duration-300 hover:text-white">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;