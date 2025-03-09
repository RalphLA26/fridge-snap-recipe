
import { motion } from "framer-motion";
import { Camera, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomeBanner = () => {
  const navigate = useNavigate();
  
  const handleCameraClick = () => {
    navigate("/camera");
  };

  return (
    <motion.div
      className="overflow-hidden relative rounded-xl shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-fridge-700 via-fridge-600 to-fridge-500 p-7 text-white rounded-xl">
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
          
          <p className="text-white/90 text-lg font-light leading-snug ml-1 mb-3">
            Turn your ingredients into<br />delicious meals with ease
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-2 ml-1"
          >
            <span className="inline-block bg-white/20 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm mb-6">
              Scan • Discover • Cook
            </span>
          </motion.div>

          {/* Integrated Camera Button */}
          <motion.div 
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-3 cursor-pointer relative overflow-hidden group hover:bg-white/30 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCameraClick}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:rotate-45 transition-transform duration-500" />
            
            <div className="flex items-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center mr-4 shadow-inner">
                <Camera className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h3 className="font-semibold text-white text-base mb-0.5">Scan Food</h3>
                <p className="text-white/80 text-xs leading-tight mb-2">
                  Identify ingredients instantly
                </p>
                <motion.div 
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 1.5 
                  }}
                  className="inline-block text-2xs px-2.5 py-1 rounded-full bg-white/25 text-white font-medium"
                >
                  Tap to Scan
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomeBanner;
