
import { motion } from "framer-motion";
import { Refrigerator } from "lucide-react";

const HomeBanner = () => {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-fridge-600 p-6 text-white rounded-2xl shadow-md relative overflow-hidden">
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <motion.div 
              className="bg-white/20 p-2.5 rounded-xl mr-3"
            >
              <Refrigerator className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold">FridgeSnap</h1>
          </div>
          
          <p className="text-white/90 text-lg">
            Turn your ingredients into delicious recipes.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomeBanner;
