
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
    <div className="grid gap-4 grid-cols-2 mt-5">
      {/* Scan Ingredients */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCameraClick}
        className="bg-white p-5 rounded-xl shadow-sm cursor-pointer border border-gray-100 transition-all duration-200"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-fridge-50 flex items-center justify-center mb-3">
            <Camera className="w-6 h-6 text-fridge-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-1">Scan Food</h3>
          <p className="text-sm text-gray-500">Take a photo of your ingredients</p>
        </div>
      </motion.div>

      {/* Find Recipes */}
      <motion.div
        whileHover={ingredientsCount > 0 ? { scale: 1.02, y: -2 } : {}}
        whileTap={ingredientsCount > 0 ? { scale: 0.98 } : {}}
        onClick={onFindRecipes}
        className={`p-5 rounded-xl shadow-sm cursor-pointer transition-all duration-200 ${
          ingredientsCount > 0 
            ? 'bg-fridge-600 text-white' 
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
            ingredientsCount > 0 ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            <Search className="w-6 h-6 text-current" />
          </div>
          <h3 className="font-medium mb-1">Find Recipes</h3>
          <p className="text-sm opacity-90">
            {ingredientsCount > 0 ? (
              `Use your ${ingredientsCount} ingredient${ingredientsCount !== 1 ? 's' : ''}`
            ) : (
              'Add ingredients first'
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickActions;
