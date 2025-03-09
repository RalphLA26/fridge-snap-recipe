
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

const HomeBanner = () => {
  return (
    <motion.div
      className="overflow-hidden relative rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-fridge-600 to-fridge-700 p-6 text-white rounded-xl shadow-md">
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center mb-3">
            <motion.div 
              className="bg-white/20 p-2.5 rounded-full mr-3"
              whileHover={{ scale: 1.05 }}
            >
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight">FridgeSnap</h1>
          </div>
          
          <p className="text-white/90 text-lg font-light">
            Turn your ingredients into delicious meals
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomeBanner;
