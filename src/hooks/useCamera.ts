
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

type FacingMode = "user" | "environment";

interface UseCameraOptions {
  initialFacingMode?: FacingMode;
}

export const useCamera = ({ initialFacingMode = "environment" }: UseCameraOptions = {}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>(initialFacingMode);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize camera
  useEffect(() => {
    let mounted = true;
    
    const startCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Clean up any existing stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        console.log(`Attempting to access camera with facing mode: ${facingMode}`);
        
        // Get user media with specified facing mode
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (!mounted) return;
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // Wait for video to be ready to play
          videoRef.current.onloadedmetadata = () => {
            if (!mounted || !videoRef.current) return;
            
            videoRef.current.play()
              .then(() => {
                console.log("Camera stream playing successfully");
                setIsLoading(false);
              })
              .catch(err => {
                console.error("Failed to play camera stream:", err);
                setError("Camera stream failed to start");
              });
          };
        } else {
          throw new Error("Video element is not available");
        }
      } catch (err) {
        if (!mounted) return;
        
        console.error("Camera initialization error:", err);
        setIsLoading(false);
        
        const message = err instanceof Error ? err.message : "Unknown camera error";
        setError(message);
        
        if (err instanceof DOMException) {
          if (err.name === 'NotAllowedError') {
            setError("Camera access denied. Please check your permissions.");
          } else if (err.name === 'NotFoundError') {
            setError("No camera found on this device.");
          } else if (err.name === 'NotReadableError' || err.name === 'AbortError') {
            setError("Camera is already in use by another application.");
          }
        }
      }
    };
    
    startCamera();
    
    return () => {
      mounted = false;
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);
  
  // Toggle camera between front and back
  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };
  
  // Take a photo
  const capturePhoto = async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      console.error("Cannot capture photo: video or canvas refs not ready");
      return null;
    }
    
    try {
      // Create flash effect
      const flashElement = document.createElement('div');
      flashElement.className = 'fixed inset-0 bg-white z-50';
      document.body.appendChild(flashElement);
      
      // Wait a moment for flash effect
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error("Could not get canvas context");
      }
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to image data URL (JPEG with 85% quality)
      const imageSrc = canvas.toDataURL('image/jpeg', 0.85);
      
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Remove flash effect
      setTimeout(() => {
        document.body.removeChild(flashElement);
      }, 150);
      
      return imageSrc;
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast.error("Failed to capture photo");
      return null;
    }
  };
  
  return {
    videoRef,
    canvasRef,
    facingMode,
    isLoading,
    error,
    toggleCamera,
    capturePhoto
  };
};
