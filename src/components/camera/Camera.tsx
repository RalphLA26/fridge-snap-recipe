
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera as CameraIcon, SwitchCamera, Scan, X, Check, ChevronLeft, Barcode } from "lucide-react";
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
        toast.info("Position barcode in the scanner area", { duration: 3000 });
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
          
          {/* Better Header UI with improved contrast and positioning */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/50 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-10 w-10 flex items-center justify-center bg-black/60 text-white backdrop-blur-md hover:bg-black/70 border border-white/10 shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            {/* Title */}
            <h2 className="text-white text-lg font-medium">
              {showBarcodeUI ? "Scan Barcode" : "Camera"}
            </h2>
            
            {/* Mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBarcodeMode(!showBarcodeUI)}
              className="rounded-full h-10 w-10 flex items-center justify-center bg-black/60 text-white backdrop-blur-md hover:bg-black/70 border border-white/10 shadow-lg"
            >
              {showBarcodeUI ? <CameraIcon className="h-5 w-5" /> : <Barcode className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Redesigned barcode scanning overlay */}
          <AnimatePresence>
            {showBarcodeUI && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
              >
                <div className="absolute inset-0 bg-black/50" />
                
                <div className="relative z-10 flex flex-col items-center space-y-6">
                  {/* Barcode viewfinder */}
                  <div className="relative w-72 h-36 sm:w-80 sm:h-40 overflow-hidden">
                    {/* Scan window */}
                    <div className="absolute inset-0 border-2 border-fridge-500">
                      {/* Barcode pattern background */}
                      <div className="absolute inset-0 flex flex-col justify-center opacity-20">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="h-1 my-[1px] bg-white"
                            style={{ 
                              width: `${Math.floor(Math.random() * 60) + 40}%`,
                              marginLeft: `${Math.floor(Math.random() * 20)}%`
                            }}
                          ></div>
                        ))}
                      </div>

                      {/* Scan animation */}
                      <motion.div 
                        className="absolute left-0 right-0 h-0.5 bg-red-500"
                        initial={{ top: 0 }}
                        animate={{ top: "100%" }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          repeatType: "reverse" 
                        }}
                      />
                      
                      {/* Corner elements for better targeting */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-fridge-500" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-fridge-500" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-fridge-500" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fridge-500" />
                    </div>
                  </div>
                  
                  {/* Scan instruction */}
                  <div className="bg-black/80 rounded-full px-5 py-2 text-white text-sm max-w-xs text-center backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>Align barcode within frame</span>
                    </div>
                  </div>
                </div>
                
                {/* Cancel button */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => toggleBarcodeMode(false)}
                    className="rounded-full px-6 py-2 bg-black/70 text-white backdrop-blur-md hover:bg-black/90 border border-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Photo camera controls - simplified and more intuitive */}
          {!showBarcodeUI && (
            <div className="absolute bottom-0 left-0 right-0 pb-10 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-32">
              <div className="flex items-center justify-center gap-10 mb-6">
                {/* Camera switch button */}
                <Button
                  variant="ghost"
                  onClick={switchCamera}
                  disabled={isLoading}
                  className="rounded-full h-12 w-12 flex items-center justify-center bg-black/60 text-white backdrop-blur-md hover:bg-black/80 disabled:opacity-50 border border-white/20"
                >
                  <SwitchCamera className="h-5 w-5" />
                </Button>
                
                {/* Shutter button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleTakePhoto}
                  disabled={isLoading}
                  className="relative rounded-full h-16 w-16 bg-white disabled:bg-gray-400 disabled:opacity-50 flex items-center justify-center shadow-lg transition-transform duration-200 border-4 border-white/90"
                >
                  <div className="absolute inset-2 rounded-full border-2 border-gray-300" />
                </motion.button>
                
                <div className="w-12 h-12" /> {/* Empty space for balance */}
              </div>
              
              {/* Simple instruction */}
              <div className="text-white text-sm bg-black/70 backdrop-blur px-5 py-2 rounded-full mt-2">
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
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRetake}
              className="rounded-full h-10 w-10 flex items-center justify-center bg-black/60 text-white backdrop-blur-md hover:bg-black/70 border border-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <h2 className="text-white text-lg font-medium">Review</h2>
            
            <div className="w-10" /> {/* Empty space for balance */}
          </div>
          
          {/* Image preview */}
          <div className="relative h-1/2 bg-black">
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                className="h-full w-full object-contain"
              />
            )}
          </div>
          
          {/* Results panel */}
          <div className="flex-1 bg-gray-900 p-5 flex flex-col">
            <h3 className="text-white text-lg font-medium mb-4">
              {ingredients.length > 0
                ? "Detected Items:"
                : "Analyzing..."}
            </h3>
            
            {/* Items list */}
            {ingredients.length > 0 ? (
              <ul className="flex-1 overflow-y-auto space-y-2 mb-4">
                {ingredients.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-white bg-gray-800 p-3 rounded-lg flex items-center shadow-md border border-gray-700/50"
                  >
                    <div className="h-2.5 w-2.5 bg-fridge-500 rounded-full mr-3" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner color="fridge" text="Analyzing image..." />
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex gap-3 mt-auto">
              <Button
                onClick={handleRetake}
                variant="outline"
                className="flex-1 border-gray-700 text-white hover:bg-gray-800"
              >
                Retake
              </Button>
              
              <Button
                onClick={handleConfirm}
                variant="fridge"
                disabled={ingredients.length === 0}
                className="flex-1"
              >
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
