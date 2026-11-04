import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnimatedNavLink = ({ 
  to, 
  children, 
  className = "",
  activeClassName = "text-green-600 bg-green-50",
  hoverClassName = "text-green-600 bg-green-50",
  icon: Icon,
  badge,
  variant = "default" // default, pill, underline, glow
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClasses = "relative font-medium transition-all duration-300 flex items-center";
  
  const variantClasses = {
    default: "px-3 py-2 rounded-md",
    pill: "px-4 py-2 rounded-full",
    underline: "px-3 py-2 border-b-2 border-transparent",
    glow: "px-4 py-2 rounded-lg"
  };

  // Add active state classes for better visibility
  const getActiveClasses = () => {
    if (!isActive) return "";
    
    switch (variant) {
      case "glow":
        return "!bg-green-600 !text-white !font-bold !shadow-lg !border-2 !border-white";
      case "pill":
        return "bg-green-100 text-green-700";
      case "underline":
        return "text-green-600 border-green-600";
      default:
        return "bg-green-50 text-green-600";
    }
  };

  // Add inline styles for active state to ensure they override any conflicting styles
  const getActiveInlineStyles = () => {
    if (!isActive) return {};
    
    switch (variant) {
      case "glow":
        return {
          backgroundColor: '#16a34a', // green-600
          color: '#ffffff',
          fontWeight: '700',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '2px solid #ffffff'
        };
      default:
        return {};
    }
  };

  const hoverVariants = {
    default: {
      scale: 1.05,
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      color: "rgb(34, 197, 94)",
      transition: { duration: 0.2 }
    },
    pill: {
      scale: 1.08,
      backgroundColor: "rgba(34, 197, 94, 0.15)",
      boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
      y: -2,
      transition: { duration: 0.2 }
    },
    underline: {
      borderBottomColor: "rgb(34, 197, 94)",
      color: "rgb(34, 197, 94)",
      y: -1,
      transition: { duration: 0.2 }
    },
    glow: {
      scale: 1.05,
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      boxShadow: "0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)",
      color: "rgb(34, 197, 94)",
      transition: { duration: 0.3 }
    }
  };

  const activeVariants = {
    default: {
      backgroundColor: "rgba(34, 197, 94, 0.15)",
      color: "rgb(34, 197, 94)",
      scale: 1.02
    },
    pill: {
      backgroundColor: "rgba(34, 197, 94, 0.2)",
      color: "rgb(34, 197, 94)",
      boxShadow: "0 2px 10px rgba(34, 197, 94, 0.3)"
    },
    underline: {
      borderBottomColor: "rgb(34, 197, 94)",
      color: "rgb(34, 197, 94)"
    },
    glow: {
      backgroundColor: "rgb(34, 197, 94)", // Solid green background
      boxShadow: "0 0 15px rgba(34, 197, 94, 0.5), 0 2px 8px rgba(0, 0, 0, 0.2)",
      color: "rgb(255, 255, 255)", // White text for better contrast
      fontWeight: "700", // Extra bold text for active state
      border: "2px solid rgb(255, 255, 255)" // White border for definition
    }
  };

  const linkClasses = `${baseClasses} ${variantClasses[variant]} ${getActiveClasses()} ${className}`;

  return (
    <motion.div
      className="relative"
      whileHover={hoverVariants[variant]}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link to={to} className={linkClasses} style={getActiveInlineStyles()}>
        {Icon && (
          <motion.div
            className="mr-2"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="h-4 w-4" />
          </motion.div>
        )}
        <motion.span
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        {badge && (
          <motion.span
            className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {badge}
          </motion.span>
        )}
        
        {/* Animated underline for active state */}
        {variant === "underline" && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-green-600"
            initial={{ width: 0 }}
            animate={{ width: isActive ? "100%" : 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Glow effect background */}
        {variant === "glow" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-lg opacity-0 -z-10"
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export default AnimatedNavLink;

