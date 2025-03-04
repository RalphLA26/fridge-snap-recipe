
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Camera from "@/components/Camera";
import { toast } from "sonner";
import { detectIngredientsFromImage } from "@/lib/imageRecognition";

const CameraView = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setIsAnalyzing(true);
    
    try {
      // Analyze image using our AI recognition system
      const result = await toast.promise(
        detectIngredientsFromImage(imageSrc),
        {
          loading: "Analyzing fridge contents...",
          success: (data) => `Detected ${data.length} items in your fridge!`,
          error: "Failed to analyze image. Please try again."
        }
      );
      
      setDetectedIngredients(result);
      setSelectedIngredients(result);
    } catch (error) {
      console.error("Error detecting ingredients:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };
  
  const handleSave = () => {
    // Load existing ingredients
    const existingIngredientsJson = localStorage.getItem("fridgeIngredients");
    const existingIngredients = existingIngredientsJson 
      ? JSON.parse(existingIngredientsJson) 
      : [];
    
    // Combine existing with new selected ingredients (avoid duplicates)
    const combinedIngredients = [
      ...existingIngredients,
      ...selectedIngredients.filter(item => !existingIngredients.includes(item))
    ];
    
    // Save to localStorage
    localStorage.setItem("fridgeIngredients", JSON.stringify(combinedIngredients));
    
    toast.success(`Added ${selectedIngredients.length} ingredients to your list`);
    navigate("/recipes");
  };
  
  const handleBack = () => {
    if (capturedImage) {
      setCapturedImage(null);
      setDetectedIngredients([]);
    } else {
      navigate("/");
    }
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!capturedImage ? (
        <Camera onCapture={handleCapture} onClose={() => navigate("/")} />
      ) : (
        <>
          <header className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="container max-w-xl mx-auto flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-medium">Detected Items</h1>
              <div className="w-10"></div> {/* Spacer for alignment */}
            </div>
          </header>
          
          <main className="container max-w-xl mx-auto p-4">
            <div className="mb-6 relative overflow-hidden rounded-lg">
              <img 
                src={capturedImage} 
                alt="Captured fridge" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-medium mb-3">
                Found {detectedIngredients.length} items in your fridge
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Select the ingredients you want to use in your recipes:
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {detectedIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    className={`p-3 rounded-lg text-left flex items-center justify-between ${
                      selectedIngredients.includes(ingredient)
                        ? "bg-fridge-100 border border-fridge-300"
                        : "bg-white border border-gray-200"
                    }`}
                    onClick={() => handleIngredientToggle(ingredient)}
                  >
                    <span>{ingredient}</span>
                    {selectedIngredients.includes(ingredient) ? (
                      <Check className="h-4 w-4 text-fridge-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full bg-fridge-600 hover:bg-fridge-700 text-white" 
              onClick={handleSave}
              disabled={selectedIngredients.length === 0}
            >
              Find Recipes with {selectedIngredients.length} Ingredients
            </Button>
          </main>
        </>
      )}
    </motion.div>
  );
};

export default CameraView;
