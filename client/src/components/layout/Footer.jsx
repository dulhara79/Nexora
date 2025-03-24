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
    <footer className="relative bg-slate-800 text-white pt-[80px] pb-5 w-m-full">
      {/* Wave shape decoration */}
      <div className="absolute top-[-120px] left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg 
          className="relative block h-[120px] w-full"
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-slate-800"
          ></path>
        </svg>
      </div>
      
      <div className="max-w-full px-5 mx-auto">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 gap-10 md:grid-cols-3"
        >
          {/* Logo Section */}
          <motion.div variants={fadeInUp} className="flex flex-col">
            <div className="flex items-center mb-4">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 mr-2.5"
              />
              <h2 className="text-2xl font-bold text-white">Nexora</h2>
            </div>
            <p className="mb-6 leading-relaxed text-slate-400">
              Share your skills, learn from others, and build a community of passionate learners.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="flex items-center justify-center text-white transition-all rounded-full w-9 h-9 bg-white/10 hover:bg-indigo-500 hover:-translate-y-1"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center text-white transition-all rounded-full w-9 h-9 bg-white/10 hover:bg-indigo-500 hover:-translate-y-1"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center text-white transition-all rounded-full w-9 h-9 bg-white/10 hover:bg-indigo-500 hover:-translate-y-1"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center text-white transition-all rounded-full w-9 h-9 bg-white/10 hover:bg-indigo-500 hover:-translate-y-1"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </motion.div>

          {/* Links Section */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div>
              <h3 className="relative pb-2 mb-5 text-lg font-bold text-white">
                Quick Links
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-indigo-500"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="transition-colors text-slate-400 hover:text-indigo-500">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors text-slate-400 hover:text-indigo-500">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors text-slate-400 hover:text-indigo-500">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors text-slate-400 hover:text-indigo-500">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="relative pb-2 mb-5 text-lg font-bold text-white">
                Resources
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-indigo-500"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="transition-colors text-slate-400 hover:text-indigo-500">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors text-slate-400 hover:text-indigo-500">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors text-slate-400 hover:text-indigo-500">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="relative pb-2 mb-5 text-lg font-bold text-white">
                Company
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-indigo-500"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="transition-colors text-slate-400 hover:text-indigo-500">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors text-slate-400 hover:text-indigo-500">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors text-slate-400 hover:text-indigo-500">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div variants={fadeInUp}>
            <h3 className="relative pb-2 mb-5 text-lg font-bold text-white">
              Newsletter
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-indigo-500"></span>
            </h3>
            <p className="mb-5 text-slate-400">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 text-white rounded-l-lg bg-white/10 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-5 py-3 font-semibold text-white transition-colors bg-indigo-500 rounded-r-lg hover:bg-indigo-600">
                Subscribe
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          variants={fadeInUp}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-5 mt-16 text-center border-t border-white/10"
        >
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} SkillShare. All rights reserved.
          </p>
          <div className="flex justify-center gap-5 mt-4">
            <a href="#" className="text-sm transition-colors text-slate-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-sm transition-colors text-slate-400 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-sm transition-colors text-slate-400 hover:text-white">
              Cookies
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;