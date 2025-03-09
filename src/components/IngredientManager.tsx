
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, X, Check, Plus, ListChecks, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="mt-5 border-fridge-100 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-fridge-50 to-white pb-3">
        <CardTitle className="text-xl font-medium text-gray-800 flex items-center">
          <ListChecks className="mr-2 h-5 w-5 text-fridge-600" />
          My Ingredients
          {ingredients.length > 0 && (
            <span className="ml-2 text-sm bg-fridge-100 text-fridge-800 py-0.5 px-2.5 rounded-full">
              {ingredients.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Add ingredient input */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
                className="flex h-11 w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fridge-400 focus-visible:ring-offset-2"
                placeholder="Add an ingredient..."
              />
              <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
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
                    className="space-y-2 max-h-[280px] overflow-y-auto pr-1 mb-4 py-1 divide-y divide-gray-100"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {ingredients.map((ingredient, index) => (
                      <motion.li 
                        key={ingredient}
                        className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-white to-fridge-50 rounded-lg border border-fridge-100 group hover:from-fridge-50 hover:to-fridge-100 transition-colors duration-200"
                        variants={item}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center">
                          <div className="bg-fridge-100 rounded-full p-1.5 mr-3">
                            <Check className="h-3 w-3 text-fridge-600" />
                          </div>
                          <span className="text-gray-700 font-medium">{ingredient}</span>
                        </div>
                        <Button
                          onClick={() => onRemoveIngredient(ingredient)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-fridge-200 opacity-70 group-hover:opacity-100"
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
                        className="bg-gradient-to-r from-fridge-600 to-fridge-700 hover:from-fridge-700 hover:to-fridge-800 text-white px-5 py-2 rounded-lg shadow-sm inline-flex items-center"
                        type="button"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Find Recipes with {ingredients.length} Ingredient{ingredients.length !== 1 ? 's' : ''}
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IngredientManager;
