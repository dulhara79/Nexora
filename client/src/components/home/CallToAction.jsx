import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const CallToAction = () => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Animated shapes */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white bg-opacity-10"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: Math.random() * 10 + 10,
            }}
          />
        ))}

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col lg:flex-row items-center justify-between bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-xl"
        >
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl">
              Join our growing community of skill-sharers and learners. Create your account today and begin exploring!
            </p>
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-lg bg-white text-indigo-700 font-bold text-lg hover:bg-opacity-90 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 rounded-lg bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
            >
              Explore Skills
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;