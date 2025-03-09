
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
  
  // Cleanup function to stop camera stream
  const stopCameraStream = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [cameraStream]);

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Stop previous stream if it exists
      stopCameraStream();
      
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
        setCameraStream(stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Set up play promise handling
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setCameraActive(true);
                // Check if torch is supported
                const videoTrack = stream.getVideoTracks()[0];
                const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
                setTorchSupported(!!capabilities.torch);
                
                // Reset torch state when changing camera
                setTorchActive(false);
                
                toast.success(`Camera activated (${facingMode === "user" ? "Front" : "Back"})`);
              })
              .catch(err => {
                console.error("Error playing video:", err);
                toast.error("Failed to start camera stream");
              });
          }
        }
      } else {
        toast.error("Camera not supported on this device or browser");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, stopCameraStream]);

  // Initialize camera on component mount and when facingMode changes
  useEffect(() => {
    startCamera();
    
    // Cleanup: stop camera when component unmounts
    return () => {
      stopCameraStream();
    };
  }, [facingMode, startCamera, stopCameraStream]);

  // Toggle torch/flashlight (if available)
  useEffect(() => {
    if (!cameraStream || !torchSupported) return;
    
    const videoTrack = cameraStream.getVideoTracks()[0];
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
  }, [torchActive, cameraStream, torchSupported]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const toggleTorch = () => {
    if (!torchSupported) {
      toast.error("Flashlight not supported on this device");
      return;
    }
    setTorchActive(prev => !prev);
  };

  const toggleMode = () => {
    setMode(prev => prev === "photo" ? "barcode" : "photo");
    toast.info(mode === "photo" 
      ? "Switched to barcode scanning mode" 
      : "Switched to photo mode");
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
      
      if (!context) {
        toast.error("Could not get canvas context");
        return;
      }
      
      try {
        // Set canvas dimensions to match the video
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image data URL
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
        
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
    } else {
      toast.error("Camera is not ready");
    }
  };

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
    capturePhoto
  };
}
