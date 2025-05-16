import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

  const Hero = () => {
  const controls = useAnimation();

  useEffect(() => {
    // Trigger animation sequence on component mount
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    });
  }, [controls]);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-blue-100 h-dvh md:pt-32 lg:pt-40 md:pb-24"
    >
      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.h1
              className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              A platform to <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                <TypeAnimation
                  sequence={[
                    "Learn",
                    2000,
                    "Share",
                    2000,
                    "Connect",
                    2000,
                    "Grow",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </motion.h1>

            <motion.p
              className="max-w-2xl text-lg text-gray-600 md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Share your skills, learn from others, and build a community of
              passionate learners. Join thousands of users in their learning
              journey.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.a
                className="px-6 py-3 font-medium text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/signup"
              >
                <span className="text-white">Get Started</span>
              </motion.a>

              <motion.button
                className="relative px-8 py-3.5 font-medium text-white transition-all duration-300 rounded-lg overflow-hidden group"
                style={{
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #4f46e5 100%)",
                  boxShadow:
                    "0 10px 15px -3px rgba(14, 165, 233, 0.2), 0 4px 6px -4px rgba(14, 165, 233, 0.2)",
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    "0 20px 25px -5px rgba(14, 165, 233, 0.3), 0 8px 10px -6px rgba(14, 165, 233, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute top-0 left-0 w-full h-full transition-opacity duration-300 opacity-0 bg-gradient-to-r from-sky-500/40 to-blue-600/40 group-hover:opacity-100"></span>
                <span className="absolute top-0 left-0 w-0 h-full skew-x-12 bg-white/20 group-hover:animate-shine"></span>
                <span className="relative tracking-wide">Learn More</span>
                <span className="relative inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Animation Container - Fixed positioning issue */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden md:block"
            style={{ height: "500px" }}
          >
            {/* Interactive Skill Cards */}
            {/* <div className="absolute inset-0 min-h-96"> */}
            <div className="relative w-full h-full min-h-96">
              {/* Baking Card */}
              <motion.div
                className="absolute z-10 p-4 bg-white rounded-lg shadow-lg"
                style={{ top: "10%", left: "5%" }}
                initial={{ x: -30, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  y: [0, -10, 0],
                  transition: {
                    y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                    opacity: { duration: 0.8, delay: 0.8 },
                  },
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Baking</span>
                </div>
              </motion.div>

              {/* Grilling Card */}
              <motion.div
                className="absolute z-10 p-4 bg-white rounded-lg shadow-lg"
                style={{ top: "25%", right: "5%" }}
                initial={{ x: 30, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  y: [0, -15, 0],
                  transition: {
                    y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                    opacity: { duration: 0.8, delay: 1.0 },
                  },
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Grilling</span>
                </div>
              </motion.div>

              {/* Knife Skills Card */}
              <motion.div
                className="absolute z-10 p-4 bg-white rounded-lg shadow-lg"
                style={{ bottom: "15%", left: "12%" }}
                initial={{ y: 30, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  x: [0, -10, 0],
                  transition: {
                    x: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
                    opacity: { duration: 0.8, delay: 1.2 },
                  },
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Knife Skills</span>
                </div>
              </motion.div>

              {/* Plating Card */}
              <motion.div
                className="absolute z-10 p-4 bg-white rounded-lg shadow-lg"
                style={{ bottom: "25%", right: "15%" }}
                initial={{ y: 30, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  x: [0, 10, 0],
                  transition: {
                    x: { repeat: Infinity, duration: 3.8, ease: "easeInOut" },
                    opacity: { duration: 0.8, delay: 1.4 },
                  },
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Plating</span>
                </div>
              </motion.div>

              {/* Sauté Card */}
              <motion.div
                className="absolute z-10 p-4 bg-white rounded-lg shadow-lg"
                style={{ top: "55%", left: "28%" }}
                initial={{ x: -20, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  y: [0, 10, 0],
                  transition: {
                    y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                    opacity: { duration: 0.8, delay: 1.6 },
                  },
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Sauté</span>
                </div>
              </motion.div>

              {/* Culinary Arts Card */}
              <motion.div
                className="absolute z-10 p-4 bg-white rounded-lg shadow-lg"
                style={{ top: "15%", left: "40%" }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  y: [0, -10, 0],
                  transition: {
                    y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
                    opacity: { duration: 0.8, delay: 0.6 },
                  },
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Culinary Arts</span>
                </div>
              </motion.div>

              {/* Recipe Creation Card */}
              <motion.div
                className="absolute z-10 p-4 bg-white rounded-lg shadow-lg"
                style={{ top: "40%", right: "25%" }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  y: [0, 10, 0],
                  transition: {
                    y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
                    opacity: { duration: 0.8, delay: 0.8 },
                  },
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Recipe Creation</span>
                </div>
              </motion.div>

              {/* Meal Planning Card */}
              <motion.div
                className="absolute z-10 p-4 bg-white rounded-lg shadow-lg"
                style={{ bottom: "5%", right: "35%" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: [0, 10, 0],
                  transition: {
                    x: { repeat: Infinity, duration: 3.7, ease: "easeInOut" },
                    opacity: { duration: 0.8, delay: 1.2 },
                  },
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Meal Planning</span>
                </div>
              </motion.div>

              {/* Main Circle Background */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-100/50 to-blue-100/50"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "450px",
                  height: "450px",
                  transform: "translate(-50%, -50%)",
                  zIndex: -1,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 0.8,
                  scale: 1,
                  rotate: 360,
                  transition: {
                    rotate: { repeat: Infinity, duration: 60, ease: "linear" },
                    opacity: { duration: 1, delay: 0.5 },
                  },
                }}
              />

              {/* Inner Circle Animation */}
              <motion.div
                className="absolute rounded-full bg-gradient-to-r from-purple-100/30 to-indigo-100/30"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "380px",
                  height: "380px",
                  transform: "translate(-50%, -50%)",
                  zIndex: -1,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 0.6,
                  scale: 1,
                  rotate: -360,
                  transition: {
                    rotate: { repeat: Infinity, duration: 45, ease: "linear" },
                    opacity: { duration: 1, delay: 0.7 },
                  },
                }}
              />

              {/* Center glow effect */}
              <motion.div
                className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-indigo-500/10"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "280px",
                  height: "280px",
                  transform: "translate(-50%, -50%)",
                  filter: "blur(20px)",
                  zIndex: -2,
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.9, 1.1, 0.9],
                  transition: {
                    opacity: {
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut",
                    },
                    scale: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Mobile Skill Cards - Only visible on mobile */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 md:hidden">
            <motion.div
              className="p-4 bg-white rounded-lg shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Baking</span>
              </div>
            </motion.div>

            <motion.div
              className="p-4 bg-white rounded-lg shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Knife Skills</span>
              </div>
            </motion.div>

            <motion.div
              className="p-4 bg-white rounded-lg shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Sauté</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated wave background */}
      <div className="absolute bottom-0 left-0 right-0 z-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto"
        >
          <motion.path
            fill="#b3d3fd"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
          ></motion.path>
        </svg>
      </div>

      {/* Decorative floating elements */}
      <motion.div
        className="absolute hidden w-16 h-16 rounded-full top-24 right-16 bg-blue-400/10 lg:block"
        animate={{
          y: [0, -20, 0],
          transition: { repeat: Infinity, duration: 5, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="absolute hidden w-12 h-12 rounded-full bottom-32 left-16 bg-purple-400/10 lg:block"
        animate={{
          y: [0, -15, 0],
          transition: {
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            delay: 1,
          },
        }}
      />

      <motion.div
        className="absolute hidden w-8 h-8 rounded-full top-1/3 left-24 bg-indigo-400/10 lg:block"
        animate={{
          y: [0, -10, 0],
          transition: {
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
            delay: 0.5,
          },
        }}
      />
    </section>
  );
};

export default Hero;
