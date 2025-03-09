
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
    let timer: ReturnType<typeof setTimeout>;
    
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
    timer = setTimeout(() => {
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
  }, [facingMode, stream]);
  
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
