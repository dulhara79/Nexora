import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center w-screen min-h-screen p-5 bg-gradient-to-br from-purple-600 via-blue-600 to-green-500">
      <div className="relative w-full max-w-6xl mx-auto text-center">
        {" "}
        {/* Added container constraints */}
        {/* Animated 404 Text */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="flex justify-center gap-4 font-bold text-white text-9xl">
            {[4, 0, 4].map((num, index) => (
              <motion.span
                key={index}
                animate={{ y: [0, -30, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                {num}
              </motion.span>
            ))}
          </h1>
        </motion.div>
        {/* Animated Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="mb-4 text-3xl font-semibold text-white">
            Oops! Page Lost in Space
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-white/90">
            The knowledge you're seeking has drifted into the cosmic void. Let's
            navigate back to familiar territory together.
          </p>

          {/* Animated SVG */}
          <motion.svg
            viewBox="0 0 200 200"
            className="w-64 h-64 mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <path
              fill="#FFD700"
              d="M40,-74.3C52.2,-69.1,62.6,-59.3,69.8,-47.5C77,-35.7,81.1,-22,83.1,-7.6C85.1,6.8,85.1,22,78.4,33.1C71.7,44.2,58.4,51.2,45.3,57.1C32.2,63,19.1,67.9,3.7,62.9C-11.7,57.9,-25.3,43.1,-37.7,33.3C-50.1,23.5,-61.3,18.7,-69.6,9.4C-77.9,0.2,-83.3,-13.5,-76.7,-21.9C-70.1,-30.4,-51.4,-33.5,-37.3,-37.8C-23.3,-42.1,-13.6,-47.5,-0.7,-46.6C12.2,-45.7,24.4,-38.4,40,-74.3Z"
              transform="translate(100 100)"
            />
          </motion.svg>

          {/* Back Home Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="inline-block px-8 py-3 text-lg font-semibold text-blue-600 transition-all duration-200 bg-white rounded-full hover:bg-opacity-90"
            >
              Beam Me Home
            </Link>
          </motion.div>
        </motion.div>
        {/* Floating Stars - Wrap in container */}
        <div className="fixed inset-0 pointer-events-none">
          {" "}
          {/* Changed to fixed positioning */}
          {[...Array(20)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
