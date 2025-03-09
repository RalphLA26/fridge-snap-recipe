
import { Camera, Search, Sparkles } from "lucide-react";
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
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCameraClick}
        className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100"
      >
        <motion.div 
          className="w-14 h-14 rounded-full bg-fridge-50 flex items-center justify-center mb-3 shadow-sm"
          whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Camera className="w-7 h-7 text-fridge-600" />
        </motion.div>
        <h3 className="font-semibold text-gray-900 text-lg">Scan Ingredients</h3>
        <p className="text-sm text-gray-500">Take a photo of your fridge</p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.98 }}
        onClick={onFindRecipes}
        className={`${ingredientsCount > 0 
          ? 'bg-gradient-to-br from-fridge-500 to-fridge-700' 
          : 'bg-gradient-to-br from-blue-400 to-blue-500'
        } p-6 rounded-xl shadow-md flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-lg transition-all duration-300 border border-white/10`}
      >
        <motion.div 
          className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center mb-3 backdrop-blur-sm shadow-inner"
          whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.35)" }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Search className="w-7 h-7 text-white" />
        </motion.div>
        <h3 className="font-semibold text-white text-lg">Find Recipes</h3>
        <p className="text-sm text-white/90 px-2">
          {ingredientsCount > 0 ? (
            <span className="flex items-center justify-center gap-1">
              Use your {ingredientsCount} ingredient{ingredientsCount !== 1 ? 's' : ''}
              {ingredientsCount > 3 && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-yellow-200" />
                </motion.span>
              )}
            </span>
          ) : (
            'Add ingredients first'
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default QuickActions;
