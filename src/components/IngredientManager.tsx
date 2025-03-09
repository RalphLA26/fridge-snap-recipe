
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.div 
          className="flex items-center"
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="bg-fridge-100 rounded-full p-2 mr-3 shadow-sm">
            <PlusCircle className="h-5 w-5 text-fridge-600" />
          </span>
          <h2 className="text-xl font-semibold text-gray-800">
            My Ingredients
            {ingredients.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-2 text-sm bg-fridge-100 text-fridge-800 py-0.5 px-2 rounded-full inline-flex"
              >
                {ingredients.length}
              </motion.span>
            )}
          </h2>
        </motion.div>
      </div>
      
      <div className="space-y-5">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
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
        </motion.div>
        
        <div>
          <AnimatePresence mode="wait">
            {ingredients.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-10 text-muted-foreground bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex flex-col items-center">
                  <motion.div 
                    className="bg-gray-100 rounded-full p-3 mb-3"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, repeatType: "mirror", duration: 2, repeatDelay: 1 }}
                  >
                    <PlusCircle className="h-6 w-6 text-gray-400" />
                  </motion.div>
                  <p>No ingredients yet. Add ingredients or take a photo of your fridge.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.ul 
                  className="space-y-2 max-h-[320px] overflow-y-auto pr-1 mb-5 scrollbar-hidden"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {ingredients.map((ingredient, index) => (
                    <motion.li 
                      key={ingredient}
                      variants={item}
                      className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      whileHover={{ x: 2, backgroundColor: "rgba(241, 245, 249, 1)" }}
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
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Button 
                    onClick={onFindRecipes}
                    className="bg-fridge-600 hover:bg-fridge-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6 py-5 cursor-pointer rounded-lg"
                    type="button"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Find Recipes with {ingredients.length} Ingredient{ingredients.length !== 1 ? 's' : ''}
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1, repeatDelay: 1 }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default IngredientManager;
