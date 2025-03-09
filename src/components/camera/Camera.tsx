
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCamera } from "@/hooks/useCamera";
import CameraLoading from "./CameraLoading";
import CameraError from "./CameraError";
import CameraControls from "./CameraControls";

interface CameraProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  
  const {
    videoRef,
    canvasRef,
    facingMode,
    isLoading,
    error,
    toggleCamera,
    capturePhoto
  } = useCamera();
  
  // Handle photo capture
  const handleCapturePhoto = async () => {
    setIsCapturing(true);
    const imageSrc = await capturePhoto();
    setIsCapturing(false);
    
    if (imageSrc) {
      onCapture(imageSrc);
    }
  };
  
  // Render loading state
  if (isLoading) {
    return <CameraLoading />;
  }
  
  // Render error state
  if (error) {
    return (
      <CameraError 
        error={error}
        facingMode={facingMode}
        onToggleCamera={toggleCamera}
        onClose={onClose}
      />
    );
  }
  
  // Render camera UI
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black flex flex-col" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Camera view */}
      <div className="relative flex-1 overflow-hidden">
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover" 
          autoPlay 
          playsInline 
          muted
        />
        
        {/* Focus guides */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-[40px] border-black/50 box-border"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4/5 h-4/5 border-2 border-white/60 rounded-lg"></div>
          </div>
        </div>
        
        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <CameraControls
        onToggleCamera={toggleCamera}
        onCapture={handleCapturePhoto}
        onClose={onClose}
        isCapturing={isCapturing}
      />
    </motion.div>
  );
};

export default Camera;
