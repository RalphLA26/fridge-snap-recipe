
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, XCircle, FlipHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CameraProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const CameraComponent = ({ onCapture, onClose }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  // Initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            audio: false
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        } else {
          toast.error("Camera not supported on this device or browser");
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast.error("Failed to access camera. Please check permissions.");
      }
    };

    startCamera();

    // Cleanup: stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const captureWithCountdown = () => {
    setCountdown(3);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          capturePhoto();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    // Trigger flash effect
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame onto the canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to image data URL
      const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
      
      // Trigger vibration if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Send image back to parent component
      onCapture(imageSrc);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black flex flex-col" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-1 overflow-hidden">
        {/* Camera viewfinder */}
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover" 
          autoPlay 
          playsInline 
          muted
        />
        
        {/* Focus frame */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-[40px] border-black/50 box-border"></div>
        </div>
        
        {/* Canvas for capturing photos (hidden) */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Flash overlay */}
        {flash && (
          <div className="absolute inset-0 bg-white z-10 animate-fade-out"></div>
        )}
        
        {/* Countdown display */}
        {countdown && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-white text-9xl font-bold"
            >
              {countdown}
            </motion.div>
          </div>
        )}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="icon" 
            className="bg-black/20 text-white hover:bg-black/40 rounded-full h-12 w-12"
          >
            <XCircle className="h-8 w-8" />
          </Button>
          
          <Button
            onClick={toggleCamera}
            variant="ghost"
            size="icon"
            className="bg-black/20 text-white hover:bg-black/40 rounded-full h-12 w-12"
            disabled={countdown !== null}
          >
            <FlipHorizontal className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Bottom controls */}
      <div className="bg-black p-6 flex justify-center">
        <Button 
          onClick={captureWithCountdown} 
          variant="ghost" 
          size="icon" 
          className="bg-white h-16 w-16 rounded-full hover:bg-gray-200"
          disabled={!cameraActive || countdown !== null}
        >
          <Camera className="h-8 w-8 text-black" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CameraComponent;
