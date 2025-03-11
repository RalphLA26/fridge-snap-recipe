import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera as CameraIcon, 
  SwitchCamera, 
  ChevronLeft, 
  Barcode, 
  Check, 
  X, 
  Image as ImageIcon,
  Zap,
  ZapOff,
  Grid3x3,
  GridIcon,
  Scan,
  Aperture
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CameraError from "@/components/CameraError";
import { useCamera } from "@/hooks/useCamera";
import { useBarcode } from "@/hooks/useBarcode";
import { useInventory } from "@/hooks/useInventory";
import { toast } from "sonner";
import CameraControls from "./CameraControls";
import CameraViewfinder from "./CameraViewfinder";
import CaptureButton from "./CaptureButton";
import ReviewControls from "./ReviewControls";

interface CameraProps {
  onClose: () => void;
}

const Camera = ({ onClose }: CameraProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<string | null>(null);
  const [isBarcodeMode, setIsBarcodeMode] = useState(false);
  const [showFocusRing, setShowFocusRing] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { saveIngredientsToInventory } = useInventory();
  
  // Camera hook initialization
  const { 
    videoRef, 
    stream, 
    error, 
    isLoading,
    switchCamera,
    takePhoto,
    setTorchMode
  } = useCamera({
    onError: (err) => console.error("Camera error:", err),
    quality: quality
  });

  // Barcode scanner hook
  const { 
    isScanningBarcode, 
    startBarcodeScanning, 
    stopBarcodeScanning,
    lastScannedBarcode
  } = useBarcode();

  // Handle barcode detection result
  useEffect(() => {
    if (lastScannedBarcode) {
      // Simulate product lookup by barcode
      const mockProducts: Record<string, string> = {
        "5901234123457": "Milk (1L)",
        "0123456789012": "Free-Range Eggs (12 pack)",
        "7350053850149": "Organic Spinach (200g)",
        "8410700624307": "Cheddar Cheese (250g)",
      };
      
      const product = mockProducts[lastScannedBarcode] || "Unknown Product";
      setProductInfo(product);
      
      // Create a blank image to represent barcode scan
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#333";
        ctx.textAlign = "center";
        ctx.fillText(`Barcode: ${lastScannedBarcode}`, canvas.width/2, canvas.height/2 - 20);
        ctx.fillText(`Product: ${product}`, canvas.width/2, canvas.height/2 + 20);
        setCapturedImage(canvas.toDataURL());
      }
      
      stopBarcodeScanning();
      setIsBarcodeMode(false);
      toast.success(`Product identified: ${product}`);
    }
  }, [lastScannedBarcode, stopBarcodeScanning]);

  // Toggle between barcode mode and regular camera mode
  const toggleBarcodeMode = useCallback(() => {
    const newMode = !isBarcodeMode;
    setIsBarcodeMode(newMode);
    
    if (newMode) {
      if (videoRef.current) {
        startBarcodeScanning(videoRef.current);
        toast.info("Scan a barcode", {
          icon: <Barcode className="h-5 w-5" />,
        });
      }
    } else {
      stopBarcodeScanning();
    }
  }, [isBarcodeMode, videoRef, startBarcodeScanning, stopBarcodeScanning]);

  const handleTakePhoto = async () => {
    // Show focus animation
    setShowFocusRing(true);
    
    // Play shutter sound
    const shutterSound = new Audio('/assets/sounds/camera-shutter.mp3');
    shutterSound.volume = 0.5;
    shutterSound.play().catch(e => console.log("Error playing sound:", e));
    
    // Wait for animation to complete
    setTimeout(async () => {
      const photoData = await takePhoto();
      if (photoData) {
        setCapturedImage(photoData);
        
        // For regular photos, we don't set any product info
        setProductInfo(null);
        
        toast.success("Photo captured!");
      }
      setShowFocusRing(false);
    }, 200);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setProductInfo(null);
  };

  const handleSave = () => {
    if (productInfo) {
      // If we have a product (from barcode), add it to inventory
      saveIngredientsToInventory([productInfo]);
      toast.success(`${productInfo} added to your inventory`);
    } else if (capturedImage) {
      // Just save the photo if there's no product info
      toast.success("Photo saved");
    }
    onClose();
  };

  // Toggle flash/torch
  const handleToggleFlash = useCallback(() => {
    const newMode = flashMode === 'off' ? 'on' : 'off';
    setFlashMode(newMode);
    setTorchMode(newMode === 'on');
  }, [flashMode, setTorchMode]);

  // Toggle composition grid
  const handleToggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  // Toggle quality
  const handleToggleQuality = useCallback(() => {
    setQuality(prev => {
      if (prev === 'low') return 'medium';
      if (prev === 'medium') return 'high';
      return 'low';
    });
  }, []);

  // Retry camera access
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  if (error) {
    return <CameraError error={error} onRetry={handleRetry} onBack={onClose} />;
  }

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Camera viewfinder or captured image */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/95"
            >
              <LoadingSpinner size="lg" color="fridge" text="Starting camera..." />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Camera feed */}
        {!capturedImage ? (
          <CameraViewfinder 
            videoRef={videoRef}
            isBarcodeMode={isBarcodeMode}
            showFocusRing={showFocusRing}
            showGrid={showGrid}
          />
        ) : (
          // Show captured image
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full flex items-center justify-center bg-black"
          >
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="max-h-full max-w-full object-contain"
            />
          </motion.div>
        )}
      </div>
      
      {/* Header bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-10"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <h2 className="text-white text-lg font-medium">
          {isBarcodeMode ? "Scan Barcode" : capturedImage ? "Review" : "Camera"}
        </h2>
        
        {!capturedImage && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFlash}
            className="rounded-full text-white hover:bg-white/10"
          >
            {flashMode === 'on' ? (
              <Zap className="h-5 w-5" />
            ) : (
              <ZapOff className="h-5 w-5" />
            )}
          </Button>
        )}
      </motion.div>
      
      {/* Bottom controls */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent z-10"
      >
        <AnimatePresence mode="wait">
          {!capturedImage ? (
            // Camera controls
            <motion.div 
              key="camera-controls"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-8"
            >
              {/* Camera settings button */}
              <CameraControls 
                onSwitchCamera={switchCamera}
                onToggleGrid={handleToggleGrid}
                onToggleQuality={handleToggleQuality}
                currentQuality={quality}
                showGrid={showGrid}
                isLoading={isLoading}
              />
              
              {/* Capture button (photo or barcode) */}
              {!isBarcodeMode ? (
                <CaptureButton onCapture={handleTakePhoto} disabled={isLoading} />
              ) : (
                <div className="rounded-full h-16 w-16 bg-white/20 border-2 border-white/40 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Barcode className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
              )}
              
              {/* Mode toggle button */}
              <Button
                variant={isBarcodeMode ? "fridge" : "outline"}
                size="icon"
                onClick={toggleBarcodeMode}
                disabled={isLoading}
                className={`rounded-full h-12 w-12 transition-colors duration-300 ${isBarcodeMode ? "" : "bg-black/50 text-white hover:bg-black/70 border border-white/20"}`}
              >
                {isBarcodeMode ? <CameraIcon className="h-5 w-5" /> : <Scan className="h-5 w-5" />}
              </Button>
            </motion.div>
          ) : (
            // Review controls
            <ReviewControls 
              onRetake={handleRetake} 
              onSave={handleSave} 
              hasProductInfo={!!productInfo}
            />
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Product info overlay */}
      <AnimatePresence>
        {capturedImage && productInfo && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-0 right-0 mx-auto bg-black/80 backdrop-blur-md p-4 rounded-lg max-w-xs text-center text-white shadow-lg"
          >
            <h3 className="font-medium mb-1">Product Identified:</h3>
            <p className="text-lg">{productInfo}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mode indicator */}
      {!capturedImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`absolute top-20 left-5 px-3 py-1.5 rounded-full ${isBarcodeMode ? 'bg-fridge-600' : 'bg-white/20'} text-white text-xs font-medium`}
        >
          {isBarcodeMode ? 'Barcode Mode' : `Photo Mode (${quality})`}
        </motion.div>
      )}
      
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Camera;
