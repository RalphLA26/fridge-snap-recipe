
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, X, Check, Plus } from "lucide-react";
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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-gray-800 flex items-center">
          My Ingredients
          {ingredients.length > 0 && (
            <span className="ml-2 text-sm bg-fridge-100 text-fridge-800 py-0.5 px-2.5 rounded-full">
              {ingredients.length}
            </span>
          )}
        </h2>
      </div>
      
      <div className="space-y-4">
        {/* Add ingredient input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
            className="flex h-11 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fridge-400 focus-visible:ring-offset-2"
            placeholder="Add an ingredient..."
          />
          <Button 
            onClick={handleAddIngredient}
            size="icon"
            className="h-11 w-11 rounded-lg bg-fridge-600 hover:bg-fridge-700 text-white shadow-sm"
            type="button"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <div>
          <AnimatePresence>
            {ingredients.length === 0 ? (
              <motion.div 
                className="text-center py-8 bg-gray-50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-full p-3 mb-3">
                    <PlusCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 max-w-[200px] mx-auto">No ingredients yet. Add ingredients to get started.</p>
                </div>
              </motion.div>
            ) : (
              <div>
                <motion.ul 
                  className="space-y-2 max-h-[280px] overflow-y-auto pr-1 mb-4 py-1"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {ingredients.map((ingredient) => (
                    <motion.li 
                      key={ingredient}
                      className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-100 group hover:bg-gray-100 transition-colors duration-200"
                      variants={item}
                      layout
                    >
                      <div className="flex items-center">
                        <div className="bg-fridge-100 rounded-full p-1 mr-3">
                          <Check className="h-3 w-3 text-fridge-600" />
                        </div>
                        <span className="text-gray-700">{ingredient}</span>
                      </div>
                      <Button
                        onClick={() => onRemoveIngredient(ingredient)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-gray-200 opacity-70 group-hover:opacity-100"
                        type="button"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </motion.li>
                  ))}
                </motion.ul>
                
                {ingredients.length > 0 && (
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button 
                      onClick={onFindRecipes}
                      className="bg-fridge-600 hover:bg-fridge-700 text-white px-5 py-2 rounded-lg shadow-sm"
                      type="button"
                    >
                      Find Recipes with {ingredients.length} Ingredient{ingredients.length !== 1 ? 's' : ''}
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default IngredientManager;
