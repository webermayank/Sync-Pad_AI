import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FallingTextProps {
  text: string;
}

export const FallingText: React.FC<FallingTextProps> = ({ text }) => {
  const chars = text.split("");

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: -200, opacity: 0, rotate: -45 },
    visible: { y: 0, opacity: 1, rotate: 0 },
  };

  return (
    <motion.div
      className="falling-text-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          className="falling-text-char"
          variants={itemVariants}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};
