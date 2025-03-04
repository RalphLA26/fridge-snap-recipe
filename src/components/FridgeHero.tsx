
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, Search } from "lucide-react";

interface FridgeHeroProps {
  ingredientsCount: number;
  onCameraClick: () => void;
  onFindRecipes: () => void;
}

const FridgeHero = ({ ingredientsCount, onCameraClick, onFindRecipes }: FridgeHeroProps) => {
  return (
    <motion.div
      className="rounded-2xl shadow-lg overflow-hidden relative"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-gradient-to-br from-fridge-500 to-fridge-700 p-6 text-white relative overflow-hidden">
        {/* Background decorative pattern */}
        <div className="absolute right-0 top-0 opacity-10 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Icon */}
        <div className="mb-4 relative">
          <div className="inline-flex items-center justify-center p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="4" y1="10" x2="20" y2="10" />
              <line x1="10" y1="2" x2="10" y2="10" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">What's in your fridge?</h2>
        <p className="mb-6 opacity-90 text-white/90 max-w-md">
          Take a photo of your ingredients or add them manually to discover personalized recipes just for you.
        </p>
        
        <div className="grid gap-3 sm:grid-cols-2">
          <Button 
            className="w-full bg-white text-fridge-700 hover:bg-gray-100 shadow-md border border-white/30 h-12 cursor-pointer"
            onClick={onCameraClick}
            type="button"
          >
            <Camera className="mr-2 h-5 w-5" />
            Scan Your Fridge
          </Button>
          
          <Button 
            className="bg-fridge-600 text-white hover:bg-fridge-700 shadow-md border border-fridge-500/30 h-12 cursor-pointer"
            onClick={onFindRecipes}
            disabled={ingredientsCount === 0}
            type="button"
          >
            <Search className="mr-2 h-5 w-5" />
            Find Recipes
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FridgeHero;
