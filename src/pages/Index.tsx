
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/Header";
import HomeBanner from "@/components/HomeBanner";
import IngredientManager from "@/components/IngredientManager";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Camera, Plus } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showIngredients, setShowIngredients] = useState(false);
  
  // Load saved ingredients from localStorage on initial render
  useEffect(() => {
    const savedIngredients = localStorage.getItem("fridgeIngredients");
    if (savedIngredients) {
      setIngredients(JSON.parse(savedIngredients));
    }
  }, []);
  
  // Save ingredients to localStorage whenever the ingredients state changes
  useEffect(() => {
    localStorage.setItem("fridgeIngredients", JSON.stringify(ingredients));
  }, [ingredients]);
  
  const handleAddIngredient = (ingredient: string) => {
    setIngredients(prev => [...prev, ingredient]);
  };
  
  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(prev => prev.filter(item => item !== ingredient));
  };
  
  const handleFindRecipes = () => {
    navigate("/recipes");
  };

  const handleCameraClick = () => {
    navigate("/camera");
  };
  
  const toggleIngredients = () => {
    setShowIngredients(prev => !prev);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-lg mx-auto px-5 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <HomeBanner />
          
          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Add Ingredient Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-1"
            >
              <Card 
                className="overflow-hidden border-fridge-100 shadow-md hover:shadow-lg transition-all duration-200 h-full cursor-pointer bg-gradient-to-br from-white to-fridge-50"
                onClick={() => setShowIngredients(true)}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fridge-100 to-fridge-200 flex items-center justify-center mb-4 shadow-sm">
                    <Plus className="h-8 w-8 text-fridge-600" />
                  </div>
                  <h3 className="font-medium text-lg text-center mb-1">Add Ingredient</h3>
                  <p className="text-sm text-gray-500 text-center">Manually add items to your inventory</p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Scan Ingredient Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-1"
            >
              <Card 
                className="overflow-hidden border-fridge-100 shadow-md hover:shadow-lg transition-all duration-200 h-full cursor-pointer bg-gradient-to-br from-fridge-600 to-fridge-700"
                onClick={handleCameraClick}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-sm">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-medium text-lg text-center mb-1 text-white">Scan Food</h3>
                  <p className="text-sm text-white/80 text-center">Use camera to identify ingredients</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Ingredients Counter Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full py-6 border-fridge-200 border flex justify-between items-center"
              onClick={toggleIngredients}
            >
              <span className="font-medium">My Ingredients</span>
              <div className="flex items-center">
                <span className="bg-fridge-100 text-fridge-700 rounded-full px-3 py-1 text-sm font-medium mr-2">
                  {ingredients.length}
                </span>
                {showIngredients ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </Button>
          </motion.div>
          
          {/* Collapsible Ingredient Manager */}
          <AnimatePresence>
            {showIngredients && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <IngredientManager
                  ingredients={ingredients}
                  onAddIngredient={handleAddIngredient}
                  onRemoveIngredient={handleRemoveIngredient}
                  onFindRecipes={handleFindRecipes}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      
      {/* Enhanced footer with multi-layer gradients */}
      <div className="mt-auto">
        <div className="h-1.5 bg-gradient-to-r from-fridge-300/40 via-fridge-500/70 to-fridge-300/40" />
        <div className="h-0.5 bg-gradient-to-r from-fridge-100 via-fridge-200 to-fridge-100" />
      </div>
    </div>
  );
};

export default Index;
