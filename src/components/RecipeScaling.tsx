
import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scaleRecipe } from "@/lib/recipeScaling";

interface RecipeScalingProps {
  originalServings: string;
  ingredients: string[];
  onIngredientsScaled: (newIngredients: string[]) => void;
}

const RecipeScaling = ({ originalServings, ingredients, onIngredientsScaled }: RecipeScalingProps) => {
  // Parse the original servings to get the number
  const originalServingsNumber = parseInt(originalServings.split(' ')[0]) || 1;
  
  const [servings, setServings] = useState(originalServingsNumber);
  
  // Scale ingredients whenever servings change
  useEffect(() => {
    const scaleFactor = servings / originalServingsNumber;
    const newIngredients = scaleRecipe(ingredients, scaleFactor);
    onIngredientsScaled(newIngredients);
  }, [servings, originalServingsNumber, ingredients, onIngredientsScaled]);
  
  const incrementServings = () => {
    setServings(prev => prev + 1);
  };
  
  const decrementServings = () => {
    if (servings > 1) {
      setServings(prev => prev - 1);
    }
  };
  
  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-white mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Adjust Recipe Size</h3>
      
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="icon"
          onClick={decrementServings}
          disabled={servings <= 1}
          className="h-8 w-8"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col items-center">
          <span className="text-xl font-semibold">{servings}</span>
          <span className="text-xs text-gray-500">servings</span>
        </div>
        
        <Button 
          variant="outline"
          size="icon"
          onClick={incrementServings}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RecipeScaling;
