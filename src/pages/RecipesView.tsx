
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import { findRecipesByIngredients } from "@/lib/recipeData";

const RecipesView = () => {
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
      <header className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container max-w-xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Recipes</h1>
          <div className="flex space-x-2">
            <span className="text-sm text-gray-500 bg-gray-100 py-1 px-3 rounded-full">
              {ingredients.length} ingredients
            </span>
          </div>
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
