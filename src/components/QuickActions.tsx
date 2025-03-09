
import { Camera, Search } from "lucide-react";
import { motion } from "framer-motion";

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
      {/* Scan Ingredients */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onCameraClick}
        className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer border border-gray-100"
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <Camera className="w-6 h-6 text-gray-700" />
        </div>
        <h3 className="font-medium text-gray-900">Scan Food</h3>
        <p className="text-sm text-gray-500">Take a photo of ingredients</p>
      </motion.div>

      {/* Find Recipes */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onFindRecipes}
        className={`${ingredientsCount > 0 
          ? 'bg-fridge-600 text-white' 
          : 'bg-gray-100 text-gray-400'
        } p-4 rounded-xl shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer`}
      >
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
          <Search className="w-6 h-6 text-current" />
        </div>
        <h3 className="font-medium">Find Recipes</h3>
        <p className="text-sm opacity-90">
          {ingredientsCount > 0 ? (
            `Use your ${ingredientsCount} ingredient${ingredientsCount !== 1 ? 's' : ''}`
          ) : (
            'Add ingredients first'
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default QuickActions;
