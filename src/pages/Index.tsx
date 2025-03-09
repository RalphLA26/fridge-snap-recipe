
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/Header";
import HomeBanner from "@/components/HomeBanner";
import IngredientManager from "@/components/IngredientManager";
import QuickActions from "@/components/QuickActions";

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 py-6">
        <div className="space-y-5">
          <HomeBanner />
          
          <QuickActions 
            ingredientsCount={ingredients.length}
            onCameraClick={handleCameraClick}
            onFindRecipes={handleFindRecipes}
          />
          
          <div className="flex justify-between">
            <button 
              onClick={() => navigate("/shopping-list")}
              className="flex-1 py-3 text-center bg-white rounded-lg border border-gray-100 shadow-sm mx-1"
            >
              <span className="text-sm font-medium">Shopping</span>
            </button>
            
            <button 
              onClick={() => navigate("/inventory")}
              className="flex-1 py-3 text-center bg-white rounded-lg border border-gray-100 shadow-sm mx-1"
            >
              <span className="text-sm font-medium">Inventory</span>
            </button>
            
            <button 
              onClick={() => navigate("/recipes")}
              className="flex-1 py-3 text-center bg-white rounded-lg border border-gray-100 shadow-sm mx-1"
            >
              <span className="text-sm font-medium">Recipes</span>
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
