import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Camera from "@/components/camera";
import { toast } from "sonner";
import { ChevronLeft, Camera as CameraIcon, Zap, RotateCcw, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectIngredientsFromImage, IngredientDetectionResult } from "@/lib/imageRecognition";

const CameraView = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  
  const handleCaptureImage = useCallback((imageSrc: string) => {
    setCapturedImage(imageSrc);
    
    toast.promise(
      detectIngredientsFromImage(imageSrc),
      {
        loading: 'Analyzing image...',
        success: (result: IngredientDetectionResult) => {
          // Process the detection results
          if (result && result.ingredients && result.confidenceScores) {
            const ingredients = result.ingredients.filter((_, i) => result.confidenceScores[i] > 0.7);
            setDetectedIngredients(ingredients);
            return `Detected ${ingredients.length} ingredients`;
          } else {
            setDetectedIngredients([]);
            return 'No ingredients detected';
          }
        },
        error: 'Failed to analyze image',
      }
    );
  }, []);
  
  const handleBack = useCallback(() => {
    if (capturedImage) {
      // If we have a captured image, reset to camera view
      setCapturedImage(null);
      setDetectedIngredients([]);
    } else {
      // Otherwise navigate back
      navigate("/");
    }
  }, [capturedImage, navigate]);
  
  const handleConfirmIngredients = () => {
    // Save detected ingredients to localStorage
    try {
      const existingIngredients = JSON.parse(localStorage.getItem("fridgeIngredients") || "[]");
      
      // Combine existing and new ingredients without duplicates
      const updatedIngredients = Array.from(new Set([...existingIngredients, ...detectedIngredients]));
      
      localStorage.setItem("fridgeIngredients", JSON.stringify(updatedIngredients));
      toast.success(`Added ${detectedIngredients.length} ingredients to your fridge`);
      
      // Navigate to recipes view
      navigate("/inventory");
    } catch (error) {
      console.error("Error saving ingredients:", error);
      toast.error("Failed to save ingredients");
    }
  };
  
  return (
    <motion.div 
      className="h-screen w-full relative flex flex-col bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header with back button */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <AnimatePresence mode="wait">
        {capturedImage ? (
          // Captured image and analysis view
          <motion.div 
            key="result"
            className="h-full w-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative flex-1">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="h-full w-full object-cover" 
              />
            </div>
            
            <div className="bg-white p-4 rounded-t-2xl -mt-6 pt-8 min-h-64 z-10">
              <h2 className="text-xl font-semibold mb-2">
                {detectedIngredients.length > 0 
                  ? `Detected Ingredients (${detectedIngredients.length})` 
                  : "No ingredients detected"}
              </h2>
              
              {detectedIngredients.length > 0 ? (
                <div className="mb-6">
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {detectedIngredients.map((ingredient, index) => (
                      <li 
                        key={index}
                        className="px-3 py-2 bg-gray-50 rounded-md text-sm flex items-center"
                      >
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center my-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Try taking another photo or adding ingredients manually</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={handleBack}
                >
                  Retake Photo
                </Button>
                <Button 
                  onClick={handleConfirmIngredients}
                  disabled={detectedIngredients.length === 0}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          // Camera view
          <motion.div
            key="camera"
            className="h-full flex flex-col justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Camera onCapture={handleCaptureImage} onClose={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CameraView;
