import React from 'react';
import { motion } from 'framer-motion';

const AuthButton = ({ children, Icon, onClick, href, primary, fullWidth, isDarkMode }) => {
  // Define styling based on props
  const baseClasses = "flex items-center justify-center gap-2 rounded-lg transition-all duration-300";
  const widthClass = fullWidth ? "w-full" : "";
  
  // Dynamic styling based on theme and primary/secondary status
  let variantClasses = "";
  if (primary) {
    variantClasses = isDarkMode
      ? "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5"
      : "bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5";
  } else {
    variantClasses = isDarkMode
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 px-4 py-2"
      : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 px-4 py-2";
  }

  // Combine all classes
  const buttonClasses = `${baseClasses} ${widthClass} ${variantClasses}`;

  // Animation variants
  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.95 }
  };

  // Return link or button based on presence of href
  if (href) {
    return (
      <motion.a
        href={href}
        className={buttonClasses}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
      >
        {Icon && <Icon size={18} />}
        <span>{children}</span>
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={buttonClasses}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </motion.button>
  );
};

export default AuthButton;