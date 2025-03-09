
import { motion } from "framer-motion";
import { Refrigerator, Utensils, Sparkles } from "lucide-react";

const HomeBanner = () => {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gradient-to-br from-fridge-600 to-fridge-800 p-8 text-white rounded-2xl shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute right-0 top-0 w-40 h-40 opacity-10">
          <div className="w-full h-full bg-white rounded-bl-full"></div>
        </div>
        <div className="absolute -left-8 -bottom-8 w-40 h-40 opacity-5">
          <div className="w-full h-full bg-white rounded-tr-full"></div>
        </div>
        
        <motion.div 
          className="relative z-10 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <motion.div 
              className="bg-white/20 p-2.5 rounded-xl mr-3 backdrop-blur-sm shadow-inner"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Refrigerator className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight">FridgeSnap</h1>
            <motion.div
              initial={{ rotate: -20, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="ml-2"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Sparkles className="h-5 w-5 text-yellow-300 filter drop-shadow-md" />
            </motion.div>
          </div>
          
          <p className="text-white/90 text-lg font-medium leading-relaxed">
            Turn your ingredients into delicious recipes with just a few clicks.
          </p>
          
          <motion.div 
            className="flex items-center mt-5 text-white/90 text-sm backdrop-blur-sm bg-white/10 px-4 py-2.5 rounded-full w-fit border border-white/10"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Utensils className="h-4 w-4 mr-2" />
            <span>Quick and easy meal planning</span>
          </motion.div>
        </motion.div>
        
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
