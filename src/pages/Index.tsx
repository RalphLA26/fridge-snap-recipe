
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, Search, User, ShoppingBag, PlusCircle } from "lucide-react";
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
      <header className="py-4 px-4 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="container max-w-xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-fridge-700 flex items-center">
            <svg className="w-7 h-7 mr-2 text-fridge-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="4" y1="10" x2="20" y2="10" />
            </svg>
            FridgeSnap
          </h1>
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/shopping-list")}
              className="relative bg-gray-50 hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center shadow-sm transition-all duration-200"
            >
              <ShoppingBag className="h-5 w-5 text-fridge-700" />
              {user?.shoppingList.length ? (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                  {user.shoppingList.length}
                </span>
              ) : null}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/profile")}
              className="bg-gray-50 hover:bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center shadow-sm transition-all duration-200"
            >
              <User className="h-5 w-5 text-fridge-700" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container max-w-xl mx-auto px-4 py-6 space-y-8">
        <section>
          <motion.div
            className="rounded-2xl shadow-lg overflow-hidden relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-fridge-500 to-fridge-700 p-6 text-white relative overflow-hidden">
              {/* Background decorative pattern */}
              <div className="absolute right-0 top-0 opacity-10 w-full h-full">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              {/* Icon */}
              <div className="mb-4 relative">
                <div className="inline-flex items-center justify-center p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="4" y1="10" x2="20" y2="10" />
                    <line x1="10" y1="2" x2="10" y2="10" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">What's in your fridge?</h2>
              <p className="mb-6 opacity-90 text-white/90 max-w-md">
                Take a photo of your ingredients or add them manually to discover personalized recipes just for you.
              </p>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <Button 
                  className="bg-white text-fridge-700 hover:bg-gray-100 shadow-md border border-white/30 h-12"
                  onClick={handleCameraClick}
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Scan Your Fridge
                </Button>
                
                <Button 
                  className="bg-fridge-600 text-white hover:bg-fridge-700 shadow-md border border-fridge-500/30 h-12"
                  onClick={handleFindRecipes}
                  disabled={ingredients.length === 0}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Recipes
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
        
        <section>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="bg-fridge-100 rounded-full p-1.5 mr-3">
                  <PlusCircle className="h-5 w-5 text-fridge-600" />
                </span>
                My Ingredients
                {ingredients.length > 0 && (
                  <span className="ml-2 text-sm bg-fridge-100 text-fridge-800 py-0.5 px-2 rounded-full">
                    {ingredients.length}
                  </span>
                )}
              </h3>
            </div>
            
            <IngredientList 
              ingredients={ingredients} 
              onAddIngredient={handleAddIngredient} 
              onRemoveIngredient={handleRemoveIngredient} 
            />
            
            {ingredients.length > 0 && (
              <div className="mt-6 text-center">
                <Button 
                  onClick={handleFindRecipes}
                  className="bg-fridge-600 hover:bg-fridge-700 text-white shadow-sm transition-all duration-200"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Find Recipes with {ingredients.length} Ingredient{ingredients.length !== 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
};

export default Index;
