
import { motion } from "framer-motion";
import { Refrigerator, Utensils } from "lucide-react";

const HomeBanner = () => {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden relative"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="bg-gradient-to-r from-fridge-600 to-fridge-700 p-8 text-white rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-white rounded-bl-full"></div>
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center mb-4">
            <div className="bg-white/20 p-2 rounded-xl mr-3">
              <Refrigerator className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">FridgeSnap</h1>
          </div>
          
          <p className="text-white/90 text-lg">
            Turn your ingredients into delicious recipes with just a few clicks.
          </p>
          
          <div className="flex items-center mt-4 text-white/80 text-sm">
            <Utensils className="h-4 w-4 mr-2" />
            <span>Quick and easy meal planning</span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <svg className="w-56 h-56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="4" y1="10" x2="20" y2="10" />
            <line x1="10" y1="2" x2="10" y2="10" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeBanner;
