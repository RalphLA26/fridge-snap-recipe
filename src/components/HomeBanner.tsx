
import { motion } from "framer-motion";

const HomeBanner = () => {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden relative"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="bg-gradient-to-r from-fridge-600 to-fridge-700 p-6 text-white">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold mb-3">Welcome to FridgeSnap</h1>
          <p className="text-white/90">
            Turn your ingredients into delicious recipes with just a few clicks.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
          <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
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
