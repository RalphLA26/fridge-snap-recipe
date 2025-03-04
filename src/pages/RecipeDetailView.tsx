
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeDetail from "@/components/RecipeDetail";
import { findRecipeById } from "@/lib/recipeData";
import { toast } from "sonner";

const RecipeDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [favorite, setFavorite] = useState(false);
  
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
        
        // Check if recipe is in favorites
        const favorites = localStorage.getItem("favoriteRecipes");
        if (favorites) {
          const parsedFavorites = JSON.parse(favorites);
          setFavorite(parsedFavorites.includes(id));
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
    if (!id) return;
    
    // Get current favorites
    const favorites = localStorage.getItem("favoriteRecipes");
    const parsedFavorites = favorites ? JSON.parse(favorites) : [];
    
    // Update favorites
    if (favorite) {
      const updatedFavorites = parsedFavorites.filter((recipeId: string) => recipeId !== id);
      localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));
      setFavorite(false);
      toast.info("Removed from favorites");
    } else {
      const updatedFavorites = [...parsedFavorites, id];
      localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));
      setFavorite(true);
      toast.success("Added to favorites");
    }
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
      </main>
    </motion.div>
  );
};

export default RecipeDetailView;
