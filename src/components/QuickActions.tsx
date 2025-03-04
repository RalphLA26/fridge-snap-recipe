
import { motion } from "framer-motion";
import { Camera, Search, ArrowRight } from "lucide-react";
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
    <motion.div
      className="grid gap-4 sm:grid-cols-2"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Button
        onClick={onCameraClick}
        className="h-auto p-4 flex flex-col items-center text-center gap-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl shadow-md border border-gray-100 group cursor-pointer"
        variant="outline"
        type="button"
      >
        <div className="w-12 h-12 bg-fridge-50 rounded-full flex items-center justify-center mb-1 group-hover:bg-fridge-100 transition-colors">
          <Camera className="w-6 h-6 text-fridge-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">Scan Ingredients</h3>
          <p className="text-sm text-gray-500">Take a photo of your fridge</p>
        </div>
      </Button>

      <Button
        onClick={onFindRecipes}
        disabled={ingredientsCount === 0}
        className="h-auto p-4 flex flex-col items-center text-center gap-3 bg-gradient-to-br from-fridge-500 to-fridge-600 hover:from-fridge-600 hover:to-fridge-700 text-white rounded-xl shadow-md border border-fridge-400 group cursor-pointer disabled:opacity-70"
        type="button"
      >
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1 group-hover:bg-white/30 transition-colors">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">Find Recipes</h3>
          <p className="text-sm text-white/80">
            {ingredientsCount > 0 
              ? `Use your ${ingredientsCount} ingredient${ingredientsCount !== 1 ? 's' : ''}`
              : 'Add ingredients first'}
          </p>
        </div>
      </Button>
    </motion.div>
  );
};

export default QuickActions;
