import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * ScrollReveal component - Animates children when they enter the viewport
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.direction - Animation direction ('up', 'down', 'left', 'right')
 * @param {number} props.distance - Distance to travel in pixels
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.delay - Animation delay in seconds
 * @param {string} props.ease - Animation easing function
 * @param {number} props.threshold - Viewport threshold to trigger animation (0-1)
 * @param {boolean} props.once - Whether to trigger animation only once
 * @param {Object} props.className - Additional CSS classes
 */
const ScrollReveal = ({
  children,
  direction = 'up',
  distance = 50,
  duration = 0.6,
  delay = 0,
  ease = 'easeOut',
  threshold = 0.1,
  once = true,
  className = '',
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  // Map directions to x/y values
  const getDirectionValues = () => {
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: distance };
    }
  };

  const { x, y } = getDirectionValues();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      transition={{ duration, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScrollRevealGroup component - For staggered animations of child elements
 */
export const ScrollRevealGroup = ({
  children,
  staggerDelay = 0.1,
  containerDelay = 0,
  threshold = 0.1,
  once = true,
  className = '',
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: containerDelay,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * RevealItem component - Child items for the ScrollRevealGroup
 */
export const RevealItem = ({
  children,
  direction = 'up',
  distance = 30,
  duration = 0.5,
  className = '',
}) => {
  // Map directions to x/y values
  const getDirectionValues = () => {
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: distance };
    }
  };

  const { x, y } = getDirectionValues();

  const itemVariants = {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

/**
 * FadeIn component - Simple fade-in animation
 */
export const FadeIn = ({
  children,
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  once = true,
  className = '',
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScaleIn component - Scale and fade in animation
 */
export const ScaleIn = ({
  children,
  duration = 0.6,
  delay = 0,
  startScale = 0.9,
  threshold = 0.1,
  once = true,
  className = '',
}) => {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: startScale }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: startScale }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;