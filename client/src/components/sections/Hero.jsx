import React from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const Hero = () => {
  return (
    <section
      id="hero"
      className="pt-24 pb-16 overflow-hidden bg-blue-100 h-dvh md:pt-32 lg:pt-40 md:pb-24"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
              A platform to{" "}
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
              <motion.button
                className="px-6 py-3 font-medium text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>

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
                {/* Animated overlay */}
                <span className="absolute top-0 left-0 w-full h-full transition-opacity duration-300 opacity-0 bg-gradient-to-r from-sky-500/40 to-blue-600/40 group-hover:opacity-100"></span>

                {/* Subtle glow effect */}
                <span className="absolute top-0 left-0 w-0 h-full skew-x-12 bg-white/20 group-hover:animate-shine"></span>

                {/* Button text with subtle spacing */}
                <span className="relative tracking-wide">Learn More</span>

                {/* Optional subtle icon */}
                <span className="relative inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative w-full h-full">
              <motion.div
                className="absolute left-0 z-10 p-4 bg-white rounded-lg shadow-lg top-10"
                initial={{ x: -50, y: 20, opacity: 0 }}
                animate={{ x: -20, y: 30, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 3,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Photography</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute right-0 z-10 p-4 bg-white rounded-lg shadow-lg top-20"
                initial={{ x: 50, y: 40, opacity: 0 }}
                animate={{ x: 30, y: 70, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 1.0,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 4,
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
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Coding</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute z-10 p-4 bg-white rounded-lg shadow-lg bottom-10 left-1/4"
                initial={{ x: 0, y: 50, opacity: 0 }}
                animate={{ x: 0, y: 20, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 1.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 3.5,
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
                  <span className="font-medium">Cooking</span>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute z-10 p-4 bg-white rounded-lg shadow-lg bottom-10 right-4"
                initial={{ x: 100, y: 50, opacity: 0 }}
                animate={{ x: 30, y: 20, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 1.4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 3.5,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
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
                        d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Writing</span>
                </div>
              </motion.div>

              {/* <img 
                src="/api/placeholder/600/500" 
                alt="Skills sharing platform illustration" 
                className="z-0 w-full h-auto rounded-lg shadow-2xl"
              /> */}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto"
        >
          <path
            fill="#F3F4F6"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
