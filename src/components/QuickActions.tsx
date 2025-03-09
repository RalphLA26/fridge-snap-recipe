
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
    <div className="grid gap-5 grid-cols-2 mt-8">
      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCameraClick}
        className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-100"
      >
        <div className="w-12 h-12 rounded-full bg-fridge-50 flex items-center justify-center mb-3">
          <Camera className="w-6 h-6 text-fridge-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Scan Ingredients</h3>
        <p className="text-sm text-gray-500">Take a photo of your fridge</p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onFindRecipes}
        className={`${ingredientsCount > 0 ? 'bg-gradient-to-br from-fridge-500 to-fridge-600' : 'bg-gradient-to-br from-blue-300 to-blue-400'} p-6 rounded-xl shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md transition-all duration-200`}
      >
        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center mb-3 backdrop-blur-sm">
          <Search className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-semibold text-white">Find Recipes</h3>
        <p className="text-sm text-white/90">
          {ingredientsCount > 0 
            ? `Use your ${ingredientsCount} ingredient${ingredientsCount !== 1 ? 's' : ''}`
            : 'Add ingredients first'}
        </p>
      </motion.div>
    </div>
  );
};

export default QuickActions;
