import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera as CameraIcon, SwitchCamera, Scan, X, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CameraError from "@/components/CameraError";
import { useCamera } from "@/hooks/useCamera";
import { useBarcode } from "@/hooks/useBarcode";
import { useInventory } from "@/hooks/useInventory";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

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
      toast.success("Items added to your inventory");
      onClose();
    } else {
      toast.error("No ingredients detected");
    }
  };

  const toggleBarcodeMode = (enabled: boolean) => {
    if (enabled) {
      if (videoRef.current) {
        setShowBarcodeUI(true);
        startBarcodeScanning(videoRef.current);
        toast.info("Scanning for barcodes...", { duration: 3000 });
      }
    } else {
      stopBarcodeScanning();
      setShowBarcodeUI(false);
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
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/95">
              <LoadingSpinner size="lg" color="fridge" text="Initializing camera..." />
              <p className="text-white/70 text-sm mt-4 max-w-xs text-center">
                Please allow camera access when prompted
              </p>
            </div>
          )}
          
          {/* Camera preview */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
            style={{ display: isLoading ? "none" : "block" }}
          />
          
          {/* Header UI */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-10 w-10 bg-black/30 text-white backdrop-blur-sm hover:bg-black/40"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            {/* Mode toggle switch */}
            <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-full p-1.5">
              <motion.div 
                className="relative flex items-center gap-2 text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant={showBarcodeUI ? "ghost" : "fridge"}
                  size="sm"
                  onClick={() => toggleBarcodeMode(false)}
                  className={`rounded-full flex items-center gap-1.5 ${!showBarcodeUI ? 'shadow-md' : 'opacity-80'}`}
                >
                  <CameraIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">Photo</span>
                </Button>
                
                <Button
                  variant={showBarcodeUI ? "fridge" : "ghost"}
                  size="sm"
                  onClick={() => toggleBarcodeMode(true)}
                  className={`rounded-full flex items-center gap-1.5 ${showBarcodeUI ? 'shadow-md' : 'opacity-80'}`}
                >
                  <Scan className="h-4 w-4" />
                  <span className="text-xs font-medium">Barcode</span>
                </Button>
              </motion.div>
            </div>
            
            <div className="w-10" />  {/* Empty space for alignment */}
          </div>
          
          {/* Scanning overlay for barcode mode */}
          {showBarcodeUI && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div 
                className="w-64 h-64 border-2 border-fridge-500 rounded-lg relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-fridge-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-fridge-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-fridge-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-fridge-500"></div>
                <motion.div 
                  className="absolute inset-0 border-fridge-500"
                  animate={{ 
                    boxShadow: ["inset 0 0 0px rgba(42, 157, 143, 0)", "inset 0 0 20px rgba(42, 157, 143, 0.5)", "inset 0 0 0px rgba(42, 157, 143, 0)"] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <p className="text-white mt-6 text-center bg-black/50 px-4 py-2 rounded-full text-sm">
                Center the barcode in the box
              </p>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Camera controls */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 pb-10 flex flex-col items-center bg-gradient-to-t from-black/70 via-black/40 to-transparent pt-20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-8 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={switchCamera}
                disabled={isLoading}
                className="rounded-full p-3 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 disabled:opacity-50"
              >
                <SwitchCamera className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={handleTakePhoto}
                disabled={isLoading || showBarcodeUI}
                className="rounded-full h-18 w-18 bg-white flex items-center justify-center p-0 hover:bg-gray-100 disabled:opacity-50 disabled:bg-gray-400 shadow-lg transition-transform duration-200 hover:scale-105"
              >
                <div className="rounded-full h-16 w-16 border-2 border-gray-300"></div>
              </Button>
              
              <div className="w-14 h-14" /> {/* Spacer to maintain centered capture button */}
            </div>
            
            <motion.div 
              className="text-white text-sm bg-black/50 px-4 py-2 rounded-full max-w-xs text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {showBarcodeUI
                ? "Scanning for barcodes... Hold steady!"
                : "Take a photo of your fridge contents"}
            </motion.div>
          </motion.div>
        </div>
      ) : (
        /* Image review and results */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full w-full flex flex-col"
        >
          {/* Image preview area */}
          <div className="relative h-3/5 bg-black">
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                className="h-full w-full object-contain"
              />
            )}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRetake}
                className="rounded-full h-10 w-10 bg-black/30 text-white backdrop-blur-sm hover:bg-black/40"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="text-white text-sm font-medium backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">
                Review Results
              </div>
              
              <div className="w-10" />  {/* Empty space for alignment */}
            </div>
          </div>
          
          {/* Results display */}
          <div className="flex-1 bg-gray-900 p-5 flex flex-col">
            <h3 className="text-white text-lg font-medium mb-4">
              {ingredients.length > 0
                ? "Items detected in your fridge:"
                : "Analyzing items..."}
            </h3>
            
            {/* Detected items list */}
            {ingredients.length > 0 ? (
              <ul className="mb-6 flex-1 overflow-y-auto space-y-3">
                {ingredients.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white bg-gray-800 p-4 rounded-lg flex items-center shadow-sm"
                  >
                    <div className="h-3 w-3 bg-fridge-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner color="fridge" text="Analyzing image..." />
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex gap-3 justify-between mt-auto">
              <Button
                onClick={handleRetake}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800 flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Retake
              </Button>
              
              <Button
                onClick={handleConfirm}
                variant="fridge"
                disabled={ingredients.length === 0}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                Add to Inventory
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Camera;
