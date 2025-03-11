
import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewControlsProps {
  onRetake: () => void;
  onSave: () => void;
  hasProductInfo: boolean;
}

const ReviewControls = ({ onRetake, onSave, hasProductInfo }: ReviewControlsProps) => {
  return (
    <motion.div 
      key="review-controls"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="w-full flex justify-between gap-4"
    >
      <Button
        variant="outline"
        onClick={onRetake}
        className="flex-1 bg-black/50 text-white border-white/20 hover:bg-black/70 backdrop-blur-sm"
      >
        <X className="mr-2 h-4 w-4" />
        Retake
      </Button>
      
      <Button
        variant="fridge"
        onClick={onSave}
        className="flex-1 relative overflow-hidden group shadow-lg"
      >
        <motion.div 
          className="absolute inset-0 bg-green-400/20"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
        />
        <div className="relative flex items-center justify-center">
          <Check className="mr-2 h-4 w-4" />
          {hasProductInfo ? "Add to Inventory" : "Save Photo"}
        </div>
      </Button>
    </motion.div>
  );
};

export default ReviewControls;
