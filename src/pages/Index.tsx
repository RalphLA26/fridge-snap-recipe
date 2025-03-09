
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-lg mx-auto px-5 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
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
      
      {/* Enhanced footer with multi-layer gradients */}
      <div className="mt-auto">
        <div className="h-1.5 bg-gradient-to-r from-fridge-300/40 via-fridge-500/70 to-fridge-300/40" />
        <div className="h-0.5 bg-gradient-to-r from-fridge-100 via-fridge-200 to-fridge-100" />
      </div>
    </div>
  );
};

export default Index;
