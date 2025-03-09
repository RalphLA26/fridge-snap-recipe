
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
          <div className="flex items-center mb-5">
            <motion.div 
              className="bg-gradient-to-br from-white/30 to-white/10 p-3 rounded-full mr-4 shadow-inner backdrop-blur-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <UtensilsCrossed className="h-7 w-7 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight">FridgeSnap</h1>
          </div>
          
          <p className="text-white/90 text-xl font-light leading-snug ml-1 mb-4">
            Turn your ingredients into<br />delicious meals with ease
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-3 ml-1"
          >
            <span className="inline-block bg-white/20 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm shadow-sm mb-8">
              Scan • Discover • Cook
            </span>
          </motion.div>

          {/* Enhanced Camera Button */}
          <motion.div 
            className="bg-white/20 backdrop-blur-sm rounded-xl p-5 mt-4 cursor-pointer relative overflow-hidden group hover:bg-white/30 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCameraClick}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:rotate-45 transition-transform duration-500" />
            
            <div className="flex items-center relative z-10">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fridge-400 to-fridge-600 flex items-center justify-center mr-5 shadow-lg">
                <Camera className="w-7 h-7 text-white" />
              </div>
              
              <div>
                <h3 className="font-semibold text-white text-lg mb-1">Scan Food</h3>
                <p className="text-white/80 text-sm leading-tight mb-3">
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
                  className="inline-block text-xs px-3.5 py-1.5 rounded-full bg-white/25 text-white font-medium"
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
