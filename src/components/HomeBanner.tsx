
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

const HomeBanner = () => {
  return (
    <motion.div
      className="overflow-hidden relative rounded-xl shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-fridge-600 via-fridge-500 to-fridge-400 p-8 text-white rounded-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-10 animate-pulse-subtle" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/10 rounded-full -ml-10 -mb-8 animate-pulse-subtle" 
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/5 rounded-full transform -translate-y-1/2 animate-pulse-subtle"
          style={{ animationDelay: "1.5s" }}
        />
        
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <motion.div 
              className="bg-white/20 p-3.5 rounded-full mr-4 shadow-inner backdrop-blur-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <UtensilsCrossed className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight">FridgeSnap</h1>
          </div>
          
          <p className="text-white/90 text-xl font-light leading-snug ml-1 mb-5">
            Turn your ingredients into<br /><span className="font-medium">delicious meals</span> with ease
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-3 ml-1"
          >
            <span className="inline-block bg-white/20 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
              Scan • Discover • Cook
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomeBanner;
