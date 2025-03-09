
import { Camera } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionsProps {
  onCameraClick: () => void;
}

const QuickActions = ({ onCameraClick }: QuickActionsProps) => {
  return (
    <div className="mt-6">
      {/* Scan Ingredients Card */}
      <motion.div
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCameraClick}
        className="bg-gradient-to-br from-fridge-50 via-white to-fridge-100/80 p-5 rounded-xl shadow-md cursor-pointer border border-fridge-100 transition-all duration-200 relative overflow-hidden group"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-fridge-100/40 to-fridge-200/40 rounded-full -mr-8 -mt-8 opacity-60 group-hover:scale-110 transition-transform duration-300 ease-out" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-fridge-200/40 to-fridge-100/30 rounded-full -ml-6 -mb-6 opacity-70 group-hover:scale-110 transition-transform duration-300 ease-out" />
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fridge-100 to-fridge-50 flex items-center justify-center mb-3 shadow-sm transform group-hover:rotate-3 transition-transform duration-300">
            <Camera className="w-7 h-7 text-fridge-700" />
          </div>
          <h3 className="font-medium text-gray-900 text-lg mb-1">Scan Food</h3>
          <p className="text-sm text-gray-600 mb-2">
            Identify ingredients fast
          </p>
          <div className="mt-1 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-fridge-100 to-fridge-50 text-fridge-700 font-medium shadow-sm transform group-hover:translate-y-1 transition-transform duration-300">
            Instant Detection
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickActions;
