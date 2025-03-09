import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera as CameraIcon, SwitchCamera, Check, ChevronLeft, Barcode, ZoomIn, Aperture, Focus } from "lucide-react";
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
      "Yogurt",
      "Spinach",
      "Carrots",
      "Bread",
      "Chicken",
      "Apples"
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
        toast.info("Point camera at barcode");
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
        "5901234123457": "Milk (1L)",
        "0123456789012": "Free-Range Eggs (12 pack)",
        "7350053850149": "Organic Spinach (200g)",
        "8410700624307": "Cheddar Cheese (250g)",
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
          <div className="relative h-full w-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ display: isLoading ? "none" : "block" }}
            />
            
            {/* Barcode UI overlay */}
            {showBarcodeUI && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="p-4 bg-black/80 rounded-lg max-w-xs w-full text-center">
                  <div className="mb-4">
                    <div className="w-full aspect-video border-2 border-fridge-400 rounded-md mb-4 relative overflow-hidden">
                      {/* Scanner line animation */}
                      <motion.div 
                        className="absolute left-0 right-0 h-0.5 bg-fridge-500"
                        initial={{ top: "10%" }}
                        animate={{ top: "90%" }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    </div>
                    <p className="text-white font-medium">Point camera at barcode</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => toggleBarcodeMode(false)}
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Header UI */}
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
              {showBarcodeUI ? "Barcode Scanner" : "Camera"}
            </h2>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBarcodeMode(!showBarcodeUI)}
              className="rounded-full text-white hover:bg-white/10"
            >
              {showBarcodeUI ? <CameraIcon className="h-5 w-5" /> : <Barcode className="h-5 w-5" />}
            </Button>
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Camera controls */}
          {!showBarcodeUI && (
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center bg-black/60 py-6 z-10">
              <div className="flex items-center justify-center gap-10 mb-4">
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
                
                {/* Shutter button */}
                <button
                  onClick={handleTakePhoto}
                  disabled={isLoading}
                  className="rounded-full h-16 w-16 bg-white disabled:bg-gray-400 flex items-center justify-center shadow-lg border-4 border-white/90"
                >
                  <div className="absolute inset-2 rounded-full border-2 border-gray-300" />
                </button>
                
                {/* Barcode button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleBarcodeMode(true)}
                  disabled={isLoading}
                  className="rounded-full h-12 w-12 bg-black/50 text-white hover:bg-black/70 border border-white/20"
                >
                  <Barcode className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Instruction */}
              <div className="text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                Take a photo of your fridge
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Review captured image and results */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full w-full flex flex-col"
        >
          {/* Header with glass morphism */}
          <div className="p-4 flex items-center justify-between backdrop-blur-md bg-black/50 border-b border-white/10 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRetake}
              className="rounded-full h-10 w-10 flex items-center justify-center text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <h2 className="text-white text-lg font-medium">Review</h2>
            
            <div className="w-10" /> {/* Empty space for balance */}
          </div>
          
          {/* Image preview */}
          <div className="relative flex-1 bg-black flex items-center justify-center">
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
          
          {/* Results panel with glass morphism */}
          <div className="bg-black/90 backdrop-blur-md border-t border-white/10 p-5 flex flex-col">
            <h3 className="text-white text-lg font-medium mb-4">
              {ingredients.length > 0
                ? "Detected Items:"
                : "Analyzing..."}
            </h3>
            
            {/* Items list */}
            {ingredients.length > 0 ? (
              <ul className="space-y-2 mb-6 max-h-40 overflow-y-auto">
                {ingredients.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white bg-white/10 backdrop-blur-sm p-3 rounded-lg flex items-center border border-white/5 shadow-md"
                  >
                    <div className="h-2.5 w-2.5 bg-fridge-500 rounded-full mr-3" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="py-6 flex items-center justify-center">
                <LoadingSpinner color="fridge" text="Analyzing image..." />
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex gap-3 mt-2">
              <Button
                onClick={handleRetake}
                variant="outline"
                className="flex-1 border-white/20 text-white bg-black/30 hover:bg-black/50"
              >
                Retake
              </Button>
              
              <Button
                onClick={handleConfirm}
                variant="fridge"
                disabled={ingredients.length === 0}
                className="flex-1"
              >
                <Check className="mr-2 h-4 w-4" />
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
