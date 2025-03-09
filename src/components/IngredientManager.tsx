
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Search, Check, X, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface IngredientManagerProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onFindRecipes: () => void;
}

const IngredientManager = ({ 
  ingredients, 
  onAddIngredient, 
  onRemoveIngredient, 
  onFindRecipes 
}: IngredientManagerProps) => {
  const [newIngredient, setNewIngredient] = useState("");
  
  const handleAddIngredient = () => {
    const ingredient = newIngredient.trim();
    if (!ingredient) return;
    
    if (ingredients.includes(ingredient)) {
      toast.error("This ingredient is already in your list");
      return;
    }
    
    onAddIngredient(ingredient);
    setNewIngredient("");
    toast.success(`Added ${ingredient} to your ingredients`);
  };
  
  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="bg-fridge-100 rounded-full p-2 mr-3">
            <PlusCircle className="h-5 w-5 text-fridge-600" />
          </span>
          My Ingredients
          {ingredients.length > 0 && (
            <span className="ml-2 text-sm bg-fridge-100 text-fridge-800 py-0.5 px-2 rounded-full">
              {ingredients.length}
            </span>
          )}
        </h2>
      </div>
      
      <div className="space-y-5">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
            className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fridge-400 focus-visible:ring-offset-2 transition-all duration-200"
            placeholder="Add more ingredients..."
          />
          <Button 
            onClick={handleAddIngredient}
            size="icon"
            className="h-12 w-12 rounded-full bg-fridge-600 hover:bg-fridge-700 text-white cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
            type="button"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <div>
          {ingredients.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 rounded-full p-3 mb-3">
                  <PlusCircle className="h-6 w-6 text-gray-400" />
                </div>
                <p>No ingredients yet. Add ingredients or take a photo of your fridge.</p>
              </div>
            </div>
          ) : (
            <>
              <motion.ul 
                className="space-y-2 max-h-[320px] overflow-y-auto pr-1 mb-5 scrollbar-hidden"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {ingredients.map((ingredient) => (
                  <motion.li 
                    key={ingredient}
                    variants={item}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-fridge-100 rounded-full p-1 mr-2">
                        <Check className="h-3 w-3 text-fridge-600" />
                      </div>
                      <span className="font-medium">{ingredient}</span>
                    </div>
                    <Button
                      onClick={() => onRemoveIngredient(ingredient)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-white cursor-pointer transition-all duration-200"
                      type="button"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </motion.li>
                ))}
              </motion.ul>
              
              <div className="text-center">
                <Button 
                  onClick={onFindRecipes}
                  className="bg-fridge-600 hover:bg-fridge-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6 py-3 cursor-pointer"
                  type="button"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Find Recipes with {ingredients.length} Ingredient{ingredients.length !== 1 ? 's' : ''}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default IngredientManager;
