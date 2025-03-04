
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/Header";
import UnifiedHomeCard from "@/components/UnifiedHomeCard";

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
    console.log("Index component mounted");
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
  
  const handleCameraClick = () => {
    console.log("Camera button clicked");
    navigate("/camera");
  };
  
  const handleFindRecipes = () => {
    console.log("Find Recipes button clicked");
    navigate("/recipes");
  };
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header />
      
      <main className="flex-1 container max-w-xl mx-auto px-4 py-6">
        <UnifiedHomeCard 
          ingredients={ingredients}
          onAddIngredient={handleAddIngredient}
          onRemoveIngredient={handleRemoveIngredient}
          onCameraClick={handleCameraClick}
          onFindRecipes={handleFindRecipes}
        />
      </main>
    </motion.div>
  );
};

export default Index;
