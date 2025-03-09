
import React from "react";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CameraControlsProps {
  onToggleCamera: () => void;
  onCapture: () => void;
  onClose: () => void;
  isCapturing?: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({ 
  onToggleCamera, 
  onCapture, 
  onClose,
  isCapturing = false
}) => {
  return (
    <>
      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
        <Button 
          onClick={onClose} 
          variant="ghost" 
          size="icon" 
          className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-md rounded-full h-12 w-12"
        >
          <XCircle className="h-8 w-8" />
        </Button>
        
        <Button
          onClick={onToggleCamera}
          variant="ghost"
          size="icon"
          className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-md rounded-full h-12 w-12"
          disabled={isCapturing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M12 10h.01" />
            <path d="M16 10h.01" />
          </svg>
        </Button>
      </div>
      
      {/* Capture button */}
      <div className="bg-black/80 p-6 flex justify-center items-center backdrop-blur-md">
        <AnimatePresence mode="wait">
          {!isCapturing && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={onCapture}
              disabled={isCapturing}
              className="bg-white h-16 w-16 rounded-full flex items-center justify-center shadow-lg relative focus:outline-none"
            >
              <span className="absolute inset-0 rounded-full border-4 border-white"></span>
              <span className="absolute inset-2 rounded-full bg-white"></span>
              {/* Pulsing effect for active state */}
              <span className="absolute -inset-1 rounded-full border border-white/30 animate-ping"></span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CameraControls;
