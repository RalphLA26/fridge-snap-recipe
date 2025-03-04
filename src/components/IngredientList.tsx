
import { useState } from "react";
import { Check, X, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface IngredientListProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
}

const IngredientList = ({ ingredients, onAddIngredient, onRemoveIngredient }: IngredientListProps) => {
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
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Add more ingredients..."
        />
        <Button 
          onClick={handleAddIngredient}
          size="icon"
          className="h-10 w-10 rounded-full bg-fridge-600 hover:bg-fridge-700 text-white"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Your Ingredients</h3>
        
        {ingredients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No ingredients yet. Add ingredients or take a photo of your fridge.</p>
          </div>
        ) : (
          <motion.ul 
            className="space-y-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {ingredients.map((ingredient) => (
              <motion.li 
                key={ingredient}
                variants={item}
                className="flex items-center justify-between py-2 px-4 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-fridge-600 mr-2" />
                  <span>{ingredient}</span>
                </div>
                <Button
                  onClick={() => onRemoveIngredient(ingredient)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default IngredientList;
