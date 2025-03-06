
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

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Stop previous stream if it exists
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({
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
          setCameraStream(stream);
          
          // Check if torch is supported
          const videoTrack = stream.getVideoTracks()[0];
          const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
          setTorchSupported(!!capabilities.torch);
          
          // Reset torch state when changing camera
          setTorchActive(false);
          
          toast.success(`Camera activated (${facingMode === "user" ? "Front" : "Back"})`);
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
  }, [facingMode, cameraStream]);

  useEffect(() => {
    startCamera();
    
    // Cleanup: stop camera when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, startCamera]);

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
