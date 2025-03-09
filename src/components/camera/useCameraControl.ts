
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
  const [isLoading, setIsLoading] = useState(true); // Set to true by default during initialization
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const initialLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoElementCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup function to stop camera stream
  const stopCameraStream = useCallback(() => {
    // Clear any pending timeouts and intervals
    if (initialLoadingTimeoutRef.current) {
      clearTimeout(initialLoadingTimeoutRef.current);
      initialLoadingTimeoutRef.current = null;
    }
    
    if (videoElementCheckIntervalRef.current) {
      clearInterval(videoElementCheckIntervalRef.current);
      videoElementCheckIntervalRef.current = null;
    }
    
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

  // Initialize camera with better error handling and fallbacks
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Set a timeout to ensure the loading state doesn't hang indefinitely
      initialLoadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        console.error("Camera initialization timed out");
        toast.error("Camera initialization timed out. Please try again.");
      }, 15000);
      
      // Stop previous stream if it exists
      stopCameraStream();
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser");
      }
      
      // Check for video element availability before proceeding
      if (!videoRef.current) {
        console.log("Video element not available yet, waiting...");
        
        // Set up an interval to check for video element availability
        let checkCount = 0;
        const maxChecks = 20; // Check for up to 10 seconds (20 * 500ms)
        
        videoElementCheckIntervalRef.current = setInterval(() => {
          checkCount++;
          
          if (videoRef.current) {
            clearInterval(videoElementCheckIntervalRef.current!);
            videoElementCheckIntervalRef.current = null;
            console.log("Video element now available, continuing camera initialization");
            // Continue camera initialization
            initCameraStream();
            return;
          }
          
          if (checkCount >= maxChecks) {
            clearInterval(videoElementCheckIntervalRef.current!);
            videoElementCheckIntervalRef.current = null;
            setIsLoading(false);
            console.error("Video element not available after multiple checks");
            toast.error("Failed to initialize camera: video element not available");
          }
        }, 500);
        
        return; // Exit function and wait for interval to potentially find video element
      }
      
      // If video element is available, proceed immediately with camera initialization
      await initCameraStream();
      
    } catch (error) {
      handleCameraError(error);
    }
  }, [facingMode, stopCameraStream, retryCount, maxRetries]);
  
  // Function to handle camera errors
  const handleCameraError = useCallback((error: any) => {
    console.error("Camera initialization error:", error);
    
    if (initialLoadingTimeoutRef.current) {
      clearTimeout(initialLoadingTimeoutRef.current);
      initialLoadingTimeoutRef.current = null;
    }
    
    // More helpful error messages based on error type
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        toast.error("Camera access denied. Please check your browser permissions.");
      } else if (error.name === 'NotFoundError') {
        toast.error("No camera found on this device.");
      } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
        toast.error("Camera is already in use by another application.");
      } else if (error.name === 'SecurityError') {
        toast.error("Camera access blocked due to security restrictions.");
      } else if (error.name === 'OverconstrainedError') {
        toast.error("Camera doesn't support the requested resolution.");
      } else {
        toast.error(`Camera error: ${error.name}`);
      }
    } else {
      toast.error(`Failed to start camera: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Try with front camera if back camera fails and we haven't tried it yet
    if (facingMode === "environment" && retryCount === 0) {
      setFacingMode("user");
      setRetryCount(prev => prev + 1);
    } else if (retryCount < maxRetries) {
      // Add exponential backoff for retries
      const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        startCamera();
      }, delay);
    } else {
      // After max retries, reset the retry count and show a final error
      setRetryCount(0);
      toast.error("Could not access camera after multiple attempts. Please check your device and permissions.");
    }
    
    setIsLoading(false);
  }, [facingMode, retryCount, maxRetries, startCamera]);
  
  // Function to initialize camera stream
  const initCameraStream = useCallback(async () => {
    // Try different settings to improve compatibility
    let stream: MediaStream | null = null;
    let errorMessage = "";
    
    // Try different constraints in order of preference
    const constraintsOptions = [
      // First try: Preferred facing mode with ideal resolution
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
        video: {
          facingMode: facingMode
        },
        audio: false
      },
      // Third try: Any camera
      {
        video: true,
        audio: false
      }
    ];
    
    // Try each constraint option until one works
    for (const constraints of constraintsOptions) {
      try {
        // Set a timeout for getUserMedia to prevent hanging
        const timeoutPromise = new Promise<MediaStream>((_, reject) => {
          setTimeout(() => reject(new Error("Camera access timed out")), 8000);
        });
        
        console.log("Attempting camera access with constraints:", constraints);
        
        // Race between getUserMedia and timeout
        stream = await Promise.race([
          navigator.mediaDevices.getUserMedia(constraints),
          timeoutPromise
        ]);
        
        // If we got a stream, break out of the loop
        if (stream && stream.getVideoTracks().length > 0) {
          console.log("Successfully got camera stream");
          break;
        }
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : "Unknown camera error";
        console.warn(`Attempt failed with constraints:`, constraints, error);
        // Continue to the next constraint option
      }
    }
    
    // If all attempts failed
    if (!stream || stream.getVideoTracks().length === 0) {
      throw new Error(errorMessage || "Failed to access any camera");
    }
    
    setCameraStream(stream);
    
    // Clear the initial loading timeout since we have a stream
    if (initialLoadingTimeoutRef.current) {
      clearTimeout(initialLoadingTimeoutRef.current);
      initialLoadingTimeoutRef.current = null;
    }
    
    if (!videoRef.current) {
      throw new Error("Video element not available");
    }
    
    videoRef.current.srcObject = stream;
    
    // Use a promise to ensure metadata is loaded
    try {
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) return reject("Video element not available");
        
        const handleLoadedMetadata = () => {
          if (!videoRef.current) return reject("Video element not available");
          
          videoRef.current.play()
            .then(() => {
              resolve();
            })
            .catch((playError) => {
              reject(playError);
            });
        };
        
        // Check if metadata is already loaded
        if (videoRef.current.readyState >= 2) {
          handleLoadedMetadata();
        } else {
          videoRef.current.onloadedmetadata = handleLoadedMetadata;
        }
        
        videoRef.current.onerror = (e) => {
          reject(`Video element error: ${e}`);
        };
      });
      
      setCameraActive(true);
      setRetryCount(0); // Reset retry count on success
      
      // Check if torch is supported
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
        const hasTorch = !!capabilities.torch;
        setTorchSupported(hasTorch);
        
        // Reset torch state when changing camera
        setTorchActive(false);
        
        toast.success(`Camera ready (${facingMode === "user" ? "Front" : "Back"})`);
      }
    } catch (playError) {
      console.error("Play error:", playError);
      throw new Error(`Could not play video: ${playError}`);
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  // Initialize camera on component mount and when facingMode changes
  useEffect(() => {
    // Small delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      startCamera();
    }, 500); // Increased to 500ms to ensure DOM is ready
    
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
            if (torchActive) {
              toast.success("Flashlight turned on");
            }
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
          if (permissionStatus.state === 'denied') {
            toast.error("Camera permission denied. Please allow camera access in your browser settings.");
            stopCameraStream();
          }
          
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted' && !cameraActive) {
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
  }, [startCamera, stopCameraStream, cameraActive]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !cameraActive && !isLoading) {
        // Resume camera when page becomes visible
        startCamera();
      } else if (document.visibilityState === 'hidden' && cameraActive) {
        // Pause camera when page is hidden
        stopCameraStream();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cameraActive, startCamera, stopCameraStream, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      if (initialLoadingTimeoutRef.current) {
        clearTimeout(initialLoadingTimeoutRef.current);
      }
      if (videoElementCheckIntervalRef.current) {
        clearInterval(videoElementCheckIntervalRef.current);
      }
    };
  }, [stopCameraStream]);

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
    
    if (!cameraActive) {
      toast.error("Camera is not active");
      return;
    }
    
    try {
      const context = canvas.getContext('2d');
      
      if (!context) {
        toast.error("Could not get canvas context");
        return;
      }
      
      if (!video.videoWidth || !video.videoHeight) {
        toast.error("Video stream is not available");
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
  }, [mode, onCapture, cameraActive]);

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
