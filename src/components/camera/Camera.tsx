
import React, { useEffect, useState } from "react";
import { Loader2, Camera as CameraIcon, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface CameraProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  // Initialize camera when component mounts or facingMode changes
  useEffect(() => {
    let mounted = true;
    const initCamera = async () => {
      try {
        // Reset state for new camera init
        setIsLoading(true);
        setError(null);
        
        // Clean up any existing streams
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Try different constraints in order of preference
        const constraintsOptions = [
          // First try: Preferred facing mode with lower resolution
          {
            video: {
              facingMode: facingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          },
          // Second try: Preferred facing mode with any resolution
          {
            video: { facingMode: facingMode },
            audio: false
          },
          // Last resort: Any camera
          {
            video: true,
            audio: false
          }
        ];
        
        let newStream = null;
        let lastError = null;
        
        // Try each constraint option until one works
        for (const constraints of constraintsOptions) {
          try {
            console.log("Attempting to access camera with:", constraints);
            newStream = await navigator.mediaDevices.getUserMedia(constraints);
            if (newStream) break;
          } catch (err) {
            console.warn("Camera access failed with constraints:", constraints, err);
            lastError = err;
            // Continue to next constraint option
          }
        }
        
        if (!newStream) {
          throw lastError || new Error("Could not access any camera");
        }
        
        // Only update state if component is still mounted
        if (mounted) {
          setStream(newStream);
          
          // Wait for the video element to be connected to the stream
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
            await new Promise<void>((resolve) => {
              if (!videoRef.current) return resolve();
              
              const onCanPlay = () => {
                resolve();
                videoRef.current?.removeEventListener('canplay', onCanPlay);
              };
              
              if (videoRef.current.readyState >= 2) {
                resolve();
              } else {
                videoRef.current.addEventListener('canplay', onCanPlay);
              }
            });
            
            videoRef.current.play();
            setIsLoading(false);
          } else {
            throw new Error("Video element not available");
          }
        }
      } catch (err) {
        console.error("Camera initialization error:", err);
        
        if (mounted) {
          setIsLoading(false);
          const errorMessage = err instanceof Error ? err.message : "Unknown camera error";
          
          // Provide more specific error messages
          if (err instanceof DOMException) {
            if (err.name === 'NotAllowedError') {
              setError("Camera access denied. Please check your permissions.");
            } else if (err.name === 'NotFoundError') {
              setError("No camera found on this device.");
            } else if (err.name === 'NotReadableError' || err.name === 'AbortError') {
              setError("Camera is already in use by another application.");
            } else {
              setError(`Camera error: ${err.name}`);
            }
          } else {
            setError(errorMessage);
          }
          
          // Also show toast for better visibility
          toast.error("Camera initialization failed");
        }
      }
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initCamera();
    }, 500);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
      
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);
  
  // Toggle between front and back camera
  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };
  
  // Capture photo
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;
    
    try {
      setIsCapturing(true);
      
      // Create flash effect
      const flashElement = document.createElement('div');
      flashElement.className = 'fixed inset-0 bg-white z-50';
      document.body.appendChild(flashElement);
      
      // Capture frame after a short delay (lets the flash be visible)
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (!context) throw new Error("Could not get canvas context");
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to image data URL
      const imageSrc = canvas.toDataURL('image/jpeg', 0.85);
      
      // Trigger vibration if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Remove flash effect
      setTimeout(() => {
        document.body.removeChild(flashElement);
        setIsCapturing(false);
        
        // Send captured image back to parent
        onCapture(imageSrc);
      }, 150);
      
    } catch (error) {
      setIsCapturing(false);
      console.error("Error capturing photo:", error);
      toast.error("Failed to capture photo");
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-fridge-400 mb-4"></div>
        <p className="text-white text-xl font-medium mb-2">Initializing camera...</p>
        <p className="text-gray-400 text-sm text-center">Please allow camera permissions if prompted</p>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-white text-xl mb-4 text-center font-medium">{error}</h2>
        <div className="space-y-3 w-full max-w-xs">
          <Button 
            onClick={toggleCamera} 
            className="w-full bg-fridge-600 hover:bg-fridge-700"
          >
            <CameraIcon className="mr-2 h-4 w-4" />
            Try {facingMode === "user" ? "Back" : "Front"} Camera
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-700 text-white hover:bg-gray-800"
          >
            Go Back
          </Button>
        </div>
      </div>
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
          onClick={toggleCamera}
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
              onClick={capturePhoto}
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
    </motion.div>
  );
};

export default Camera;
