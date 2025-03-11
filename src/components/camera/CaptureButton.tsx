
import React from "react";
import { motion } from "framer-motion";

interface CaptureButtonProps {
  onCapture: () => void;
  disabled?: boolean;
}

const CaptureButton = ({ onCapture, disabled }: CaptureButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={onCapture}
      disabled={disabled}
      className="relative rounded-full h-20 w-20 bg-white disabled:bg-gray-400 flex items-center justify-center shadow-lg transition-transform duration-200 overflow-hidden group"
    >
      {/* Inner circle with pulse animation */}
      <motion.div 
        className="rounded-full h-16 w-16 border-2 border-fridge-400 absolute"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
      
      {/* Active state highlight */}
      <motion.div 
        className="absolute inset-0 bg-fridge-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileTap={{ scale: 1.2, opacity: 0.3 }}
      />
      
      {/* Center dot */}
      <div className="h-12 w-12 bg-fridge-600 rounded-full flex items-center justify-center">
        <div className="h-2 w-2 bg-white rounded-full"></div>
      </div>
    </motion.button>
  );
};

export default CaptureButton;
