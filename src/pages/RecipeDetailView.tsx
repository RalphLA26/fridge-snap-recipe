
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Heart, ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeDetail from "@/components/RecipeDetail";
import { findRecipeById } from "@/lib/recipeData";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const RecipeDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, addToFavorites, removeFromFavorites, isFavorite, addToShoppingList } = useUser();
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  
  useEffect(() => {
    // Simulate loading time for a smoother experience
    const timer = setTimeout(() => {
      if (id) {
        const foundRecipe = findRecipeById(id);
        setRecipe(foundRecipe);
        
        // Load saved ingredients
        const savedIngredients = localStorage.getItem("fridgeIngredients");
        if (savedIngredients) {
          setIngredients(JSON.parse(savedIngredients));
        }
      }
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handleShare = () => {
    // Mock share functionality
    toast.success("Recipe shared successfully!");
  };
  
  const handleToggleFavorite = () => {
    if (!id || !recipe) return;
    
    if (isFavorite(id)) {
      removeFromFavorites(id);
      toast.info("Removed from favorites");
    } else {
      addToFavorites(id);
      toast.success("Added to favorites");
    }
  };
  
  const handleAddIngredientsToList = () => {
    if (!recipe) return;
    
    // Get missing ingredients
    const missingIngredients = recipe.ingredients.filter((ingredient: string) => 
      !ingredients.some(userIngredient => 
        ingredient.toLowerCase().includes(userIngredient.toLowerCase())
      )
    );
    
    if (missingIngredients.length === 0) {
      toast.info("You already have all the ingredients!");
      return;
    }
    
    // Add each missing ingredient to shopping list
    missingIngredients.forEach((ingredient: string) => {
      addToShoppingList({
        name: ingredient,
        quantity: "1",
        isChecked: false
      });
    });
    
    toast.success(`Added ${missingIngredients.length} ingredients to your shopping list`);
    
    // Optional: Navigate to shopping list
    // navigate("/shopping-list");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-fridge-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-medium mb-2">Recipe not found</h2>
        <p className="text-gray-500 mb-4">The recipe you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/recipes")}>
          Back to Recipes
        </Button>
      </div>
    );
  }
  
  const favorite = isFavorite(id || "");
  
  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container max-w-xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/recipes")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Recipe Details</h1>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleToggleFavorite}
              className={favorite ? "text-red-500" : ""}
            >
              <Heart className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container max-w-xl mx-auto p-4">
        <RecipeDetail recipe={recipe} availableIngredients={ingredients} />
        
        <div className="mt-6">
          <Button 
            className="w-full py-6 flex items-center justify-center bg-fridge-600 hover:bg-fridge-700 text-white shadow-md"
            onClick={handleAddIngredientsToList}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Add Missing Ingredients to Shopping List
          </Button>
        </div>
      </main>
    </motion.div>
  );
};

export default RecipeDetailView;
