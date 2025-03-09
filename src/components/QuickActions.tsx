
import { Camera, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  ingredientsCount: number;
  onCameraClick: () => void;
  onFindRecipes: () => void;
}

const QuickActions = ({ 
  ingredientsCount, 
  onCameraClick, 
  onFindRecipes 
}: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        onClick={onCameraClick}
        className="h-auto py-4 flex flex-col items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 rounded-xl shadow border border-gray-100"
        variant="outline"
        type="button"
      >
        <div className="w-10 h-10 bg-fridge-50 rounded-full flex items-center justify-center">
          <Camera className="w-5 h-5 text-fridge-600" />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-sm">Scan</h3>
          <p className="text-xs text-gray-500">Take a photo</p>
        </div>
      </Button>

      <Button
        onClick={onFindRecipes}
        disabled={ingredientsCount === 0}
        className="h-auto py-4 flex flex-col items-center gap-2 bg-fridge-500 hover:bg-fridge-600 text-white rounded-xl shadow border border-fridge-400"
        type="button"
      >
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-sm">Find Recipes</h3>
          <p className="text-xs text-white/80">
            {ingredientsCount > 0 
              ? `${ingredientsCount} ingredient${ingredientsCount !== 1 ? 's' : ''}`
              : 'Add ingredients first'}
          </p>
        </div>
      </Button>
    </div>
  );
};

export default QuickActions;
