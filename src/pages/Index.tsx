
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/Header";
import HomeBanner from "@/components/HomeBanner";
import IngredientManager from "@/components/IngredientManager";
import QuickActions from "@/components/QuickActions";
import { ShoppingBag, Clock, ChefHat } from "lucide-react";

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

  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 py-4">
        <div className="space-y-4">
          <HomeBanner />
          
          <QuickActions 
            ingredientsCount={ingredients.length}
            onCameraClick={handleCameraClick}
            onFindRecipes={handleFindRecipes}
          />
          
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => handleNavigate("/shopping-list")}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
            >
              <div className="w-8 h-8 bg-fridge-50 rounded-full flex items-center justify-center mb-1">
                <ShoppingBag className="w-4 h-4 text-fridge-600" />
              </div>
              <span className="text-xs font-medium">Shopping</span>
            </button>
            
            <button 
              onClick={() => handleNavigate("/inventory")}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
            >
              <div className="w-8 h-8 bg-fridge-50 rounded-full flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-fridge-600" />
              </div>
              <span className="text-xs font-medium">Inventory</span>
            </button>
            
            <button 
              onClick={() => handleNavigate("/recipes")}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
            >
              <div className="w-8 h-8 bg-fridge-50 rounded-full flex items-center justify-center mb-1">
                <ChefHat className="w-4 h-4 text-fridge-600" />
              </div>
              <span className="text-xs font-medium">Recipes</span>
            </button>
          </div>
          
          <IngredientManager
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onFindRecipes={handleFindRecipes}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
