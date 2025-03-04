
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, Search, User, ShoppingBag } from "lucide-react";
import IngredientList from "@/components/IngredientList";
import { useUser } from "@/contexts/UserContext";

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
  
  const handleCameraClick = () => {
    navigate("/camera");
  };
  
  const handleFindRecipes = () => {
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
      <header className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container max-w-xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-fridge-800">FridgeSnap</h1>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/shopping-list")}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {user?.shoppingList.length ? (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {user.shoppingList.length}
                </span>
              ) : null}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/profile")}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container max-w-xl mx-auto p-4 space-y-6">
        <section className="mt-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-fridge-500 to-fridge-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 opacity-10">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7zm0 2h10v14H7V5zm2 2v4h6V7H9zm0 6v4h6v-4H9z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold mb-2">What's in your fridge?</h2>
            <p className="mb-4 opacity-90">Take a photo of your fridge or add ingredients manually to find delicious recipes.</p>
            
            <Button 
              className="w-full bg-white hover:bg-gray-100 text-fridge-700 mb-3 shadow-md"
              onClick={handleCameraClick}
            >
              <Camera className="mr-2 h-5 w-5" />
              Take a Photo
            </Button>
            
            <Button 
              className="w-full bg-fridge-600 hover:bg-fridge-700 text-white shadow-md"
              onClick={handleFindRecipes}
              disabled={ingredients.length === 0}
            >
              <Search className="mr-2 h-5 w-5" />
              Find Recipes
            </Button>
          </motion.div>
        </section>
        
        <section className="mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <IngredientList 
              ingredients={ingredients} 
              onAddIngredient={handleAddIngredient} 
              onRemoveIngredient={handleRemoveIngredient} 
            />
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
};

export default Index;
