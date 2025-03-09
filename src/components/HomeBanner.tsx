
import { motion } from "framer-motion";
import { Refrigerator, Utensils, Sparkles } from "lucide-react";

const HomeBanner = () => {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden relative shadow-lg"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="bg-gradient-to-r from-fridge-600 to-fridge-700 p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-fridge-500 rounded-full opacity-10 blur-2xl" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-white rounded-full opacity-5 blur-2xl" />
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center mb-4">
            <div className="bg-white/20 p-3 rounded-xl mr-4 shadow-inner">
              <Refrigerator className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">FridgeSnap</h1>
          </div>
          
          <p className="text-white/90 text-lg leading-relaxed mb-6">
            Turn your ingredients into delicious recipes with just a few clicks. No more food waste!
          </p>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center rounded-full bg-white/10 text-white/90 text-sm py-1.5 px-3">
              <Utensils className="h-4 w-4 mr-2" />
              <span>Quick meal planning</span>
            </div>
            <div className="flex items-center rounded-full bg-white/10 text-white/90 text-sm py-1.5 px-3">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Smart ingredients</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeBanner;
