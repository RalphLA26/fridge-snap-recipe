
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, X, Plus, Check } from "lucide-react";
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-medium text-gray-800">
          My Ingredients
          {ingredients.length > 0 && (
            <span className="ml-2 text-sm bg-fridge-100 text-fridge-800 py-0.5 px-2 rounded-full">
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
            className="flex h-10 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fridge-400 focus-visible:ring-offset-2"
            placeholder="Add an ingredient..."
          />
          <Button 
            onClick={handleAddIngredient}
            size="icon"
            className="h-10 w-10 rounded-lg bg-fridge-600 hover:bg-fridge-700 text-white"
            type="button"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <div>
          {ingredients.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 rounded-full p-3 mb-3">
                  <PlusCircle className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No ingredients yet. Add ingredients to get started.</p>
              </div>
            </div>
          ) : (
            <div>
              <ul className="space-y-2 max-h-[320px] overflow-y-auto pr-1 mb-4">
                {ingredients.map((ingredient) => (
                  <li 
                    key={ingredient}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="bg-fridge-100 rounded-full p-1 mr-2">
                        <Check className="h-3 w-3 text-fridge-600" />
                      </div>
                      <span>{ingredient}</span>
                    </div>
                    <Button
                      onClick={() => onRemoveIngredient(ingredient)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-gray-200"
                      type="button"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </li>
                ))}
              </ul>
              
              {ingredients.length > 0 && (
                <div className="text-center">
                  <Button 
                    onClick={onFindRecipes}
                    className="bg-fridge-600 hover:bg-fridge-700 text-white px-4 py-2"
                    type="button"
                  >
                    Find Recipes ({ingredients.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientManager;
