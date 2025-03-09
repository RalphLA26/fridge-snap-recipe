import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera as CameraIcon, SwitchCamera, Scan, X, Check } from "lucide-react";
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
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showBarcodeUI, setShowBarcodeUI] = useState(false);
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

  // For demo purposes - simulate detecting items in a fridge image
  const analyzeImage = useCallback(async () => {
    if (!capturedImage) return;
    
    toast.info("Analyzing image...");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock detection results
    const mockIngredients = [
      "Milk",
      "Eggs",
      "Cheese",
      "Butter",
      "Yogurt"
    ];
    
    // Randomly select 2-4 ingredients from the mock list
    const numIngredients = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...mockIngredients].sort(() => 0.5 - Math.random());
    const detected = shuffled.slice(0, numIngredients);
    
    setIngredients(detected);
    toast.success(`Detected ${detected.length} items in your fridge!`);
  }, [capturedImage]);

  const handleTakePhoto = async () => {
    const photoData = await takePhoto();
    if (photoData) {
      setCapturedImage(photoData);
      analyzeImage();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIngredients([]);
  };

  const handleConfirm = () => {
    if (ingredients.length > 0) {
      saveIngredientsToInventory(ingredients);
    } else {
      toast.error("No ingredients detected");
      onClose();
    }
  };

  const toggleBarcodeScanner = () => {
    if (isScanningBarcode) {
      stopBarcodeScanning();
      setShowBarcodeUI(false);
    } else {
      if (videoRef.current) {
        setShowBarcodeUI(true);
        startBarcodeScanning(videoRef.current);
      }
    }
  };

  // When a barcode is detected
  useEffect(() => {
    if (lastScannedBarcode) {
      // Simulate looking up a product by barcode
      const mockProducts = {
        "5901234123457": "Milk",
        "0123456789012": "Eggs",
        "9781234567897": "Yogurt",
        "2345678901234": "Cheese",
      };
      
      const product = mockProducts[lastScannedBarcode as keyof typeof mockProducts] || "Unknown Product";
      
      setIngredients([product]);
      setCapturedImage(""); // Just to trigger the review screen
      setShowBarcodeUI(false);
      
      toast.success(`Scanned product: ${product}`);
    }
  }, [lastScannedBarcode]);

  // Retry camera access
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  if (error) {
    return <CameraError error={error} onRetry={handleRetry} onBack={onClose} />;
  }

  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      {/* Camera viewfinder */}
      {!capturedImage ? (
        <div className="relative h-full w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <LoadingSpinner size="lg" color="fridge" text="Initializing camera..." />
            </div>
          )}
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
            style={{ display: isLoading ? "none" : "block" }}
          />
          
          {/* Scanning overlay for barcode mode */}
          {showBarcodeUI && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-64 h-64 border-2 border-fridge-500 rounded-lg relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-fridge-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-fridge-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-fridge-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fridge-500"></div>
              </div>
              <p className="text-white mt-4 text-center bg-black/50 px-4 py-2 rounded-full">
                Center the barcode in the box
              </p>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Camera controls */}
          <div className="absolute bottom-0 left-0 right-0 pb-10 flex flex-col items-center">
            <div className="flex items-center justify-center gap-8 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleBarcodeScanner}
                className={`rounded-full p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 ${isScanningBarcode ? 'bg-fridge-600 hover:bg-fridge-700' : ''}`}
              >
                <Scan className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={handleTakePhoto}
                disabled={isLoading || isScanningBarcode}
                className="rounded-full h-16 w-16 bg-white flex items-center justify-center p-0 hover:bg-gray-200"
              >
                <div className="rounded-full h-14 w-14 border-2 border-gray-300"></div>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={switchCamera}
                disabled={isLoading || isScanningBarcode}
                className="rounded-full p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              >
                <SwitchCamera className="h-6 w-6" />
              </Button>
            </div>
            
            <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {showBarcodeUI
                ? "Scanning for barcodes..."
                : "Take a photo of your fridge contents"}
            </p>
          </div>
        </div>
      ) : (
        /* Image review and results */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full w-full flex flex-col"
        >
          {capturedImage && (
            <div className="relative h-2/3 bg-black">
              <img
                src={capturedImage}
                alt="Captured"
                className="h-full w-full object-contain"
              />
            </div>
          )}
          
          <div className="flex-1 bg-gray-900 p-5 flex flex-col">
            <h3 className="text-white text-lg font-medium mb-2">
              {ingredients.length > 0
                ? "We detected these items:"
                : "Analyzing items..."}
            </h3>
            
            {ingredients.length > 0 ? (
              <ul className="mb-4 flex-1 overflow-y-auto">
                {ingredients.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white bg-gray-800 p-3 rounded-md mb-2 flex items-center"
                  >
                    <div className="h-2 w-2 bg-fridge-500 rounded-full mr-2"></div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner color="fridge" text="Analyzing image..." />
              </div>
            )}
            
            <div className="flex gap-3 justify-end mt-auto">
              <Button
                onClick={handleRetake}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                <X className="h-4 w-4 mr-2" />
                Retake
              </Button>
              
              <Button
                onClick={handleConfirm}
                variant="fridge"
                disabled={ingredients.length === 0}
              >
                <Check className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 left-4 rounded-full h-10 w-10 bg-black/30 text-white backdrop-blur-sm hover:bg-black/40 z-50"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Camera;
