
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/Header";
import HomeBanner from "@/components/HomeBanner";
import IngredientManager from "@/components/IngredientManager";
import QuickActions from "@/components/QuickActions";
import { ShoppingBag, Clock, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  // Define the animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
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
        <motion.div 
          className="space-y-6" 
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <HomeBanner />
          </motion.div>
          
          <motion.div variants={item}>
            <QuickActions 
              ingredientsCount={ingredients.length}
              onCameraClick={handleCameraClick}
              onFindRecipes={handleFindRecipes}
            />
          </motion.div>
          
          <motion.div variants={item}>
            <div className="grid grid-cols-3 gap-3">
              <Card 
                className="bg-white border border-gray-100 rounded-xl hover:shadow-md cursor-pointer transition-all duration-200"
                onClick={() => handleNavigate("/shopping-list")}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-fridge-50 rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag className="w-5 h-5 text-fridge-600" />
                  </div>
                  <span className="text-sm font-medium">Shopping</span>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-white border border-gray-100 rounded-xl hover:shadow-md cursor-pointer transition-all duration-200"
                onClick={() => handleNavigate("/inventory")}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-fridge-50 rounded-full flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-fridge-600" />
                  </div>
                  <span className="text-sm font-medium">Inventory</span>
                </CardContent>
              </Card>
              
              <Card 
                className="bg-white border border-gray-100 rounded-xl hover:shadow-md cursor-pointer transition-all duration-200"
                onClick={() => handleNavigate("/recipes")}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-fridge-50 rounded-full flex items-center justify-center mb-2">
                    <ChefHat className="w-5 h-5 text-fridge-600" />
                  </div>
                  <span className="text-sm font-medium">Recipes</span>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          <motion.div variants={item}>
            <IngredientManager
              ingredients={ingredients}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              onFindRecipes={handleFindRecipes}
            />
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Index;
