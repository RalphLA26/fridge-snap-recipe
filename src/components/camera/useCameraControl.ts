
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ExtendedMediaTrackCapabilities, ExtendedMediaTrackConstraintSet } from "./types";
import { scanBarcode, lookupProduct } from "@/lib/barcodeScanner";

export default function useCameraControl(onCapture: (imageSrc: string) => void) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [mode, setMode] = useState<"photo" | "barcode">("photo");
  const [torchActive, setTorchActive] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Stop previous stream if it exists
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = {
          video: {
            facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
          // Ensure video element is ready
          videoRef.current.srcObject = null;
          videoRef.current.srcObject = stream;
          
          // Handle video playback
          try {
            await videoRef.current.play();
            setCameraActive(true);
            setCameraStream(stream);
            
            // Check if torch is supported
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
              const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
              setTorchSupported(!!capabilities.torch);
              // Reset torch state when changing camera
              setTorchActive(false);
            }
            
            toast.success(`Camera activated (${facingMode === "user" ? "Front" : "Back"})`);
          } catch (err) {
            console.error("Error playing video:", err);
            // Don't show error toast here as it might be due to user navigating away
          }
        }
      } else {
        toast.error("Camera not supported on this device or browser");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
      setCameraActive(false);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  // Cleanup function to stop all tracks
  const stopAllTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.error("Error stopping track:", e);
        }
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
    setCameraStream(null);
  }, []);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopAllTracks();
    };
  }, [stopAllTracks]);

  // Toggle torch/flashlight (if available)
  useEffect(() => {
    if (!streamRef.current || !torchSupported) return;
    
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      try {
        const constraints = {
          advanced: [{ torch: torchActive } as ExtendedMediaTrackConstraintSet]
        };
        videoTrack.applyConstraints(constraints)
          .then(() => {
            toast.success(torchActive ? "Flashlight turned on" : "Flashlight turned off");
          })
          .catch(err => {
            console.error("Error toggling torch:", err);
            toast.error("Failed to toggle flashlight");
            setTorchActive(false);
          });
      } catch (err) {
        console.error("Error toggling torch:", err);
      }
    }
  }, [torchActive, torchSupported]);

  const toggleCamera = useCallback(() => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    
    // Need to restart camera after changing facing mode
    setTimeout(() => {
      startCamera();
    }, 300);
  }, [facingMode, startCamera]);

  const toggleTorch = useCallback(() => {
    if (!torchSupported) {
      toast.error("Flashlight not supported on this device");
      return;
    }
    setTorchActive(prev => !prev);
  }, [torchSupported]);

  const toggleMode = useCallback(() => {
    setMode(prev => {
      const newMode = prev === "photo" ? "barcode" : "photo";
      toast.info(prev === "photo" 
        ? "Switched to barcode scanning mode" 
        : "Switched to photo mode");
      return newMode;
    });
  }, []);

  const captureWithCountdown = useCallback(() => {
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
  }, []);

  const capturePhoto = useCallback(() => {
    // Trigger flash effect
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !cameraActive) {
      toast.error("Camera is not ready");
      return;
    }
    
    try {
      const context = canvas.getContext('2d');
      
      if (!context) {
        toast.error("Could not get canvas context");
        return;
      }
      
      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to image data URL
      const imageSrc = canvas.toDataURL('image/jpeg', 0.85);
      
      // Trigger vibration if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      if (mode === "barcode") {
        // Process barcode
        toast.promise(
          scanBarcode(imageSrc)
            .then(barcode => {
              const product = lookupProduct(barcode);
              if (product) {
                // Add to ingredients
                const existingIngredientsJson = localStorage.getItem("fridgeIngredients");
                const existingIngredients = existingIngredientsJson 
                  ? JSON.parse(existingIngredientsJson) 
                  : [];
                
                if (!existingIngredients.includes(product.name)) {
                  existingIngredients.push(product.name);
                  localStorage.setItem("fridgeIngredients", JSON.stringify(existingIngredients));
                  return `Added ${product.name} to your ingredients`;
                } else {
                  return `${product.name} is already in your ingredients`;
                }
              } else {
                throw new Error("Product not found in database");
              }
            }),
          {
            loading: 'Scanning barcode...',
            success: (message) => message,
            error: (error) => error.message,
          }
        );
      } else {
        // Send image back to parent component for ingredient detection
        onCapture(imageSrc);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast.error("Failed to capture photo");
    }
  }, [cameraActive, mode, onCapture]);

  return {
    videoRef,
    canvasRef,
    cameraActive,
    facingMode,
    countdown,
    flash,
    mode,
    torchActive,
    torchSupported,
    isLoading,
    toggleCamera,
    toggleTorch,
    toggleMode,
    captureWithCountdown,
    capturePhoto,
    startCamera
  };
}
