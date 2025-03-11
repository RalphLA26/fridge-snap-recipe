import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface UseCameraOptions {
  onError?: (error: Error) => void;
  facingMode?: "user" | "environment";
  quality?: "low" | "medium" | "high";
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  error: Error | null;
  isLoading: boolean;
  switchCamera: () => void;
  takePhoto: () => Promise<string | null>;
  setTorchMode: (on: boolean) => void;
}

export function useCamera({
  onError,
  facingMode = "environment",
  quality = "high",
}: UseCameraOptions = {}): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFacingMode, setCurrentFacingMode] = useState<"user" | "environment">(facingMode);

  // Define camera quality constraints based on quality setting
  const getQualityConstraints = () => {
    switch (quality) {
      case "low":
        return {
          width: { ideal: 640 },
          height: { ideal: 480 },
        };
      case "medium":
        return {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        };
      case "high":
      default:
        return {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        };
    }
  };

  const requestCameraPermission = async () => {
    setIsLoading(true);
    try {
      const qualityConstraints = getQualityConstraints();
      
      const constraints = {
        video: {
          facingMode: currentFacingMode,
          ...qualityConstraints,
        },
      };

      // Stop any existing streams
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      console.log("Requesting camera with constraints:", constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      // Get actual camera track settings
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        console.log("Camera capabilities:", videoTrack.getCapabilities());
        console.log("Camera settings:", videoTrack.getSettings());
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(e => {
              console.error("Error playing video:", e);
            });
          }
        };
      }
      
      setError(null);
      console.log("Camera initialized with facing mode:", currentFacingMode);
    } catch (err) {
      console.error("Camera initialization error:", err);
      const cameraError = err instanceof Error ? err : new Error("Failed to access camera");
      setError(cameraError);
      if (onError) {
        onError(cameraError);
      }
      toast.error("Could not access camera. Please check permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchCamera = () => {
    // Toggle facing mode
    setCurrentFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  // Set torch/flash mode
  const setTorchMode = (on: boolean) => {
    if (!stream) return;
    
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;
    
    // Check if torch is supported by attempting to read capabilities
    try {
      const capabilities = videoTrack.getCapabilities();
      
      try {
        // Fix the type error by using a direct constraint approach
        // This is more widely supported across browsers
        videoTrack.applyConstraints({
          // Use 'torch' directly as a constraint
          // TypeScript doesn't recognize 'torch' as a standard constraint,
          // but it's supported by many mobile browsers
          torch: on
        } as MediaTrackConstraints);
        
        toast.success(on ? "Flash turned on" : "Flash turned off");
      } catch (constraintErr) {
        console.error("Error setting torch constraint:", constraintErr);
        toast.error("Flash control is not supported on this device");
      }
    } catch (err) {
      console.error("Error checking torch capabilities:", err);
      toast.error("Flash control is not available");
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    if (!videoRef.current || !stream) {
      toast.error("Camera is not ready");
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      
      // Use the actual video dimensions for best quality
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Could not get canvas context");
      }
      
      // Draw the current video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // For selfie/user mode, flip the image horizontally
      if (currentFacingMode === "user") {
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      }
      
      // Add a subtle vignette effect for aesthetic
      context.fillStyle = 'radial-gradient(circle at center, transparent 65%, rgba(0,0,0,0.3) 100%)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get the image as a data URL (higher quality for better results)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      
      return dataUrl;
    } catch (err) {
      console.error("Error taking photo:", err);
      toast.error("Failed to capture image");
      return null;
    }
  };

  // Initialize camera when component mounts or facing mode changes
  useEffect(() => {
    requestCameraPermission();
    
    // Cleanup function to stop all tracks when unmounting
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentFacingMode, quality]);

  return {
    videoRef,
    stream,
    error,
    isLoading,
    switchCamera,
    takePhoto,
    setTorchMode,
  };
}
