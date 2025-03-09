
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
          className="space-y-7"
        >
          <HomeBanner />
          
          {/* Enhanced Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="overflow-hidden border-none rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-0">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-fridge-600 to-fridge-700 p-5 text-white rounded-t-2xl">
                  <h2 className="text-xl font-semibold">Get Started</h2>
                  <p className="text-sm text-white/90 mt-1">Add ingredients to your inventory</p>
                </div>
                
                {/* Card Actions */}
                <div className="p-5 space-y-3">
                  {/* Scan Food Option */}
                  <motion.div
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-fridge-50 to-fridge-100 cursor-pointer border border-fridge-200 shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={handleCameraClick}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fridge-500 to-fridge-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <Camera className="h-6 w-6 text-white" />
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
                    className="p-4 rounded-xl bg-gradient-to-r from-fridge-50 to-fridge-100 cursor-pointer border border-fridge-200 shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => setShowIngredients(true)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fridge-500 to-fridge-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <Plus className="h-6 w-6 text-white" />
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
          >
            <Button
              variant="outline"
              className="w-full py-6 border border-fridge-200 shadow-md rounded-xl flex justify-between items-center bg-white hover:bg-fridge-50 transition-all duration-300"
              onClick={toggleIngredients}
            >
              <div className="flex items-center">
                <div className="bg-fridge-100 rounded-full p-2.5 mr-3">
                  <UtensilsCrossed className="h-5 w-5 text-fridge-600" />
                </div>
                <span className="font-medium text-gray-800">My Ingredients</span>
              </div>
              <div className="flex items-center">
                <span className="bg-gradient-to-r from-fridge-100 to-fridge-200 text-fridge-700 rounded-full px-3.5 py-1.5 text-sm font-medium mr-2.5 shadow-sm">
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
      
      {/* Footer */}
      <div className="mt-auto">
        <div className="h-1.5 bg-gradient-to-r from-fridge-300/40 via-fridge-500/70 to-fridge-300/40" />
        <div className="h-0.5 bg-gradient-to-r from-fridge-100 via-fridge-200 to-fridge-100" />
      </div>
    </div>
  );
};

export default Index;
