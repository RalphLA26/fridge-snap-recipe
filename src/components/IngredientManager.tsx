
import { useState } from "react";
import { PlusCircle, Search, Check, X, Plus } from "lucide-react";
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
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-fridge-600" />
          My Ingredients
          {ingredients.length > 0 && (
            <span className="text-xs bg-fridge-100 text-fridge-800 py-0.5 px-2 rounded-full">
              {ingredients.length}
            </span>
          )}
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            placeholder="Add ingredients..."
          />
          <Button 
            onClick={handleAddIngredient}
            size="icon"
            className="h-10 w-10 rounded-full bg-fridge-600 hover:bg-fridge-700 text-white"
            type="button"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div>
          {ingredients.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm bg-gray-50 rounded-lg border border-gray-100">
              <p>Add ingredients to get started</p>
            </div>
          ) : (
            <>
              <ul className="space-y-2 max-h-[240px] overflow-y-auto pr-1 mb-4">
                {ingredients.map((ingredient) => (
                  <li 
                    key={ingredient}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="bg-fridge-100 rounded-full p-1 mr-2">
                        <Check className="h-3 w-3 text-fridge-600" />
                      </div>
                      <span className="text-sm">{ingredient}</span>
                    </div>
                    <Button
                      onClick={() => onRemoveIngredient(ingredient)}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full hover:bg-white"
                      type="button"
                    >
                      <X className="h-3 w-3 text-gray-500" />
                    </Button>
                  </li>
                ))}
              </ul>
              
              {ingredients.length > 0 && (
                <div className="text-center">
                  <Button 
                    onClick={onFindRecipes}
                    className="bg-fridge-600 hover:bg-fridge-700 text-white text-sm w-full"
                    type="button"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Find Recipes ({ingredients.length})
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientManager;
