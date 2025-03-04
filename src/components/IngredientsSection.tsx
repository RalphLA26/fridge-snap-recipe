
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import IngredientList from "@/components/IngredientList";

interface IngredientsSectionProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onFindRecipes: () => void;
}

const IngredientsSection = ({ 
  ingredients, 
  onAddIngredient, 
  onRemoveIngredient, 
  onFindRecipes 
}: IngredientsSectionProps) => {
  return (
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
        onAddIngredient={onAddIngredient} 
        onRemoveIngredient={onRemoveIngredient} 
      />
      
      {ingredients.length > 0 && (
        <div className="mt-6 text-center">
          <Button 
            onClick={onFindRecipes}
            className="bg-fridge-600 hover:bg-fridge-700 text-white shadow-sm transition-all duration-200 cursor-pointer"
            type="button"
          >
            <Search className="mr-2 h-4 w-4" />
            Find Recipes with {ingredients.length} Ingredient{ingredients.length !== 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default IngredientsSection;
