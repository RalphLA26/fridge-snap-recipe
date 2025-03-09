
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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  // Cleanup function to stop camera stream
  const stopCameraStream = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (error) {
          console.error("Error stopping track:", error);
        }
      });
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, [cameraStream]);

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Stop previous stream if it exists
      stopCameraStream();
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser");
      }
      
      // Set a reasonable timeout for camera initialization
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Camera initialization timed out")), 10000);
      });
      
      // Start with more flexible constraints
      const constraints = {
        video: {
          facingMode: facingMode,
          // Use realistic resolutions that are more likely to be supported
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      // Race the camera initialization with a timeout
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia(constraints),
        timeoutPromise
      ]) as MediaStream;
      
      if (!stream || stream.getVideoTracks().length === 0) {
        throw new Error("No video stream available");
      }
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Make sure we've loaded the metadata before playing
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            // Set up play promise handling
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setCameraActive(true);
                  setRetryCount(0); // Reset retry count on success
                  
                  try {
                    // Check if torch is supported
                    const videoTrack = stream.getVideoTracks()[0];
                    if (videoTrack) {
                      const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
                      setTorchSupported(!!capabilities.torch);
                      
                      // Reset torch state when changing camera
                      setTorchActive(false);
                      
                      toast.success(`Camera activated (${facingMode === "user" ? "Front" : "Back"})`);
                    }
                  } catch (error) {
                    console.error("Error checking torch capabilities:", error);
                    setTorchSupported(false);
                  }
                })
                .catch(err => {
                  console.error("Error playing video:", err);
                  toast.error("Failed to start video playback. Try again or check permissions.");
                  stopCameraStream();
                  
                  // Try with front camera if back camera fails
                  if (facingMode === "environment" && retryCount === 0) {
                    setFacingMode("user");
                    setRetryCount(prev => prev + 1);
                  }
                });
            }
          }
        };
        
        // Handle errors during video loading
        videoRef.current.onerror = () => {
          console.error("Video element error");
          toast.error("Video element encountered an error");
          stopCameraStream();
          
          if (retryCount < maxRetries) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              startCamera();
            }, 1000);
          }
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      
      // Provide more specific error messages based on the error
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          toast.error("Camera access denied. Please check your browser permissions.");
        } else if (error.name === 'NotFoundError') {
          toast.error("No camera found on this device.");
        } else if (error.name === 'NotReadableError') {
          toast.error("Camera is already in use by another application.");
        } else {
          toast.error(`Camera error: ${error.message}`);
        }
      } else {
        toast.error(`Failed to access camera: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Try with front camera if back camera fails
      if (facingMode === "environment" && retryCount === 0) {
        setFacingMode("user");
        setRetryCount(prev => prev + 1);
      } else if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          startCamera();
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, stopCameraStream, retryCount, maxRetries]);

  // Initialize camera on component mount and when facingMode changes
  useEffect(() => {
    // Small delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      startCamera();
    }, 300);
    
    // Cleanup: stop camera when component unmounts
    return () => {
      clearTimeout(timer);
      stopCameraStream();
    };
  }, [facingMode, startCamera, stopCameraStream]);

  // Toggle torch/flashlight (if available)
  useEffect(() => {
    if (!cameraStream || !torchSupported) return;
    
    try {
      const videoTrack = cameraStream.getVideoTracks()[0];
      if (videoTrack) {
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
      }
    } catch (err) {
      console.error("Error toggling torch:", err);
      setTorchActive(false);
    }
  }, [torchActive, cameraStream, torchSupported]);

  // Add permission detection
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then(permissionStatus => {
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              startCamera();
            } else if (permissionStatus.state === 'denied') {
              toast.error("Camera permission denied");
              stopCameraStream();
            }
          };
        })
        .catch(error => {
          console.error('Error checking permissions:', error);
        });
    }
  }, [startCamera, stopCameraStream]);

  // Safely toggle camera
  const toggleCamera = useCallback(() => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  }, []);

  // Safely toggle torch
  const toggleTorch = useCallback(() => {
    if (!torchSupported) {
      toast.error("Flashlight not supported on this device");
      return;
    }
    setTorchActive(prev => !prev);
  }, [torchSupported]);

  // Safely toggle mode
  const toggleMode = useCallback(() => {
    setMode(prevMode => {
      const newMode = prevMode === "photo" ? "barcode" : "photo";
      toast.info(newMode === "barcode" 
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
    
    if (!video || !canvas) {
      toast.error("Camera is not ready");
      return;
    }
    
    try {
      const context = canvas.getContext('2d');
      
      if (!context) {
        toast.error("Could not get canvas context");
        return;
      }
      
      if (!video.videoWidth || !video.videoHeight) {
        toast.error("Video stream is not available or ready");
        return;
      }
      
      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to image data URL with reduced quality for performance
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
              if (!barcode) {
                throw new Error("No barcode detected. Try again with better lighting.");
              }
              
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
  }, [mode, onCapture]);

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
