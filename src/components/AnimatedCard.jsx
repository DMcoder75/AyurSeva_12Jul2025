import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = "",
  hoverScale = 1.05,
  hoverY = -5,
  tapScale = 0.98,
  duration = 0.3
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale: hoverScale, 
        y: hoverY,
        transition: { duration: duration, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: tapScale,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;

