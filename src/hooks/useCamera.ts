
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface UseCameraOptions {
  initialFacingMode?: "user" | "environment";
}

export const useCamera = ({ initialFacingMode = "environment" }: UseCameraOptions = {}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(initialFacingMode);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
          
          // Important: We need to make sure the video element is available
          // before setting srcObject
          if (videoRef.current) {
            // Set the stream to the video element
            videoRef.current.srcObject = newStream;
            
            // Wait for the video to be ready
            videoRef.current.onloadedmetadata = () => {
              if (mounted && videoRef.current) {
                videoRef.current.play().catch(err => {
                  console.error("Error playing video:", err);
                  setError("Failed to play video stream");
                });
                setIsLoading(false);
              }
            };
          } else {
            console.warn("Video element not available yet, will retry");
            // Set a flag to retry but don't throw error immediately
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
    
    // Initialize camera immediately (no delay)
    initCamera();
    
    return () => {
      mounted = false;
      
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
  const capturePhoto = async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current || !stream) return null;
    
    try {
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
    stream,
    facingMode,
    isLoading,
    error,
    toggleCamera,
    capturePhoto,
  };
};
