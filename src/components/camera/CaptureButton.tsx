
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
      <div className="rounded-full h-18 w-18 border-2 border-gray-300 absolute inset-1" />
      <motion.div 
        className="absolute inset-0 bg-fridge-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileTap={{ scale: 1.2, opacity: 0.3 }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.div 
          className="w-10 h-10 border-2 border-white/30 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.button>
  );
};

export default CaptureButton;
