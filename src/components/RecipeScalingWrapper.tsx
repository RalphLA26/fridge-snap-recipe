
import { useState } from "react";
import RecipeScaling from "./RecipeScaling";

interface RecipeScalingWrapperProps {
  originalServings: string;
  ingredients: string[];
  onIngredientsUpdate?: (newIngredients: string[]) => void;
}

const RecipeScalingWrapper = ({ 
  originalServings, 
  ingredients, 
  onIngredientsUpdate 
}: RecipeScalingWrapperProps) => {
  const [scaledIngredients, setScaledIngredients] = useState<string[]>(ingredients);
  
  const handleIngredientsScaled = (newIngredients: string[]) => {
    setScaledIngredients(newIngredients);
    if (onIngredientsUpdate) {
      onIngredientsUpdate(newIngredients);
    }
  };
  
  return (
    <div>
      <RecipeScaling 
        originalServings={originalServings} 
        ingredients={ingredients} 
        onIngredientsScaled={handleIngredientsScaled} 
      />
      <div className="mt-4">
        <h3 className="font-medium text-lg mb-2">Scaled Ingredients</h3>
        <ul className="list-disc pl-5 space-y-1">
          {scaledIngredients.map((ingredient, index) => (
            <li key={index} className="text-gray-700">{ingredient}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeScalingWrapper;
