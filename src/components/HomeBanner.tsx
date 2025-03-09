
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
      <div className="bg-gradient-to-tr from-fridge-700 via-fridge-600 to-fridge-500 p-7 text-white rounded-xl shadow-lg">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 animate-pulse-subtle" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8 animate-pulse-subtle" 
          style={{ animationDelay: "1s" }}
        />
        
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <motion.div 
              className="bg-white/20 p-2.5 rounded-full mr-3 shadow-inner backdrop-blur-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight">FridgeSnap</h1>
          </div>
          
          <p className="text-white/90 text-lg font-light leading-snug ml-1">
            Turn your ingredients into<br />delicious meals with ease
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomeBanner;
