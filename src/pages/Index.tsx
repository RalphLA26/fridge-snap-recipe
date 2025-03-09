
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/Header";
import HomeBanner from "@/components/HomeBanner";
import IngredientManager from "@/components/IngredientManager";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [ingredients, setIngredients] = useState<string[]>([]);
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <HomeBanner />
          
          <IngredientManager
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onFindRecipes={handleFindRecipes}
          />
        </motion.div>
      </main>
      
      {/* Enhanced footer with gradients */}
      <div className="h-1 bg-gradient-to-r from-fridge-300/50 via-fridge-500/60 to-fridge-300/50" />
      <div className="h-0.5 bg-gradient-to-r from-fridge-100 via-fridge-200 to-fridge-100" />
    </div>
  );
};

export default Index;
