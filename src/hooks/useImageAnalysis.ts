
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { detectIngredientsFromImage, IngredientDetectionResult } from "@/lib/imageRecognition";

export const useImageAnalysis = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const analyzeImage = useCallback((imageSrc: string) => {
    if (!imageSrc) {
      toast.error("Failed to capture image");
      return;
    }
    
    setCapturedImage(imageSrc);
    setIsAnalyzing(true);
    
    toast.promise(
      detectIngredientsFromImage(imageSrc)
        .then((result: IngredientDetectionResult) => {
          // Process the detection results
          if (result && result.ingredients && result.confidenceScores) {
            const ingredients = result.ingredients.filter((_, i) => result.confidenceScores[i] > 0.7);
            setDetectedIngredients(ingredients);
            return ingredients.length > 0 ? `Detected ${ingredients.length} ingredients` : 'No ingredients detected';
          } else {
            setDetectedIngredients([]);
            return 'No ingredients detected';
          }
        })
        .catch(error => {
          console.error("Image analysis error:", error);
          throw new Error('Failed to analyze image');
        })
        .finally(() => {
          setIsAnalyzing(false);
        }),
      {
        loading: 'Analyzing image...',
        success: (message) => message,
        error: 'Failed to analyze image',
      }
    );
  }, []);
  
  const reset = useCallback(() => {
    setCapturedImage(null);
    setDetectedIngredients([]);
    setIsAnalyzing(false);
  }, []);
  
  return {
    capturedImage,
    detectedIngredients,
    isAnalyzing,
    analyzeImage,
    reset
  };
};
