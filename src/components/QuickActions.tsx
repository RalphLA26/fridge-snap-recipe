
import { Camera, Search, Scan } from "lucide-react";
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
      {/* Scan Ingredients Card */}
      <motion.div
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCameraClick}
        className="bg-gradient-to-br from-fridge-50 to-white p-5 rounded-xl shadow-md cursor-pointer border border-fridge-100 transition-all duration-200"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-fridge-100 flex items-center justify-center mb-3 shadow-sm">
            <Camera className="w-7 h-7 text-fridge-600" />
          </div>
          <h3 className="font-medium text-gray-900 text-lg mb-1">Scan Food</h3>
          <p className="text-sm text-gray-600">
            Take a photo to identify ingredients
          </p>
          <div className="mt-2 text-xs px-3 py-1 rounded-full bg-fridge-100 text-fridge-700 font-medium">
            Quick & Easy
          </div>
        </div>
      </motion.div>

      {/* Find Recipes Card */}
      <motion.div
        whileHover={ingredientsCount > 0 ? { scale: 1.03, y: -3 } : {}}
        whileTap={ingredientsCount > 0 ? { scale: 0.98 } : {}}
        onClick={onFindRecipes}
        className={`p-5 rounded-xl shadow-md cursor-pointer transition-all duration-200 ${
          ingredientsCount > 0 
            ? 'bg-gradient-to-br from-fridge-600 to-fridge-700 text-white' 
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-sm ${
            ingredientsCount > 0 ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            <Search className="w-7 h-7 text-current" />
          </div>
          <h3 className="font-medium mb-1 text-lg">Find Recipes</h3>
          <p className="text-sm opacity-90">
            {ingredientsCount > 0 ? (
              `Use your ${ingredientsCount} ingredient${ingredientsCount !== 1 ? 's' : ''}`
            ) : (
              'Add ingredients first'
            )}
          </p>
          {ingredientsCount > 0 && (
            <div className="mt-2 text-xs px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              {ingredientsCount} Available
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuickActions;
