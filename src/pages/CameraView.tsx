
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, CameraIcon, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Camera from "@/components/camera";
import { toast } from "sonner";
import { detectIngredientsFromImage } from "@/lib/imageRecognition";

const CameraView = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReviewStage, setShowReviewStage] = useState(false);
  
  const handleCapture = async (imageSrc: string) => {
    // Debug log when image is captured
    console.log("Image captured in CameraView");
    setCapturedImage(imageSrc);
    // Don't analyze immediately - wait for user to confirm
    setShowReviewStage(true);
  };
  
  const handleContinue = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // Analyze image using our AI recognition system
      const result = await toast.promise(
        detectIngredientsFromImage(capturedImage),
        {
          loading: "Analyzing fridge contents...",
          success: (data) => `Detected ${data.length} items in your fridge!`,
          error: "Failed to analyze image. Please try again."
        }
      );
      
      if (Array.isArray(result)) {
        setDetectedIngredients(result);
        setSelectedIngredients(result);
      } else {
        // Handle case where result isn't an array
        toast.error("Invalid response format from image detection");
        setDetectedIngredients([]);
        setSelectedIngredients([]);
      }
    } catch (error) {
      console.error("Error detecting ingredients:", error);
    } finally {
      setIsAnalyzing(false);
      setShowReviewStage(false);
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
    if (detectedIngredients.length > 0) {
      setDetectedIngredients([]);
      setShowReviewStage(true);
    } else if (showReviewStage) {
      setShowReviewStage(false);
      setCapturedImage(null);
    } else {
      navigate("/");
    }
  };
  
  const handleRetake = () => {
    setCapturedImage(null);
    setDetectedIngredients([]);
    setSelectedIngredients([]);
    setShowReviewStage(false);
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
          <header className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="container max-w-xl mx-auto flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack}
                className="hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-medium text-fridge-700">
                {detectedIngredients.length > 0 ? "Detected Items" : "Review Your Photo"}
              </h1>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRetake}
                className="hover:bg-gray-100 rounded-full text-fridge-600"
              >
                <CameraIcon className="h-5 w-5" />
              </Button>
            </div>
          </header>
          
          <main className="container max-w-xl mx-auto p-4 pb-24">
            <div className="mb-6 relative overflow-hidden rounded-lg shadow-md">
              <img 
                src={capturedImage} 
                alt="Captured fridge" 
                className="w-full h-auto border border-gray-200"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                    <div className="animate-spin h-8 w-8 border-4 border-fridge-600 border-t-transparent rounded-full mb-2"></div>
                    <p className="text-sm font-medium">Analyzing your fridge...</p>
                  </div>
                </div>
              )}
            </div>
            
            {showReviewStage && !detectedIngredients.length && !isAnalyzing && (
              <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-fridge-100 p-2 rounded-full">
                    <CameraIcon className="h-5 w-5 text-fridge-600" />
                  </div>
                  <h2 className="text-lg font-medium text-gray-800">
                    Review your photo
                  </h2>
                </div>
                
                <p className="text-sm text-gray-500 mb-5 pl-10">
                  Does your photo clearly show the items in your fridge?
                </p>
                
                <motion.div 
                  className="flex gap-3 justify-end"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button 
                    variant="outline"
                    onClick={handleRetake}
                    className="bg-white border-gray-200"
                  >
                    Retake Photo
                  </Button>
                  
                  <Button 
                    className="bg-fridge-600 hover:bg-fridge-700 text-white"
                    onClick={handleContinue}
                  >
                    Continue
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            )}
            
            {detectedIngredients.length > 0 ? (
              <>
                <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-fridge-100 p-2 rounded-full">
                      <Lightbulb className="h-5 w-5 text-fridge-600" />
                    </div>
                    <h2 className="text-lg font-medium text-gray-800">
                      Found {detectedIngredients.length} items
                    </h2>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-5 pl-10">
                    Select the ingredients you want to use in your recipes:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    {detectedIngredients.map((ingredient) => (
                      <motion.button
                        key={ingredient}
                        className={`p-3 rounded-lg text-left flex items-center justify-between transition-all ${
                          selectedIngredients.includes(ingredient)
                            ? "bg-fridge-50 border border-fridge-200 shadow-sm"
                            : "bg-white border border-gray-200"
                        }`}
                        onClick={() => handleIngredientToggle(ingredient)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="capitalize">{ingredient}</span>
                        {selectedIngredients.includes(ingredient) ? (
                          <Check className="h-4 w-4 text-fridge-600" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <motion.div 
                  className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200"
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="container max-w-xl mx-auto">
                    <Button 
                      className="w-full bg-fridge-600 hover:bg-fridge-700 text-white py-6"
                      onClick={handleSave}
                      disabled={selectedIngredients.length === 0}
                    >
                      Find Recipes with {selectedIngredients.length} Ingredient{selectedIngredients.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </motion.div>
              </>
            ) : (
              !isAnalyzing && !showReviewStage && (
                <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 mb-4">No ingredients detected. Try taking another photo with better lighting.</p>
                  <Button 
                    onClick={handleRetake} 
                    className="bg-fridge-600 hover:bg-fridge-700 text-white"
                  >
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Take Another Photo
                  </Button>
                </div>
              )
            )}
          </main>
        </>
      )}
    </motion.div>
  );
};

export default CameraView;
