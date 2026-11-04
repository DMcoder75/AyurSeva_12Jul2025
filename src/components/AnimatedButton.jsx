import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  className = "",
  onClick,
  type = "button",
  disabled = false,
  variant = "primary" // primary, secondary, outline
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500"
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <motion.button
      className={buttonClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default AnimatedButton;

