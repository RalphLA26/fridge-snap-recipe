
import { Camera } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionsProps {
  onCameraClick: () => void;
}

const QuickActions = ({ onCameraClick }: QuickActionsProps) => {
  return (
    <div className="mt-6">
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCameraClick}
        className="bg-gradient-to-br from-white via-fridge-50 to-fridge-100/80 p-6 rounded-xl shadow-md cursor-pointer border border-fridge-100/80 transition-all duration-200 relative overflow-hidden group hover:shadow-lg"
      >
        {/* Animated decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fridge-100/60 to-fridge-200/40 rounded-full -mr-10 -mt-10 opacity-70 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-fridge-200/40 to-fridge-100/30 rounded-full -ml-8 -mb-8 opacity-70 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out" />
        
        <div className="flex items-center text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fridge-500 to-fridge-600 flex items-center justify-center mr-5 shadow-md transform group-hover:rotate-3 transition-transform duration-300">
            <Camera className="w-8 h-8 text-white" />
          </div>
          
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">Scan Food</h3>
            <p className="text-sm text-gray-600 mb-2.5">
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
              className="inline-block text-xs px-3.5 py-1.5 rounded-full bg-gradient-to-r from-fridge-500 to-fridge-600 text-white font-medium shadow-sm"
            >
              Tap to Scan
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickActions;
