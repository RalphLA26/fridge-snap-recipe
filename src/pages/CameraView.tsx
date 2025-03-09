
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/hooks/useInventory";

const CameraView = () => {
  const navigate = useNavigate();
  
  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);
  
  return (
    <motion.div 
      className="h-screen w-full relative flex flex-col bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header with back button */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="bg-black/30 text-white backdrop-blur-sm hover:bg-black/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center h-full text-white">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4">Camera Removed</h2>
          <p className="mb-8">The camera functionality has been removed as requested.</p>
          <Button onClick={handleBack} className="bg-fridge-600 hover:bg-fridge-700">
            Return Home
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CameraView;
