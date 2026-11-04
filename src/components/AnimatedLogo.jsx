import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const AnimatedLogo = () => {
  const text = "Ayur-Seva";
  const [animationKey, setAnimationKey] = useState(0);
  
  // Enhanced animation variants for more pronounced pop effect
  const letterVariants = {
    initial: { 
      scale: 1,
      y: 0,
      rotateZ: 0
    },
    layeredPop: { 
      scale: [1, 1.5, 1],
      y: [0, -12, 0],
      rotateZ: [0, 5, 0],
      transition: {
        duration: 0.7,
        ease: [0.68, -0.55, 0.265, 1.55], // Bouncy easing
        times: [0, 0.6, 1]
      }
    },
    hover: { 
      scale: [1, 1.4, 1],
      y: [0, -10, 0],
      rotateZ: [0, -3, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  // Container variants for pronounced staggered animation
  const containerVariants = {
    initial: {},
    layeredPop: {
      transition: {
        staggerChildren: 0.12, // Slower stagger for more visible layered effect
        delayChildren: 0.3
      }
    },
    hover: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0
      }
    }
  };

  // Trigger layered pop animation periodically
  useEffect(() => {
    const triggerAnimation = () => {
      setAnimationKey(prev => prev + 1);
    };

    // Initial animation
    const initialTimer = setTimeout(triggerAnimation, 500);
    
    // Repeat animation every 4 seconds
    const interval = setInterval(triggerAnimation, 4000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
      <motion.div
        whileHover={{ 
          rotate: [0, -15, 15, -10, 0],
          scale: 1.15
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ 
          rotate: { duration: 0.6 },
          scale: { duration: 0.2 }
        }}
        className="relative"
        animate={{
          rotate: [0, 8, -8, 0],
          scale: [1, 1.1, 1]
        }}
        key={`icon-${animationKey}`}
      >
        <Leaf className="h-8 w-8 text-green-600" />
        
        {/* Enhanced glow effect */}
        <motion.div
          className="absolute inset-0 h-8 w-8"
          animate={{
            boxShadow: [
              "0 0 0px rgba(34, 197, 94, 0)",
              "0 0 15px rgba(34, 197, 94, 0.4)",
              "0 0 0px rgba(34, 197, 94, 0)"
            ]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      <motion.div 
        className="text-2xl font-bold text-green-800"
        variants={containerVariants}
        initial="initial"
        animate="layeredPop"
        whileHover="hover"
        key={`text-${animationKey}`}
      >
        {text.split('').map((letter, index) => (
          <motion.span
            key={`${letter}-${index}-${animationKey}`}
            variants={letterVariants}
            whileHover="hover"
            className={`inline-block ${
              index >= 5 ? 'text-green-600' : 'text-green-800'
            }`}
            style={{ 
              transformOrigin: 'center bottom',
              display: 'inline-block',
              minWidth: letter === '-' ? '0.3em' : 'auto',
              fontWeight: '800' // Extra bold for more impact
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.div>
    </Link>
  );
};

export default AnimatedLogo;

