
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
      className="relative rounded-full h-20 w-20 bg-white disabled:bg-gray-400 flex items-center justify-center shadow-xl transition-transform duration-200 overflow-hidden group"
    >
      {/* Outer ring with pulsing animation */}
      <motion.div 
        className="absolute inset-0 rounded-full border-4 border-white/30"
        animate={{ 
          boxShadow: ['0 0 0 0 rgba(255, 255, 255, 0)', '0 0 0 8px rgba(255, 255, 255, 0.1)'],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Inner circle with subtle animation */}
      <motion.div 
        className="rounded-full h-16 w-16 border-2 border-fridge-400 absolute"
        animate={{ 
          scale: [1, 1.05, 1],
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
      
      {/* Shutter button */}
      <div className="h-14 w-14 bg-fridge-600 rounded-full flex items-center justify-center shadow-inner">
        <div className="h-2 w-2 bg-white rounded-full"></div>
      </div>
    </motion.button>
  );
};

export default CaptureButton;
