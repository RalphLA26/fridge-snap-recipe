
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
      <div className="bg-gradient-to-br from-fridge-700 via-fridge-600 to-fridge-500 p-7 text-white rounded-xl shadow-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 animate-pulse-subtle" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8 animate-pulse-subtle" 
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full transform -translate-y-1/2 animate-pulse-subtle"
          style={{ animationDelay: "1.5s" }}
        />
        
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center mb-5">
            <motion.div 
              className="bg-gradient-to-br from-white/30 to-white/10 p-2.5 rounded-full mr-3 shadow-inner backdrop-blur-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight">FridgeSnap</h1>
          </div>
          
          <p className="text-white/90 text-lg font-light leading-snug ml-1 mb-2">
            Turn your ingredients into<br />delicious meals with ease
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 ml-1"
          >
            <span className="inline-block bg-white/20 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
              Scan • Discover • Cook
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomeBanner;
