
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetectedIngredientsProps {
  ingredients: string[];
  isAnalyzing: boolean;
  onRetake: () => void;
  onSave: () => void;
}

const DetectedIngredients = ({
  ingredients,
  isAnalyzing,
  onRetake,
  onSave,
}: DetectedIngredientsProps) => {
  return (
    <div className="bg-white p-4 rounded-t-2xl -mt-6 pt-8 min-h-64 z-10 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]">
      <h2 className="text-xl font-semibold mb-2">
        {ingredients.length > 0 
          ? `Detected Ingredients (${ingredients.length})` 
          : "No ingredients detected"}
      </h2>
      
      {ingredients.length > 0 ? (
        <div className="mb-6">
          <ul className="space-y-2 max-h-60 overflow-y-auto px-1">
            {ingredients.map((ingredient, index) => (
              <li 
                key={index}
                className="px-3 py-2.5 bg-fridge-50 rounded-md text-sm flex items-center justify-between border border-fridge-100"
              >
                <div className="flex items-center">
                  <span className="h-2 w-2 bg-fridge-500 rounded-full mr-2"></span>
                  <span className="font-medium text-fridge-900">{ingredient}</span>
                </div>
                <div className="flex space-x-1">
                  <Check className="h-4 w-4 text-fridge-500" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center my-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-gray-300">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <p>Try taking another photo or adding ingredients manually</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline"
          onClick={onRetake}
          className="border-fridge-200 hover:bg-fridge-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          Retake Photo
        </Button>
        <Button 
          onClick={onSave}
          disabled={ingredients.length === 0 || isAnalyzing}
          className="bg-fridge-600 hover:bg-fridge-700"
        >
          <Check className="h-4 w-4 mr-2" />
          Save to Fridge
        </Button>
      </div>
    </div>
  );
};

export default DetectedIngredients;
