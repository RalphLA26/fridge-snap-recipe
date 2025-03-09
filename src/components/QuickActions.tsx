
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
    <div className="flex gap-4">
      <Button
        onClick={onCameraClick}
        className="flex-1 py-3 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 rounded-lg shadow-sm border border-gray-100"
        variant="outline"
        type="button"
      >
        <Camera className="w-5 h-5 text-fridge-600" />
        <span>Scan Food</span>
      </Button>

      <Button
        onClick={onFindRecipes}
        disabled={ingredientsCount === 0}
        className="flex-1 py-3 flex items-center justify-center gap-2 bg-fridge-500 hover:bg-fridge-600 text-white rounded-lg shadow-sm"
        type="button"
      >
        <Search className="w-5 h-5 text-white" />
        <span>Find Recipes</span>
      </Button>
    </div>
  );
};

export default QuickActions;
