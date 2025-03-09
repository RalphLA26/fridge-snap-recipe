
import { motion } from "framer-motion";
import { Camera, Search, Sparkles } from "lucide-react";
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
        className="relative h-auto p-6 flex flex-col items-center text-center gap-3 bg-white hover:bg-gray-50 text-gray-800 rounded-xl shadow-md border border-gray-100 group cursor-pointer transition-all duration-200 overflow-hidden"
        variant="outline"
        type="button"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-fridge-50 rounded-full opacity-70 transform rotate-45" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-fridge-50 rounded-full opacity-70" />
        
        <div className="w-14 h-14 bg-fridge-50 rounded-full flex items-center justify-center mb-1 group-hover:bg-fridge-100 transition-colors z-10">
          <Camera className="w-7 h-7 text-fridge-600" />
        </div>
        <div className="z-10">
          <h3 className="font-semibold text-lg mb-1">Scan Ingredients</h3>
          <p className="text-sm text-gray-500">Take a photo of your fridge</p>
        </div>
      </Button>

      <Button
        onClick={onFindRecipes}
        disabled={ingredientsCount === 0}
        className="relative h-auto p-6 flex flex-col items-center text-center gap-3 bg-gradient-to-br from-fridge-500 to-fridge-600 hover:from-fridge-600 hover:to-fridge-700 text-white rounded-xl shadow-md border border-fridge-400 group cursor-pointer disabled:opacity-70 transition-all duration-200 overflow-hidden"
        type="button"
      >
        {/* Animated particles */}
        {ingredientsCount > 0 && (
          <>
            <motion.div 
              className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-40"
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-40"
              animate={{ 
                y: [0, 15, 0],
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            />
          </>
        )}
        
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-1 group-hover:bg-white/30 transition-colors">
          {ingredientsCount > 0 ? (
            <Sparkles className="w-7 h-7 text-white" />
          ) : (
            <Search className="w-7 h-7 text-white" />
          )}
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
