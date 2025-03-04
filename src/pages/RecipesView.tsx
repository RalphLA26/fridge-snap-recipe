
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import { findRecipesByIngredients } from "@/lib/recipeData";

const RecipesView = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  
  // Load saved ingredients from localStorage on initial render
  useEffect(() => {
    const savedIngredients = localStorage.getItem("fridgeIngredients");
    if (savedIngredients) {
      const parsedIngredients = JSON.parse(savedIngredients);
      setIngredients(parsedIngredients);
      
      // Find recipes based on ingredients
      const matchedRecipes = findRecipesByIngredients(parsedIngredients);
      setRecipes(matchedRecipes);
    } else {
      // No ingredients found, show all recipes
      const allRecipes = findRecipesByIngredients([]);
      setRecipes(allRecipes);
    }
  }, []);
  
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
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
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Suggested Recipes</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="container max-w-xl mx-auto p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {ingredients.length > 0
              ? `Found ${recipes.length} recipes using your ${ingredients.length} ingredients`
              : "Browse all available recipes"}
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {recipes.map(({ recipe, matchingCount }) => (
            <motion.div key={recipe.id} variants={item}>
              <RecipeCard
                id={recipe.id}
                title={recipe.title}
                image={recipe.image}
                cookTime={recipe.cookTime}
                matchingIngredients={matchingCount}
                totalIngredients={recipe.ingredients.length}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </motion.div>
  );
};

export default RecipesView;
