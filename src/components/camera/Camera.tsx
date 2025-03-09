
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera as CameraIcon, SwitchCamera, ChevronLeft, Barcode, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CameraError from "@/components/CameraError";
import { useCamera } from "@/hooks/useCamera";
import { useBarcode } from "@/hooks/useBarcode";
import { useInventory } from "@/hooks/useInventory";
import { toast } from "sonner";

interface CameraProps {
  onClose: () => void;
}

const Camera = ({ onClose }: CameraProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<string | null>(null);
  const [isBarcodeMode, setIsBarcodeMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { saveIngredientsToInventory } = useInventory();
  
  // Camera hook initialization
  const { 
    videoRef, 
    stream, 
    error, 
    isLoading,
    switchCamera,
    takePhoto 
  } = useCamera({
    onError: (err) => console.error("Camera error:", err)
  });

  // Barcode scanner hook
  const { 
    isScanningBarcode, 
    startBarcodeScanning, 
    stopBarcodeScanning,
    lastScannedBarcode
  } = useBarcode();

  // Toggle between barcode mode and regular camera mode
  const toggleBarcodeMode = useCallback(() => {
    const newMode = !isBarcodeMode;
    setIsBarcodeMode(newMode);
    
    if (newMode) {
      if (videoRef.current) {
        startBarcodeScanning(videoRef.current);
        toast.info("Scan a barcode");
      }
    } else {
      stopBarcodeScanning();
    }
  }, [isBarcodeMode, videoRef, startBarcodeScanning, stopBarcodeScanning]);

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

  const handleTakePhoto = async () => {
    const photoData = await takePhoto();
    if (photoData) {
      setCapturedImage(photoData);
      
      // For regular photos, we don't set any product info
      setProductInfo(null);
      
      toast.success("Photo captured!");
    }
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
      // You could add more functionality here
      toast.success("Photo saved");
    }
    onClose();
  };

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
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/95">
            <LoadingSpinner size="lg" color="fridge" text="Starting camera..." />
          </div>
        )}
        
        {/* Camera feed */}
        {!capturedImage ? (
          <div className="relative h-full w-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            
            {/* Barcode scanning overlay */}
            {isBarcodeMode && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4/5 max-w-xs aspect-[3/2] border-2 border-white/80 rounded-md">
                  <motion.div 
                    className="w-full h-0.5 bg-fridge-500"
                    initial={{ top: "20%" }}
                    animate={{ top: "80%" }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    style={{ position: "relative" }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          // Show captured image
          <div className="h-full w-full flex items-center justify-center bg-black">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </div>
      
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-black/60 z-10">
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
        
        <div className="w-10" />
      </div>
      
      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center bg-black/60 z-10">
        {!capturedImage ? (
          // Camera controls
          <div className="flex items-center justify-center gap-8">
            {/* Camera switch button */}
            <Button
              variant="outline"
              size="icon"
              onClick={switchCamera}
              disabled={isLoading}
              className="rounded-full h-12 w-12 bg-black/50 text-white hover:bg-black/70 border border-white/20"
            >
              <SwitchCamera className="h-5 w-5" />
            </Button>
            
            {/* Capture button (photo or barcode) */}
            {!isBarcodeMode ? (
              <button
                onClick={handleTakePhoto}
                disabled={isLoading}
                className="rounded-full h-16 w-16 bg-white disabled:bg-gray-400 flex items-center justify-center shadow-lg"
              >
                <div className="rounded-full h-14 w-14 border-2 border-gray-300" />
              </button>
            ) : (
              <div className="rounded-full h-16 w-16 bg-white/20 border-2 border-white/40 flex items-center justify-center">
                <Barcode className="h-8 w-8 text-white" />
              </div>
            )}
            
            {/* Mode toggle button */}
            <Button
              variant={isBarcodeMode ? "fridge" : "outline"}
              size="icon"
              onClick={toggleBarcodeMode}
              disabled={isLoading}
              className={`rounded-full h-12 w-12 ${isBarcodeMode ? "" : "bg-black/50 text-white hover:bg-black/70 border border-white/20"}`}
            >
              {isBarcodeMode ? <CameraIcon className="h-5 w-5" /> : <Barcode className="h-5 w-5" />}
            </Button>
          </div>
        ) : (
          // Review controls
          <div className="w-full flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleRetake}
              className="flex-1 bg-black/50 text-white border-white/20 hover:bg-black/70"
            >
              Retake
            </Button>
            
            <Button
              variant="fridge"
              onClick={handleSave}
              className="flex-1"
            >
              <Check className="mr-1 h-4 w-4" />
              {productInfo ? "Add to Inventory" : "Save Photo"}
            </Button>
          </div>
        )}
      </div>
      
      {/* Product info overlay */}
      {capturedImage && productInfo && (
        <div className="absolute top-20 left-0 right-0 mx-auto bg-black/80 backdrop-blur-md p-4 rounded-lg max-w-xs text-center text-white">
          <h3 className="font-medium mb-1">Product Identified:</h3>
          <p className="text-lg">{productInfo}</p>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Camera;
