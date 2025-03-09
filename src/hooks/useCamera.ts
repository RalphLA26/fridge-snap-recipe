
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface UseCameraOptions {
  onError?: (error: Error) => void;
  facingMode?: "user" | "environment";
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  error: Error | null;
  isLoading: boolean;
  switchCamera: () => void;
  takePhoto: () => Promise<string | null>;
}

export function useCamera({
  onError,
  facingMode = "environment",
}: UseCameraOptions = {}): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFacingMode, setCurrentFacingMode] = useState<"user" | "environment">(facingMode);

  const requestCameraPermission = async () => {
    setIsLoading(true);
    try {
      const constraints = {
        video: {
          facingMode: currentFacingMode,
          // Request high quality for better results
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      // Stop any existing streams
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
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
      
      // Get the image as a data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85); // Good quality but not too large
      
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
  }, [currentFacingMode]);

  return {
    videoRef,
    stream,
    error,
    isLoading,
    switchCamera,
    takePhoto,
  };
}
