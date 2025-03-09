
import { Camera, Search } from "lucide-react";

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
    <div className="grid gap-4 grid-cols-2 mt-6">
      <div
        onClick={onCameraClick}
        className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md transition-all duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <Camera className="w-5 h-5 text-fridge-600" />
        </div>
        <h3 className="font-medium text-gray-900">Scan Ingredients</h3>
        <p className="text-sm text-gray-500">Take a photo of your fridge</p>
      </div>

      <div
        onClick={onFindRecipes}
        className={`${ingredientsCount > 0 ? 'bg-fridge-400' : 'bg-blue-300'} p-6 rounded-xl shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md transition-all duration-200`}
      >
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center mb-2">
          <Search className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-medium text-white">Find Recipes</h3>
        <p className="text-sm text-white/90">
          {ingredientsCount > 0 
            ? `Use your ${ingredientsCount} ingredient${ingredientsCount !== 1 ? 's' : ''}`
            : 'Add ingredients first'}
        </p>
      </div>
    </div>
  );
};

export default QuickActions;
