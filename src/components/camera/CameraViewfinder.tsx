
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
      
      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      
      {/* Composition grid overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/40" />
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
            {/* Barcode scanner frame */}
            <div className="relative w-4/5 max-w-xs aspect-[3/2] border-2 border-white/80 rounded-md flex items-center justify-center bg-black/20 backdrop-blur-sm shadow-lg overflow-hidden">
              {/* Barcode lines - actual barcode looking design */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full flex flex-row items-center">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const isThick = Math.random() > 0.6;
                    const isShort = Math.random() > 0.7;
                    return (
                      <div 
                        key={i} 
                        className={`h-${isShort ? '70' : '100'}% mx-px ${isThick ? 'w-1.5' : 'w-0.5'} bg-white/80`}
                      />
                    );
                  })}
                </div>
              </div>
              
              {/* Scanning line */}
              <motion.div 
                className="absolute w-full h-1 bg-fridge-500 shadow-[0_0_8px_2px_rgba(79,209,127,0.5)]"
                initial={{ top: "20%" }}
                animate={{ top: "80%" }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              {/* Animated frame */}
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
              
              {/* Corner elements for barcode scanner */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-fridge-400" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-fridge-400" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-fridge-400" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-fridge-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CameraViewfinder;
