
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface CameraViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isBarcodeMode: boolean;
  showFocusRing: boolean;
  showGrid: boolean;
}

const CameraViewfinder = ({ 
  videoRef, 
  isBarcodeMode, 
  showFocusRing, 
  showGrid 
}: CameraViewfinderProps) => {
  return (
    <div className="relative h-full w-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="h-full w-full"
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      </motion.div>
      
      {/* Composition grid overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/30" />
            ))}
          </div>
        </div>
      )}
      
      {/* Focus indicator */}
      <AnimatePresence>
        {showFocusRing && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-24 h-24 rounded-full border-2 border-white/80 flex items-center justify-center">
              <motion.div 
                className="w-20 h-20 rounded-full border-2 border-white/60"
                animate={{ scale: [1, 0.8, 1] }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center">
                  <motion.div 
                    className="w-4 h-4 bg-white/80 rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Barcode scanning overlay */}
      <AnimatePresence>
        {isBarcodeMode && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-4/5 max-w-xs aspect-[3/2] border-2 border-white/80 rounded-md flex items-center justify-center">
              <motion.div 
                className="absolute w-full h-0.5 bg-fridge-500"
                initial={{ top: "20%" }}
                animate={{ top: "80%" }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div
                className="absolute inset-0 border-4 border-fridge-500/50 rounded-md"
                animate={{ 
                  boxShadow: ['0 0 0 0 rgba(79, 209, 127, 0)', '0 0 0 4px rgba(79, 209, 127, 0.3)'],
                  scale: [0.98, 1.01]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <div className="absolute w-12 h-12 border-2 border-fridge-400 rounded-full flex items-center justify-center">
                <motion.div
                  className="w-8 h-8 border-2 border-fridge-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CameraViewfinder;
