
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
    <div className="grid gap-5 grid-cols-2 mt-6">
      {/* Scan Ingredients Card */}
      <motion.div
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCameraClick}
        className="bg-gradient-to-br from-fridge-50/80 to-white p-5 rounded-xl shadow-md cursor-pointer border border-fridge-100 transition-all duration-200 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-fridge-50 rounded-full -mr-5 -mt-5 opacity-50" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-fridge-100 rounded-full -ml-6 -mb-6 opacity-30" />
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fridge-100 to-fridge-50 flex items-center justify-center mb-3 shadow-sm">
            <Camera className="w-7 h-7 text-fridge-700" />
          </div>
          <h3 className="font-medium text-gray-900 text-lg mb-1">Scan Food</h3>
          <p className="text-sm text-gray-600 mb-2">
            Take a photo to identify ingredients
          </p>
          <div className="mt-1 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-fridge-100 to-fridge-50 text-fridge-700 font-medium shadow-sm">
            Quick & Easy
          </div>
        </div>
      </motion.div>

      {/* Find Recipes Card */}
      <motion.div
        whileHover={ingredientsCount > 0 ? { scale: 1.03, y: -3 } : {}}
        whileTap={ingredientsCount > 0 ? { scale: 0.98 } : {}}
        onClick={onFindRecipes}
        className={`p-5 rounded-xl shadow-md cursor-pointer transition-all duration-200 relative overflow-hidden ${
          ingredientsCount > 0 
            ? 'bg-gradient-to-br from-fridge-600 to-fridge-700 text-white' 
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        {ingredientsCount > 0 && (
          <>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-5 -mt-5" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-6 -mb-6" />
          </>
        )}
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-sm ${
            ingredientsCount > 0 
              ? 'bg-gradient-to-br from-white/20 to-white/10' 
              : 'bg-gray-200'
          }`}>
            <Search className="w-7 h-7 text-current" />
          </div>
          <h3 className="font-medium mb-1 text-lg">Find Recipes</h3>
          <p className="text-sm opacity-90 mb-2">
            {ingredientsCount > 0 ? (
              `Use your ${ingredientsCount} ingredient${ingredientsCount !== 1 ? 's' : ''}`
            ) : (
              'Add ingredients first'
            )}
          </p>
          {ingredientsCount > 0 && (
            <div className="mt-1 text-xs px-3 py-1 rounded-full bg-white/20 text-white font-medium shadow-sm backdrop-blur-sm">
              {ingredientsCount} Available
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuickActions;
