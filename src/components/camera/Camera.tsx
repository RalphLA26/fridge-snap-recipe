
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
          
          {/* Header UI - Improved with better contrast and shadows */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/50 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-12 w-12 bg-black/50 text-white backdrop-blur-md hover:bg-black/70 border border-white/10 shadow-lg"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            {/* Improved mode toggle switch */}
            <motion.div 
              className="flex items-center bg-black/60 backdrop-blur-xl rounded-full p-1 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative flex items-center text-white">
                <Button
                  variant={showBarcodeUI ? "ghost" : "fridge"}
                  size="sm"
                  onClick={() => toggleBarcodeMode(false)}
                  className={`rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-300 ${!showBarcodeUI ? 'shadow-md' : 'opacity-70 hover:opacity-100'}`}
                >
                  <CameraIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">Photo</span>
                </Button>
                
                <Button
                  variant={showBarcodeUI ? "fridge" : "ghost"}
                  size="sm"
                  onClick={() => toggleBarcodeMode(true)}
                  className={`rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-300 ${showBarcodeUI ? 'shadow-md' : 'opacity-70 hover:opacity-100'}`}
                >
                  <Scan className="h-4 w-4" />
                  <span className="text-xs font-medium">Barcode</span>
                </Button>
              </div>
            </motion.div>
            
            <div className="w-12" />  {/* Empty space for alignment */}
          </div>
          
          {/* Completely redesigned barcode scanning overlay */}
          {showBarcodeUI && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Inner scanning area */}
                <div className="w-80 h-48 relative">
                  {/* Scanner window with barcode pattern */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg border-2 border-fridge-500/80 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                    <div className="absolute top-0 left-0 right-0 h-full w-full flex items-center justify-center overflow-hidden">
                      {/* Barcode scan area - semi-transparent with actual barcode design */}
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm">
                        {/* Horizontal barcode pattern */}
                        <div className="absolute top-1/2 left-0 right-0 h-16 -translate-y-1/2 flex flex-col justify-center gap-1 overflow-hidden">
                          {/* Barcode lines - varying thicknesses */}
                          <div className="flex items-center justify-center w-full">
                            {Array.from({ length: 40 }).map((_, i) => (
                              <div 
                                key={`bar-${i}`} 
                                className="h-16" 
                                style={{ 
                                  width: [1, 2, 3, 4][Math.floor(Math.random() * 4)], 
                                  backgroundColor: Math.random() > 0.3 ? 'rgba(255,255,255,0.8)' : 'transparent',
                                  marginRight: '2px'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Barcode numbers at bottom */}
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        <div className="px-4 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-xs tracking-widest font-mono">
                          5901234123457
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated scanner laser line */}
                    <motion.div 
                      className="absolute left-0 right-0 h-0.5 bg-red-500 z-10 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                      initial={{ top: "10%" }}
                      animate={{ top: "90%" }}
                      transition={{ 
                        duration: 1.8, 
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    
                    {/* Corner targeting elements */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-fridge-500 rounded-tl"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-fridge-500 rounded-tr"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-fridge-500 rounded-bl"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-fridge-500 rounded-br"></div>
                  </div>
                  
                  {/* Scanner effect glow */}
                  <motion.div 
                    className="absolute inset-0 rounded-lg"
                    animate={{ 
                      boxShadow: ["inset 0 0 0px rgba(56, 189, 248, 0)", "inset 0 0 25px rgba(56, 189, 248, 0.3)", "inset 0 0 0px rgba(56, 189, 248, 0)"] 
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </div>
                
                {/* Enhanced scanning status indicator */}
                <motion.div 
                  className="mt-8 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-red-500/30 animate-pulse"></div>
                    <div className="relative h-2 w-2 rounded-full bg-red-500"></div>
                  </div>
                  <p className="text-white text-sm font-medium">
                    Align barcode within frame
                  </p>
                </motion.div>
              </motion.div>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Improved camera controls */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 pb-12 flex flex-col items-center bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-32"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-10 mb-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={switchCamera}
                  disabled={isLoading}
                  className="rounded-full p-3 h-14 w-14 bg-black/60 backdrop-blur-xl text-white hover:bg-black/80 disabled:opacity-50 border border-white/20 shadow-lg"
                >
                  <SwitchCamera className="h-6 w-6" />
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleTakePhoto}
                  disabled={isLoading || showBarcodeUI}
                  className="rounded-full h-20 w-20 bg-white flex items-center justify-center p-0 hover:bg-gray-100 disabled:opacity-50 disabled:bg-gray-400 shadow-xl transition-all duration-200 hover:scale-105 border-4 border-white/90"
                  aria-label="Take photo"
                >
                  <div className="rounded-full h-16 w-16 border-2 border-gray-300"></div>
                </Button>
              </motion.div>
              
              <div className="w-14 h-14" /> {/* Spacer for alignment */}
            </div>
            
            {/* Improved instruction text */}
            <motion.div 
              className="text-white text-sm bg-black/70 backdrop-blur-xl px-6 py-3 rounded-full max-w-xs text-center border border-white/20 shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {showBarcodeUI
                ? "Scanning for barcodes..."
                : "Take a photo of your fridge contents"}
            </motion.div>
          </motion.div>
        </div>
      ) : (
        /* Enhanced image review and results */
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
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRetake}
                className="rounded-full h-12 w-12 bg-black/50 text-white backdrop-blur-md hover:bg-black/70 border border-white/10 shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <div className="text-white text-sm font-medium backdrop-blur-xl bg-black/60 px-5 py-2.5 rounded-full border border-white/20 shadow-md">
                Review Results
              </div>
              
              <div className="w-12" />  {/* Empty space for alignment */}
            </div>
          </div>
          
          {/* Enhanced results display */}
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
                    className="text-white bg-gray-800/90 p-4 rounded-lg flex items-center shadow-md border border-gray-700/50"
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
            
            {/* Enhanced action buttons */}
            <div className="flex gap-3 justify-between mt-auto">
              <Button
                onClick={handleRetake}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800 flex-1 shadow-md"
              >
                <X className="h-4 w-4 mr-2" />
                Retake
              </Button>
              
              <Button
                onClick={handleConfirm}
                variant="fridge"
                disabled={ingredients.length === 0}
                className="flex-1 shadow-md"
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
