import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Camera from "@/components/camera/Camera";
import CapturedImageView from "@/components/camera/CapturedImageView";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import { useInventory } from "@/hooks/useInventory";

const CameraView = () => {
  const navigate = useNavigate();
  const { 
    capturedImage, 
    detectedIngredients, 
    isAnalyzing, 
    analyzeImage, 
    reset 
  } = useImageAnalysis();
  
  const { saveIngredientsToInventory } = useInventory();
  
  const handleCaptureImage = useCallback((imageSrc: string) => {
    analyzeImage(imageSrc);
  }, [analyzeImage]);
  
  const handleBack = useCallback(() => {
    if (capturedImage) {
      // If we have a captured image, reset to camera view
      reset();
    } else {
      // Otherwise navigate back
      navigate("/");
    }
  }, [capturedImage, navigate, reset]);
  
  const handleConfirmIngredients = useCallback(() => {
    saveIngredientsToInventory(detectedIngredients);
  }, [detectedIngredients, saveIngredientsToInventory]);
  
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
          <CapturedImageView
            imageSrc={capturedImage}
            isAnalyzing={isAnalyzing}
            detectedIngredients={detectedIngredients}
            onRetake={handleBack}
            onSave={handleConfirmIngredients}
          />
        ) : (
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
