
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/Header";
import HomeBanner from "@/components/HomeBanner";
import IngredientManager from "@/components/IngredientManager";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Camera, Plus, UtensilsCrossed } from "lucide-react";

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
      
      <main className="flex-1 container max-w-lg mx-auto px-5 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <HomeBanner />
          
          {/* Enhanced Action Cards with Improved Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6"
          >
            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-fridge-600 to-fridge-700 p-4 text-white">
                  <h2 className="text-lg font-semibold">Add Ingredients</h2>
                  <p className="text-sm text-white/80">Choose how to add items to your inventory</p>
                </div>
                
                {/* Card Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-white">
                  {/* Scan Food Option */}
                  <motion.div
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-fridge-50 to-fridge-100 cursor-pointer border border-fridge-200 shadow-sm"
                    onClick={handleCameraClick}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-fridge-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <Camera className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-fridge-900">Scan Food</h3>
                        <p className="text-sm text-fridge-700">Use camera to identify ingredients</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Add Manually Option */}
                  <motion.div
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-fridge-50 to-fridge-100 cursor-pointer border border-fridge-200 shadow-sm"
                    onClick={() => setShowIngredients(true)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-fridge-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <Plus className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-fridge-900">Add Manually</h3>
                        <p className="text-sm text-fridge-700">Type in your ingredients</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Ingredients Counter Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full mt-2"
          >
            <Button
              variant="outline"
              className="w-full py-6 border border-fridge-100 shadow-md rounded-xl flex justify-between items-center bg-white hover:bg-fridge-50 transition-all duration-300"
              onClick={toggleIngredients}
            >
              <span className="font-medium flex items-center">
                <UtensilsCrossed className="h-5 w-5 mr-2 text-fridge-600" />
                My Ingredients
              </span>
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
